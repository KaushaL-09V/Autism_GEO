/**
 * AuthContext — Session Management
 * Provides login, signup, logout + user state across the app.
 * Uses localStorage for persistence (no backend auth required).
 */

import React, { createContext, useContext, useState, useCallback } from "react";

export interface User {
  name: string;
  email: string;
  institution?: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, institution: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "autism_predictor_user";

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(loadUser);

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 800));
    // In production, validate against backend. For now, accept any non-empty creds.
    if (!email) throw new Error("Invalid credentials");

    // Try to restore a previously registered user
    const stored = loadUser();
    const resolvedUser: User = stored?.email === email
      ? stored
      : {
          name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          role: "Researcher",
        };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(resolvedUser));
    setUser(resolvedUser);
  }, []);

  const signup = useCallback(async (name: string, institution: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 900));
    if (!email || !name) throw new Error("Required fields missing");

    const newUser: User = { name, email, institution, role: "Researcher" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
