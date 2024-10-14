import streamRoute from './routes/stream';
import m3uFileRoute from './routes/m3u';
import homeRoutes from './routes/home';
import { formatViews } from './utils';
import { Hono } from 'hono';
import path from 'path';
import fs from 'fs';

import nunjucks from 'nunjucks';

const app = new Hono();
let PORT = 3000;

// Configure Nunjucks
const nunjucksEnv = nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  noCache: true,
  // watch: true,
});

nunjucksEnv.addFilter('formatViews', formatViews);

// Inject the renderNunjucks method into the context
app.get('*', (c, next) => {
  c.renderNunjucks = (template: string, data: Record<string, any>) => {
    const renderedHtml = nunjucks.render(template, data);
    return new Response(renderedHtml, {
      headers: { 'Content-Type': 'text/html' },
    });
  };

  return next();
});

app.get('/logo.svg', async (c) => {
  const logo = fs.readFileSync(path.join(__dirname, '/public/logo.svg'));
  return new Response(logo, { headers: { 'Content-Type': 'image/svg+xml' } });
});

app.route('/', homeRoutes);
app.route('/', m3uFileRoute);
app.route('/', streamRoute);

const server = Bun.serve({
  port: PORT,
  fetch: app.fetch, // Connect Hono to Bun's server
  error: (err) => {
    console.error('Error:', err);
    return new Response('Internal Server Error', { status: 500 });
  },
});

PORT = server.port;

export { PORT };
