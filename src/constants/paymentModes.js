export const PAYMENT_MODES = Object.freeze([
  "CASH",
  "CHEQUE",
  "BANK_TRANSFER",
  "UPI",
  "NEFT",
  "RTGS",
  "IMPS",
  "OTHER",
]);

export const PAYMENT_MODE_LABELS = Object.freeze({
  CASH: "Cash",
  CHEQUE: "Cheque",
  BANK_TRANSFER: "Bank Transfer",
  UPI: "UPI",
  NEFT: "NEFT",
  RTGS: "RTGS",
  IMPS: "IMPS",
  OTHER: "Other",
});

export function isValidPaymentMode(mode) {
  return PAYMENT_MODES.includes(mode);
}