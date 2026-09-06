import {
  apiHandler,
  authenticated,
} from "@/app/api/_utils";

import {
  getBillById,
} from "@/services/billingService";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;
      const bill =
        await getBillById(id);

      if (!bill) {
        throw new Error("Bill not found");
      }

      /*
       * Replace this with the final PDF generator
       * from src/lib/pdf/billPdf.js
       */

      return new Response(
        JSON.stringify({
          success: true,
          message:
            "Bill PDF generation is ready to connect",
          bill,
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