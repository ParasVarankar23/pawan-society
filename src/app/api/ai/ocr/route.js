import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  processOCR,
} from "@/lib/gemini/ocr";

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const data =
        await getJsonBody(request);

      if (!processOCR) {
        throw new Error(
          "OCR service is not available"
        );
      }

      const result =
        await processOCR(data);

      return json(result);
    })
  );
}