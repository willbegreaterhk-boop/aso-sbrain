const DEFAULT_ALLOWED_ORIGINS = ["https://k1mzee.icu", "http://k1mzee.icu"];
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, {status: 204, headers: cors});
    }
    if (!cors["Access-Control-Allow-Origin"]) {
      return jsonResponse({error: "origin_not_allowed"}, 403, cors);
    }
    if (request.method !== "POST") {
      return jsonResponse({error: "method_not_allowed"}, 405, cors);
    }

    try {
      if (url.pathname === "/review") return await handleReview(request, env, cors);
      if (url.pathname === "/decide") return await handleDecide(request, env, cors);
      return jsonResponse({error: "not_found"}, 404, cors);
    } catch (err) {
      return jsonResponse({error: "worker_error", message: safeMessage(err)}, 500, cors);
    }
  }
};

async function handleReview(request, env, cors) {
  const payload = await readJson(request);
  const day = payload.day && typeof payload.day === "object" ? payload.day : {};
  const date = text(payload.date || day.date || "");
  const messages = [
    {
      role: "system",
      content: [
        "你是 brain two 的每日复盘助手。只返回严格 JSON，不要 Markdown，不要 JSON 外文字。",
        "打分建设性：看趋势和用户自己的基线，不审判、不羞辱、不吹捧。",
        "忠于当天 entries 和 fitness，不要编造事实。信息不足就明确说不足。",
        "输出结构：{\"summary\":\"...\",\"score\":{\"overall\":1-10,\"dims\":{\"专注\":1-10,\"执行\":1-10,\"健身\":1-10,\"饮食\":1-10}},\"advice\":[\"...\"],\"promotedCardIds\":[\"...\"],\"promotedCards\":[{\"lib\":\"business|personal\",\"domain\":\"电商|半导体|二手车|媒体|原生家庭|球鞋\",\"type\":\"框架|决策|事实|操作|开放问题|偏好|反思·洞察\",\"title\":\"...\",\"body\":\"...\",\"context\":\"...\",\"conf\":\"high|medium|low\",\"source\":\"YYYY-MM-DD\"}]}"
      ].join("\n")
    },
    {
      role: "user",
      content: JSON.stringify({
        date,
        instruction: "复盘当天，给 1-3 条建议，并把最多 2 条耐用洞察放入 promotedCards。source 必须等于 date。",
        day: compactDay(day)
      })
    }
  ];
  const raw = await callDeepSeek(env, messages, 1000);
  return jsonResponse(normalizeReview(raw, date), 200, cors);
}

async function handleDecide(request, env, cors) {
  const payload = await readJson(request);
  const question = text(payload.question).slice(0, 900);
  const cards = Array.isArray(payload.cards) ? payload.cards.map(compactCard).filter(Boolean).slice(0, 10) : [];
  const messages = [
    {
      role: "system",
      content: [
        "你是 brain two 的决策助手。只返回严格 JSON，不要 Markdown，不要 JSON 外文字。",
        "你只能基于用户问题和给你的 cards 推理。不得使用外部知识补完，不得编造卡片没有的信息。",
        "必须引用使用到的卡 id。若 cards 不足以判断，answer 直接说明不够，basedOnCardIds 可为空。",
        "输出结构：{\"answer\":\"...\",\"basedOnCardIds\":[\"card-...\"],\"caveats\":[\"...\"]}"
      ].join("\n")
    },
    {
      role: "user",
      content: JSON.stringify({question, cards})
    }
  ];
  const raw = await callDeepSeek(env, messages, 900);
  return jsonResponse(normalizeDecision(raw, cards), 200, cors);
}

