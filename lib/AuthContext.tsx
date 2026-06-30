/**
 * Auth context for Investra.
 *
 * - Uses Firebase Google Sign-In when configured (NEXT_PUBLIC_FIREBASE_* set).
 * - Falls back to an anonymous/guest session when Firebase is not configured.
 * - Stores user in localStorage so session persists across page navigations.
 * - Exposes: user, isLoading, signIn, signOut, isAuthenticated
 */
"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  signInWithGoogle as firebaseSignIn,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  isFirebaseReady,
  getFirebaseAuth,
  type User,
} from "@/lib/firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  /** true once the client has read localStorage — use this to suppress
   * auth-dependent UI during SSR to avoid the hydration mismatch. */
  hydrated: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "investra_auth_user";

function persist(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
  window.dispatchEvent(new Event("investra-auth-change"));
}

function readStored(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function toAuthUser(u: User): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // On the server, user is always null and hydrated is always false.
  // We deliberately initialise with null (not readStored()) so the server
  // and client start with the same value, eliminating the hydration mismatch.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(isFirebaseReady);

  useEffect(() => {
    // First effect: read localStorage so client matches persisted state.
    const stored = readStored();
    if (stored) setUser(stored);
    setHydrated(true);

    if (!isFirebaseReady) {
      setIsLoading(false);
      return;
    }

    // Firebase is configured — subscribe to real auth state.
    let unsub: (() => void) | undefined;
    try {
      const auth = getFirebaseAuth();
      unsub = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const authUser = toAuthUser(firebaseUser);
          setUser(authUser);
          persist(authUser);
        } else {
          setUser(null);
          persist(null);
        }
        setIsLoading(false);
      });
    } catch {
      setIsLoading(false);
    }

    return () => unsub?.();
  }, []);

  // Keep in sync across tabs
  useEffect(() => {
    const onChange = () => setUser(readStored());
    window.addEventListener("investra-auth-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("investra-auth-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const signIn = useCallback(async () => {
    if (!isFirebaseReady) {
      throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* to your .env file.");
    }
    const firebaseUser = await firebaseSignIn();
    const authUser = toAuthUser(firebaseUser);
    setUser(authUser);
    persist(authUser);

    // Sync Firebase user to Supabase users table (fire and forget)
    fetch("/api/auth/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid:         authUser.uid,
        email:       authUser.email,
        displayName: authUser.displayName,
        photoURL:    authUser.photoURL,
      }),
    }).catch(() => {}); // silent — non-blocking
  }, []);

  const handleSignOut = useCallback(async () => {
    await firebaseSignOut();
    setUser(null);
    persist(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      hydrated,
      isAuthenticated: Boolean(user),
      signIn,
      signOut: handleSignOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
