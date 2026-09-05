export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email || "").trim()
  );
}

export function isValidMobile(mobile) {
  return /^[6-9]\d{9}$/.test(
    String(mobile || "").trim()
  );
}

export function isValidPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8
  );
}

export function isValidOTP(otp) {
  return /^\d{6}$/.test(
    String(otp || "").trim()
  );
}

export function isValidAmount(amount) {
  const value = Number(amount);

  return (
    Number.isFinite(value) &&
    value >= 0
  );
}

export function isValidMonth(month) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(
    String(month || "")
  );
}

export function cleanString(value) {
  return String(value || "").trim();
}

export function roundMoney(value) {
  return Math.round(
    (Number(value) + Number.EPSILON) * 100
  ) / 100;
}