async function callDeepSeek(env, messages, maxTokens) {
  if (!env.DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY is not configured");
  const response = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + env.DEEPSEEK_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL || "deepseek-chat",
      temperature: 0.2,
      max_tokens: maxTokens,
      response_format: {type: "json_object"},
      messages
    })
  });
  if (!response.ok) throw new Error("deepseek_http_" + response.status);
  const data = await response.json();
  const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error("deepseek_empty");
  return parseStrictJson(content);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(","))
    .split(",").map(s => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin);
  return {
    ...(ok ? {"Access-Control-Allow-Origin": origin} : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {...headers, "Content-Type": "application/json; charset=utf-8"}
  });
}

async function readJson(request) {
  try {
    const data = await request.json();
    return data && typeof data === "object" ? data : {};
  } catch (_) {
    throw new Error("invalid_json");
  }
}

function parseStrictJson(content) {
  try {
    return JSON.parse(content);
  } catch (_) {
    const match = String(content).match(/\{[\s\S]*\}/);
    if (!match) throw new Error("invalid_model_json");
    return JSON.parse(match[0]);
  }
}

function normalizeReview(raw, date) {
  const score = raw && raw.score && typeof raw.score === "object" ? raw.score : {};
  const dims = score.dims && typeof score.dims === "object" ? score.dims : {};
  const advice = Array.isArray(raw.advice) ? raw.advice.map(text).filter(Boolean).slice(0, 3) : [];
  const promotedCards = Array.isArray(raw.promotedCards) ? raw.promotedCards.map(card => ({
    lib: card.lib === "personal" ? "personal" : "business",
    domain: text(card.domain),
    type: text(card.type) || "反思·洞察",
    title: text(card.title),
    body: text(card.body),
    context: text(card.context),
    conf: ["high", "medium", "low"].includes(card.conf) ? card.conf : "medium",
    source: date || text(card.source)
  })).filter(card => card.body).slice(0, 2) : [];
  const promotedCardIds = Array.isArray(raw.promotedCardIds) ? raw.promotedCardIds.map(text).filter(Boolean).slice(0, 5) : [];
  return {
    summary: text(raw.summary) || "今天的数据还不够完整，先补足关键记录再复盘。",
    score: {
      overall: clampScore(score.overall),
      dims: {
        "专注": clampScore(dims["专注"]),
        "执行": clampScore(dims["执行"]),
        "健身": clampScore(dims["健身"]),
        "饮食": clampScore(dims["饮食"])
      }
    },
    advice,
    promotedCardIds,
    promotedCards,
    generatedAt: new Date().toISOString()
  };
}

function normalizeDecision(raw, cards) {
  const known = new Set(cards.map(card => card.id));
  const ids = Array.isArray(raw.basedOnCardIds)
    ? raw.basedOnCardIds.map(text).filter(id => known.has(id)).slice(0, 8)
    : [];
  return {
    answer: text(raw.answer) || "现有卡片不足以支撑判断。",
    basedOnCardIds: ids,
    caveats: Array.isArray(raw.caveats) ? raw.caveats.map(text).filter(Boolean).slice(0, 5) : []
  };
}

function compactDay(day) {
  return {
    entries: Array.isArray(day.entries) ? day.entries.slice(0, 30).map(entry => ({
      time: text(entry.time),
      tag: text(entry.tag),
      domain: text(entry.domain),
      text: text(entry.text).slice(0, 800)
    })) : [],
    fitness: day.fitness || {}
  };
}

function compactCard(card) {
  if (!card || typeof card !== "object") return null;
  return {
    id: text(card.id),
    domain: text(card.domain),
    type: text(card.type),
    title: text(card.title).slice(0, 120),
    body: text(card.body).slice(0, 900),
    context: text(card.context).slice(0, 260),
    conf: text(card.conf),
    source: text(card.source)
  };
}

function text(value) {
  return value == null ? "" : String(value).trim();
}

function clampScore(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 5;
  return Math.max(1, Math.min(10, Math.round(n)));
}

function safeMessage(err) {
  const msg = err && err.message ? String(err.message) : "unknown";
  return msg.replace(/[A-Za-z0-9_-]{24,}/g, "[redacted]");
}
