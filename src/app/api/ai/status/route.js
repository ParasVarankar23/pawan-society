import {
  apiHandler,
  authenticated,
  json,
} from "@/app/api/_utils";

import {
  isGeminiAvailable,
} from "@/lib/gemini/client";

export async function GET() {
  return apiHandler(() =>
    authenticated(async () => {
      return json({
        enabled:
          isGeminiAvailable(),
        provider: "GEMINI",
        optional: true,
      });
    })
  );
}