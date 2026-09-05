import {
  requireGemini,
} from "./client";

export async function extractOCRData({
  image,
  mimeType,
}) {
  const apiKey = requireGemini();

  /*
   * Gemini OCR implementation will be added here.
   *
   * This module is intentionally isolated so that
   * the rest of the Pawan Society system does not
   * depend on Gemini.
   */

  return {
    success: false,
    provider: "GEMINI",
    message:
      "Gemini OCR implementation pending.",
    apiKeyConfigured: Boolean(apiKey),
    mimeType,
    imageProvided: Boolean(image),
  };
}