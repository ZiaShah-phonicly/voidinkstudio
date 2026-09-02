# AGENTS.md — VOIDINK Studios (Frontend)

> **Read this file first** before changing anything in `voidinkstudio`.
> Work like a senior engineer: understand the flow, make a minimal correct change, verify, then stop.
> Partner backend: `D:\voidinkstudio_workspace\backend-voidink` (see that repo’s `AGENTS.md`).

---

## 1. What this project is

Public marketing + commission site for **VOIDINK Studios**:

- Service showcase, pricing cards, contact/order form
- Order tracking page (`/track`)

Stack: **Vite 8 + React 19 + React Router 7**. No Redux, no UI kit, no axios — plain `fetch` + `App.css`.

**Staff admin portal** lives in a **separate app**: `D:\voidinkstudio_workspace\voidink-admin` (deploy later on `admin.voidinkstudios.com`). Same `backend-voidink` API.

**CRM:** Form submit still upserts CRM in Mongo when API+Mongo saves an order. Staff manage pipeline in `voidink-admin`. Optional n8n enrichment: import `backend-voidink/workflows/voidink-crm-order-enrichment.json`.

---

## 2. How to start (local)

```powershell
cd D:\voidinkstudio_workspace\voidinkstudio
npm install
# Ensure .env exists (copy from .env.example) — UTF-8 **without BOM**
npm run dev          # http://localhost:5173
```

Backend (when API mode is on):

```powershell
cd D:\voidinkstudio_workspace\backend-voidink
.\venv\Scripts\Activate.ps1
python manage.py runserver 8002
```

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production → `dist/` (env vars baked in at build time) |
| `npm run preview` | Preview `dist/` |
| `npm run lint` | ESLint |

**Vite proxy** (`vite.config.js`): browser `/api/*` → `http://127.0.0.1:8002`.  
If `VITE_API_URL` is set, the browser calls that origin directly (proxy bypassed).

---

## 3. Repo map

```
voidinkstudio/
├── AGENTS.md                 ← you are here
├── src/
│   ├── App.jsx               # All routes
│   ├── App.css               # Almost all styles
│   ├── main.jsx
│   ├── components/           # SiteLayout, PricingCard, ChatWidget, GoldTubesBackground, …
│   ├── pages/                # Public pages (+ NotFoundPage)
│   ├── data/                 # Content + pricing + form package helpers
│   ├── utils/                # authApi (session helpers), submit*, trackOrder
│   └── hooks/
├── public/                   # Images, _redirects (Netlify SPA)
├── google-apps-script/       # Code.gs — Sheets web app (redeploy after edits)
├── dist/                     # Build output (no runtime .env needed)
├── vite.config.js
├── .env                      # Local only (gitignored) — NO BOM
└── .env.example
```

---

## 4. Routes (`src/App.jsx`)

| Path | Page | Notes |
|------|------|--------|
| `/` | `HomePage` | Form `#query`, pricing `#pricing`, Order Now prefill |
| `/about` | About | |
| `/services/:slug` | `ServicePage` | Order Now → home form via state + sessionStorage |
| `/services/fursuits`, `/fursuits` | `FursuitPage` | Dedicated fursuit commissions page (`/fursuits` redirects) |
| `/track`, `/track/:trackingId` | `TrackOrderPage` | Needs backend tracking API |
| `/unsubscribe` | `UnsubscribePage` | Public opt-out from cold outreach (CAN-SPAM) |
| `/faq`, `/privacy-policy`, `/terms-of-service` | Legal/FAQ | |
| `*` | `NotFoundPage` | Branded 404 |
| ~~`/login`, `/register`, `/admin/*`~~ | Auth / admin | **Removed from this app** — staff portal is `voidink-admin`. Prod nginx may 301 `/admin` → `admin.voidinkstudios.com`. |

Home hash sections: `#home` `#services` `#work` `#process` `#pricing` `#testimonials` `#query`.

---

## 5. Critical product flows

### 5.1 Contact / order form (`HomePage.jsx`)

1. User fills form (or arrives via **Order Now**).
2. Submit respects **`VITE_FORM_USE_API`**:
   - `false` (current temporary mode): **Google Sheet only** via `submitToGoogleSheet.js` (`mode: 'no-cors'`).
   - `true`: `POST /api/voidink/submit/` via `submitToVoidinkApi.js`; on API failure, fallback to Sheet.
