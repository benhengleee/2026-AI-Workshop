const SPREADSHEET_NAME = '2026 AI 工作坊';
const SHEET_NAME = '2026 AI 工作坊';
const SHEET_HEADERS = ['姓名', 'Email', '單位', '電話', '職稱'];

function initializeSpreadsheet() {
  const spreadsheet = getSpreadsheet_();
  const sheet = getSignupSheet_(spreadsheet);
  return {
    spreadsheetUrl: spreadsheet.getUrl(),
    sheetName: sheet.getName()
  };
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: '2026 AI 工作坊報名服務已就緒。'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let requestId = '';

  try {
    const postData = JSON.parse(e.parameter.payload || '{}');
    requestId = postData.requestId || '';

    const spreadsheet = getSpreadsheet_();
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    try {
      const sheet = getSignupSheet_(spreadsheet);
      sheet.getRange('D2:D').setNumberFormat('@');
      sheet.appendRow([
        postData.name || '',
        postData.email || '',
        postData.unit || '',
        String(postData.phone || ''),
        postData.title || ''
      ]);
    } finally {
      lock.releaseLock();
    }

    return createResponsePage_({
      success: true,
      message: '報名成功，資料已送出。',
      requestId: requestId
    });
  } catch (error) {
    return createResponsePage_({
      success: false,
      message: error.message || '報名失敗。',
      requestId: requestId
    });
  }
}

function getSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty('SPREADSHEET_ID');

  if (!spreadsheetId) {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    try {
      spreadsheetId = properties.getProperty('SPREADSHEET_ID');
      if (!spreadsheetId) {
        const spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
        spreadsheetId = spreadsheet.getId();
        properties.setProperty('SPREADSHEET_ID', spreadsheetId);
      }
    } finally {
      lock.releaseLock();
    }
  }

  return SpreadsheetApp.openById(spreadsheetId);
}

function getSignupSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    const sheets = spreadsheet.getSheets();
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      sheet = sheets[0].setName(SHEET_NAME);
    } else {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);
    sheet.getRange('A1:E1').setBackground('#dfefff').setFontWeight('bold');
  }

  sheet.getRange('D2:D').setNumberFormat('@');
  return sheet;
}

function createResponsePage_(result) {
  const message = JSON.stringify({
    type: 'registration-result',
    requestId: result.requestId,
    success: result.success,
    message: result.message
  }).replace(/</g, '\\u003c');

  return HtmlService.createHtmlOutput(
    '<!doctype html><html><body><script>window.top.postMessage(' +
      message +
      ', "*");</script></body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
