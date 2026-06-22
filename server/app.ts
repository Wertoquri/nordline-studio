import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { leadSchema } from '../src/lib/leadSchema.js';

export const api = express();
api.disable('x-powered-by');
api.use(express.json({ limit: '16kb' }));
api.use(cors({ origin: process.env.CORS_ORIGIN?.split(',').map((x) => x.trim()) || 'http://localhost:5173', methods: ['POST'], allowedHeaders: ['Content-Type'] }));
api.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false }));

api.post('/api/leads', async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ ok: false, error: 'Invalid lead data' }); return; }
  if (parsed.data.website) { res.status(202).json({ ok: true }); return; }
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try { const response = await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...parsed.data, source: 'nordline-website', receivedAt: new Date().toISOString() }) }); if (!response.ok) throw new Error(`Webhook returned ${response.status}`); }
    catch (error) { console.error('Lead delivery failed', error instanceof Error ? error.message : 'Unknown error'); res.status(502).json({ ok: false, error: 'Delivery failed' }); return; }
  } else { console.info('Lead accepted', { projectType: parsed.data.projectType, area: parsed.data.area }); }
  res.status(202).json({ ok: true });
});