3. Optional Discord webhook if `VITE_DISCORD_WEBHOOK_URL` is set.
4. Success UI may show `tracking_id` **only when API/Mongo saved the order**.

**Fursuit commissions:** Dedicated page `/services/fursuits` (also `/fursuits` → redirect). Form dropdown includes Head / Partial / Full / Other. Extra fields (species, suit type, reference sheet link, budget range) show when any Fursuit service is selected and are folded into `description` / `references` on submit. Order Now prefills the matching Fursuit service + package (`Custom Head` / `Partial Suit` / `Full Suit`).

**Package / price behavior (do not regress):**

- Service → packages from `getFormPackagesForService()` in `src/data/voidinkData.js`
- Package select → auto-fill `price`
- Service change → reset package/price/budget
- `CUSTOM_PACKAGE = 'Custom / Need a quote'` → budget dropdown; fixed package → readonly price
- Variants (e.g. Furry SFW/NSFW) → option values like `Reference Sheet (SFW)`

**Order Now prefill:**

- Home pricing: `PricingCard` → `handleOrderClick` → `applyOrderToForm` → scroll `#query`
- Service page: writes `sessionStorage['voidink_pending_order']` + `navigate('/', { state: { order } })`
- Home reads **both** `location.state.order` and sessionStorage
- Package field value must match dropdown options (`packageName`, not `"Category — Name"`)

### 5.2 Tracking

- UI: `TrackOrderPage` + `trackOrder.js`
- API: `GET /api/voidink/track/<VI-…>/`
- Sheet-only submissions **do not** create tracking IDs

### 5.3 Admin portal

Moved to **`voidink-admin`**. See that repo’s `AGENTS.md`.

---

## 6. Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_GOOGLE_SHEETS_URL` | Apps Script web app URL |
| `VITE_FORM_USE_API` | `true` = Mongo API; `false` = Sheet only |
| `VITE_API_URL` | API origin; empty = use Vite `/api` proxy |
| `VITE_DISCORD_WEBHOOK_URL` | Optional |
| `VITE_RETELL_VOICE_ENABLED` | `true` = show Aria on site; `false` = hide completely |
| `VITE_RETELL_VOICE_AGENT_ID` | Retell voice agent id (`agent_…`) |
| `RETELL_API_KEY` | Used by Vite during `npm run dev` to mint call tokens (never `VITE_`) |
| `VITE_LOCK_PAGE` | `true` = block right-click / Save As / View Source; `false` = unlocked (local inspect) |
| `VITE_TUBES_ENABLED` | `true` / `false` — hero tubes WebGL cursor (default off; heavy) |
| `VITE_TUBES_THEME` | `voidink` \| `gold` \| `silver` (only when enabled) |
| `VITE_TUBES_COLORS` / `LIGHTS` / `INTENSITY` | Hero tubes overrides |

Also ship `public/robots.txt` + `public/sitemap.xml` + `public/llms.txt` (AI/GEO brand summary). Prod nginx: see `deploy/nginx.voidinkstudios.com.example` (HSTS / X-Frame-Options).

**SEO / GEO (do not spam):**

- Brand spellings live in `src/data/seo.js` + Organization/WebSite schema in `index.html` (`voidinkstudio` without “s” is a known misspelling; do not stuff it into H1).
- Per-route title/description via `usePageMeta`. FAQ/Service JSON-LD must match visible page content.
- Never add fake `AggregateRating`, SearchAction without a real site search, or LocalBusiness without a real NAP.

**Rules:**

- Vite inlines `VITE_*` at **build** time → after env changes run `npm run build` for `dist/`
- `.env` must be UTF-8 **without BOM** (BOM breaks first key, usually Sheets URL)
- Restart `npm run dev` after `.env` edits

---

## 7. Backend API contract (expected)

Base: proxy `/api` or `VITE_API_URL`.

| Method | Path |
|--------|------|
| GET | `/api/health/` |
| POST | `/api/register/` |
| POST | `/api/login/` |
| GET | `/api/me/` |
| POST | `/api/voidink/submit/` |
| POST | `/api/voidink/unsubscribe/` |
| GET | `/api/voidink/user/?email=` |
| GET | `/api/voidink/track/<tracking_id>/` |
| GET/PATCH | `/api/admin/orders/…` |
| GET/PATCH | `/api/admin/users/…` |

