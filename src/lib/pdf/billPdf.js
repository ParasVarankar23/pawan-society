export async function generateBillPdfData(
  bill
) {
  return {
    type: "BILL",
    billNumber: bill.billNumber,
    billingMonth: bill.billingMonth,
    roomId: bill.roomId,
    memberId: bill.memberId,
    totalOutstanding:
      bill.totalOutstanding,
    balanceAmount:
      bill.balanceAmount,
  };
}