/**
 * Cloudflare Pages Function — POST /api/ai-chat
 * Grounded AI Barista concierge for An Roastery (hoang-coffeeshop.pages.dev).
 * Uses Gemini API when GEMINI_API_KEY is configured; otherwise returns 503 with
 * { fallback: true } so the frontend switches seamlessly to its local engine.
 */

const ALLOWED_EXACT_ORIGINS = new Set([
  'https://hoang-coffeeshop.pages.dev',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173'
]);

const MAX_BODY_BYTES = 8192; // 8 KB
const MAX_MESSAGE_CHARS = 800;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const GEMINI_TIMEOUT_MS = 7000;
const MODEL_CHAIN = [
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite'
];

// Per-isolate sliding-window rate limiter
const rateBucket = new Map();

function isAllowedOrigin(origin) {
  if (!origin) return true; // Same-origin non-CORS or server health checks
  if (ALLOWED_EXACT_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    if (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
    ) {
      return true;
    }
    if (
      url.protocol === 'https:' &&
      url.hostname.endsWith('.hoang-coffeeshop.pages.dev')
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function corsHeaders(origin) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    Vary: 'Origin'
  };
  if (origin && isAllowedOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '600';
  }
  return headers;
}

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip || 'unknown';
  const entry = rateBucket.get(key);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateBucket.set(key, { windowStart: now, count: 1 });
    // Prune stale entries occasionally
    if (rateBucket.size > 500) {
      for (const [k, v] of rateBucket.entries()) {
        if (now - v.windowStart > RATE_LIMIT_WINDOW_MS) rateBucket.delete(k);
      }
    }
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.max(
      1,
      Math.ceil((RATE_LIMIT_WINDOW_MS - (now - entry.windowStart)) / 1000)
    );
    return { allowed: false, retryAfter };
  }
  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function buildSystemPrompt(lang) {
  const isEn = lang === 'en';
  return [
    'You are the Head Barista & Roastery Concierge at An Roastery — a Vietnamese specialty clean-roast coffee house and micro-batch roastery.',
    isEn
      ? 'Respond in warm, concise, editorial English (2 to 4 sentences). Never use emojis or heavy markdown formatting.'
      : 'Trả lời bằng tiếng Việt ấm áp, súc tích, tinh tế theo phong cách xưởng rang thủ công (2 đến 4 câu). Không dùng emoji hay ký tự markdown rườm rà.',
    'Grounded facts about An Roastery (never invent prices, origins, or policies outside this list):',
    '- Whole beans: Arabica Cầu Đất Honey (195,000 VND / 250g, light-medium roast, wild honey & sweet orange, V60/Kalita); Arabica Sơn La Chiềng Ban Washed (210,000 VND / 250g, light-medium, white blossom & green apple, crisp acidity); Fine Robusta Bảo Lộc Natural (155,000 VND / 250g, dark-medium, dark cacao & molasses, low acidity, ideal for Phin & bold espresso); Lot 01 An House Blend (275,000 VND / 500g, 60% Cầu Đất / 40% Bảo Lộc, hazelnut & caramel, daily bar espresso).',
    '- Ground & Drip: Rang Xay Phin Mộc Cổ Điển (125,000 VND / 250g, 100% clean-roast, low acid); Hộp Thiếc Espresso & Moka Pot (175,000 VND / 250g); Cầu Đất Xay Sẵn Giấy Lọc (185,000 VND / 250g); Phin Giấy Cầu Đất Sương Sớm (160,000 VND / 10x12g); Phin Giấy Phối Trộn Đậm Mộc (145,000 VND / 10x14g).',
    '- Cold Bottled RTD: Cold Brew Cam Vàng Ủ 24 Giờ (55,000 VND / 330ml); Cà Phê Muối Biển Đóng Chai (48,000 VND / 250ml); Bạc Xỉu Sữa Đà Lạt Đóng Chai (45,000 VND / 250ml, gentle caffeine).',
    '- Gear: Phin Inox 304 (115,000 VND); Bộ Phễu Sứ V60 + Bình + Ấm Cổ Ngỗng (890,000 VND); Cặp Tách Sứ Men Tro Lái Thiêu (340,000 VND).',
    '- Brew ratios: Phin 25g:95ml @ 95-96°C (5-6 min); V60 Pour Over 15g:240ml (1:16) @ 91-93°C (2m45s); Espresso 18g in -> 36g out @ 93°C (28s); Cold Brew 50g:500ml (1:10) @ 4°C (20-24h).',
    '- B2B Wholesale: From 10 kg/month, roasted weekly in zero-waste 5 kg returnable stainless tubs, commercial machine setup, barista training, 4-hour technical response in HCMC & Hanoi. Free 4-lot sample box. Contact: 1900 6886 or b2b@anroastery.vn.',
    '- Cafés: 12 Hoàng Hoa Thám (Tân Bình, HCMC), 06 Trần Cao Vân (Q.3, HCMC), 48 Trần Thái Tông (Cầu Giấy, Hanoi). Hours: Mon-Fri 06:30-22:30, Sat-Sun 07:00-23:00. Public cupping every Saturday 09:30.',
    'If the user asks something unrelated to coffee, brewing, or An Roastery, politely steer the conversation back to coffee and An Roastery.'
  ].join('\n');
}

async function callGemini(apiKey, model, systemPrompt, contents) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.55,
          maxOutputTokens: 320
        }
      }),
      signal: controller.signal
    });

    if (!res.ok) {
      return { ok: false, status: res.status };
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p) => p?.text || '')
      .join('')
      .trim();

    if (!text) return { ok: false, status: 502 };
    return { ok: true, text };
  } catch {
    return { ok: false, status: 504 };
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  if (origin && !isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '';
  const headers = corsHeaders(origin);

  if (origin && !isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
      status: 403,
      headers
    });
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers
    });
  }

  const clientIp =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown';
  const rate = checkRateLimit(clientIp);
  if (!rate.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests', fallback: true }),
      {
        status: 429,
        headers: { ...headers, 'Retry-After': String(rate.retryAfter) }
      }
    );
  }

  let rawBody = '';
  try {
    rawBody = await request.text();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers
    });
  }

  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers
    });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'Malformed JSON' }), {
      status: 400,
      headers
    });
  }

  const message =
    typeof payload?.message === 'string' ? payload.message.trim() : '';
  const lang = payload?.lang === 'en' ? 'en' : 'vi';
  if (!message || message.length > MAX_MESSAGE_CHARS) {
    return new Response(
      JSON.stringify({ error: 'Message must be 1 to 800 characters' }),
      { status: 400, headers }
    );
  }

  const apiKey = env?.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ fallback: true, error: 'AI service unconfigured' }),
      { status: 503, headers }
    );
  }

  const history = Array.isArray(payload?.history)
    ? payload.history
        .slice(-6)
        .filter(
          (item) =>
            item &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.text === 'string' &&
            item.text.trim().length > 0
        )
        .map((item) => ({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.text.trim().slice(0, 400) }]
        }))
    : [];

  const contents = [...history, { role: 'user', parts: [{ text: message }] }];
  const systemPrompt = buildSystemPrompt(lang);

  for (const model of MODEL_CHAIN) {
    const result = await callGemini(apiKey, model, systemPrompt, contents);
    if (result.ok) {
      return new Response(
        JSON.stringify({
          reply: result.text,
          model,
          source: 'gemini'
        }),
        { status: 200, headers }
      );
    }
  }

  return new Response(
    JSON.stringify({ fallback: true, error: 'Upstream AI unavailable' }),
    { status: 502, headers }
  );
}
