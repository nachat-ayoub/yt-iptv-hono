import { spawn } from 'child_process';
import { Readable } from 'stream';

const mergeVideoAudio = async (
  videoUrl: string,
  audioUrl: string
): Promise<Buffer> => {
  const videoResponse = await fetch(videoUrl);
  const audioResponse = await fetch(audioUrl);

  if (!videoResponse.ok || !audioResponse.ok) {
    throw new Error('Failed to fetch video or audio');
  }

  const videoStream = Readable.fromWeb(videoResponse.body as any);
  const audioStream = Readable.fromWeb(audioResponse.body as any);

  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];

    // Spawn FFmpeg process
    const ffmpegProcess = spawn('ffmpeg', [
      '-i',
      'pipe:0', // Input from stdin for video
      '-i',
      'pipe:1', // Input from stdin for audio
      '-c:v',
      'copy', // Copy video codec without re-encoding
      '-c:a',
      'aac', // Use AAC for audio codec
      '-shortest', // End the output when the shortest input ends
      '-movflags',
      'frag_keyframe+empty_moov', // Optimize for streaming
      'pipe:2', // Output to stdout
    ]);

    // Handle video stream
    videoStream.pipe(ffmpegProcess.stdin);
    // Handle audio stream
    audioStream.pipe(ffmpegProcess.stdin);

    ffmpegProcess.stdout.on('data', (chunk) => {
      buffers.push(chunk); // Collect chunks of data
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.error(`FFmpeg STDERR: ${data}`);
    });

    ffmpegProcess.on('error', (err) => {
      console.error('Error spawning FFmpeg:', err);
      reject(err);
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Merging completed');
        resolve(Buffer.concat(buffers)); // Resolve with the combined buffer
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
};

export default mergeVideoAudio;
