import { GoogleGenerativeAI } from '@google/generative-ai';

function requireApiKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    const err = new Error(
      'Gemini API key missing. Create a `.env` file with VITE_GEMINI_API_KEY=YOUR_KEY and restart the dev server.',
    );
    err.code = 'GEMINI_API_KEY_MISSING';
    throw err;
  }
  return key;
}

function normalizeGeminiError(e) {
  const message = e instanceof Error ? e.message : String(e);
  const lower = message.toLowerCase();

  if (lower.includes('401') || lower.includes('unauthorized')) {
    return 'Unauthorized (401). Your Gemini API key is invalid or has no access. Check your key in `.env` and restart the server.';
  }

  if (lower.includes('429') || lower.includes('rate limit')) {
    return 'Rate limit hit (429). Please wait a moment and try again.';
  }

  if (lower.includes('network') || lower.includes('fetch') || lower.includes('enotfound')) {
    return 'Network error while calling Gemini. Check your internet connection and try again.';
  }

  return message || 'AI request failed. Please try again.';
}

/**
 * @param {string} question
 * @param {object} summary
 * @returns {Promise<string>}
 */
export async function askGemini(question, summary) {
  const apiKey = requireApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);
  // Flash is the recommended free-tier model.
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = [
    'You are an analytics assistant for an Indian municipal property tax dashboard (UPYOG multi-tenant).',
    'Answer using ONLY the provided summary data. Be concise and compute exact values from the summary.',
    'If the question asks for a percentage, show it to 1 decimal place.',
    'If the question is ambiguous, ask one short clarification question.',
    '',
    'DATA SUMMARY (JSON):',
    JSON.stringify(summary),
    '',
    'USER QUESTION:',
    question,
  ].join('\n');

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (e) {
    throw new Error(normalizeGeminiError(e), { cause: e });
  }
}

