import {
  apiHandler,
  authenticated,
  json,
} from "@/app/api/_utils";

import { getReceiptById } from "@/services/receiptService";

export async function GET(request, { params }) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;
      const receipt = await getReceiptById(id);

      if (!receipt) {
        throw new Error("Receipt not found");
      }

      return json(receipt);
    })
  );
}
