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
   INITIAL FORM
========================================================= */

const initialForm = {
  roomId: "",
  name: "",
  mobile: "",
  alternateMobile: "",
  email: "",
  memberType: "OWNER",
  occupancyType: "SELF",
  address: "",
};

/* =========================================================
   ICONS
========================================================= */

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

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M7 3h3l1.5 4-2 1.5a15 15 0 0 0 6 6l1.5-2 4 1.5v3c0 1-1 2-2 2C11 19 5 13 5 5c0-1 1-2 2-2Z" />
    </svg>
  );
}

function MailIcon() {
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
        y="5"
        width="18"
        height="14"
        rx="2"
      />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
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

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M10.3 4.3 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

/* =========================================================
   SECTION CARD
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

export default function AddMemberPage({
  embedded = false,
  onClose,
  onSaved,
}) {
  const router = useRouter();
  const PageWrapper = embedded
    ? Fragment
    : AppShell;

  const [rooms, setRooms] =
    useState([]);

  const [form, setForm] =
    useState(initialForm);

  const [saving, setSaving] =
    useState(false);

  const [loadingRooms, setLoadingRooms] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD ROOMS
  ======================================================= */

  useEffect(() => {
    async function loadRooms() {
      setLoadingRooms(true);

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
        setLoadingRooms(false);
      }
    }

    loadRooms();
  }, []);

  /* =======================================================
     UPDATE
  ======================================================= */

  function updateField(
    field,
    value
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

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
     VALIDATION
  ======================================================= */

  function validateForm() {
    if (!form.roomId) {
      return "Please select a room.";
    }

    if (!form.name.trim()) {
      return "Member name is required.";
    }

    if (
      form.mobile &&
      !/^[0-9]{10}$/.test(
        form.mobile.trim()
      )
    ) {
      return "Please enter a valid 10-digit mobile number.";
    }

    if (
      form.alternateMobile &&
      !/^[0-9]{10}$/.test(
        form.alternateMobile.trim()
      )
    ) {
      return "Please enter a valid alternate mobile number.";
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    return "";
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function submit(event) {
    event.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        roomId: form.roomId,
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        alternateMobile:
          form.alternateMobile.trim(),
        email: form.email.trim(),
        memberType:
          form.memberType,
        occupancyType:
          form.occupancyType,
        address:
          form.address.trim(),
      };

      await api.post(
        "/members",
        payload
      );

      if (onSaved) {
        onSaved();
      } else {
        router.push("/members");
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to save member."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <PageWrapper>

      <Toast
        message={error}
        onClose={() => setError("")}
      />

      <div className="mx-auto max-w-5xl space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4">

          <button
            type="button"
            onClick={onClose || (() => router.back())}
            className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-950"
          >
            <ArrowLeftIcon />
            Back to Members
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Society Register
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Add Member
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Register a new member and assign a
              society room.
            </p>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <AlertIcon />

            <div>
              <p className="font-semibold">
                Please check the form
              </p>

              <p className="mt-0.5 text-xs">
                {error}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-5"
        >

          {/* =================================================
              ROOM ASSIGNMENT
          ================================================= */}

          <FormSection
            icon={<HomeIcon />}
            title="Room Assignment"
            description="Select the society room associated with this member."
          >
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="roomId"
                  className="label"
                >
                  Room *
                </label>

                <div className="relative">

                  <select
                    id="roomId"
                    value={form.roomId}
                    onChange={(event) =>
                      updateField(
                        "roomId",
                        event.target.value
                      )
                    }
                    required
                    disabled={
                      loadingRooms
                    }
                    className="input appearance-none pr-10"
                  >
                    <option value="">
                      {loadingRooms
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

                {rooms.length === 0 &&
                  !loadingRooms && (
                    <p className="mt-2 text-xs text-amber-600">
                      No active rooms are available.
                      Add a room first.
                    </p>
                  )}
              </div>

              {/* Selected room */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Selected Room
                </p>

                {selectedRoom ? (
                  <div className="mt-2 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                      <HomeIcon />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Room{" "}
                        {
                          selectedRoom.roomNumber
                        }
                      </p>

                      <p className="text-xs text-slate-500">
                        {selectedRoom.wing
                          ? `Wing ${selectedRoom.wing}`
                          : "No wing"}
                        {" · "}
                        Floor{" "}
                        {selectedRoom.floor ??
                          "-"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">
                    Select a room to continue.
                  </p>
                )}
              </div>
            </div>
          </FormSection>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <FormSection
            icon={<UserIcon />}
            title="Member Information"
            description="Basic information about the society member."
          >
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="name"
                  className="label"
                >
                  Member Name *
                </label>

                <input
                  id="name"
                  className="input"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="memberType"
                  className="label"
                >
                  Member Type
                </label>

                <div className="relative">
                  <select
                    id="memberType"
                    className="input appearance-none pr-10"
                    value={
                      form.memberType
                    }
                    onChange={(event) =>
                      updateField(
                        "memberType",
                        event.target.value
                      )
                    }
                  >
                    <option value="OWNER">
                      Owner
                    </option>

                    <option value="TENANT">
                      Tenant
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
                <label
                  htmlFor="occupancyType"
                  className="label"
                >
                  Occupancy Type
                </label>

                <div className="relative">
                  <select
                    id="occupancyType"
                    className="input appearance-none pr-10"
                    value={
                      form.occupancyType
                    }
                    onChange={(event) =>
                      updateField(
                        "occupancyType",
                        event.target.value
                      )
                    }
                  >
                    <option value="SELF">
                      Self Occupied
                    </option>

                    <option value="RENTED">
                      Rented
                    </option>

                    <option value="VACANT">
                      Vacant
                    </option>
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* =================================================
              CONTACT
          ================================================= */}

          <FormSection
            icon={<PhoneIcon />}
            title="Contact Information"
            description="Contact details used for bills, receipts and society communication."
          >
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="mobile"
                  className="label"
                >
                  Mobile Number
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <PhoneIcon />
                  </div>

                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className="input pl-10"
                    value={form.mobile}
                    onChange={(event) =>
                      updateField(
                        "mobile",
                        event.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="alternateMobile"
                  className="label"
                >
                  Alternate Mobile
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <PhoneIcon />
                  </div>

                  <input
                    id="alternateMobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className="input pl-10"
                    value={
                      form.alternateMobile
                    }
                    onChange={(event) =>
                      updateField(
                        "alternateMobile",
                        event.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Alternate contact number"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="email"
                  className="label"
                >
                  Email Address
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <MailIcon />
                  </div>

                  <input
                    id="email"
                    type="email"
                    className="input pl-10"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="member@example.com"
                  />
                </div>

                <p className="mt-1.5 text-[11px] text-slate-400">
                  Used for monthly bills, receipts
                  and email reminders.
                </p>
              </div>
            </div>
          </FormSection>

          {/* =================================================
              ADDRESS
          ================================================= */}

          <FormSection
            icon={<MapIcon />}
            title="Address"
            description="Enter the member's correspondence or permanent address."
          >
            <textarea
              id="address"
              className="input min-h-[130px] resize-y py-3"
              value={form.address}
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                )
              }
              placeholder="Enter address..."
            />

            <p className="mt-1.5 text-[11px] text-slate-400">
              You can include street, locality, city,
              state and PIN code.
            </p>
          </FormSection>

          {/* =================================================
              FORM FOOTER
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end sm:p-5">

            <button
              type="button"
              onClick={onClose || (() => router.back())}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                loadingRooms ||
                rooms.length === 0
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving Member...
                </>
              ) : (
                <>
                  <CheckIcon />
                  Save Member
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </PageWrapper>
  );
}