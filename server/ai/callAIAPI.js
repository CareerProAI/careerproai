import { callGroqAPI } from './groqProvider.js';
import { callGeminiAPI } from './geminiProvider.js';
import { computeBothRateLimited } from '../server-utils.js';

// Single call site for every AI feature in this app (resume parse, job match-batch
// scoring, job compare, application-package generation). Groq is tried first; any
// failure there (rate limit, malformed response, network error) falls back to Gemini once
// before giving up, so a single provider's outage or exhausted free-tier quota doesn't
// take the whole feature down. computeBothRateLimited lives in server-utils.js so it can
// be unit-tested without forcing two real 429 responses from live providers.
export async function callAIAPI(systemPrompt, userPrompt, options = {}) {
  try {
    return await callGroqAPI(systemPrompt, userPrompt, options);
  } catch (primaryErr) {
    console.error('Groq call failed, falling back to Gemini:', primaryErr.message);
    try {
      return await callGeminiAPI(systemPrompt, userPrompt, options);
    } catch (fallbackErr) {
      const combinedErr = new Error(`Both AI providers failed. Groq: ${primaryErr.message} | Gemini: ${fallbackErr.message}`);
      combinedErr.bothRateLimited = computeBothRateLimited(primaryErr.message, fallbackErr.message);
      throw combinedErr;
    }
  }
}
