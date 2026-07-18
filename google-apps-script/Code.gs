/**
 * VOIDINK — Google Sheets Form Handler
 *
 * Deploy as Web App:
 *   Execute as: Me
 *   Who has access: Anyone   ← must be Anyone (not "Anyone with Google account")
 *
 * After ANY code change:
 *   Deploy → Manage deployments → ✏️ → Version: New version → Deploy
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    const p = (e && e.parameter) || {}
    const now = new Date()

    sheet.appendRow([
      now,
      p.name || '',
      p.email || '',
      p.service || '',
      p.budget || '',
      p.deadline || '',
      p.description || '',
      p.references || '',
    ])

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(
      ContentService.MimeType.JSON,
    )
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

/** Optional: open the URL in browser to verify deployment */
function doGet() {
  return ContentService.createTextOutput('VOIDINK form endpoint is live.').setMimeType(
    ContentService.MimeType.TEXT,
  )
}
