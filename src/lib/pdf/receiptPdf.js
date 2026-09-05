export async function generateReceiptPdfData(
  receipt
) {
  return {
    type: "RECEIPT",
    receiptNumber:
      receipt.receiptNumber,
    amount: receipt.amount,
    paymentMode:
      receipt.paymentMode,
    receiptDate:
      receipt.receiptDate,
  };
}