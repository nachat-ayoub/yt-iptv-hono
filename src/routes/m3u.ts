import { PORT } from '../index';
import { getHomeHostName, VidQualityType, vidQuality } from '../utils';
import { Hono } from 'hono';

const m3uFileRoute = new Hono();

// Download Stream File
m3uFileRoute.get('/stream/download', async (c) => {
  try {
    // Build M3U playlist content
    let m3uContent = '#EXTM3U';

    for (const key in vidQuality) {
      if (Object.prototype.hasOwnProperty.call(vidQuality, key)) {
        const quality = vidQuality[key as VidQualityType];
        m3uContent += `\n#EXTINF:-1,YouTube - ${key}\n`;
        m3uContent += `http://${getHomeHostName()}:${PORT}/stream?quality=${key}`;
      }
    }

    // Set the headers to specify the content type and suggest a filename
    c.header('Content-Type', 'audio/mpeg-url');
    c.header('Content-Disposition', 'attachment; filename="yt-iptv-hono.m3u"');

    // Return the M3U playlist file
    return c.body(m3uContent);
  } catch (error) {
    console.error('Error generating M3U file:', error);
    return c.json({ error: 'Failed to generate the M3U file.' }, 500);
  }
});

export default m3uFileRoute;
