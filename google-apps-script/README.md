# Google Sheet Form Setup — VOIDINK (Simple Method)

Yeh wahi **free + clean** method hai jo aapne share kiya — bas React site ke fields ke hisaab se.

## Step 1 — Google Sheet

1. [Google Sheets](https://sheets.google.com) → New spreadsheet
2. **Row 1** mein yeh headings likho:

```
Timestamp | Tracking ID | Name | Email | Service | Package | Price | Budget | Deadline | Description | References
```

> After updating `Code.gs`, redeploy the Apps Script web app (Manage deployments → Edit → New version).

Sheet rows are now written by the **backend** (`GOOGLE_SHEETS_URL` in `backend-voidink/.env`), not only the frontend.

## Step 2 — Apps Script

1. Sheet mein: **Extensions → Apps Script**
2. Purana code delete karo
3. File `google-apps-script/Code.gs` ka code paste karo
4. **Save** karo

## Step 3 — Deploy Web App

1. **Deploy → New deployment**
2. Type: **Web app**
3. **Execute as:** Me
4. **Who has access:** Anyone
5. **Deploy** → Web App **URL copy** karo

## Step 4 — React project `.env`

Project root mein `.env` file:

```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Server restart:

```bash
npm run dev
```

## Step 5 — Test

1. Site kholo → Contact form fill karo → Submit
2. Google Sheet refresh karo → nayi row aani chahiye
3. **Date-wise** dekhne ke liye **Timestamp** column se sort/filter karo

---

## Aapki site vs simple HTML form

| Simple HTML guide | Aapki React site |
|-------------------|----------------|
| `name`, `email`, `phone`, `message` | `name`, `email`, `service`, `package`, `price`, `budget`, `deadline`, `description`, `references` |
| `<form>` + `FormData` | Same `FormData` — `src/utils/submitToGoogleSheet.js` |
| Manual URL in script | URL `.env` se: `VITE_GOOGLE_SHEETS_URL` |

**Coding aapko nahi karni** — sirf Sheet + Script deploy + `.env` mein URL.

---

## Production (Netlify / Vercel)

Hosting dashboard → Environment Variables:

```
VITE_GOOGLE_SHEETS_URL = your web app url
```

Redeploy karo.

## Optional Discord

```env
VITE_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

Form submit par Sheet + Discord dono chalenge.
