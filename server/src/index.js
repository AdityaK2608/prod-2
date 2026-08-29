import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;
const NVD_BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',').map(v => v.trim()) || true }));
app.use(express.json({ limit: '100kb' }));

const searchSchema = new mongoose.Schema({
  query: { type: String, required: true, trim: true, maxlength: 200 },
  resultCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });
const Search = mongoose.models.Search || mongoose.model('Search', searchSchema);

let mongoReady = false;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => { mongoReady = true; console.log('MongoDB connected'); })
    .catch(err => console.error('MongoDB connection failed:', err.message));
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'sentinel-api', mongo: mongoReady }));

app.get('/api/cves', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    const startIndex = Math.max(0, Number.parseInt(req.query.startIndex || '0', 10) || 0);
    const resultsPerPage = Math.min(50, Math.max(1, Number.parseInt(req.query.resultsPerPage || '12', 10) || 12));
    if (!q || q.length > 200) return res.status(400).json({ error: 'A query between 1 and 200 characters is required.' });

    const params = new URLSearchParams({ startIndex: String(startIndex), resultsPerPage: String(resultsPerPage) });
    if (/^CVE-\d{4}-\d{4,}$/i.test(q)) params.set('cveId', q.toUpperCase());
    else params.set('keywordSearch', q);

    const response = await fetch(`${NVD_BASE}?${params}`, {
      headers: { Accept: 'application/json', ...(process.env.NVD_API_KEY ? { apiKey: process.env.NVD_API_KEY } : {}) }
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.message || `NVD returned HTTP ${response.status}` });

    if (mongoReady) Search.create({ query: q, resultCount: data.totalResults || 0 }).catch(() => {});
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: 'NVD lookup failed', detail: error.message });
  }
});

app.get('/api/search-history', async (_req, res) => {
  if (!mongoReady) return res.json([]);
  const rows = await Search.find().sort({ createdAt: -1 }).limit(20).lean();
  res.json(rows);
});

app.listen(PORT, () => console.log(`Sentinel API listening on :${PORT}`));
