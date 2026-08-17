import { callGroqAPI } from './groqProvider.js';
import { callGeminiAPI } from './geminiProvider.js';
import { callZaiAPI } from './zaiProvider.js';
import { callDeepSeekAPI } from './deepseekProvider.js';
import { computeAllRateLimited } from '../server-utils.js';

/** Chain of Responsibility: Groq → Gemini → Z.ai → DeepSeek (skip any provider with no key). */
export function buildProviderChain() {
  return [
    { name: 'Groq', isConfigured: () => Boolean(process.env.GROQ_API_KEY), call: callGroqAPI },
    { name: 'Gemini', isConfigured: () => Boolean(process.env.GEMINI_API_KEY), call: callGeminiAPI },
    { name: 'Z.ai', isConfigured: () => Boolean(process.env.ZAI_API_KEY), call: callZaiAPI },
    { name: 'DeepSeek', isConfigured: () => Boolean(process.env.DEEPSEEK_API_KEY), call: callDeepSeekAPI },
  ];
}

export async function runProviderChain(systemPrompt, userPrompt, options = {}, providers = buildProviderChain()) {
  const ready = providers.filter((p) => p.isConfigured());
  if (ready.length === 0) {
    throw new Error('No AI provider is configured.');
  }

  const errors = [];
  for (let i = 0; i < ready.length; i += 1) {
    try {
      return await ready[i].call(systemPrompt, userPrompt, options);
    } catch (err) {
      errors.push(err);
      const next = ready[i + 1];
      if (next) {
        console.error(`${ready[i].name} call failed, falling back to ${next.name}:`, err.message);
      }
    }
  }

  const detail = errors.map((err, i) => `${ready[i].name}: ${err.message}`).join(' | ');
  const combinedErr = new Error(`All AI providers failed. ${detail}`);
  combinedErr.bothRateLimited = computeAllRateLimited(errors.map((err) => err.message));
  throw combinedErr;
}
