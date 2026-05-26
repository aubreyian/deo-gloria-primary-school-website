/* Ysterberg Public Primary School CMS Google Sheets backend.
   Paste into Extensions > Apps Script in the CMS spreadsheet, set ADMIN_TOKEN, then deploy as a Web App. */
const ADMIN_TOKEN = "CHANGE-THIS-SCHOOL-ADMIN-TOKEN";
const COLLECTIONS = {
  announcements: { sheet: "Announcements", fields: ["id", "title", "date", "category", "message", "audience", "urgency"] },
  events: { sheet: "Events", fields: ["id", "title", "date", "time", "venue", "description", "audience", "type"] },
  admissions: { sheet: "Admissions", fields: ["id", "name", "phone", "email", "grade", "message", "status", "submittedAt"] },
  contacts: { sheet: "Contacts", fields: ["id", "name", "phone", "email", "enquiryType", "message", "status", "submittedAt"] },
  documents: { sheet: "Documents", fields: ["id", "title", "description", "category", "fileLink", "important"] },
  faqs: { sheet: "FAQs", fields: ["id", "question", "answer", "category"] }
};
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : "{}");
    if (payload.action === "read") return json({ ok: true, data: readData(Boolean(payload.includePrivate), payload.token) });
    if (payload.action === "append") return appendRecord(payload);
    if (payload.action === "saveAll") return saveAll(payload);
    return json({ ok: false, message: "Unknown action." });
  } catch (error) { return json({ ok: false, message: error.message }); }
}
function appendRecord(payload) {
  if (payload.collection !== "admissions" && payload.collection !== "contacts") requireAdmin(payload.token);
  const config = COLLECTIONS[payload.collection];
  if (!config) throw new Error("Unknown collection.");
  sheet(config.sheet, config.fields).appendRow(config.fields.map((field) => payload.item && payload.item[field] != null ? payload.item[field] : ""));
  return json({ ok: true });
}
function saveAll(payload) {
  requireAdmin(payload.token);
  const data = payload.data || {};
  writeSettings(data.settings || {});
  Object.keys(COLLECTIONS).forEach((key) => writeCollection(COLLECTIONS[key], data[key] || []));
  return json({ ok: true });
}
function readData(includePrivate, token) {
  const data = { settings: readSettings(), announcements: readCollection(COLLECTIONS.announcements), events: readCollection(COLLECTIONS.events), documents: readCollection(COLLECTIONS.documents), faqs: readCollection(COLLECTIONS.faqs) };
  if (includePrivate) { requireAdmin(token); data.admissions = readCollection(COLLECTIONS.admissions); data.contacts = readCollection(COLLECTIONS.contacts); }
  return data;
}
function readSettings() { const rows = sheet("Settings", ["key", "value"]).getDataRange().getValues(); const out = {}; rows.slice(1).forEach((r) => { if (r[0]) out[String(r[0])] = r[1] == null ? "" : String(r[1]); }); return out; }
function writeSettings(settings) { const rows = [["key", "value"]].concat(Object.keys(settings).map((k) => [k, settings[k]])); const s = sheet("Settings", ["key", "value"]); s.clearContents(); s.getRange(1, 1, rows.length, 2).setValues(rows); }
function readCollection(config) { const values = sheet(config.sheet, config.fields).getDataRange().getValues(); const headers = values[0] || config.fields; return values.slice(1).filter((row) => row.some((cell) => cell !== "")).map((row) => Object.fromEntries(headers.map((h, i) => [h, h === "important" ? String(row[i]).toLowerCase() === "true" || row[i] === true : row[i]]))); }
function writeCollection(config, items) { const rows = [config.fields].concat(items.map((item) => config.fields.map((field) => item[field] == null ? "" : item[field]))); const s = sheet(config.sheet, config.fields); s.clearContents(); s.getRange(1, 1, rows.length, config.fields.length).setValues(rows); }
function sheet(name, headers) { const ss = SpreadsheetApp.getActiveSpreadsheet(); let s = ss.getSheetByName(name); if (!s) s = ss.insertSheet(name); if (s.getLastRow() === 0) s.getRange(1, 1, 1, headers.length).setValues([headers]); return s; }
function requireAdmin(token) { if (!ADMIN_TOKEN || ADMIN_TOKEN === "CHANGE-THIS-SCHOOL-ADMIN-TOKEN") throw new Error("Apps Script admin token has not been configured."); if (String(token || "") !== ADMIN_TOKEN) throw new Error("Invalid admin token."); }
function json(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
