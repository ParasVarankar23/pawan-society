"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import Toast from "@/components/common/Toast";

function MenuIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
        >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
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

function LogoutIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
        >
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >
            <path d="M12 3 20 6v5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

export default function Header({
    onMenuClick,
}) {
    const router = useRouter();

    const {
        user,
        logout,
    } = useAuth();

    const [
        showLogoutModal,
        setShowLogoutModal,
    ] = useState(false);

    const [error, setError] =
        useState("");

    const [loggingOut, setLoggingOut] =
        useState(false);

    async function handleLogout() {
        setLoggingOut(true);

        try {
            await logout();

            router.replace("/login");
        } catch (err) {
            setError(
                err.message ||
                "Unable to log out. Please try again."
            );

            setShowLogoutModal(false);
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <>
            <Toast
                message={error}
                onClose={() => setError("")}
            />

            <header className="sticky top-0 z-30 h-[72px] border-b border-slate-200 bg-white/95 backdrop-blur">

                <div className="flex h-full items-center justify-between px-4 sm:px-5 lg:px-7">

                    {/* Left */}
                    <div className="flex items-center gap-3">

                        {/* Mobile menu */}
                        <button
                            type="button"
                            onClick={onMenuClick}
                            aria-label="Open navigation"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                        >
                            <MenuIcon />
                        </button>

                        <div>
                            <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                                Pawan Society Management
                            </h1>

                            <p className="hidden text-xs text-slate-400 sm:block">
                                Society Administration Portal
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* User */}
                        <div className="hidden items-center gap-3 sm:flex">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                <UserIcon />
                            </div>

                            <div className="max-w-[220px] text-right">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {user?.name ||
                                        "Administrator"}
                                </p>

                                <p className="truncate text-xs text-slate-500">
                                    {user?.email ||
                                        "Administrator"}
                                </p>
                            </div>
                        </div>

                        {/* Mobile avatar */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white sm:hidden">
                            {(
                                user?.name ||
                                "A"
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        {/* Logout */}
                        <button
                            type="button"
                            onClick={() =>
                                setShowLogoutModal(true)
                            }
                            className="flex h-10 items-center gap-2 rounded-xl border border-slate-300 px-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                            <LogoutIcon />

                            <span className="hidden sm:inline">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Logout modal */}
            {showLogoutModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={() =>
                        !loggingOut &&
                        setShowLogoutModal(false)
                    }
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="logout-title"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    >

                        {/* Modal header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                    <LogoutIcon />
                                </div>

                                <div>
                                    <h2
                                        id="logout-title"
                                        className="text-base font-bold text-slate-900"
                                    >
                                        Sign out
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        End your current session
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLogoutModal(false)
                                }
                                disabled={loggingOut}
                                aria-label="Close"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6">

                            <p className="text-sm leading-6 text-slate-600">
                                Are you sure you want to log out
                                of the Pawan Society Management
                                System?
                            </p>

                            <div className="mt-4 flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                <div className="mt-0.5 text-slate-500">
                                    <ShieldIcon />
                                </div>

                                <p className="text-xs leading-5 text-slate-500">
                                    Your secure session will be ended.
                                    You will need to sign in again
                                    to access the administration panel.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLogoutModal(false)
                                }
                                disabled={loggingOut}
                                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Stay signed in
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loggingOut ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Logging out...
                                    </>
                                ) : (
                                    <>
                                        <LogoutIcon />
                                        Yes, log out
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}