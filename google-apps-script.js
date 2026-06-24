const SHEET_NAME = "progress";
const HEADERS = [
  "child_token",
  "book_id",
  "done",
  "hero",
  "liked",
  "mood",
  "rating",
  "question_answers",
  "finished_at",
  "updated_at"
];

function doGet(e) {
  try {
    const childToken = String(e.parameter.child || "").trim();
    if (!childToken) return respond({ ok: false, error: "Missing child token" }, e);

    return respond({
      ok: true,
      entries: readProgress(childToken)
    }, e);
  } catch (error) {
    return respond({ ok: false, error: String(error.message || error) }, e);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const childToken = String(payload.childToken || "").trim();
    if (!childToken) return respond({ ok: false, error: "Missing child token" }, e);

    if (payload.action === "reset") {
      replaceChildRows(childToken, {});
      return respond({ ok: true }, e);
    }

    if (payload.action === "save_all") {
      replaceChildRows(childToken, payload.entries || {});
      return respond({ ok: true }, e);
    }

    return respond({ ok: false, error: "Unknown action" }, e);
  } catch (error) {
    return respond({ ok: false, error: String(error.message || error) }, e);
  }
}

function readProgress(childToken) {
  const sheet = getProgressSheet();
  const values = sheet.getDataRange().getValues();
  const entries = {};

  for (let row = 1; row < values.length; row += 1) {
    const record = rowToRecord(values[row]);
    if (record.child_token !== childToken) continue;

    entries[String(record.book_id)] = {
      done: record.done === true || record.done === "true",
      hero: record.hero || "",
      liked: record.liked || "",
      mood: record.mood || "fun",
      rating: Number(record.rating) || 5,
      questionAnswers: parseJsonArray(record.question_answers),
      finishedAt: record.finished_at || "",
      updatedAt: record.updated_at || ""
    };
  }

  return entries;
}

function replaceChildRows(childToken, entries) {
  const sheet = getProgressSheet();
  const values = sheet.getDataRange().getValues();

  for (let row = values.length; row >= 2; row -= 1) {
    if (String(values[row - 1][0]) === childToken) {
      sheet.deleteRow(row);
    }
  }

  const now = new Date().toISOString();
  const rows = Object.entries(entries)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([bookId, entry]) => [
      childToken,
      Number(bookId),
      Boolean(entry.done),
      String(entry.hero || ""),
      String(entry.liked || ""),
      String(entry.mood || "fun"),
      Number(entry.rating) || 5,
      JSON.stringify(Array.isArray(entry.questionAnswers) ? entry.questionAnswers : []),
      String(entry.finishedAt || entry.finished_at || now),
      now
    ]);

  if (rows.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);
  }
}

function getProgressSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = HEADERS.every((header, index) => firstRow[index] === header);
  if (!hasHeaders) {
    sheet.clear();
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function rowToRecord(row) {
  return HEADERS.reduce((record, header, index) => {
    record[header] = row[index];
    return record;
  }, {});
}

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function respond(payload, e) {
  const callback = e && e.parameter && e.parameter.callback;
  const body = callback
    ? `${callback}(${JSON.stringify(payload)});`
    : JSON.stringify(payload);

  return ContentService
    .createTextOutput(body)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}
