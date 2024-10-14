import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import FFmpeg from 'fluent-ffmpeg';
import os from 'os';

FFmpeg.setFfmpegPath(ffmpegInstaller.path);
FFmpeg.setFfprobePath(ffprobeInstaller.path);

export const ffmpeg = FFmpeg;

let videoId: string = 'Blx0roWAsFQ';

export function getStoredVideoId(): string {
  return videoId;
}

export function setStoredVideoId(id: string): void {
  videoId = id;
}

export function getHomeHostName(): string {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const iface = networkInterfaces[interfaceName];
    if (iface) {
      for (const net of iface) {
        // Check for IPv4 addresses
        if (net.family === 'IPv4' && !net.internal) {
          return net.address; // Return the first external IPv4 address found
        }
      }
    }
  }

  return 'localhost'; // Fallback to localhost
}

export const vidQuality = {
  '144': '160', // 144p
  '240': '133', // 240p
  '360': '18', // 360p (often with audio)
  '480': '135', // 480p
  '720': '136', // 720p
  '720p60': '298', // 720p60
  '1080': '137', // 1080p
  '1080p60': '299', // 1080p60
  highest: 'highestvideo', // The highest available quality
  lowest: 'lowestvideo', // The lowest available quality
};

// make ts type using object values:
export type VidQualityType = keyof typeof vidQuality;

export function formatViews(views: number) {
  if (views < 1000) {
    return views.toString();
  } else if (views >= 1000 && views < 100_000) {
    return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else if (views >= 100_000 && views < 1_000_000) {
    return (views / 1000).toFixed(0).replace(/\.0$/, '') + 'K';
  } else if (views >= 1_000_000 && views < 1_000_000_000) {
    return (views / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else {
    return (views / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
}
