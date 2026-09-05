export function isGeminiConfigured() {
  return Boolean(
    process.env.GEMINI_API_KEY
  );
}

export function requireGemini() {
  if (!isGeminiConfigured()) {
    throw new Error(
      "Gemini API is not configured"
    );
  }

  return process.env.GEMINI_API_KEY;
}

export const isGeminiAvailable = isGeminiConfigured;