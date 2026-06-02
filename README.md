# SENTINEL SIEM Dashboard

SENTINEL is a presentation-ready Security Information and Event Management dashboard built for SOC-style monitoring, incident response, log investigation, and threat intelligence review.

## What It Includes

- Real-time security event simulation with pause/resume controls
- Global attack map, 24-hour threat timeline, severity distribution, and system health panels
- Expandable event details with MITRE ATT&CK mappings and recommended response actions
- Incident response workflow with analyst assignment, status progression, and activity timeline
- Log search with keyword search, regex mode, severity/source filters, copy, and CSV/JSON export
- Threat intelligence workspace for IOC lookup, feed filtering, campaign tracking, and enrichment status
- Header notifications with acknowledgement state and live presentation-friendly alert context
- Dark/light theme persistence and responsive layouts for desktop and mobile

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS with HSL design tokens
- shadcn/ui and Radix primitives
- Recharts
- Framer Motion
- React Router
- Vitest + Testing Library
- Playwright for browser verification

## Run Locally

```bash
npm install
./scripts/start-all.sh
```

The all-in-one launcher starts:

- Frontend: `http://127.0.0.1:8080`
- Local mock backend: `http://127.0.0.1:3001`

It also opens the frontend in your browser automatically.

Alternative commands:

```bash
npm run start:all
npm run backend
npm run frontend
```

Useful environment overrides:

```bash
FRONTEND_PORT=5173 BACKEND_PORT=3002 ./scripts/start-all.sh
OPEN_BROWSER=0 ./scripts/start-all.sh
```

## Quality Checks

```bash
npm run lint
npm test
npm run build
npx tsc --noEmit
```

## Demo Routes

- `/` - SOC dashboard overview
- `/incidents` - Incident response workflow
- `/log-search` - Log investigation and export
- `/threat-intel` - Threat intelligence and IOC enrichment

## Data Model

The presentation build uses deterministic mock data plus client-side simulation so it can run reliably without credentials or network dependencies during a live demo. The data layer is intentionally typed and centralized in `src/data` and `src/lib/sentinel-api.ts`, so replacing the mock adapter with a cloud API is a contained backend integration step.

Recommended production integrations:

- Event ingestion API with queue-backed processing
- WebSocket or SSE stream for live event updates
- Database persistence for events, incidents, analysts, alert acknowledgements, and audit history
- Authentication, role-based access control, and tenant scoping
- Threat intelligence enrichment from MISP, OTX, VirusTotal, AbuseIPDB, or an internal feed
