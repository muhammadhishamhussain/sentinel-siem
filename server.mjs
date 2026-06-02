#!/usr/bin/env node
/**
 * Minimal static file server for the built Vite frontend.
 * Used as the Railway "Frontend" service start command: node server.mjs
 *
 * Serves the dist/ folder with SPA fallback (all unknown paths → index.html).
 */
import { createServer }                        from 'node:http';
import { readFileSync, existsSync, statSync }  from 'node:fs';
import { extname, join }                       from 'node:path';
import { fileURLToPath }                       from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST      = join(__dirname, 'dist');
const PORT      = Number(process.env.PORT) || 8080;

const MIME = {
  '.html'  : 'text/html; charset=utf-8',
  '.js'    : 'application/javascript; charset=utf-8',
  '.mjs'   : 'application/javascript; charset=utf-8',
  '.css'   : 'text/css; charset=utf-8',
  '.svg'   : 'image/svg+xml',
  '.png'   : 'image/png',
  '.jpg'   : 'image/jpeg',
  '.ico'   : 'image/x-icon',
  '.json'  : 'application/json; charset=utf-8',
  '.woff'  : 'font/woff',
  '.woff2' : 'font/woff2',
  '.txt'   : 'text/plain; charset=utf-8',
};

createServer((req, res) => {
  let urlPath  = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let filePath = join(DIST, urlPath);

  // SPA fallback: serve index.html for non-existent paths and directories
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(DIST, 'index.html');
  }

  const ext         = extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  const isHtml      = ext === '.html';

  try {
    const content = readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type'  : contentType,
      'Cache-Control' : isHtml
        ? 'no-cache, no-store, must-revalidate'
        : 'public, max-age=31536000, immutable',
    });
    res.end(content);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}).listen(PORT, '0.0.0.0', () => {
  console.log(`[frontend] SENTINEL UI serving dist/ on port ${PORT}`);
});
