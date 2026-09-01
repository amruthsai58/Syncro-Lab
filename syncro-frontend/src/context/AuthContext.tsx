import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { MOCK_USER } from '../data/mockData';

// ─── Auth Context (Identity-Lite — name-only entry) ───────────────────────
// Pattern: Factory (profile creation) + Repository (lookup) + Singleton (context)

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  enterWithName: (name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'syncro_token';
const USER_KEY = 'syncro_user';
const API_BASE = 'http://localhost:3001/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Factory pattern: POST /api/identity/enter → creates or looks up profile → JWT
  const enterWithName = useCallback(async (name: string) => {
    setIsLoading(true);
    try {
      const deviceKey = getOrCreateDeviceKey();
      const res = await fetch(`${API_BASE}/identity/enter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, deviceKey }),
      });
      if (!res.ok) throw new Error('Failed to enter');
      const data = await res.json();
      const { token: jwt, user: profile } = data;
      localStorage.setItem(TOKEN_KEY, jwt);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
      setToken(jwt);
      setUser(profile);
    } catch {
      // Fallback: offline/demo mode with mock user
      const mockProfile = { ...MOCK_USER, displayName: name };
      const fakeToken = `demo_${Date.now()}`;
      localStorage.setItem(TOKEN_KEY, fakeToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockProfile));
      setToken(fakeToken);
      setUser(mockProfile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, enterWithName, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ─── Device Key Utility ───────────────────────────────────────────────────

function getOrCreateDeviceKey(): string {
  const KEY = 'syncro_device_key';
  let key = localStorage.getItem(KEY);
  if (!key) {
    key = `dev_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
    localStorage.setItem(KEY, key);
  }
  return key;
}
