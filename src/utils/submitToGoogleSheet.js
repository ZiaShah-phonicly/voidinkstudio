/**
 * Sends form data to Google Sheet via Apps Script Web App.
 *
 * Google Apps Script blocks normal CORS reads from browsers, so we use
 * mode: "no-cors" (same reliable pattern as simple HTML forms).
 * Data still reaches the sheet; response body cannot be read.
 *
 * .env:
 * VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/XXXX/exec
 */
export async function submitToGoogleSheet(payload) {
  const url = (import.meta.env.VITE_GOOGLE_SHEETS_URL || '').trim()

  // Optional: skip sheet if URL not configured; MongoDB API still saves.
  if (!url) {
    return { status: 'skipped', reason: 'missing_sheets_url' }
  }

  const body = new URLSearchParams()
  body.set('tracking_id', payload.tracking_id || '')
  body.set('name', payload.name || '')
  body.set('email', payload.email || '')
  body.set('service', payload.service || '')
  body.set('package', payload.package || '')
  body.set('price', payload.price || '')
  body.set('budget', payload.budget || '')
  body.set('deadline', payload.deadline || '')
  body.set('description', payload.description || '')
  body.set('references', payload.references || '')

  // no-cors avoids the Access-Control-Allow-Origin block from script.google.com
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    body,
  })

  return { status: 'success' }
}
