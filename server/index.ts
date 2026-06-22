import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { api } from './app.js';
const port = Number(process.env.PORT || 8787);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
api.use(express.static(root, { maxAge: '1d' }));
api.get('/{*path}', (_req, res) => res.sendFile(path.join(root, 'index.html')));
api.listen(port, () => console.info(`Nordline server listening on http://localhost:${port}`));
