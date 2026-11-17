/** Vite plugin: delegates /api/* requests to src/mockApi.js when VITE_MOCK_API=1. */
import { mockApi } from '../src/mockApi.js';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export function mockApiPlugin() {
  return {
    name: 'an-roastery-mock-api',
    configureServer(server) {
      if (process.env.VITE_MOCK_API !== '1') return;
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/')) return next();

        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
        });
        req.on('end', async () => {
          let parsed;
          try {
            parsed = raw ? JSON.parse(raw) : undefined;
          } catch {
            parsed = undefined;
          }
          try {
            const data = await mockApi(url, { method: req.method || 'GET', body: parsed });
            json(res, 200, data);
          } catch (err) {
            json(res, err.status || 500, { message: err.message || 'Mock API error' });
          }
        });
      });
    }
  };
}
