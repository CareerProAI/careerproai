import { timedFetch, GEMINI_TIMEOUT_MS } from './timedFetch.js';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = 'gemini-3.6-flash';

// Fallback provider — same contract as callGroqAPI (same params, same return shape) so
// callAIAPI can swap between them transparently. Gemini's REST shape differs from the
// OpenAI-compatible one: system prompt is a separate `system_instruction` field, auth is
// an `x-goog-api-key` header rather than a Bearer token, and JSON mode is requested via
// `generationConfig.responseMimeType` rather than `response_format`.
export async function callGeminiAPI(systemPrompt, userPrompt, { jsonMode = true, maxTokens, temperature = 0.2 } = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API Key is not configured on the server.');
  }

  const generationConfig = { temperature };
  if (jsonMode) generationConfig.responseMimeType = 'application/json';
  if (maxTokens) generationConfig.maxOutputTokens = maxTokens;

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ parts: [{ text: userPrompt }] }],
    generationConfig,
  };

  const response = await timedFetch(`${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent`, {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }, GEMINI_TIMEOUT_MS);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error(`Gemini API returned an unexpected response shape: ${JSON.stringify(data).slice(0, 300)}`);
  }
  const content = text.trim();
  if (!jsonMode) return content;

  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  return JSON.parse(cleaned);
}
