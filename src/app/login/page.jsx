"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/components/auth/AuthProvider";

function MailIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
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

function LockIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                x="4"
                y="10"
                width="16"
                height="11"
                rx="2"
            />

            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />

            <circle
                cx="12"
                cy="12"
                r="2.5"
            />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3l18 18" />

            <path d="M10.6 6.2A9.9 9.9 0 0 1 12 6c6 0 9.5 6 9.5 6a17.8 17.8 0 0 1-3 3.8" />

            <path d="M6.7 6.7C4 8.3 2.5 12 2.5 12s3.5 6 9.5 6c1.2 0 2.3-.2 3.3-.6" />

            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 3 20 6v5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m5 12 4 4L19 6" />
        </svg>
    );
}

export default function LoginPage() {
    const router = useRouter();

    const { login } = useAuth();

    const [email, setEmail] = useState(
        ""
    );

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(
                email.trim().toLowerCase(),
                password
            );

            router.replace("/dashboard");
        } catch (err) {
            setError(
                err.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f8fb]">
            <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_0.95fr]">

                {/* ================================================= */}
                {/* LEFT SIDE */}
                {/* ================================================= */}

                <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex">

                    {/* Background decoration */}
                    <div className="absolute inset-0">
                        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

                        <div className="absolute -bottom-40 -right-32 h-[550px] w-[550px] rounded-full bg-indigo-500/10 blur-3xl" />

                        <div className="absolute left-[55%] top-[20%] h-40 w-40 rounded-full border border-white/5" />

                        <div className="absolute left-[65%] top-[28%] h-20 w-20 rounded-full border border-white/5" />
                    </div>

                    {/* Grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                            backgroundSize: "50px 50px",
                        }}
                    />

                    <div className="relative z-10 flex min-h-screen w-full flex-col justify-between px-10 py-10 xl:px-16 xl:py-12">

                        {/* Brand */}
                        <div className="flex items-center gap-4">
                            <Image
                                src="/pawan.png"
                                alt="Pawan Society"
                                width={512}
                                height={256}
                                priority
                                className="h-24 w-26 rounded-xl bg-white object-contain shadow-xl"
                            />
                        </div>

                        {/* Main content */}
                        <div className="max-w-xl">

                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                                Society Administration Portal
                            </div>

                            <h2 className="text-4xl font-bold leading-[1.12] tracking-tight xl:text-5xl">
                                Everything your society
                                <br />
                                needs,{" "}
                                <span className="text-slate-400">
                                    in one place.
                                </span>
                            </h2>

                            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">
                                A simple and secure platform to manage
                                members, maintenance billing, water
                                readings, payments, receipts, expenses,
                                accounts and society reports.
                            </p>

                            {/* Features */}
                            <div className="mt-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">

                                {[
                                    "Member & Room Management",
                                    "Monthly Maintenance Billing",
                                    "Water Reading & Billing",
                                    "Payments & Digital Receipts",
                                    "Ledger & Cash Book",
                                    "Financial Reports & Audit",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-xs text-slate-300 backdrop-blur-sm"
                                    >
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300">
                                            <CheckIcon />
                                        </span>

                                        {item}
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Bottom */}
                        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6">

                            <div className="text-xs text-slate-500">
                                Sector 7 · Khanda Colony · New Panvel
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <ShieldIcon />
                                Secure Administration
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================================================= */}
                {/* RIGHT SIDE */}
                {/* ================================================= */}

                <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

                    <div className="w-full max-w-[440px]">

                        {/* Mobile branding */}
                        <div className="mb-9 text-center lg:hidden">
                            <Image
                                src="/logo.png"
                                alt="Pawan Society"
                                width={512}
                                height={256}
                                priority
                                className="mx-auto h-28 w-full max-w-96 rounded-2xl bg-white object-contain shadow-lg"
                            />
                        </div>

                        {/* Login heading */}
                        <div className="mb-7 text-center">

                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Administrator Access
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                Welcome back
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Sign in to continue to your society
                                administration dashboard.
                            </p>
                        </div>

                        {/* Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-8">

                            {/* Error */}
                            {error && (
                                <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">

                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                                        !
                                    </div>

                                    <p className="text-sm leading-5 text-red-700">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Email address
                                    </label>

                                    <div className="group relative">

                                        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-slate-700">
                                            <MailIcon />
                                        </div>

                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(
                                                    event.target.value
                                                )
                                            }
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                                            placeholder="Enter your email"
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between">

                                        <label
                                            htmlFor="password"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Password
                                        </label>

                                        <Link
                                            href="/forgot-password"
                                            className="text-xs font-semibold text-slate-500 transition hover:text-slate-950 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <div className="group relative">

                                        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-slate-700">
                                            <LockIcon />
                                        </div>

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(
                                                    event.target.value
                                                )
                                            }
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            required
                                        />

                                        {/* Eye button */}
                                        <button
                                            type="button"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                            className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon />
                                            ) : (
                                                <EyeIcon />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Security information */}
                                <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3.5">

                                    <div className="mt-0.5 text-slate-500">
                                        <ShieldIcon />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-slate-700">
                                            Secure administrator login
                                        </p>

                                        <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                                            Your authentication session is
                                            protected using secure HTTP-only
                                            cookies.
                                        </p>
                                    </div>
                                </div>

                                {/* Login button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/15 disabled:pointer-events-none disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in to dashboard

                                            <span className="transition-transform group-hover:translate-x-1">
                                                <ArrowIcon />
                                            </span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* First-time setup */}
                            <div className="mt-6 border-t border-slate-100 pt-6 text-center">

                                <p className="text-xs text-slate-500">
                                    First-time setup?
                                </p>

                                <Link
                                    href="/admin-register"
                                    className="mt-1 inline-block text-sm font-semibold text-slate-800 hover:text-slate-950 hover:underline"
                                >
                                    Create administrator account
                                </Link>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 text-center">

                            <p className="text-[11px] text-slate-400">
                                Pawan Society Management System
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                                Sector 7 · Khanda Colony · New Panvel
                                410206
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}