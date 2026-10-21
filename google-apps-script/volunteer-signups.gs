// Event volunteer sign-ups → Google Sheet + "new volunteer" email.
//
// Lives in the campaign spreadsheet (Extensions → Apps Script) and is
// deployed as a web app; the sign-up form in each event's pop-up POSTs
// here (the main volunteer page's form still goes by EmailJS). See
// the README's "Volunteer sign-ups" section for setup. The script runs as
// the sheet owner, so it can write to a private sheet and send email from
// that account — nothing with write access ever reaches the website bundle.
//
// The web app URL is public, so everything below treats the request as
// untrusted: a honeypot, required-field and length checks, a global
// rate limit, and neutralising values that Sheets would run as formulas.

// Where the campaign is told about each sign-up. Set it under Project
// Settings → Script properties as NOTIFY_EMAIL (comma-separate for several).
const NOTIFY_EMAIL = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');

const SHEET_NAME = 'Volunteers';
const HEADERS = [
  'Submitted at',
  'Name',
  'Surname',
  'WhatsApp / mobile',
  'Email',
  'Event',
];

// Caps how many sign-ups are accepted per rolling window across everyone,
// so a script hammering the URL can't flood the sheet or burn through the
// account's daily email quota (100/day on a free Google account).
const RATE_LIMIT = 20;
const RATE_WINDOW_SECONDS = 10 * 60;

const MAX_LENGTH = 200;

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ ok: false, error: 'bad-request' });
  }

  // Bots fill every field; people never see this one. Pretend it worked so
  // the bot has nothing to learn from.
  if (data.website) return respond({ ok: true });

  const clean = (key) => sanitise(String(data[key] == null ? '' : data[key]).trim().slice(0, MAX_LENGTH));
  const row = {
    firstName: clean('firstName'),
    lastName: clean('lastName'),
    phone: clean('phone'),
    email: clean('email'),
    event: clean('event'),
  };

  if (!row.firstName || !row.lastName || !row.phone || !row.event) {
    return respond({ ok: false, error: 'missing-fields' });
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return respond({ ok: false, error: 'busy' });
  try {
    if (!withinRateLimit()) return respond({ ok: false, error: 'rate-limited' });

    sheet().appendRow([
      new Date(),
      row.firstName,
      row.lastName,
      row.phone,
      row.email,
      row.event,
    ]);
  } finally {
    lock.releaseLock();
  }

  // The row is the record; the email is just the heads-up, so a mail
  // failure (quota, bad address) mustn't turn a saved sign-up into an error.
  try {
    notify(row);
  } catch (err) {
    console.error('Volunteer notification failed', err);
  }

  return respond({ ok: true });
}

function sheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let tab = spreadsheet.getSheetByName(SHEET_NAME);
  if (!tab) {
    tab = spreadsheet.insertSheet(SHEET_NAME);
    tab.appendRow(HEADERS);
    tab.setFrozenRows(1);
    tab.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return tab;
}

function withinRateLimit() {
  const cache = CacheService.getScriptCache();
  const count = Number(cache.get('signups') || 0);
  if (count >= RATE_LIMIT) return false;
  cache.put('signups', String(count + 1), RATE_WINDOW_SECONDS);
  return true;
}

// A cell starting with = + - or @ is run as a formula when the sheet is
// opened; a leading apostrophe makes Sheets store it as plain text instead.
// Phone numbers like "+27..." hit this too, which is fine — they stay as
// typed rather than being mangled into a number.
function sanitise(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function notify(row) {
  if (!NOTIFY_EMAIL) return;
  const plain = (value) => String(value).replace(/^'/, '');
  const name = `${plain(row.firstName)} ${plain(row.lastName)}`;
  const lines = [
    `Signed up for: ${plain(row.event)}`,
    '',
    `Name: ${name}`,
    `WhatsApp / mobile: ${plain(row.phone)}`,
    `Email: ${plain(row.email) || '(not given)'}`,
  ];
  lines.push('', `All sign-ups: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`);

  const message = { to: NOTIFY_EMAIL, subject: `New volunteer: ${name}`, body: lines.join('\n') };
  // Lets the team hit Reply to answer the volunteer directly.
  if (/^[^\s@]+@[^\s@]+$/.test(plain(row.email))) message.replyTo = plain(row.email);
  MailApp.sendEmail(message);
}

function respond(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
