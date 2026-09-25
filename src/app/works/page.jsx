"use client";

import {
  ChevronDown,
  Eye,
  Hammer,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  WalletCards
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import Toast from "@/components/common/Toast";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/apiClient";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusClass = (status) => {
  const value = String(status || "").toUpperCase();

  if (value === "COMPLETED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (value === "IN_PROGRESS") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (value === "CANCELLED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
};

export default function WorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [workCategories, setWorkCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (message, type = "success") =>
    setToast({
      show: true,
      type,
      message,
    });

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function loadWorks() {
    try {
      setRefreshing(true);

      const query =
        category !== "ALL"
          ? `?category=${encodeURIComponent(category)}`
          : "";

      const response = await api.get(`/works${query}`);

      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.items ||
        response?.data?.works ||
        [];

      setWorks(data);
    } catch (error) {
      setWorks([]);

      showToast(
        error?.message || "Failed to load society works.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadWorks();
  }, [category]);

  useEffect(() => {
    async function loadWorkCategories() {
      try {
        const response = await api.get("/works/categories");
        const data = Array.isArray(response?.data)
          ? response.data
          : response?.data?.categories || [];

        setWorkCategories(data);
      } catch (error) {
        showToast(
          error?.message || "Failed to load work categories.",
          "error"
        );
      }
    }

    loadWorkCategories();
  }, []);

  const filteredWorks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return works;

    return works.filter((item) =>
      [
        item.workName,
        item.category?.name,
        item.category,
        item.vendorName,
        item.description,
        item.billNumber,
        item.status,
        item.paymentStatus,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [works, search]);

  const totalEstimated = filteredWorks.reduce(
    (sum, item) =>
      sum + Number(item.estimatedCost || 0),
    0
  );

  const totalActual = filteredWorks.reduce(
    (sum, item) =>
      sum + Number(item.actualCost || 0),
    0
  );

  async function deleteWork(work) {
    if (!window.confirm(`Cancel work "${work.workName || "this work"}"?`)) {
      return;
    }

    try {
      await api.delete(`/works/${work._id}`);
      await loadWorks();
      showToast("Society work cancelled successfully.");
    } catch (error) {
      showToast(
        error?.message || "Failed to cancel society work.",
        "error"
      );
    }
  }

  return (
    <AppShell>
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() =>
          setToast((current) => ({
            ...current,
            show: false,
          }))
        }
      />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white">
              <Hammer size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Society Management
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Society Works
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage repairs, construction and maintenance works
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadWorks}
              disabled={refreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              href="/works/add"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white"
            >
              <Plus size={17} />
              Add Work
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Works</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {filteredWorks.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Estimated Cost</p>
            <p className="mt-2 text-2xl font-bold text-violet-600">
              {formatCurrency(totalEstimated)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Actual Cost</p>
            <p className="mt-2 text-2xl font-bold text-red-600">
              {formatCurrency(totalActual)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search work, vendor, bill number..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div ref={categoryRef} className="relative">
              <button
                type="button"
                className="input flex h-11 w-full items-center justify-between text-left"
                onClick={() => setCategoryOpen((current) => !current)}
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
              >
                <span className="text-sm text-slate-700">
                  {category === "ALL"
                    ? "All Categories"
                    : workCategories.find((item) => item.name === category)?.name || category}
                </span>
                <ChevronDown size={16} className="text-slate-500" />
              </button>

              {categoryOpen && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <input
                    type="search"
                    value={categorySearch}
                    onChange={(event) => setCategorySearch(event.target.value)}
                    placeholder="Search category..."
                    className="input h-10 w-full"
                    aria-label="Search work category"
                  />
                  <div className="mt-2 max-h-48 overflow-y-auto" role="listbox">
                    {[{ name: "All Categories", value: "ALL" }, ...workCategories.map((item) => ({ name: item.name, value: item.name }))]
                      .filter((item) => item.name.toLowerCase().includes(categorySearch.trim().toLowerCase()))
                      .map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          role="option"
                          aria-selected={category === item.value}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${category === item.value ? "bg-slate-50 font-semibold text-slate-950" : "text-slate-700"}`}
                          onClick={() => {
                            setCategory(item.value);
                            setCategorySearch("");
                            setCategoryOpen(false);
                          }}
                        >
                          {item.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Society Works Register
            </h2>
          </div>

          <div className="max-h-[620px] overflow-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase text-slate-500">
                  <th className="px-5 py-4">Work</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Vendor</th>
                  <th className="px-5 py-4">Start</th>
                  <th className="px-5 py-4">Completion</th>
                  <th className="px-5 py-4 text-right">Estimated</th>
                  <th className="px-5 py-4 text-right">Actual</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 9 }).map((__, cell) => (
                        <td key={cell} className="px-5 py-5">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredWorks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-16 text-center">
                      <WalletCards
                        size={40}
                        className="mx-auto text-slate-300"
                      />
                      <p className="mt-4 font-semibold text-slate-700">
                        No society works found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredWorks.map((work) => (
                    <tr
                      key={work._id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {work.workName || "-"}
                        </p>

                        {work.description && (
                          <p className="mt-1 max-w-[240px] truncate text-xs text-slate-400">
                            {work.description}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {work.category?.name ||
                          work.category ||
                          "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {work.vendorName || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(work.startDate)}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(work.completionDate)}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-slate-700">
                        {formatCurrency(work.estimatedCost)}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-red-600">
                        {formatCurrency(work.actualCost)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(
                            work.status
                          )}`}
                        >
                          {work.status || "PLANNED"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/works/${work._id}`}
                            title="View work"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/works/${work._id}`}
                            title="Edit work"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            title="Delete work"
                            onClick={() => deleteWork(work)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}