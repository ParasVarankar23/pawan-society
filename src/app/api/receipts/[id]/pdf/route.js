import {
  apiHandler,
  authenticated,
} from "@/app/api/_utils";

import {
  getReceiptById,
} from "@/services/receiptService";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const receipt =
        await getReceiptById(params.id);

      if (!receipt) {
        throw new Error(
          "Receipt not found"
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message:
            "Receipt PDF generation is ready to connect",
          receipt,
        }),
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );
    })
  );
}