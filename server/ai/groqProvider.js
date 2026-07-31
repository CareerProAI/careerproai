const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Primary provider. jsonMode (default true) requests structured JSON output and parses
// the result; pass jsonMode: false for a plain-text completion (see the /api/jobs/compare
// fallback below). Groq's API is OpenAI-compatible; some models still wrap JSON output in
// a markdown code fence despite response_format: json_object — stripped defensively before
// parsing. Uses max_completion_tokens, not the deprecated max_tokens.
export async function callGroqAPI(systemPrompt, userPrompt, { jsonMode = true, maxTokens, temperature = 0.2 } = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API Key is not configured on the server.');
  }

  const body = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature,
  };
  if (jsonMode) body.response_format = { type: 'json_object' };
  if (maxTokens) body.max_completion_tokens = maxTokens;

  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  // A 200 response doesn't guarantee a well-formed choices array — seen in practice with
  // free-tier models under load (e.g. a truncated/keep-alive-only body).
  const choice = data?.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error(`Groq API returned an unexpected response shape: ${JSON.stringify(data).slice(0, 300)}`);
  }
  const content = choice.message.content.trim();
  if (!jsonMode) return content;

  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  return JSON.parse(cleaned);
}