Details, Mongo schema, scripts: **`backend-voidink/AGENTS.md`**.

---

## 8. Content vs code

Prefer editing data, not hardcoding in JSX:

| File | Owns |
|------|------|
| `src/data/voidinkData.js` | Pricing, form services, package helpers, testimonials, work |
| `src/data/serviceDetails.js` | Service page copy + `formService` / `pricingCategoryId` |
| `src/data/serviceGalleries.js` | Gallery images |
| `src/data/faqData.js` | FAQ |
| `src/data/chatbotEngine.js` | ChatWidget replies |
| `google-apps-script/Code.gs` | Sheet row shape (redeploy web app after change) |

---

## 9. Engineering standards (mandatory)

1. **Before coding:** find the existing flow; prefer extending helpers over one-off JSX hacks.
2. **Scope:** change only what the task needs — no drive-by refactors, no new markdown unless asked.
3. **Match style:** existing React patterns, `App.css` tokens, no new design system unless requested.
4. **Verify:**
   - Manual path for the feature (form submit, Order Now, admin login, track lookup)
   - No regressions on package dropdown / price autofill / Order Now prefill
   - If API involved: hit endpoint or confirm Mongo/Atlas connectivity
5. **Security:**
   - Never commit `.env` secrets or real Atlas passwords into docs/examples
   - Don’t weaken `is_staff` checks on admin routes
   - Public track must keep email masked (backend)
   - Don’t log passwords or full JWTs
6. **Sheets:** browser path uses `no-cors` — cannot read response; don’t “fix” by awaiting JSON from Apps Script in the browser.
7. **Bugs:** reproduce → root cause → fix → retest happy path + one failure path.

---

## 10. Common failure modes

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Form “Failed to fetch” | API mode on but backend down / wrong `VITE_API_URL` | Start `:8002`, or set `VITE_FORM_USE_API=false` |
| Sheet empty, API works | Missing/wrong Sheets URL or BOM in `.env` | Fix URL; save `.env` without BOM; rebuild |
| Package dropdown only “Custom” | Regression in `getFormPackagesForService` / HomePage select | Restore service→packages mapping |
| Order Now wrong fields | Prefill uses wrong package value shape | Use `packageName`; match dropdown `value` |
| Track 404 | Sheet-only submit or Mongo down | Need API+Mongo for tracking IDs |
| Admin “not a team admin” | User `is_staff: false` in Mongo | `python scripts/set_staff.py email` |
| Dist missing Sheets URL | Stale build or BOM at build time | Fix `.env`, `npm run build`, confirm URL in `dist/assets/*.js` |

---

## 11. Deploy notes

### VPS (recommended — same as Phonicly web)

- Domain: **https://voidinkstudios.com**
- Script: `./deploy-web.sh` on the VPS checkout (pull → build → atomic `dist` swap)
- Full steps: **`DEPLOY_WEB_RUNBOOK.md`** + nginx sample `deploy/nginx.voidinkstudios.com.example`
- VPS `.env` (gitignored) bakes `VITE_*` at build time, e.g.:
  - `VITE_API_URL=https://api.voidink.studio`
  - `VITE_FORM_USE_API=true`
  - `VITE_LOCK_PAGE=true`
- Web is **not** Docker; only the API (`backend-voidink`) is dockerized.

### General

- Ship `dist/` after `npm run build` with production env values.
- `dist` does **not** need a runtime `.env`.
- Netlify: `public/_redirects` handles SPA fallback (optional; VPS uses nginx `try_files`).
- Re-enable Mongo pipeline: `VITE_FORM_USE_API=true` + healthy `backend-voidink` + Atlas IP allowlist.

---

## 12. Agent checklist (every task)

- [ ] Read relevant section of this file + open the real source files
- [ ] Confirm `VITE_FORM_USE_API` mode before touching form submit
- [ ] Keep Order Now + package/price autofill working
- [ ] Don’t invent new collections/endpoints without updating both repos’ AGENTS.md
- [ ] Test the user-visible path you changed
- [ ] No secrets in commits; no unrelated file churn
