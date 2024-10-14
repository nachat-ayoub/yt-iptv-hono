import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

// Define an interface for the input parameters
interface CreateVideoParams {
  text?: string; // Optional, defaults to 'Default Text'
  bgColor?: string; // Optional, defaults to 'black'
  textColor?: string; // Optional, defaults to 'white'
  duration?: number; // Optional, defaults to 5
}

const createVideo = async ({
  text = 'Default Text', // Default text if not provided
  bgColor = 'black', // Default background color
  textColor = 'white', // Default text color
  duration = 10, // Default duration in seconds
}: CreateVideoParams): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    const passThrough = new PassThrough();

    ffmpeg()
      .input(`color=c=${bgColor}:s=1280x720:d=${duration}`) // Set background color and duration
      .inputFormat('lavfi')
      .videoFilters([
        {
          filter: 'drawtext',
          options: {
            fontsize: 60,
            fontcolor: textColor, // Use the provided text color
            x: '(w-text_w)/2',
            y: '(h-text_h)/2',
            text: text, // Use the provided text
          },
        },
      ])
      .outputOptions([
        '-c:v libx264',
        '-preset ultrafast',
        '-movflags frag_keyframe+empty_moov',
      ])
      .format('mp4')
      .on('error', (err) => {
        reject(new Error(`FFmpeg error: ${err.message}`));
      })
      .on('end', () => {
        resolve(Buffer.concat(buffers));
      })
      .pipe(passThrough);

    passThrough.on('data', (chunk) => {
      buffers.push(chunk);
    });
  });
};

export default createVideo;
