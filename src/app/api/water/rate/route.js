import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  getCurrentCharges,
  createCharge,
  updateCharge,
} from "@/services/chargeService";

export async function GET() {
  return apiHandler(() =>
    authenticated(async () => {
      const charges =
        await getCurrentCharges();

      return json({
        ratePerUnit:
          charges?.waterRatePerUnit ?? 9,
      });
    })
  );
}

export async function PUT(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const { ratePerUnit } =
        await getJsonBody(request);

      if (
        ratePerUnit === undefined ||
        Number(ratePerUnit) < 0
      ) {
        throw new Error(
          "Valid water rate is required"
        );
      }

      const charges =
        await getCurrentCharges();

      if (!charges) {
        const created =
          await createCharge({
            waterRatePerUnit:
              Number(ratePerUnit),
            effectiveFrom: new Date(),
            status: "ACTIVE",
          });

        return json(created);
      }

      return json(
        await updateCharge(
          charges._id,
          {
            waterRatePerUnit:
              Number(ratePerUnit),
          }
        )
      );
    })
  );
}