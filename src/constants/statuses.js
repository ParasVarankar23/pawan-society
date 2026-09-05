export const COMMON_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
});

export const ADMIN_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
});

export const MEMBER_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
});

export const ROOM_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
});

export const BILL_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  GENERATED: "GENERATED",
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED",
});

export const PAYMENT_STATUS = Object.freeze({
  SUCCESS: "SUCCESS",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
});

export const RECEIPT_EMAIL_STATUS = Object.freeze({
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED",
  NOT_SENT: "NOT_SENT",
});

export const TRANSACTION_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
});

export const EMAIL_STATUS = Object.freeze({
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED",
});

export const OTP_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  VERIFIED: "VERIFIED",
  USED: "USED",
  EXPIRED: "EXPIRED",
  BLOCKED: "BLOCKED",
});

export const SESSION_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  REVOKED: "REVOKED",
  EXPIRED: "EXPIRED",
});

export const AI_DOCUMENT_STATUS = Object.freeze({
  PENDING: "PENDING",
  PROCESSED: "PROCESSED",
  FAILED: "FAILED",
  VERIFIED: "VERIFIED",
});

export const ELECTRICITY_STATUS = Object.freeze({
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
});

export const WORK_STATUS = Object.freeze({
  PLANNED: "PLANNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
});

export const WORK_PAYMENT_STATUS = Object.freeze({
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
});