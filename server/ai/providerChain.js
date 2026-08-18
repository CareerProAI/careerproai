import { callGroqAPI } from './groqProvider.js';
import { callGeminiAPI } from './geminiProvider.js';
import { callZaiAPI } from './zaiProvider.js';
import { callDeepSeekAPI } from './deepseekProvider.js';
import { computeAllRateLimited } from '../server-utils.js';

export function configuredAiFlags(env = process.env) {
  return {
    groq: Boolean(env.GROQ_API_KEY),
    gemini: Boolean(env.GEMINI_API_KEY),
    zai: Boolean(env.ZAI_API_KEY),
    deepseek: Boolean(env.DEEPSEEK_API_KEY),
  };
}

export function buildConfigStatus(env = process.env) {
  const providers = configuredAiFlags(env);
  const aiConfigured = providers.groq || providers.gemini || providers.zai || providers.deepseek;
  return { aiConfigured, providers };
}

/** Chain of Responsibility: Groq → Gemini → Z.ai (skip any provider with no key). */
export function buildProviderChain() {
  return [
    { name: 'Groq', isConfigured: () => configuredAiFlags().groq, call: callGroqAPI },
    { name: 'Gemini', isConfigured: () => configuredAiFlags().gemini, call: callGeminiAPI },
    { name: 'Z.ai', isConfigured: () => configuredAiFlags().zai, call: callZaiAPI },
    { name: 'DeepSeek', isConfigured: () => configuredAiFlags().deepseek, call: callDeepSeekAPI },
  ];
}

export function logConfiguredAiChain() {
  const names = buildProviderChain().filter((p) => p.isConfigured()).map((p) => p.name);
  console.log(`AI fallback chain: ${names.join(' → ') || 'none'}`);
}

export async function runProviderChain(systemPrompt, userPrompt, options = {}, providers = buildProviderChain()) {
  const ready = providers.filter((p) => p.isConfigured());
  if (ready.length === 0) {
    throw new Error('No AI provider is configured.');
  }

  const errors = [];
  for (let i = 0; i < ready.length; i += 1) {
    try {
      const result = await ready[i].call(systemPrompt, userPrompt, options);
      if (i > 0) console.log(`AI fallback succeeded via ${ready[i].name}`);
      return result;
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
