"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen overflow-x-hidden bg-slate-50">

        <Sidebar
          open={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <div className="lg:ml-[280px]">

          <Header
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          <main className="min-h-[calc(100vh-72px)] p-4 sm:p-5 lg:p-7">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}