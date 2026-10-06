// Kontaktformular: Vercel Function, Versand ueber Resend (gleiches Muster wie assistenzplus.de/api/contact).
// GET  -> {ready: bool}  (kontakt.html blendet das Formular nur ein, wenn der Versand konfiguriert ist)
// POST -> Anfrage per E-Mail an Najra
//
// Umgebungsvariablen (Vercel, Projekt nanu-aesthetics, Team nanu-ae):
//   RESEND_API_KEY  Pflicht. Ohne ihn bleibt das Formular unsichtbar.
//   KONTAKT_TO      optional, Empfaenger (Standard: nanuaestheticss@gmail.com)
//   RESEND_FROM     optional, Absender (Standard: anfrage@nanu-aesthetics.de, Domain muss bei Resend verifiziert sein)

const ALLOWED_ORIGINS = ['https://nanu-aesthetics.de', 'https://www.nanu-aesthetics.de'];
const DEFAULT_TO = 'nanuaestheticss@gmail.com';
const DEFAULT_FROM = 'Nanu Aesthetics Website <anfrage@nanu-aesthetics.de>';

const BEHANDLUNGEN = [
  'Powder Brows',
  'Ombré Brows',
  'Aquarell Lips',
  '3D Lips',
  'Brow Lifting',
  'Lash Lifting',
  'PMU-Remover',
  'Noch unsicher, ich möchte mich beraten lassen',
];

// In-Memory-Rate-Limit pro Serverless-Instanz (5 Anfragen pro Stunde und IP)
const RATE_MAX = 5;
const RATE_WINDOW = 60 * 60 * 1000;
const rateMap = new Map();

function rateOk(ip) {
  const now = Date.now();
  if (rateMap.size > 10000) {
    for (const [k, e] of rateMap) if (now > e.resetAt) rateMap.delete(k);
  }
  const e = rateMap.get(ip);
  if (!e || now > e.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (e.count >= RATE_MAX) return false;
  e.count++;
  return true;
}

function esc(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(text).replace(/[&<>"']/g, (c) => map[c]);
}

function str(v) {
  return typeof v === 'string' ? v.trim() : '';
}

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
const PHONE_RE = /^[0-9+()\/ .-]{6,30}$/;

function row(label, value, shade) {
  return `<tr${shade ? ' style="background-color:#f5f1ea;"' : ''}>
    <td style="padding:12px;border:1px solid #e3dccf;font-weight:bold;width:160px;">${label}</td>
    <td style="padding:12px;border:1px solid #e3dccf;white-space:pre-wrap;">${value}</td>
  </tr>`;
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.RESEND_API_KEY;

  if (req.method === 'GET') return res.status(200).json({ ready: Boolean(apiKey) });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Nur Anfragen von der eigenen Domain (Browser senden Origin bei POST immer mit)
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Nicht erlaubt.' });
  }

  // Nur die von Vercel gesetzte Client-IP, x-forwarded-for ist vom Client faelschbar
  const ip = req.headers['x-real-ip'] || (req.socket && req.socket.remoteAddress) || 'unknown';
  if (!rateOk(ip)) {
    return res.status(429).json({ error: 'Zu viele Anfragen. Bitte versuch es später noch einmal oder schreib mir per WhatsApp.' });
  }

  const data = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot: Bots still "erfolgreich" abweisen
  if (str(data.website)) return res.status(200).json({ success: true });

  const name = str(data.name);
  const email = str(data.email);
  const telefon = str(data.telefon);
  const behandlung = str(data.behandlung);
  const nachricht = str(data.nachricht);
  const einwilligung = data.einwilligung === true;

  if (!name || !nachricht || (!email && !telefon)) {
    return res.status(400).json({ error: 'Bitte gib deinen Namen, eine Nachricht und eine E-Mail-Adresse oder Telefonnummer an.' });
  }
  if (!einwilligung) {
    return res.status(400).json({ error: 'Bitte bestätige die Datenschutzhinweise.' });
  }
  if (name.length > 100 || email.length > 254 || telefon.length > 30 || nachricht.length > 2000) {
    return res.status(400).json({ error: 'Eine Angabe ist zu lang.' });
  }
  if (email && !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Die E-Mail-Adresse sieht nicht richtig aus.' });
  }
  if (telefon && !PHONE_RE.test(telefon)) {
    return res.status(400).json({ error: 'Die Telefonnummer sieht nicht richtig aus.' });
  }
  const behandlungOk = BEHANDLUNGEN.includes(behandlung) ? behandlung : 'Nicht angegeben';

  if (!apiKey) {
    console.error(JSON.stringify({ route: '/api/kontakt', event: 'resend_not_configured', ts: new Date().toISOString() }));
    return res.status(503).json({ error: 'Das Formular ist gerade nicht verfügbar. Schreib mir bitte per WhatsApp oder E-Mail.' });
  }

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#2a211a;max-width:640px;">
      <h2 style="margin:0 0 16px 0;">Neue Anfrage über nanu-aesthetics.de</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${row('Name', esc(name), true)}
        ${row('E-Mail', email ? `<a href="mailto:${encodeURIComponent(email)}">${esc(email)}</a>` : 'Nicht angegeben', false)}
        ${row('Telefon', telefon ? `<a href="tel:${encodeURIComponent(telefon)}">${esc(telefon)}</a>` : 'Nicht angegeben', true)}
        ${row('Behandlung', esc(behandlungOk), false)}
        ${row('Nachricht', esc(nachricht), true)}
      </table>
      <p style="margin-top:20px;color:#6b5a4a;font-size:13px;">
        ${email ? 'Du kannst direkt auf diese E-Mail antworten, die Antwort geht an die Absenderin der Anfrage.' : 'Keine E-Mail-Adresse angegeben, bitte telefonisch oder per WhatsApp antworten.'}
      </p>
    </div>`;

  let resp = null;
  try {
    resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || DEFAULT_FROM,
        to: [process.env.KONTAKT_TO || DEFAULT_TO],
        ...(email ? { reply_to: email } : {}),
        // Betreff ist Klartext, kein HTML
        subject: `Neue Anfrage: ${name.replace(/\s+/g, ' ')}${behandlungOk !== 'Nicht angegeben' ? ` (${behandlungOk})` : ''}`,
        html,
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    console.error(JSON.stringify({ route: '/api/kontakt', event: 'resend_exception', message: err instanceof Error ? err.message : String(err), ts: new Date().toISOString() }));
  }

  if (!resp || !resp.ok) {
    if (resp) {
      const body = await resp.text().catch(() => '');
      console.error(JSON.stringify({ route: '/api/kontakt', event: 'resend_failed', status: resp.status, body: body.slice(0, 500), ts: new Date().toISOString() }));
    }
    return res.status(502).json({ error: 'Deine Nachricht konnte gerade nicht gesendet werden. Schreib mir bitte per WhatsApp oder E-Mail.' });
  }

  return res.status(200).json({ success: true });
};

module.exports.BEHANDLUNGEN = BEHANDLUNGEN;
