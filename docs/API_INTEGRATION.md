# Hooking the frontend to real APIs

This guide explains how the app is wired to the backend and how to connect pages to real data.

## Overview

- **Client**: `client/src/services/api.ts` – axios instance with base URL `VITE_API_URL` or `http://localhost:5000/api/v1`, Bearer token from `localStorage.auth_token`, and interceptors for 401/403.
- **Services**:  
  - `applicantService.ts` – all applicant APIs (profile, applications, CV, complaints, rewards, jobs, apply).  
  - `employerService.ts` – all employer APIs (profile, job orders, candidates, interviews, documents, pricing).
- **Server**: Express under `server/`. Auth is at `/api/v1/auth`. Applicant routes at `/api/v1/applicant` and employer at `/api/v1/employer`, both protected by `authorize` + role (`APPLICANT` or `EMPLOYER`). Controllers use Prisma against the existing schema.

## Response shape

Backend returns JSON like:

```json
{ "success": true, "data": { ... } }
```

The client services use a small helper so that the **return value** of each method is the inner `data` (or the whole response if there is no `data`). So in components you get the payload directly:

```ts
const applications = await applicantService.getApplications();
// applications is the array (or whatever the server put in data)
```

## Environment

- **Backend**: `.env` in `server/` with `DATABASE_URL`, `JWT_SECRET`, etc. Run migrations with `npx prisma migrate dev` and start with `npm run dev` (or `node server.js`).
- **Frontend**: `.env` or `.env.local` with `VITE_API_URL=http://localhost:5000/api/v1` so the client points to your API.

## Auth

- Login/register and email verification set `localStorage.auth_token`. The axios instance sends `Authorization: Bearer <token>` on every request.
- Protected routes require a valid JWT and the right role; otherwise the server returns 401/403 and the client interceptor can redirect to login or show a toast.

## Wiring a page to the API

1. **Use the existing service** for that feature (e.g. `applicantService.getApplications()`, `employerService.getCandidates()`).
2. **Call it in `useEffect`** (or in a data-fetching library like React Query if you add it), and keep loading/error state.
3. **Use real data when the call succeeds**, and **fall back to mock data** when the call fails or returns empty (so the UI still works before the backend is ready or when offline).

Example pattern:

```tsx
const [applications, setApplications] = useState<Application[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let cancelled = false;

  applicantService
    .getApplications()
    .then((data) => {
      if (cancelled) return;
      const list = Array.isArray(data) ? data : (data as any)?.items ?? [];
      setApplications(list.length ? list : mockApplications);
    })
    .catch(() => {
      if (!cancelled) setApplications(mockApplications);
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });

  return () => { cancelled = true; };
}, []);
```

Then render from `applications` and show a loader while `loading` is true.

## Applicant API endpoints (server)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/applicant/profile` | Current applicant profile (from Profile + User email) |
| GET | `/applicant/applications` | List applications with job order info |
| GET | `/applicant/applications/:id` | Single application details |
| GET | `/applicant/complaints` | List complaints (optional `?status=`) |
| POST | `/applicant/complaints` | Create complaint `{ category, subject?, description }` |
| GET | `/applicant/cv` | Get saved CV (aiGeneratedCV) |
| PUT | `/applicant/cv` | Save CV payload (object) |
| POST | `/applicant/cv/generate` | Generate AI CV (summary, skill tags) |
| GET | `/applicant/reward-points` | Current reward points |
| GET | `/applicant/rewards/history` | Points history (stub) |
| GET | `/applicant/rewards/catalog` | Redeemable rewards (stub) |
| POST | `/applicant/rewards/redeem` | Redeem (stub, returns 400) |
| GET | `/applicant/jobs` | List active job orders `?search=&location=&page=&limit=` |
| GET | `/applicant/jobs/:id` | Job detail |
| POST | `/applicant/jobs/:id/apply` | Apply to job (creates Application) |
| GET | `/applicant/profile-completion` | Completion percentage |
| GET | `/applicant/notifications` | Notifications (stub) |
| GET | `/applicant/recommended-jobs` | Recommended jobs (stub) |
| GET | `/applicant/saved-jobs` | Saved jobs (stub) |
| GET | `/applicant/match-score` | Match score (stub) |
| GET | `/applicant/profile-views` | Profile views (stub) |
| GET | `/applicant/application-stats` | Counts by status |

## Employer API endpoints (server)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/employer/profile` | Company/employer profile |
| PATCH | `/employer/profile` | Update profile (companyName, contactPerson, phone, country) |
| GET | `/employer/job-orders` | List job orders `?status=` |
| GET | `/employer/candidates` | Candidates (applicants who applied to this employer’s jobs) |
| GET | `/employer/candidates/:id` | Candidate detail (applicant + application) |
| GET | `/employer/interviews` | List interviews (from applications) |
| PATCH | `/employer/interviews/:applicationId/rating` | Set interview rating/notes `{ rating, notes }` |
| POST | `/employer/interviews/:applicationId/share-feedback` | Mark feedback shared |
| GET | `/employer/documents` | Verification documents (from employer.verificationDocs) |
| POST | `/employer/documents` | Upload document (multipart; adds to verificationDocs) |
| GET | `/employer/pricing` | Transparent pricing (static list) |
| GET | `/employer/upcoming-interviews` | Upcoming interviews (stub) |
| GET | `/employer/recent-candidates` | Recent candidates |
| GET | `/employer/candidate-count` | Total candidates |
| GET | `/employer/job-order-count` | Job order count `?status=` |
| GET | `/employer/interview-count` | Interview count |
| GET | `/employer/deployed-worker-count` | Deployed count |
| GET | `/employer/dashboard-stats` | Dashboard aggregates |

## Database (Prisma)

- **User** (email, role, …) → **Profile** (applicant) or **Employer** (company).
- **JobOrder** (employerId) → **Application** (applicantId, jobOrderId, status, interviewNotes, videoInterviewUrl, aiMatchScore, …).
- **Complaint** (applicantId, category, status, escalationLevel, …).
- **Profile** has `aiGeneratedCV` (JSON) and `rewardPoints`; **Employer** has `verificationDocs` (JSON) and `trustScore`.

Running migrations and seeding (if you have a seed) ensures these tables exist before calling the new routes.

## Optional: React Query

For caching, refetching, and loading/error state you can add `@tanstack/react-query` and wrap the app with `QueryClientProvider`, then use:

```ts
const { data, isLoading, error } = useQuery({
  queryKey: ["applications"],
  queryFn: () => applicantService.getApplications(),
});
```

Use `data` when present and fall back to mock when `error` or empty, same as above.

## Summary

1. **Backend**: Start server with DB and env; applicant and employer routes are mounted and use Prisma.
2. **Frontend**: Set `VITE_API_URL`; all calls go through `api.ts` with the stored token.
3. **Pages**: Call the right service in `useEffect` (or React Query), set state from the returned `data`, and fall back to mock data on failure or empty so the UI always has something to show.
