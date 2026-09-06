"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import AddMemberPage from "@/app/members/add/page";
import api from "@/lib/apiClient";

/* =========================================================
   ICONS
========================================================= */

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21a7 7 0 0 1 14 0" />
      <path d="M16 4.5a4 4 0 0 1 0 7.5" />
      <path d="M17 14a6 6 0 0 1 5 7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-3" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 3" />
      <path d="M20 20v-4h-4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
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
   HELPERS
========================================================= */

function getInitials(name) {
  if (!name) return "M";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
}

function formatMemberType(type) {
  if (!type) return "Unknown";

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function formatOccupancyType(type) {
  if (!type) return "Unknown";

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function memberTypeClass(type) {
  switch (type) {
    case "OWNER":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "TENANT":
      return "bg-blue-50 text-blue-700 border-blue-100";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  type = "default",
}) {
  const styles = {
    default:
      "bg-slate-100 text-slate-700",

    success:
      "bg-emerald-50 text-emerald-600",

    blue:
      "bg-blue-50 text-blue-600",

    warning:
      "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles[type]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MOBILE MEMBER CARD
========================================================= */

function MemberCard({
  member,
  onDelete,
}) {
  const room =
    member.roomId?.roomNumber ||
    member.room?.roomNumber ||
    "-";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
            {getInitials(member.name)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">
              {member.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              Room {room}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${memberTypeClass(
            member.memberType
          )}`}
        >
          {formatMemberType(
            member.memberType
          )}
        </span>
      </div>

      <div className="mt-4 space-y-2">

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <PhoneIcon />
          <span>
            {member.mobile || "No mobile number"}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
          <MailIcon />
          <span className="truncate">
            {member.email || "No email address"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Occupancy
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {formatOccupancyType(
              member.occupancyType
            )}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Room
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {room}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">

        <Link
          href={`/members/${member._id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <EyeIcon />
          View
        </Link>

        <Link
          href={`/members/${member._id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          <EditIcon />
          Manage
        </Link>

        <button
          type="button"
          onClick={() => onDelete(member)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-xl bg-slate-100"
        />
      ))}
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <UsersIcon />
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900">
        No members found
      </h3>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Try changing your search or add a new
        society member.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-5 flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        <PlusIcon />
        Add Member
      </button>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function MembersPage() {
  const [members, setMembers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  async function loadMembers(
    value = search
  ) {
    setLoading(true);
    setError("");

    try {
      const result =
        await api.get(
          `/members${
            value
              ? `?search=${encodeURIComponent(
                  value
                )}`
              : ""
          }`
        );

      const list =
        Array.isArray(result.data)
          ? result.data
          : result.data?.members || [];

      setMembers(list);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load members."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMembers = useMemo(() => {
    if (typeFilter === "ALL") {
      return members;
    }

    return members.filter(
      (member) =>
        member.memberType ===
        typeFilter
    );
  }, [members, typeFilter]);

  const summary = useMemo(() => {
    return {
      total: members.length,

      owners: members.filter(
        (member) =>
          member.memberType ===
          "OWNER"
      ).length,

      tenants: members.filter(
        (member) =>
          member.memberType ===
          "TENANT"
      ).length,

      other: members.filter(
        (member) =>
          member.memberType ===
          "OTHER"
      ).length,
    };
  }, [members]);

  function handleSearch(event) {
    event?.preventDefault();

    loadMembers(search);
  }

  function resetFilters() {
    setSearch("");
    setTypeFilter("ALL");
    loadMembers("");
  }

  async function deleteMember(member) {
    if (!window.confirm(`Delete ${member.name}?`)) return;

    try {
      await api.delete(`/members/${member._id}`);
      await loadMembers(search);
    } catch (err) {
      setError(err.message || "Unable to delete member.");
    }
  }

  return (
    <AppShell>

      <Toast
        message={error}
        onClose={() => setError("")}
      />

      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Society Register
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Members
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage society members, rooms and
              contact information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 sm:w-auto"
          >
            <PlusIcon />
            Add Member
          </button>
        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">

          <SummaryCard
            title="Total Members"
            value={summary.total}
            subtitle="Registered members"
            icon={<UsersIcon />}
          />

          <SummaryCard
            title="Owners"
            value={summary.owners}
            subtitle="Property owners"
            type="success"
            icon={<HomeIcon />}
          />

          <SummaryCard
            title="Tenants"
            value={summary.tenants}
            subtitle="Registered tenants"
            type="blue"
            icon={<UsersIcon />}
          />

          <SummaryCard
            title="Other"
            value={summary.other}
            subtitle="Other member types"
            type="warning"
            icon={<UsersIcon />}
          />
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 lg:flex-row"
          >

            <div className="relative flex-1">

              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </div>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search member name, mobile or email..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div className="relative lg:w-48">

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value
                  )
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-3 pr-9 text-sm text-slate-700 outline-none focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              >
                <option value="ALL">
                  All Members
                </option>

                <option value="OWNER">
                  Owners
                </option>

                <option value="TENANT">
                  Tenants
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <SearchIcon />
              Search
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshIcon />
              Reset
            </button>
          </form>
        </div>

        {/* =================================================
            MEMBER REGISTER
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Member Register
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredMembers.length} member
                {filteredMembers.length === 1
                  ? ""
                  : "s"} displayed
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadMembers(search)
              }
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshIcon />
              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredMembers.length === 0 ? (
            <EmptyState
              onAdd={() => setShowAddModal(true)}
            />
          ) : (
            <>
              {/* Mobile */}
              <div className="space-y-3 bg-slate-50 p-4 md:hidden">
                {filteredMembers.map(
                  (member) => (
                    <MemberCard
                      key={member._id}
                      member={member}
                      onDelete={deleteMember}
                    />
                  )
                )}
              </div>

              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[950px] text-sm">

                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Member
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Room
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Mobile
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Email
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Type
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Occupancy
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {filteredMembers.map(
                      (member) => {
                        const room =
                          member.roomId
                            ?.roomNumber ||
                          member.room
                            ?.roomNumber ||
                          "-";

                        return (
                          <tr
                            key={
                              member._id
                            }
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                          >

                            {/* Member */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                                  {getInitials(
                                    member.name
                                  )}
                                </div>

                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {
                                      member.name
                                    }
                                  </p>

                                  <p className="text-[10px] text-slate-400">
                                    Member
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Room */}
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 font-semibold text-slate-700">
                                <HomeIcon />
                                {room}
                              </span>
                            </td>

                            {/* Mobile */}
                            <td className="px-5 py-4 text-slate-600">
                              {member.mobile ||
                                "-"}
                            </td>

                            {/* Email */}
                            <td className="max-w-[220px] px-5 py-4">
                              <span className="block truncate text-slate-600">
                                {member.email ||
                                  "-"}
                              </span>
                            </td>

                            {/* Type */}
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${memberTypeClass(
                                  member.memberType
                                )}`}
                              >
                                {formatMemberType(
                                  member.memberType
                                )}
                              </span>
                            </td>

                            {/* Occupancy */}
                            <td className="px-5 py-4 text-slate-600">
                              {formatOccupancyType(
                                member.occupancyType
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">

                                <Link
                                  href={`/members/${member._id}`}
                                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-950"
                                >
                                  <EyeIcon />
                                  View
                                </Link>

                                <Link
                                  href={`/members/${member._id}`}
                                  className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                                >
                                  <EditIcon />
                                  Manage
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => deleteMember(member)}
                                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-member-title"
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-slate-50 p-4 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2
                id="add-member-title"
                className="text-lg font-bold text-slate-950"
              >
                Add Member
              </h2>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <AddMemberPage
              embedded
              onClose={() => setShowAddModal(false)}
              onSaved={() => {
                setShowAddModal(false);
                loadMembers(search);
              }}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}