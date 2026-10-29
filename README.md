# Workout Zone: gym website

Full-stack website for Workout Zone, Parel East, Mumbai.

- **Frontend:** React + Vite + Tailwind + React Router (`frontend/`)
- **Backend:** Node + Express REST API (`backend/`)
- **Database:** PostgreSQL via Prisma (hosted on Neon)
- **Admin:** `/admin` dashboard for trainers, services, memberships, timings, supplements, business details, enquiries, **offers and announcements, the equipment gallery and customer reviews**

## Folder structure

```
workout-zone/
  frontend/   React app (public site + /admin dashboard)
  backend/    Express API, Prisma schema, seed and admin scripts
  docs/       DEPLOYMENT.md, DATABASE.md, LIVE_CHECKLIST.md
```

## Run locally (Windows PowerShell)

Requires Node.js 20+ and Git.

```powershell
npm run install:all
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Edit `backend\.env` and fill in `DATABASE_URL`, `DIRECT_URL` (both from Neon) and `JWT_SECRET`:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Then, from the `backend` folder, create the tables, add starting data and create your admin login:

```powershell
cd backend
npx prisma migrate dev
npm run db:seed
npm run admin:create
```

Start both servers in two PowerShell windows (from the project root):

```powershell
npm run dev:backend
npm run dev:frontend
```

- Website: http://localhost:5173
- Admin: http://localhost:5173/admin
- API health: http://localhost:4000/api/health
- Database viewer: `npm run db:studio` (inside `backend`)

## Environment variables

| File | Variable | Purpose |
|---|---|---|
| backend/.env | `DATABASE_URL` | Neon **pooled** connection string (used by the running app) |
| backend/.env | `DIRECT_URL` | Neon **direct** connection string (used by migrations) |
| backend/.env | `JWT_SECRET` | Signs admin sessions. 32+ random characters. Never share or commit |
| backend/.env | `FRONTEND_URL` | The website's address, used for CORS (e.g. `http://localhost:5173`) |
| backend/.env | `PORT`, `NODE_ENV` | Server port and mode (`production` when live) |
| backend/.env | `UPLOAD_DIR` | Optional. Folder for photos/videos uploaded in the admin. Needs a persistent disk in production |
| backend/.env | `COOKIE_SAMESITE` | Optional. `lax`, `strict` or `none`. Defaults to `none` in production, `lax` otherwise |
| frontend/.env | `VITE_API_BASE_URL` | The API's address. Public value only, never put secrets here |

`.env` files are git-ignored. Only the `.env.example` files are committed.

## Useful commands

| Command (from `backend`) | What it does |
|---|---|
| `npm run dev` | Start the API with auto-restart |
| `npm test` | Backend tests |
| `npm run db:seed` | Add starting data (safe to re-run) |
| `npm run admin:create` | Create an admin, or reset an admin's password |
| `npm run db:studio` | Browse the database in a browser |

From `frontend`: `npm run dev`, `npm run build`, `npm test`.

## Security notes

- No default admin account exists. Create yours with `npm run admin:create`.
- Passwords are stored only as bcrypt hashes. Sessions use an HttpOnly cookie.
- Admin writes require a custom request header (CSRF defence), and login is rate-limited.
- The public enquiry form has a hidden spam trap and is rate-limited. It stores enquiries in the database only: **it does not send email or WhatsApp notifications**, so check the dashboard regularly.
- Image links must start with `/` or `https://`.

## Content rules

- Do not add prices, trainer biographies, certifications or reviews unless the gym owner has verified them.
- Use only photos the gym owner has approved (record each in `frontend/public/images/MANIFEST.md`). Until then the site shows clearly labelled placeholders.

## Known limitations

- Uploaded photos/videos are saved on the backend server's disk (`UPLOAD_DIR`). On hosts with a temporary disk they disappear on redeploy, so use a persistent disk or move uploads to cloud storage before relying on them (see `docs/DEPLOYMENT.md`).
- Uploads accept JPG, PNG, WebP (up to 8 MB) and MP4, WebM (up to 60 MB). Images are not resized automatically, so upload web-sized photos.
- Reordering uses Up/Down buttons (gallery, reviews) or the display-order number; there is no drag-and-drop.
- No online payments or class booking.
- Enquiry notifications by email/WhatsApp are not built.

## Homepage and content management

Homepage order: hero, active announcement, services (Strength Training, Yoga, Zumba), HYROX, equipment gallery, reviews, timings, contact. The design follows the approved prototype: near-black and lime, Barlow Condensed and Inter.

| Admin screen | Controls |
|---|---|
| Offers | Title, description, terms, banner image, festival theme and emojis, button text and link, display format (pop-up, banner, card), how often a visitor sees it, priority, start and end dates, on/off, preview. Only an enabled offer inside its dates appears; with none active the site opens normally |
| Gallery | Upload or link equipment photos and videos, captions, order, publish or hide, delete |
| Reviews | Genuine reviews only, with the customer's permission: name, review, optional stars and photo, order, publish, delete |
| Services | "Show on the homepage" decides which services appear in the homepage section |
| Timings | Weekdays that share the same schedule are shown as one "Monday – Friday" entry; Saturday and Sunday show what is stored here |

After pulling these changes, from `backend` run `npm install`, `npx prisma migrate dev --name redesign_content` and `npm run db:seed`.
