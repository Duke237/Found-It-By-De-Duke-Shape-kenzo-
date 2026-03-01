"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type SessionUser = {
  id: string;
  username?: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  return JSON.parse(text) as T;
}

async function readError(res: Response): Promise<{ error?: string }> {
  return readJson<{ error?: string }>(res).catch(() => ({ error: undefined }));
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // `undefined` means "not yet loaded".
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) {
      setUser(null);
      return;
    }
    const data = await readJson<{ user: SessionUser | null }>(res);
    setUser(data.user);
  }, []);

  useEffect(() => {
    // Initial session read happens via a client fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await readError(res);
        throw new Error(data.error ?? "Invalid email or password.");
      }
      await refresh();
    },
    [refresh]
  );

  const signup = useCallback(
    async (input: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await readError(res);
        throw new Error(data.error ?? "Unable to create account.");
      }
      await refresh();
    },
    [refresh]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    setUser(null);
  }, []);

  const loading = user === undefined;

  const value = useMemo<AuthContextValue>(
    () => ({ user: user ?? null, loading, refresh, login, signup, logout }),
    [user, loading, refresh, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
