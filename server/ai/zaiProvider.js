import { timedFetch } from './timedFetch.js';

const ZAI_BASE_URL = 'https://api.z.ai/api/paas/v4';
const ZAI_MODEL = 'glm-4.5-flash';
// 50s: when Groq and Gemini are rate-limited (429 in < 1s each) Z.ai gets the full
// budget; 1s + 1s + 50s = 52s stays within Vercel's 60s maxDuration.
// Raised from 30s because GLM-4.5-flash needs more headroom on long resume texts.
export const ZAI_TIMEOUT_MS = 50_000;

/** OpenAI-compatible fallback after Groq and Gemini (free GLM flash). */
export async function callZaiAPI(systemPrompt, userPrompt, { jsonMode = true, maxTokens, temperature = 0.2 } = {}) {
  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) {
    throw new Error('Z.ai API Key is not configured on the server.');
  }

  const body = {
    model: ZAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    thinking: { type: 'disabled' },
  };
  if (jsonMode) body.response_format = { type: 'json_object' };
  if (maxTokens) body.max_tokens = maxTokens;

  const response = await timedFetch(`${ZAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept-Language': 'en-US,en',
    },
    body: JSON.stringify(body),
  }, ZAI_TIMEOUT_MS);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Z.ai API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error(`Z.ai API returned an unexpected response shape: ${JSON.stringify(data).slice(0, 300)}`);
  }
  if (!jsonMode) return content;

  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  return JSON.parse(cleaned);
}
