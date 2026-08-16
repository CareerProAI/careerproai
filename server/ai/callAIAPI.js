import { runProviderChain } from './providerChain.js';

// Single call site for every AI feature. Chain of Responsibility:
// Groq → Gemini → DeepSeek (DeepSeek is skipped until DEEPSEEK_API_KEY is set).
export async function callAIAPI(systemPrompt, userPrompt, options = {}) {
  return runProviderChain(systemPrompt, userPrompt, options);
}
