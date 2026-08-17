import { runProviderChain } from './providerChain.js';

// Single call site for every AI feature. Chain of Responsibility:
// Groq → Gemini → Z.ai → DeepSeek (Z.ai/DeepSeek skipped until their keys are set).
export async function callAIAPI(systemPrompt, userPrompt, options = {}) {
  return runProviderChain(systemPrompt, userPrompt, options);
}
