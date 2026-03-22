# Step-by-Step: Deploy Legaforce API Server (Server-Side)

This guide walks you through putting your API on a real server so the frontend can call it instead of `localhost`.

---

## Overview

1. **Host the API** on a cloud provider (e.g. Render, Railway, Fly.io, or a VPS).
2. **Use a managed PostgreSQL** database (same provider or e.g. Neon, Supabase).
3. **Set environment variables** on the server.
4. **Point the client** to the deployed API with `VITE_API_URL`.

---

## Part 1: Prepare the project

### 1.1 Ensure the server listens on all interfaces

Your server already uses `app.listen(PORT)` with no host, so it listens on all interfaces (`0.0.0.0`) by default. No code change needed.

### 1.2 Create an example env file (for your reference only)

In the **server** folder, create `.env.production.example` (do **not** commit real secrets). Use it as a checklist:

```env
# Server
NODE_ENV=production
PORT=5000
SERVER_URL=https://your-api-domain.com
FRONTEND_URL=https://your-frontend-domain.com

# Database (PostgreSQL connection string)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require

# Auth
JWT_SECRET=your-long-random-secret-at-least-32-chars
JWT_EXPIRES_IN=7d

# Optional: email, AWS, Arcjet, OpenAI, etc.
# SENDGRID_API_KEY=
# EMAIL_USER=
# EMAIL_PASSWORD=
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_REGION=
# AWS_S3_BUCKET=
# ARCJET_KEY=
# ARCJET_ENV=
# OPENAI_API_KEY=
```

---

## Part 2: Database (PostgreSQL)

### Option A: Managed PostgreSQL (recommended)

1. Sign up for a managed Postgres service:
   - **Neon** – https://neon.tech (free tier)
   - **Supabase** – https://supabase.com (free tier)
   - **Render** – https://render.com (add a Postgres instance)
   - **Railway** – https://railway.app (add PostgreSQL)

2. Create a new project and a **PostgreSQL** database.

3. Copy the **connection string** (e.g. `postgresql://user:pass@host:5432/dbname?sslmode=require`).  
   This will be your `DATABASE_URL`.

4. Run migrations from your **local** machine once (pointing at this DB):
   - Set `DATABASE_URL` in your local `.env.production.local` or pass it inline:
   ```bash
   cd server
   set DATABASE_URL=postgresql://...&& npx prisma migrate deploy
   ```
   - On PowerShell you can use:
   ```powershell
   $env:DATABASE_URL="postgresql://..."; npx prisma migrate deploy
   ```

### Option B: PostgreSQL on a VPS

If you deploy the Node app on a VPS (e.g. Ubuntu), install Postgres there and create a database and user, then set `DATABASE_URL` to `postgresql://user:password@localhost:5432/legaforce`.

---

## Part 3: Deploy the API server

### Option 1: Render (free tier, simple)

1. **Sign up:** https://render.com

2. **New Web Service**
   - Connect your GitHub repo: `Legaforce`
   - Root directory: **`server`** (not the repo root).
   - Runtime: **Node**.
   - Build command: `npm install && npx prisma generate`
   - Start command: `npm start` (or `node server.js`).
   - Instance type: Free (or paid if you prefer).

3. **Environment variables** (in Render dashboard → Environment):
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (Render sets `PORT` automatically; 5000 is fine as fallback)
   - `DATABASE_URL` = your Postgres connection string
   - `JWT_SECRET` = long random string (e.g. 32+ chars)
   - `JWT_EXPIRES_IN` = `7d`
   - `FRONTEND_URL` = your frontend URL (e.g. `https://your-app.vercel.app` or `https://your-domain.com`)
   - `SERVER_URL` = your Render API URL (e.g. `https://legaforce-api.onrender.com`)
   - Add any others you use: `SENDGRID_API_KEY`, `EMAIL_USER`, `EMAIL_PASSWORD`, AWS, Arcjet, etc.

4. **Deploy**
   - Click **Create Web Service**. Render will build and run the server.
   - Your API URL will be like: `https://legaforce-api.onrender.com`.

5. **Run migrations once** (from your machine or Render shell):
   - In Render: **Shell** tab, then:
   ```bash
   npx prisma migrate deploy
   ```
   - Or from local with `DATABASE_URL` set to the same DB:
   ```bash
   cd server
   npx prisma migrate deploy
   ```

### Option 2: Railway

1. **Sign up:** https://railway.app

2. **New Project** → **Deploy from GitHub** → select `Legaforce`.

