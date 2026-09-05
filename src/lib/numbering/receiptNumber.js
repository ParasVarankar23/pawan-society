import Counter from "@/models/Counter";

export async function getNextReceiptNumber(
  financialYear
) {
  const key =
    `RECEIPT_${financialYear}`;

  const counter =
    await Counter.findOneAndUpdate(
      {
        key,
        financialYear,
      },
      {
        $inc: {
          sequence: 1,
        },
        $setOnInsert: {
          key,
          financialYear,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

  return counter.sequence;
}