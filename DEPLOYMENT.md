# Railway Deployment — SENTINEL SIEM

Single-service deploy: Vite frontend build + Express API + WebSocket + PostgreSQL on one Railway service.

## Architecture

```
Browser → https://<your-service>.up.railway.app
              ├── /*           → static dist/ (SPA)
              ├── /api/*       → Express (live feeds, incidents, AI)
              ├── /ws          → WebSocket event stream
              └── PostgreSQL   → IOCs, events, incidents
```

**Live feeds (no API keys):** ThreatFox, FeodoTracker, CISA KEV (auto-refresh ~15 min). Manual refresh: Threat Intel → **Enrich Feed** (`POST /api/feeds/sync`).

## Prerequisites

- [Railway CLI](https://docs.railway.app/guides/cli): `npm i -g @railway/cli`
- Railway project with **PostgreSQL** plugin linked

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Injected by PostgreSQL plugin |
| `OLLAMA_API_KEY` | For AI | Ollama Cloud — powers Explain / summaries |
| `ALLOWED_ORIGINS` | Optional | `*` or your domain for CORS |
| `PORT` | Auto | Set by Railway |

Optional split-deploy only: `VITE_API_URL`, `VITE_WS_URL` at build time.

## Deploy

```bash
npm install
npm run build          # vite build + backend deps
railway login
railway link           # select sentinel-siem project
railway up --detach
```

**Start command (Railway):** `npm start` → `node backend/src/index.mjs` (serves `dist/` + API).

## Verify

```bash
curl https://YOUR-SERVICE.up.railway.app/api/health
curl https://YOUR-SERVICE.up.railway.app/api/dashboard
curl -X POST https://YOUR-SERVICE.up.railway.app/api/feeds/sync
```

Health `availableRoutes` should include `/api/feeds/sync` and `/api/ai/explain` after latest deploy.

## Local development

```bash
# Terminal 1 — API + DB
cd backend && npm install && npm run dev

# Terminal 2 — Vite (proxies /api to :3001)
npm run dev
```

Copy `.env.example` → `.env` and set `OLLAMA_API_KEY` for AI features locally.

## What is live vs demo

| Area | Source |
|---|---|
| Dashboard metrics, events, IOCs | PostgreSQL from real feeds |
| WebSocket stream | Backend generator + feed-derived events |
| AI Explain / summaries | Ollama Cloud (`gemma3:12b`) when `OLLAMA_API_KEY` set |
| Incident drills, some Reports sections | Client-side / sample (labeled) |
| Settings (refresh, density) | `localStorage` |
