import { getStoredVideoId, vidQuality, VidQualityType } from '../utils';
import createVideo from '../createVideo';
import ytdl from '@distube/ytdl-core';
import { Hono } from 'hono';

import cp from 'child_process';
import fs from 'fs';

const streamRoute = new Hono();
streamRoute.get('/stream', async (c) => {
  try {
    const url = `https://www.youtube.com/watch?v=${getStoredVideoId()}`;

    const qualityParam = c.req.query('quality');
    // validate quality param
    if (
      qualityParam &&
      vidQuality[qualityParam as VidQualityType] === undefined
    ) {
      throw new Error(
        'Invalid quality parameter, qualityParam: ' + qualityParam
      );
    }

    ytdl.getInfo(url).then((info) => {
      fs.writeFileSync('formats.json', JSON.stringify(info.formats));
    });

    // Use ytdl to fetch audio and video streams
    const videoStream = ytdl(url, {
      filter: 'videoonly',
      quality: vidQuality[qualityParam as VidQualityType],
    });
    const audioStream = ytdl(url, {
      filter: 'audioonly',
      highWaterMark: 1 << 25,
    });

    // Start ffmpeg to merge video and audio
    const ffmpegProcess = cp.spawn(
      'ffmpeg',
      [
        '-i',
        'pipe:3', // Video input from pipe 3
        '-i',
        'pipe:4', // Audio input from pipe 4
        '-map',
        '0:v', // Map video input
        '-map',
        '1:a', // Map audio input
        '-c:v',
        'copy', // Copy video codec as is
        '-c:a',
        'libmp3lame', // Encode audio with libmp3lame
        '-crf',
        '27', // Set the constant rate factor for quality control
        '-preset',
        'veryfast', // Use fast encoding preset
        '-movflags',
        'frag_keyframe+empty_moov', // Fragment for MP4 streaming
        '-f',
        'mp4', // Set output format to MP4
        '-loglevel',
        'error', // Only show FFmpeg errors
        '-', // Output to pipe
      ],
      {
        stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe'], // Set pipes for stdin, stdout, stderr, and custom I/O
      }
    );

    // Pipe video and audio streams into ffmpeg
    videoStream.pipe(ffmpegProcess?.stdio?.at(3) as any);
    audioStream.pipe(ffmpegProcess?.stdio?.at(4) as any);

    // Capture ffmpeg logs (stderr) for debugging if needed
    let ffmpegLogs = '';
    ffmpegProcess.stdio[2].on('data', (chunk) => {
      ffmpegLogs += chunk.toString();
    });

    // Handle the exit event of the ffmpeg process
    ffmpegProcess.on('exit', (exitCode) => {
      if (exitCode === 1) {
        console.error(ffmpegLogs);
      }
    });

    // Return the response
    return new Response(ffmpegProcess.stdio[1] as any, {
      headers: { 'Content-Type': 'video/mp4' },
    });
  } catch (error) {
    console.error('Error streaming video:', error);
    // parse the error into a string
    const message = error instanceof Error ? error.message : 'Unknown error';

    const vidBuff = await streamErrorVideo(message); // Await here to ensure the video is created before returning
    return new Response(vidBuff, {
      headers: {
        'Content-Type': 'video/mp4',
      },
    });
  }
});

// Function to stream an error video from a file
const streamErrorVideo = async (message: string) => {
  // Generate and save the error video if it doesn't exist
  const vidBuff = await createVideo({
    text: message,
    bgColor: 'red',
    textColor: 'white',
    duration: 30,
  });

  // Return a Response that streams the error video
  return vidBuff;
};

export default streamRoute;
