"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, MapPin, Phone, Trash2, UserRound } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import api from "@/lib/apiClient";

function formatValue(value) {
  return value || "Not provided";
}

function formatType(value) {
  return value
    ? value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
    : "Not provided";
}

function Detail({ label, value, icon }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export default function MemberDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMember() {
      try {
        const response = await api.get(`/members/${id}`);
        setMember(response?.data || null);
      } catch (requestError) {
        setError(requestError.message || "Unable to load member.");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadMember();
  }, [id]);

  async function handleDelete() {
    if (!member || !window.confirm(`Delete ${member.name}?`)) return;

    try {
      setDeleting(true);
      await api.delete(`/members/${id}`);
      router.push("/members");
    } catch (requestError) {
      setError(requestError.message || "Unable to delete member.");
      setDeleting(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to Members
        </Link>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
            Loading member details...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && member && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <UserRound size={23} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Member Profile
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    {member.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatType(member.memberType)} · Room {member.roomId?.roomNumber || "-"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 sm:w-auto"
              >
                <Trash2 size={17} />
                {deleting ? "Deleting..." : "Delete Member"}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Mobile" value={formatValue(member.mobile)} icon={<Phone size={14} />} />
              <Detail label="Email" value={formatValue(member.email)} icon={<Mail size={14} />} />
              <Detail label="Room" value={formatValue(member.roomId?.roomNumber)} icon={<Building2 size={14} />} />
              <Detail label="Occupancy" value={formatType(member.occupancyType)} icon={<UserRound size={14} />} />
              <Detail label="Address" value={formatValue(member.address)} icon={<MapPin size={14} />} />
              <Detail label="Alternate Mobile" value={formatValue(member.alternateMobile)} icon={<Phone size={14} />} />
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">Member information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Detail label="Member type" value={formatType(member.memberType)} />
                <Detail label="Status" value={formatType(member.status)} />
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
