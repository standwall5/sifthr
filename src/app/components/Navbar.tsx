"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session, User as SupabaseAuthUser } from "@supabase/supabase-js";
import { supabase } from "@/app/lib/supabaseClient";

// Minimal app user shape for admin checks
type AppUser = {
  is_admin: boolean;
};

// Theme handling
type Theme = "light" | "dark";

// These should mirror the CSS variables in globals.css
const lightThemeVars: Record<string, string> = {
  "--bg": "#f5f5dc",
  "--text": "#141414",
  "--nav": "rgba(166, 226, 110, 0.322)",
  "--lime": "rgb(200, 229, 36)",
  "--blue": "rgb(131, 165, 240)",
  "--purple": "rgb(153, 85, 235)",
  "--yellow": "rgb(237, 183, 77)",
  "--red": "rgb(235, 102, 102)",
  "--green": "rgb(111, 177, 138)",
  // Optional extras used in dark theme; keep defaults for light
  "--box": "#ffffff",
  "--box-bg": "#ffffff",
  "--card-bg": "#ffffff",
  "--card-bg-highlight": "#ffffff",
};

const darkThemeVars: Record<string, string> = {
  "--bg": "#16101b",
  "--text": "#ffffff",
  "--nav": "rgba(66, 61, 112, 0.322)",
  "--lime": "rgb(200, 229, 36)",
  "--blue": "rgb(131, 165, 240)",
  "--purple": "rgb(153, 85, 235)",
  "--yellow": "rgb(237, 183, 77)",
  "--red": "rgb(235, 102, 102)",
  "--green": "rgb(111, 177, 138)",
  "--box": "#352a3d",
  "--box-bg": "#160a20",
  "--card-bg": "#25192e",
  "--card-bg-highlight": "#402641",
};

function applyTheme(theme: Theme) {
  const vars = theme === "dark" ? darkThemeVars : lightThemeVars;
  const root = document.documentElement;

  // Set an attribute for possible CSS hooks; not strictly required
  root.setAttribute("data-theme", theme);

  // Apply CSS variables inline for immediate effect (no refresh)
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function getInitialTheme(): Theme {
  // Respect persisted preference first
  const saved =
    typeof window !== "undefined" ? localStorage.getItem("theme") : null;
  if (saved === "light" || saved === "dark") return saved;

  // Fallback to system preference
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

const Navbar: React.FC = () => {
  const router = useRouter();

  // Auth state
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // UI state
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Theme state
  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  const loggedIn = useMemo(() => !!session?.user, [session]);

  // Initialize theme and listen to changes
  useEffect(() => {
    // Apply initial theme immediately
    applyTheme(theme);

    // Persist preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync theme when opening in new tabs (optional)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const value = e.newValue;
        if (value === "light" || value === "dark") {
          setTheme(value);
          applyTheme(value);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Supabase auth state handling
  useEffect(() => {
    let isMounted = true;

    const refreshSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(data.session ?? null);
    };

    // Initial load
    refreshSession();

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, _session) => {
        setSession(_session ?? null);
        // Broadcast to other listeners in the app
        window.dispatchEvent(new Event("auth:changed"));
      },
    );

    // Also respond to custom events from other components
    const onAuthChanged = () => refreshSession();
    window.addEventListener("auth:changed", onAuthChanged);

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
      window.removeEventListener("auth:changed", onAuthChanged);
    };
  }, []);

  // Load app user (for admin flag) when session changes
  useEffect(() => {
    let cancelled = false;

    const loadAdminFlag = async (authUser: SupabaseAuthUser) => {
      const { data, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("auth_id", authUser.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean((data as AppUser).is_admin));
      }
    };

    if (session?.user) {
      loadAdminFlag(session.user);
    } else {
      setIsAdmin(false);
    }

    return () => {
      cancelled = true;
    };
  }, [session]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    window.dispatchEvent(new Event("auth:changed"));
    router.push("/");
  }

  function toggleTheme() {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      // Persist and apply immediately handled by useEffect
      return next;
    });
  }

  return (
    <nav>
      <ul>
        <li className="brand-icon">
          <Link href={loggedIn ? "/home" : "/"}>
            <Image
              src="/assets/images/logoModuleFinal.png"
              alt="Sifthr Logo"
              width={100}
              height={40}
            />
            <h1>
              Sif<span>thr</span>
            </h1>
          </Link>
        </li>

        {loggedIn && (
          <>
            {isAdmin && (
              <li>
                <Link className="nav-link" id="adminButton" href="/admin">
                  Add Content
                </Link>
              </li>
            )}
            <li>
              <Link className="nav-link" href="/learning-modules">
                Modules
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/quizzes">
                Quizzes
              </Link>
            </li>
          </>
        )}

        <li>
          <Link className="nav-link" href="/latest-news">
            Latest News
          </Link>
        </li>
        <li>
          <Link className="nav-link" href="/support">
            Support
          </Link>
        </li>

        {/* Theme toggle */}
        <li>
          <button
            type="button"
            className="nav-link"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </li>

        {loggedIn && (
          <li id="user-icon" className="relative">
            <Image
              src="/assets/images/userIcon.png"
              alt="User Profile"
              width={70}
              height={70}
              className="cursor-pointer"
              onClick={() => setIsDropdownOpen((o) => !o)}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </li>
        )}
      </ul>
      <div className="backdrop"></div>
    </nav>
  );
};

export default Navbar;
