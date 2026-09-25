"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Loader from "@/components/common/Loader";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({
  children,
}) {
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <Loader label="Checking authentication..." fullScreen />;
  }

  if (!user) {
    return null;
  }

  return children;
}