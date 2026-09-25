"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Toast from "@/components/common/Toast";
import AppShell from "@/components/layout/AppShell";
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
  className = "",
}) {
  return (
    <section className={`relative overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>

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
  memberId = null,
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

  const [roomSearch, setRoomSearch] =
    useState("");

  const [memberTypeSearch, setMemberTypeSearch] =
    useState("");

  const [memberTypeOpen, setMemberTypeOpen] =
    useState(false);

  const [occupancySearch, setOccupancySearch] =
    useState("");

  const [occupancyOpen, setOccupancyOpen] =
    useState(false);

  const [roomPickerOpen, setRoomPickerOpen] =
    useState(false);

  const roomPickerRef = useRef(null);

  const editing = Boolean(memberId);

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

        let currentMember = null;

        if (memberId) {
          const memberResult =
            await api.get(
              `/members/${memberId}`
            );

          currentMember = memberResult.data;
        }

        const list =
          Array.isArray(result.data)
            ? result.data
            : result.data?.rooms || [];

        const currentRoomId =
          currentMember?.roomId?._id ||
          currentMember?.roomId ||
          "";

        setRooms(
          list
            .sort(
              (firstRoom, secondRoom) =>
                Number(firstRoom.roomNumber) -
                Number(secondRoom.roomNumber)
            )
        );

        if (currentMember) {
          setForm({
            roomId: currentRoomId,
            name: currentMember.name || "",
            mobile: currentMember.mobile || "",
            alternateMobile:
              currentMember.alternateMobile || "",
            email: currentMember.email || "",
            memberType:
              currentMember.memberType || "OWNER",
            occupancyType:
              currentMember.occupancyType || "SELF",
            address: currentMember.address || "",
          });
        }
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
  }, [memberId]);

  useEffect(() => {
    function closeRoomPicker(event) {
      if (
        roomPickerRef.current &&
        !roomPickerRef.current.contains(event.target)
      ) {
        setRoomPickerOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      closeRoomPicker
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeRoomPicker
      );
    };
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

  const filteredRooms = rooms.filter((room) => {
    const query = roomSearch.trim().toLowerCase();

    if (!query) return true;

    return (
      String(room.roomNumber).toLowerCase().includes(query) ||
      room.memberId?.name?.toLowerCase().includes(query)
    );
  });

  let selectedRoomLabel = "Select Room";

  if (selectedRoom) {
    selectedRoomLabel = `Room ${selectedRoom.roomNumber}`;
  }

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

      if (editing) {
        await api.put(
          `/members/${memberId}`,
          payload
        );
      } else {
        await api.post(
          "/members",
          payload
        );
      }

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
              {editing ? "Edit Member" : "Add Member"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update member details and room assignment."
                : "Register a new member and assign a society room."}
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
            className="z-20"
          >
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="roomId"
                  className="label"
                >
                  Room *
                </label>

                <div
                  ref={roomPickerRef}
                  className="relative"
                >
                  <button
                    id="roomId"
                    type="button"
                    className="input flex w-full items-center justify-between text-left disabled:opacity-50"
                    onClick={() => setRoomPickerOpen((open) => !open)}
                    disabled={loadingRooms}
                    aria-haspopup="listbox"
                    aria-expanded={roomPickerOpen}
                  >
                    <span className={selectedRoom ? "text-slate-800" : "text-slate-400"}>
                      {loadingRooms
                        ? "Loading rooms..."
                        : selectedRoomLabel}
                    </span>
                    <ChevronDownIcon />
                  </button>

                  {roomPickerOpen && !loadingRooms && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      <input
                        type="search"
                        value={roomSearch}
                        onChange={(event) => setRoomSearch(event.target.value)}
                        placeholder="Search room or member..."
                        className="input mb-2 h-10 w-full"
                      />

                      <div
                        className="max-h-32 overflow-y-auto overscroll-contain"
                        role="listbox"
                        aria-label="Rooms"
                      >
                        {filteredRooms.map((room) => {
                          const isCurrentRoom = room._id === form.roomId;
                          const isOccupied = Boolean(room.memberId) && !isCurrentRoom;

                          return (
                            <button
                              key={room._id}
                              type="button"
                              role="option"
                              aria-selected={isCurrentRoom}
                              disabled={isOccupied}
                              onClick={() => {
                                updateField("roomId", room._id);
                                setRoomPickerOpen(false);
                                setRoomSearch("");
                              }}
                              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${isOccupied ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-slate-100"} ${isCurrentRoom ? "bg-slate-100 font-semibold text-slate-950" : ""}`}
                            >
                              Room {room.roomNumber}
                              {room.memberId?.name
                                ? ` · ${room.memberId.name} (Occupied)`
                                : " · Available"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
                        Available room
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

                <SearchableMemberOption
                  value={form.memberType}
                  options={[["OWNER", "Owner"], ["TENANT", "Tenant"], ["OTHER", "Other"]]}
                  search={memberTypeSearch}
                  open={memberTypeOpen}
                  setSearch={setMemberTypeSearch}
                  setOpen={setMemberTypeOpen}
                  onChange={(value) => updateField("memberType", value)}
                  placeholder="Search member type..."
                />
              </div>

              <div>
                <label
                  htmlFor="occupancyType"
                  className="label"
                >
                  Occupancy Type
                </label>

                <SearchableMemberOption
                  value={form.occupancyType}
                  options={[["SELF", "Self Occupied"], ["RENTED", "Rented"], ["VACANT", "Vacant"]]}
                  search={occupancySearch}
                  open={occupancyOpen}
                  setSearch={setOccupancySearch}
                  setOpen={setOccupancyOpen}
                  onChange={(value) => updateField("occupancyType", value)}
                  placeholder="Search occupancy type..."
                />
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
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <PhoneIcon />
                  </div>

                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className="input input-with-icon"
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
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <PhoneIcon />
                  </div>

                  <input
                    id="alternateMobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className="input input-with-icon"
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
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <MailIcon />
                  </div>

                  <input
                    id="email"
                    type="email"
                    className="input input-with-icon"
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
                  {editing
                    ? "Updating Member..."
                    : "Saving Member..."}
                </>
              ) : (
                <>
                  <CheckIcon />
                  {editing
                    ? "Update Member"
                    : "Save Member"}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </PageWrapper>
  );
}

function SearchableMemberOption({
  value,
  options,
  search,
  open,
  setSearch,
  setOpen,
  onChange,
  placeholder,
}) {
  const selectedLabel =
    options.find(([optionValue]) => optionValue === value)?.[1] ||
    "Select option";
  const filteredOptions = options.filter(([, label]) =>
    label.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        className="input flex w-full items-center justify-between text-left"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="text-slate-800">{selectedLabel}</span>
        <ChevronDownIcon />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <input
            className="input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
          />
          <div className="mt-2 max-h-40 overflow-y-auto">
            {filteredOptions.map(([optionValue, label]) => (
              <button
                key={optionValue}
                type="button"
                className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${value === optionValue ? "bg-slate-50 font-semibold" : "text-slate-700"}`}
                onClick={() => {
                  onChange(optionValue);
                  setSearch("");
                  setOpen(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}