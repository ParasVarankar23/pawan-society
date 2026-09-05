"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import api from "@/lib/apiClient";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const hasLoadedUser = useRef(false);

  const loadUser = useCallback(async function loadUser() {
    try {
      let result;

      try {
        result = await api.get("/auth/me");
      } catch (error) {
        if (error.status !== 401) {
          throw error;
        }

        await api.post("/auth/refresh");
        result = await api.get("/auth/me");
      }

      setUser(result.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasLoadedUser.current) {
      return;
    }

    hasLoadedUser.current = true;
    loadUser();
  }, []);

  const login = useCallback(async function login(
    email,
    password
  ) {
    const result =
      await api.post("/auth/login", {
        email,
        password,
      });

    setUser(result.data.admin);

    return result;
  }, []);

  const logout = useCallback(async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshUser: loadUser,
    }),
    [user, loading, login, logout, loadUser]
  );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}