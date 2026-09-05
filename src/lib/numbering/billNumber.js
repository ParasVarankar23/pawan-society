import Counter from "@/models/Counter";

export async function getNextBillNumber(
  financialYear
) {
  const key =
    `BILL_${financialYear}`;

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

function getFinancialYear(value = new Date()) {
  const date = typeof value === "string"
    ? new Date(`${value}-01`)
    : value;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return month >= 4
    ? `${year}-${String(year + 1).slice(-2)}`
    : `${year - 1}-${String(year).slice(-2)}`;
}

export async function generateBillNumber({ billingMonth } = {}) {
  return getNextBillNumber(getFinancialYear(billingMonth));
}