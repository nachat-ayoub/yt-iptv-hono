import 'hono';

declare module 'hono' {
  interface Context {
    renderNunjucks: (template: string, data: Record<string, any>) => Response;
  }
}
