"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

/* =========================================================
   ICONS
========================================================= */

function PaymentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />
      <path d="M8 2v4M16 2v4M3 9h18" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M10.3 4.3 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7 3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function money(value) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;
}

function today() {
  return new Date()
    .toISOString()
    .split("T")[0];
}

/* =========================================================
   SECTION
========================================================= */

function FormSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {description}
          </p>
        </div>

      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>

    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AddPaymentPage() {
  const router = useRouter();

  const [rooms, setRooms] =
    useState([]);

  const [bills, setBills] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      roomId: "",
      memberId: "",
      billId: "",
      amount: "",
      paymentDate: today(),
      paymentMode: "CASH",
      referenceNumber: "",
      chequeNumber: "",
      bankName: "",
      remarks: "",
    });

  /* =======================================================
     LOAD ROOMS
  ======================================================= */

  useEffect(() => {
    async function loadRooms() {
      try {
        const result =
          await api.get(
            "/rooms?status=ACTIVE"
          );

        const list =
          Array.isArray(result.data)
            ? result.data
            : result.data?.rooms || [];

        setRooms(list);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load rooms."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRooms();
  }, []);

  /* =======================================================
     LOAD BILLS WHEN ROOM CHANGES
  ======================================================= */

  useEffect(() => {
    async function loadBills() {
      if (!form.roomId) {
        setBills([]);
        return;
      }

      try {
        const result =
          await api.get(
            `/billing/outstanding?roomId=${form.roomId}`
          );

        const list =
          Array.isArray(result.data)
            ? result.data
            : result.data?.bills || [];

        setBills(list);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load outstanding bills."
        );
      }
    }

    loadBills();
  }, [form.roomId]);

  /* =======================================================
     SELECTED ROOM
  ======================================================= */

  const selectedRoom = useMemo(() => {
    return rooms.find(
      (room) =>
        room._id === form.roomId
    );
  }, [rooms, form.roomId]);

  /* =======================================================
     SELECTED BILL
  ======================================================= */

  const selectedBill = useMemo(() => {
    return bills.find(
      (bill) =>
        bill._id === form.billId
    );
  }, [bills, form.billId]);

  /* =======================================================
     MEMBER
  ======================================================= */

  const member =
    selectedBill?.memberId ||
    selectedRoom?.memberId ||
    selectedRoom?.member;

  /* =======================================================
     OUTSTANDING
  ======================================================= */

  const billOutstanding = Number(
    selectedBill?.balanceAmount ??
      selectedBill?.totalOutstanding ??
      0
  );

  const enteredAmount =
    Number(form.amount || 0);

  const remainingBalance = Math.max(
    billOutstanding - enteredAmount,
    0
  );

  /* =======================================================
     FIELD
  ======================================================= */

  function updateField(
    field,
    value
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (field === "roomId") {
      setForm((previous) => ({
        ...previous,
        roomId: value,
        billId: "",
        memberId: "",
        amount: "",
      }));
    }

    if (field === "billId") {
      const bill = bills.find(
        (item) =>
          item._id === value
      );

      setForm((previous) => ({
        ...previous,
        billId: value,
        memberId:
          bill?.memberId?._id ||
          bill?.memberId ||
          previous.memberId,
        amount:
          bill?.balanceAmount !==
            undefined
            ? String(
                bill.balanceAmount
              )
            : "",
      }));
    }
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function submit(event) {
    event.preventDefault();

    setError("");

    if (!form.roomId) {
      setError(
        "Please select a room."
      );
      return;
    }

    if (!form.amount) {
      setError(
        "Please enter payment amount."
      );
      return;
    }

    if (Number(form.amount) <= 0) {
      setError(
        "Payment amount must be greater than zero."
      );
      return;
    }

    if (
      selectedBill &&
      Number(form.amount) >
        billOutstanding
    ) {
      setError(
        "Payment amount cannot be greater than the selected bill balance."
      );
      return;
    }

    setSaving(true);

    try {
      await api.post(
        "/payments",
        {
          roomId: form.roomId,
          memberId:
            form.memberId ||
            member?._id ||
            undefined,
          billId:
            form.billId || undefined,
          amount:
            Number(form.amount),
          paymentDate:
            form.paymentDate,
          paymentMode:
            form.paymentMode,
          referenceNumber:
            form.referenceNumber.trim(),
          chequeNumber:
            form.chequeNumber.trim(),
          bankName:
            form.bankName.trim(),
          remarks:
            form.remarks.trim(),
        }
      );

      router.push("/payments");
    } catch (err) {
      setError(
        err.message ||
          "Unable to record payment."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>

      <Toast
        message={error}
        onClose={() => setError("")}
      />

      <div className="mx-auto max-w-5xl space-y-6">

        {/* HEADER */}

        <div>
          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-950"
          >
            <ArrowLeftIcon />
            Back to Payments
          </button>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Finance
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Record Payment
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Record a member payment and automatically
            update the bill, receipt, ledger and cash
            book.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-5"
        >

          {/* ROOM */}

          <FormSection
            icon={<HomeIcon />}
            title="Member & Room"
            description="Select the society room and bill against which the payment is being received."
          >

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="label">
                  Room *
                </label>

                <div className="relative">

                  <select
                    className="input appearance-none pr-10"
                    value={form.roomId}
                    onChange={(event) =>
                      updateField(
                        "roomId",
                        event.target.value
                      )
                    }
                    disabled={loading}
                    required
                  >

                    <option value="">
                      {loading
                        ? "Loading rooms..."
                        : "Select Room"}
                    </option>

                    {rooms.map(
                      (room) => (
                        <option
                          key={
                            room._id
                          }
                          value={
                            room._id
                          }
                        >
                          Room{" "}
                          {
                            room.roomNumber
                          }
                          {room.wing
                            ? ` · Wing ${room.wing}`
                            : ""}
                        </option>
                      )
                    )}

                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDownIcon />
                  </div>

                </div>
              </div>

              <div>
                <label className="label">
                  Bill
                </label>

                <div className="relative">

                  <select
                    className="input appearance-none pr-10"
                    value={form.billId}
                    onChange={(event) =>
                      updateField(
                        "billId",
                        event.target.value
                      )
                    }
                    disabled={
                      !form.roomId
                    }
                  >

                    <option value="">
                      {form.roomId
                        ? bills.length
                          ? "Select Bill"
                          : "No outstanding bills"
                        : "Select room first"}
                    </option>

                    {bills.map(
                      (bill) => (
                        <option
                          key={
                            bill._id
                          }
                          value={
                            bill._id
                          }
                        >
                          Bill #
                          {
                            bill.billNumber
                          }
                          {" · "}
                          Balance{" "}
                          {money(
                            bill.balanceAmount ??
                              bill.totalOutstanding
                          )}
                        </option>
                      )
                    )}

                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDownIcon />
                  </div>

                </div>
              </div>

            </div>

            {/* SELECTED MEMBER */}

            {member && (
              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                    <UserIcon />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {member.name ||
                        "Member"}
                    </p>

                    <p className="text-xs text-slate-500">
                      Room{" "}
                      {
                        selectedRoom
                          ?.roomNumber
                      }
                    </p>
                  </div>

                </div>
              </div>
            )}

          </FormSection>

          {/* PAYMENT */}

          <FormSection
            icon={<PaymentIcon />}
            title="Payment Details"
            description="Enter the amount received and select the payment method."
          >

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="label">
                  Payment Amount *
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="input pl-8 text-lg font-semibold"
                    value={form.amount}
                    onChange={(event) =>
                      updateField(
                        "amount",
                        event.target.value
                      )
                    }
                    placeholder="0.00"
                    required
                  />

                </div>

                {selectedBill && (
                  <p className="mt-2 text-xs text-slate-500">
                    Outstanding:
                    <span className="ml-1 font-bold text-red-600">
                      {money(
                        billOutstanding
                      )}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="label">
                  Payment Date *
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <CalendarIcon />
                  </div>

                  <input
                    type="date"
                    className="input pl-10"
                    value={
                      form.paymentDate
                    }
                    onChange={(event) =>
                      updateField(
                        "paymentDate",
                        event.target.value
                      )
                    }
                    required
                  />

                </div>
              </div>

              <div>
                <label className="label">
                  Payment Mode *
                </label>

                <div className="relative">

                  <select
                    className="input appearance-none pr-10"
                    value={
                      form.paymentMode
                    }
                    onChange={(event) =>
                      updateField(
                        "paymentMode",
                        event.target.value
                      )
                    }
                  >

                    <option value="CASH">
                      Cash
                    </option>

                    <option value="UPI">
                      UPI
                    </option>

                    <option value="BANK_TRANSFER">
                      Bank Transfer
                    </option>

                    <option value="CHEQUE">
                      Cheque
                    </option>

                    <option value="NEFT">
                      NEFT
                    </option>

                    <option value="RTGS">
                      RTGS
                    </option>

                    <option value="IMPS">
                      IMPS
                    </option>

                    <option value="OTHER">
                      Other
                    </option>

                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDownIcon />
                  </div>

                </div>
              </div>

              <div>
                <label className="label">
                  Reference Number
                </label>

                <input
                  className="input"
                  value={
                    form.referenceNumber
                  }
                  onChange={(event) =>
                    updateField(
                      "referenceNumber",
                      event.target.value
                    )
                  }
                  placeholder="UPI / bank reference"
                />
              </div>

            </div>

            {/* CHEQUE */}

            {form.paymentMode ===
              "CHEQUE" && (
              <div className="mt-5 grid gap-5 md:grid-cols-2">

                <div>
                  <label className="label">
                    Cheque Number
                  </label>

                  <input
                    className="input"
                    value={
                      form.chequeNumber
                    }
                    onChange={(event) =>
                      updateField(
                        "chequeNumber",
                        event.target.value
                      )
                    }
                    placeholder="Cheque number"
                  />
                </div>

                <div>
                  <label className="label">
                    Bank Name
                  </label>

                  <input
                    className="input"
                    value={
                      form.bankName
                    }
                    onChange={(event) =>
                      updateField(
                        "bankName",
                        event.target.value
                      )
                    }
                    placeholder="Bank name"
                  />
                </div>

              </div>
            )}

          </FormSection>

          {/* PAYMENT PREVIEW */}

          {form.amount && (
            <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm sm:p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Payment Summary
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">

                <div>
                  <p className="text-xs text-slate-400">
                    Bill Outstanding
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {money(
                      billOutstanding
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Payment
                  </p>

                  <p className="mt-1 text-lg font-bold text-emerald-400">
                    {money(
                      enteredAmount
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Remaining Balance
                  </p>

                  <p className="mt-1 text-lg font-bold text-red-300">
                    {money(
                      remainingBalance
                    )}
                  </p>
                </div>

              </div>
            </section>
          )}

          {/* REMARKS */}

          <FormSection
            icon={<PaymentIcon />}
            title="Remarks"
            description="Add an optional note for the payment record."
          >

            <textarea
              className="input min-h-[110px] resize-y py-3"
              value={form.remarks}
              onChange={(event) =>
                updateField(
                  "remarks",
                  event.target.value
                )
              }
              placeholder="Payment remarks..."
            />

          </FormSection>

          {/* FOOTER */}

          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end sm:p-5">

            <button
              type="button"
              onClick={() =>
                router.back()
              }
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Recording...
                </>
              ) : (
                <>
                  <CheckIcon />
                  Record Payment
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </AppShell>
  );
}