import { getStoredVideoId, setStoredVideoId } from '../utils';
import ytsr from '@distube/ytsr';
import { Hono } from 'hono';

const homeRoutes = new Hono();

homeRoutes.get('/', async (c) => {
  const q = c.req.query('q') || 'IbraTraveler';

  const { items: videos } = await ytsr(q || 'IbraTraveler', {
    safeSearch: true,
    limit: 20,
  });

  return c.renderNunjucks('index.njk', {
    title: 'Home',
    videos,
    currentVideoId: getStoredVideoId(),
  });
});

homeRoutes.post('/update-video/:id', async (c) => {
  const id = c.req.param('id');
  setStoredVideoId(id);

  return c.redirect('/');
});

export default homeRoutes;
