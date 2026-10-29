# Deployment guide

Costs, free-tier limits and menu names change often. Check each provider's current pricing and documentation before relying on this guide. Nothing here should be done without the gym owner's approval of any cost.

## Overview
```
Visitor -> Frontend (static site) -> Backend API (Node) -> PostgreSQL (Neon)
```
You deploy three things: the database (already on Neon), the backend, and the frontend.

## 1. Strongly recommended: use one custom domain
The admin login uses a cookie. If the website and API live on unrelated domains (for example `something.vercel.app` and `something.onrender.com`), browsers treat the cookie as a third-party cookie and may block it, which breaks admin login.

Use subdomains of one domain you own:
- Website: `https://www.yourgym.example`
- API: `https://api.yourgym.example`

Domain names cost money (yearly). Ask the owner before buying one.

## 2. Backend (Node host such as Render or Railway)
- Root directory: `backend`
- Build command: `npm install && npx prisma migrate deploy`
- Start command: `npm start`
- Environment variables:
  - `NODE_ENV=production`
  - `DATABASE_URL` (Neon pooled), `DIRECT_URL` (Neon direct)
  - `JWT_SECRET` (a NEW random value, not the one used locally)
  - `FRONTEND_URL=https://www.yourgym.example` (exact origin, no trailing slash)
- **Uploads:** photos and videos uploaded in the admin are stored in `UPLOAD_DIR` (default `backend/uploads`). Many hosts wipe the disk on every deploy, so attach a persistent disk or volume and point `UPLOAD_DIR` at it (disks usually cost extra; check the provider). Without one, uploaded files vanish and you would need to re-upload. Moving uploads to cloud storage (for example an S3-compatible bucket) is a possible later improvement.
- After the first deploy, open `https://api.yourgym.example/api/health`. It should show `"database":"connected"`.
- Create the first live admin by running `npm run admin:create` against the production database from your own computer (put the production `DATABASE_URL` and `DIRECT_URL` in `backend/.env` temporarily, then restore your local values). Do not leave production secrets in files you share.
- Free backend plans may sleep when idle, making the first visit slow. Check the provider's current free-tier behaviour.

## 3. Frontend (static host such as Vercel or Netlify)
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://api.yourgym.example`
- Single-page-app routing is already configured (`vercel.json` and `public/_redirects`), so refreshing `/trainers` or `/admin` works.

## 4. After deploying
1. Visit the live site and click every page.
2. Submit a test enquiry, then log in at `/admin`, check it appears, and delete it.
3. Confirm the admin login works in Chrome and on a phone.
4. Work through `docs/LIVE_CHECKLIST.md`.

## Troubleshooting
| Symptom | Likely cause |
|---|---|
| Site loads but data is missing | `VITE_API_BASE_URL` wrong; rebuild the frontend after changing it |
| Browser console shows a CORS error | `FRONTEND_URL` doesn't exactly match the site's origin |
| Admin login succeeds, then you are logged out | Cookie blocked: website and API are on unrelated domains (see section 1) |
| `/api/health` shows `unreachable` | Wrong `DATABASE_URL`, or the database is asleep (retry in a few seconds) |
| Backend won't start | `JWT_SECRET` missing or shorter than 32 characters |
