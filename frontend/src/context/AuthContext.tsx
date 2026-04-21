/**
 * AuthContext — Real API-backed auth with localStorage cache.
 * Calls /api/auth/login and /api/auth/signup on the Flask backend.
 * Falls back to offline mock if the backend is not reachable.
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { authApi, getStoredUser, clearStoredUser, setStoredUser, type ApiUser } from "../services/healthcareApi";

export type UserRole = "patient" | "doctor";

export interface User {
  id: string;          // stored as string for legacy compat; real DB id is int
  name: string;
  email: string;
  institution?: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  signup: (name: string, institution: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Convert API user (int id) → local User (string id)
function toUser(u: ApiUser): User {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    role: u.role,
    institution: u.institution,
  };
}

// Offline mock fallback
function mockUser(email: string, name: string, role: UserRole): User {
  return {
    id: `${role[0]}${Date.now().toString(36)}`,
    name,
    email,
    role,
  };
}

function loadUser(): User | null {
  try {
    // Try ApiUser shape first (from real backend)
    const raw = localStorage.getItem("autism_predictor_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Normalise: if id is number it came from the real DB
    if (typeof parsed.id === "number") return toUser(parsed as ApiUser);
    return parsed as User;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(loadUser);

  const login = useCallback(async (email: string, password: string, role: UserRole = "patient") => {
    try {
      // ── Real backend ──
      const apiUser = await authApi.login(email, password);
      const u = toUser(apiUser);
      localStorage.setItem("autism_predictor_user", JSON.stringify(apiUser)); // store raw so header can read int id
      setUser(u);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // If it's a network error → offline mock
      if (msg.includes("reach the server") || msg.includes("Network") || msg.includes("ECONNREFUSED")) {
        const stored = loadUser();
        const u = stored?.email === email
          ? { ...stored, role: stored.role ?? role }
          : mockUser(email, email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()), role);
        localStorage.setItem("autism_predictor_user", JSON.stringify(u));
        setUser(u);
        return;
      }
      // Auth error (wrong password etc) — rethrow
      throw new Error(msg);
    }
  }, []);

  const signup = useCallback(async (
    name: string,
    institution: string,
    email: string,
    password: string,
    role: UserRole = "patient",
  ) => {
    try {
      const apiUser = await authApi.signup(name, institution, email, password, role);
      const u = toUser(apiUser);
      localStorage.setItem("autism_predictor_user", JSON.stringify(apiUser));
      setUser(u);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("reach the server") || msg.includes("Network") || msg.includes("ECONNREFUSED")) {
        const u = mockUser(email, name, role);
        localStorage.setItem("autism_predictor_user", JSON.stringify({ ...u, institution }));
        setUser(u);
        return;
      }
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredUser();
    localStorage.removeItem("autism_predictor_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      userRole: user?.role ?? null,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// Re-export getStoredUser for components that need the raw int id
export { getStoredUser, setStoredUser, clearStoredUser };
