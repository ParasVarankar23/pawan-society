import {
  apiHandler,
  authenticated,
  error,
  json,
} from "@/app/api/_utils";

import {
  processOCR,
} from "@/lib/gemini/ocr";

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file || typeof file.arrayBuffer !== "function") {
        return error("An image or PDF file is required.", 400);
      }

      const image = Buffer
        .from(await file.arrayBuffer())
        .toString("base64");

      if (!processOCR) {
        throw new Error(
          "OCR service is not available"
        );
      }

      const result =
        await processOCR({
          image,
          mimeType: file.type || "application/octet-stream",
        });

      return json(result);
    })
  );
}