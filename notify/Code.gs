/**
 * Lucena Lab Inventory: email the lab manager when someone submits an order request.
 *
 * How it stays safe:
 * - The app sends only the request's ID and the signed-in person's Firebase login token.
 * - This script reads the request from Firestore WITH that token, so Firestore's own
 *   security rules decide: only people on the lab's list can trigger an email, and only
 *   for a request that really exists. The email text comes from the database, not from
 *   whatever was posted here.
 * - Each request is emailed once (repeats within 6 hours are ignored).
 */
const PROJECT_ID = 'lucena-alcaide-lab';
const SEND_TO = 'ralucher@gmail.com';
const APP_URL = 'https://ralucher.github.io/lab-inventory/';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const id = String(body.requestId || '');
    const token = String(body.idToken || '');
    if (!/^[A-Za-z0-9]{1,40}$/.test(id) || !token) return reply_('bad request');

    const cache = CacheService.getScriptCache();
    if (cache.get('sent:' + id)) return reply_('already sent');

    const res = UrlFetchApp.fetch(
      'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID +
        '/databases/(default)/documents/requests/' + id,
      { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) return reply_('not allowed');

    const f = JSON.parse(res.getContentText()).fields || {};
    const v = function (k) {
      const x = f[k];
      if (!x) return '';
      if ('stringValue' in x) return x.stringValue;
      if ('integerValue' in x) return String(x.integerValue);
      if ('doubleValue' in x) return String(x.doubleValue);
      if ('booleanValue' in x) return x.booleanValue ? 'yes' : 'no';
      return '';
    };

    const who = v('requestedBy');
    const qty = v('qty') || '1';
    const price = v('unitPrice');
    const total = price ? (Number(price) * Number(qty)).toFixed(2) + ' €' : '';
    const urgent = v('urgent') === 'yes';
    const lines = [
      (urgent ? 'URGENT ' : '') + 'New order request in the Lucena Lab Inventory.',
      '',
      'Item:       ' + v('name'),
      'Quantity:   ' + qty,
      'Catalog #:  ' + (v('catalog') || '-'),
      'Supplier:   ' + (v('supplier') || '-'),
      'Unit price: ' + (price ? Number(price).toFixed(2) + ' €' : '-') + (total ? '   (total ' + total + ')' : ''),
      'Asked by:   ' + (who || 'a lab member'),
      'Notes:      ' + (v('notes') || '-'),
      '',
      'Approve or update it on the Orders board: ' + APP_URL
    ];

    const mail = {
      to: SEND_TO,
      subject: (urgent ? '[URGENT] ' : '') + 'Order request: ' + v('name') + ' x' + qty,
      body: lines.join('\n'),
      name: 'Lucena Lab Inventory'
    };
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(who)) mail.replyTo = who;
    MailApp.sendEmail(mail);
    cache.put('sent:' + id, '1', 21600);
    return reply_('sent');
  } catch (err) {
    return reply_('error');
  }
}

function reply_(text) {
  return ContentService.createTextOutput(text);
}

/** Run this once from the editor to grant the script permission to send email and read Firestore. */
function authorize() {
  MailApp.getRemainingDailyQuota();
  UrlFetchApp.fetch('https://www.google.com', { muteHttpExceptions: true });
}
