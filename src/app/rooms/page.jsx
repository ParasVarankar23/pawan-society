"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  CarFront,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import api from "@/lib/apiClient";

const initialForm = {
  roomNumber: "",
  wing: "",
  floor: "",
  areaSqFt: "",
  occupancyStatus: "VACANT",
  parking: false,
  parkingCount: 0,
};

const occupancyOptions = [
  {
    value: "OCCUPIED",
    label: "Occupied",
  },
  {
    value: "VACANT",
    label: "Vacant",
  },
  {
    value: "RENTED",
    label: "Rented",
  },
  {
    value: "UNDER_MAINTENANCE",
    label: "Under Maintenance",
  },
];

function getStatusClass(status) {
  switch (status) {
    case "OCCUPIED":
      return "bg-green-100 text-green-700";

    case "RENTED":
      return "bg-blue-100 text-blue-700";

    case "UNDER_MAINTENANCE":
      return "bg-orange-100 text-orange-700";

    case "VACANT":
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function formatStatus(status) {
  return status
    ?.replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

export default function RoomsPage() {
  const [rooms, setRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingRoom, setEditingRoom] =
    useState(null);

  const [form, setForm] =
    useState(initialForm);

  async function loadRooms(
    searchValue = ""
  ) {
    setLoading(true);
    setError("");

    try {
      const query = searchValue
        ? `?search=${encodeURIComponent(
            searchValue
          )}`
        : "";

      const result =
        await api.get(
          `/rooms${query}`
        );

      setRooms(
        Array.isArray(result.data)
          ? result.data
          : result.data?.rooms || []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load rooms"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  function openAddModal() {
    setEditingRoom(null);

    setForm({
      ...initialForm,
    });

    setShowModal(true);
  }

  function openEditModal(room) {
    setEditingRoom(room);

    setForm({
      roomNumber:
        room.roomNumber || "",

      wing: room.wing || "",

      floor:
        room.floor !== undefined &&
        room.floor !== null
          ? room.floor
          : "",

      areaSqFt:
        room.areaSqFt !== undefined &&
        room.areaSqFt !== null
          ? room.areaSqFt
          : "",

      occupancyStatus:
        room.occupancyStatus ||
        "VACANT",

      parking:
        Boolean(room.parking),

      parkingCount:
        room.parkingCount || 0,
    });

    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingRoom(null);
    setForm({
      ...initialForm,
    });
  }

  function updateField(
    field,
    value
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setSaving(true);

    try {
      const payload = {
        roomNumber:
          form.roomNumber.trim(),

        wing:
          form.wing.trim(),

        floor:
          form.floor === ""
            ? undefined
            : Number(form.floor),

        areaSqFt:
          form.areaSqFt === ""
            ? undefined
            : Number(form.areaSqFt),

        occupancyStatus:
          form.occupancyStatus,

        parking:
          Boolean(form.parking),

        parkingCount:
          form.parking
            ? Number(
                form.parkingCount || 0
              )
            : 0,
      };

      if (editingRoom) {
        await api.put(
          `/rooms/${editingRoom._id}`,
          payload
        );
      } else {
        await api.post(
          "/rooms",
          payload
        );
      }

      closeModal();

      await loadRooms(search);
    } catch (err) {
      alert(
        err.message ||
          "Unable to save room"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteRoom(room) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete room ${room.roomNumber}?`
      );

    if (!confirmed) return;

    try {
      await api.delete(
        `/rooms/${room._id}`
      );

      await loadRooms(search);
    } catch (err) {
      alert(
        err.message ||
          "Unable to delete room"
      );
    }
  }

  function handleSearch() {
    loadRooms(search);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Property Register
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Rooms
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage flats, occupancy, parking and room information.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 sm:w-auto"
          >
            <Plus size={17} />
            Add Room
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-slate-500">
              Total Rooms
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              {rooms.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-slate-500">
              Occupied
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
              {
                rooms.filter(
                  (room) =>
                    room.occupancyStatus ===
                    "OCCUPIED"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-slate-500">
              Rented
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight text-blue-600">
              {
                rooms.filter(
                  (room) =>
                    room.occupancyStatus ===
                    "RENTED"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-slate-500">
              Vacant
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600">
              {
                rooms.filter(
                  (room) =>
                    room.occupancyStatus ===
                    "VACANT"
                ).length
              }
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  handleSearch();
                }
              }}
              placeholder="Search room number, wing or floor..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Search size={17} />
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                loadRooms("");
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Room Register
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {rooms.length} room{rooms.length === 1 ? "" : "s"} displayed
              </p>
            </div>
            <button
              type="button"
              onClick={() => loadRooms(search)}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {loading ? (
            <LoadingState />
          ) : rooms.length === 0 ? (
            <div className="p-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Building2 size={28} />
              </div>

              <h3 className="mt-3 font-semibold">
                No rooms found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your first society room.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Plus size={16} />
                Add Room
              </button>
            </div>
          ) : (
            <>
            <div className="space-y-3 bg-slate-50 p-4 md:hidden">
              {rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onEdit={openEditModal}
                  onDelete={deleteRoom}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-sm">
                <thead className="bg-slate-50/70">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Room
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Wing
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Floor
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Area
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Member
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Parking
                    </th>

                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rooms.map(
                    (room) => (
                      <tr
                        key={room._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-900">
                          {room.roomNumber}
                        </td>

                        <td className="px-5 py-4">
                          {room.wing || "-"}
                        </td>

                        <td className="px-5 py-4">
                          {room.floor ?? "-"}
                        </td>

                        <td className="px-5 py-4">
                          {room.areaSqFt
                            ? `${room.areaSqFt} sq.ft`
                            : "-"}
                        </td>

                        <td className="px-5 py-4">
                          {room.memberId
                            ?.name ||
                            room.member
                              ?.name ||
                            "Not assigned"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                              room.occupancyStatus
                            )}`}
                          >
                            {formatStatus(
                              room.occupancyStatus
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {room.parking
                            ? `${room.parkingCount || 0} slot(s)`
                            : "No"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  room
                                )
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-950"
                            >
                              <Edit3 size={14} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteRoom(
                                  room
                                )
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold">
                  {editingRoom
                    ? "Edit Room"
                    : "Add Room"}
                </h2>

                <p className="text-xs text-slate-500">
                  Enter room information
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {/* Room Number */}
                <div>
                  <label className="label">
                    Room Number *
                  </label>

                  <input
                    className="input"
                    value={
                      form.roomNumber
                    }
                    onChange={(event) =>
                      updateField(
                        "roomNumber",
                        event.target.value
                      )
                    }
                    placeholder="Example: A-101"
                    required
                  />
                </div>

                {/* Wing */}
                <div>
                  <label className="label">
                    Wing
                  </label>

                  <input
                    className="input"
                    value={form.wing}
                    onChange={(event) =>
                      updateField(
                        "wing",
                        event.target.value
                      )
                    }
                    placeholder="Example: A"
                  />
                </div>

                {/* Floor */}
                <div>
                  <label className="label">
                    Floor
                  </label>

                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={form.floor}
                    onChange={(event) =>
                      updateField(
                        "floor",
                        event.target.value
                      )
                    }
                    placeholder="Example: 1"
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="label">
                    Area (sq.ft)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input"
                    value={
                      form.areaSqFt
                    }
                    onChange={(event) =>
                      updateField(
                        "areaSqFt",
                        event.target.value
                      )
                    }
                    placeholder="Example: 650"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="label">
                    Occupancy Status
                  </label>

                  <select
                    className="input"
                    value={
                      form.occupancyStatus
                    }
                    onChange={(event) =>
                      updateField(
                        "occupancyStatus",
                        event.target.value
                      )
                    }
                  >
                    {occupancyOptions.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Parking */}
                <div>
                  <label className="label">
                    Parking
                  </label>

                  <select
                    className="input"
                    value={
                      form.parking
                        ? "YES"
                        : "NO"
                    }
                    onChange={(event) =>
                      updateField(
                        "parking",
                        event.target.value ===
                          "YES"
                      )
                    }
                  >
                    <option value="NO">
                      No
                    </option>

                    <option value="YES">
                      Yes
                    </option>
                  </select>
                </div>

                {/* Parking count */}
                {form.parking && (
                  <div>
                    <label className="label">
                      Parking Count
                    </label>

                    <input
                      type="number"
                      min="1"
                      className="input"
                      value={
                        form.parkingCount
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "parkingCount",
                          event.target.value
                        )
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border px-5 py-2.5 text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingRoom
                    ? "Update Room"
                    : "Save Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  tone = "default",
}) {
  const tones = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    warning: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, onEdit, onDelete }) {
  const member = room.memberId?.name || room.member?.name || "Not assigned";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Building2 size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">
              Room {room.roomNumber}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {room.wing ? `Wing ${room.wing}` : "No wing assigned"}
            </p>
          </div>
        </div>

        <span className={`shrink-0 rounded-full border border-transparent px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(room.occupancyStatus)}`}>
          {formatStatus(room.occupancyStatus)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Member</p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-700">{member}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Area</p>
          <p className="mt-1 text-xs font-semibold text-slate-700">
            {room.areaSqFt ? `${room.areaSqFt} sq.ft` : "Not set"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <CarFront size={15} />
        {room.parking ? `${room.parkingCount || 0} parking slot(s)` : "No parking"}
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
        <button type="button" onClick={() => onEdit(room)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <Edit3 size={14} />
          Edit
        </button>
        <button type="button" onClick={() => onDelete(room)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50">
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}