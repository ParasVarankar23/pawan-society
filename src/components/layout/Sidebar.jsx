"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
      className="h-[19px] w-[19px]"
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <path d="M12 2s7 7.2 7 12a7 7 0 0 1-14 0c0-4.8 7-12 7-12Z" />
      <path d="M9 16a3.5 3.5 0 0 0 6 0" />
    </svg>
  );
}

function BillingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" />
      <path d="M9 7h6" />
      <path d="M9 11h6" />
      <path d="M9 15h3" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h3" />
    </svg>
  );
}

function LedgerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  );
}

function OutstandingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ExpenseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <path d="M3 7h18" />
      <path d="M5 7v13h14V7" />
      <path d="M8 7V4h8v3" />
      <path d="M9 12h6" />
    </svg>
  );
}

function ElectricityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

function DrinkingWaterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
      <path d="M9 15a3 3 0 0 0 6 0" />
    </svg>
  );
}

function WorksIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <path d="m14 6 4-4 4 4-4 4" />
      <path d="m18 2-9 9" />
      <path d="M4 13h6v6H4z" />
      <path d="M13 17h7" />
      <path d="M13 21h5" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 9h.01" />
      <path d="M18 15h.01" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="m4.93 4.93 2.83 2.83" />
      <path d="m16.24 16.24 2.83 2.83" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="m4.93 19.07 2.83-2.83" />
      <path d="m16.24 7.76 2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[19px] w-[19px]"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.41 1.41-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-2v-.09A1.7 1.7 0 0 0 12.4 19.35a1.7 1.7 0 0 0-1.88.34l-.06.06-1.41-1.41.06-.06A1.7 1.7 0 0 0 9.45 16.4 1.7 1.7 0 0 0 7.89 15H7.8v-2h.09a1.7 1.7 0 0 0 1.56-1.03 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.41-1.41.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.43 7.46V7h2v.46a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.41 1.41-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.97 13h.03v2h-.03a1.7 1.7 0 0 0-1.57 0Z" />
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

const menu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
  },
  {
    label: "Rooms",
    href: "/rooms",
    icon: HomeIcon,
  },
  {
    label: "Water",
    href: "/water",
    icon: WaterIcon,
  },
  {
    label: "Billing",
    href: "/billing",
    icon: BillingIcon,
  },
  {
    label: "Payments",
    href: "/payments",
    icon: PaymentIcon,
  },
  {
    label: "Receipts",
    href: "/receipts",
    icon: ReceiptIcon,
  },
  {
    label: "Ledger",
    href: "/ledger",
    icon: LedgerIcon,
  },
  {
    label: "Outstanding",
    href: "/outstanding",
    icon: OutstandingIcon,
  },
  {
    label: "Expenses",
    href: "/expenses",
    icon: ExpenseIcon,
  },
  {
    label: "Electricity",
    href: "/electricity",
    icon: ElectricityIcon,
  },
  {
    label: "Drinking Water",
    href: "/drinking-water",
    icon: DrinkingWaterIcon,
  },
  {
    label: "Society Works",
    href: "/works",
    icon: WorksIcon,
  },
  {
    label: "Cash Book",
    href: "/cashbook",
    icon: CashIcon,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: ReportsIcon,
  },
  {
    label: "Emails",
    href: "/emails",
    icon: EmailIcon,
  },
  {
    label: "AI / OCR",
    href: "/ai",
    icon: AIIcon,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
];

export default function Sidebar({
  open,
  onClose,
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[280px] flex-col
          bg-slate-950 text-white
          shadow-2xl shadow-slate-950/20
          transition-transform duration-300 ease-out
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        {/* Logo header */}
        <div className="shrink-0 border-b border-white/10 px-4 py-4">
          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0 flex-1">
              <div className="flex h-12 items-center justify-center overflow-hidden rounded-xl bg-white px-4 shadow-sm">
                <Image
                  src="/pawan.png"
                  alt="Pawan Society"
                  width={220}
                  height={90}
                  priority
                  className="h-10 w-auto max-w-full object-contain"
                />
              </div>

              <div className="mt-2 px-1">
                <p className="text-[12px] font-medium text-slate-400">
                  Sector 7 · New Panvel
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Society Management System
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">

          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Main Menu
          </p>

          <div className="space-y-1">
            {menu.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center gap-3
                    rounded-xl px-3.5 py-2.5
                    text-[13px] font-medium
                    transition-all duration-200
                    ${
                      active
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-slate-950" />
                  )}

                  <span
                    className={`
                      flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                      ${
                        active
                          ? "bg-slate-100 text-slate-900"
                          : "bg-white/[0.05] text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                      }
                    `}
                  >
                    <Icon />
                  </span>

                  <span className="truncate">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="shrink-0 border-t border-white/10 p-3">
          <div className="rounded-xl bg-white/[0.04] px-3 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-slate-950">
                PS
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-300">
                  Pawan Society
                </p>

                <p className="truncate text-[10px] text-slate-500">
                  Administration
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}