3. **Configure service**
   - Set **Root Directory** to `server`.
   - Build: `npm install && npx prisma generate`
   - Start: `npm start` or `node server.js`.

4. **Add PostgreSQL**
   - In the project, click **+ New** → **Database** → **PostgreSQL**.
   - Railway sets `DATABASE_URL` automatically for the API service.

5. **Variables**
   - In the API service → **Variables**, add:
     - `NODE_ENV` = `production`
     - `JWT_SECRET` = (long random string)
     - `JWT_EXPIRES_IN` = `7d`
     - `FRONTEND_URL` = your frontend URL
     - `SERVER_URL` = your Railway API URL (e.g. `https://legaforce-api.up.railway.app`)
   - Copy `DATABASE_URL` from the Postgres service if not linked.

6. **Deploy** and run migrations (Railway shell or local with same `DATABASE_URL`):
   ```bash
   npx prisma migrate deploy
   ```

### Option 3: VPS (Ubuntu / any Linux)

1. **Server**
   - Rent a VPS (DigitalOcean, Linode, AWS EC2, etc.) and SSH in.

2. **Install Node and PostgreSQL**
   ```bash
   sudo apt update && sudo apt install -y nodejs npm postgresql
   ```
   (Prefer Node 20+ via `nvm` or NodeSource.)

3. **Clone repo and run server**
   ```bash
   cd /var/www
   git clone https://github.com/YourOrg/Legaforce.git
   cd Legaforce/server
   npm install
   npx prisma generate
   ```

4. **Env file**
   ```bash
   nano .env.production.local
   ```
   Paste the same variables as in the example (SERVER_URL, FRONTEND_URL, DATABASE_URL, JWT_SECRET, etc.).

5. **Run migrations**
   ```bash
   NODE_ENV=production npx prisma migrate deploy
   ```

6. **Run with PM2 (keeps it running)**
   ```bash
   sudo npm install -g pm2
   PORT=5000 NODE_ENV=production pm2 start server.js --name legaforce-api
   pm2 save && pm2 startup
   ```

7. **Reverse proxy (HTTPS)**  
   Use Nginx or Caddy in front of `http://localhost:5000`, and SSL (e.g. Let’s Encrypt). Then `SERVER_URL` and `FRONTEND_URL` should use your domain and HTTPS.

---

## Part 4: Point the client to the server-side API

Once the API is live at a URL like `https://legaforce-api.onrender.com`:

### 4.1 Production build (e.g. Vercel / Netlify / static host)

1. In the **client** project, create an env file for production:
   - **Vercel:** Project → Settings → Environment Variables  
     Add: `VITE_API_URL` = `https://legaforce-api.onrender.com/api/v1`
   - **Netlify:** Site → Build & deploy → Environment  
     Same: `VITE_API_URL` = `https://your-api-url.com/api/v1`
   - **Local build:** Create `client/.env.production`:
     ```env
     VITE_API_URL=https://legaforce-api.onrender.com/api/v1
     ```

2. Rebuild the client:
   ```bash
   cd client
   npm run build
   ```
   The built app will now call the server-side API.

### 4.2 Local development

To keep using localhost for the API, don’t set `VITE_API_URL` (or set it to `http://localhost:5000/api/v1`).  
To test against the deployed API locally, set in `client/.env.development.local`:
```env
VITE_API_URL=https://legaforce-api.onrender.com/api/v1
```

---

## Part 5: Checklist

- [ ] PostgreSQL database created and `DATABASE_URL` set on the server.
- [ ] `npx prisma migrate deploy` run once against that database.
- [ ] Server env vars set: `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `SERVER_URL`.
- [ ] API is reachable: `https://your-api-url.com/api/v1/health` returns `{"success":true,"status":"healthy",...}`.
- [ ] Client has `VITE_API_URL=https://your-api-url.com/api/v1` for production builds.
- [ ] CORS: `FRONTEND_URL` on the server matches the exact origin of your frontend (no trailing slash).

---

## Quick reference: env vars

| Variable         | Where    | Purpose |
|-----------------|----------|--------|
| `VITE_API_URL`  | Client   | API base URL (e.g. `https://api.example.com/api/v1`) |
| `FRONTEND_URL`  | Server   | Allowed CORS origin (e.g. `https://app.example.com`) |
| `SERVER_URL`    | Server   | Public URL of the API (for emails/links) |
| `DATABASE_URL`  | Server   | PostgreSQL connection string |
| `JWT_SECRET`    | Server   | Secret for signing JWTs |

After this, your APIs are server-side; the client only needs `VITE_API_URL` set when building for production.
