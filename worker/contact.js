// Cloudflare Worker — contact form handler with MailChannels
// Deploy at: https://dash.cloudflare.com → Workers & Pages → Create Worker

// ── CONFIG — change these ──────────────────────────────────────────────────
const TO_EMAIL = 'you@gmail.com';           // where you receive messages
const FROM_EMAIL = 'noreply@yourdomain.com';  // must match your domain (or workers.dev)
const FROM_NAME = 'Financial Advisory Site';
// ──────────────────────────────────────────────────────────────────────────

// IMPORTANT: Update this to your GitHub Pages URL or Cloudflare Pages URL
// to allow cross-origin requests from your frontend.
const ALLOWED_ORIGINS = [
  'https://yourusername.github.io',   // GitHub Pages
  'https://yoursite.pages.dev',       // Cloudflare Pages
  'https://yourdomain.com',           // Custom domain
  'http://localhost:3000',            // Local dev
  'http://127.0.0.1:5500',           // VS Code Live Server
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, origin);
    }

    if (request.method !== 'POST') {
      return corsResponse('Method not allowed', 405, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse('Invalid JSON body', 400, origin);
    }

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return corsResponse('Missing required fields', 400, origin);
    }

    // Send via MailChannels (free, no API key needed from Cloudflare Workers)
    const mailRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: TO_EMAIL }],
        }],
        from: {
          email: FROM_EMAIL,
          name: FROM_NAME,
        },
        subject: `New message from ${name}`,
        content: [{
          type: 'text/plain',
          value: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }],
        reply_to: { email: email, name: name },
      }),
    });

    if (!mailRes.ok) {
      const err = await mailRes.text();
      console.error('MailChannels error:', err);
      return corsResponse('Email send failed', 500, origin);
    }

    return corsResponse({ ok: true, message: 'Email sent!' }, 200, origin);
  }
};

// Helper: wrap response with CORS headers
function corsResponse(body, status, origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  const headers = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  const responseBody = body === null
    ? null
    : typeof body === 'string'
      ? JSON.stringify({ error: body })
      : JSON.stringify(body);

  return new Response(responseBody, { status, headers });
}
