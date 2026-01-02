"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import {
  getCachedAdminStatus,
  fetchAndCacheAdminStatus,
  signOutUser,
} from "@/app/lib/authActions";

interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();

  // Auth state
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // UI state
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  // Fetch user streak
  const fetchStreak = async () => {
    try {
      const response = await fetch("/api/streaks/current");
      if (response.ok) {
        const data = await response.json();
        setStreak(data.streak?.current_streak || 0);
      }
    } catch (error) {
      console.error("Error fetching streak:", error);
    }
  };

  // Check auth status on mount only
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setLoggedIn(true);
        fetchStreak();

        // Check admin status
        const cachedAdmin = getCachedAdminStatus();
        if (cachedAdmin !== null) {
          setIsAdmin(cachedAdmin);
        }

        const isAdminStatus = await fetchAndCacheAdminStatus(user.id);
        setIsAdmin(isAdminStatus);
      } else {
        setLoggedIn(false);
        setIsAdmin(false);
      }

      setIsLoading(false);
    };

    checkAuth();

    // Listen ONLY for custom events (not Supabase auth changes)
    const onAuthChanged = () => checkAuth();
    window.addEventListener("auth:changed", onAuthChanged);

    return () => {
      window.removeEventListener("auth:changed", onAuthChanged);
    };
  }, []);

  async function handleSignOut() {
    try {
      setIsDropdownOpen(false);
      await signOutUser();

      // Update local state immediately
      setLoggedIn(false);
      setIsAdmin(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
      router.push("/");
    }
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

        {!isLoading && loggedIn && (
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

        {!isLoading && loggedIn && (
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
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border dark:border-gray-700">
                <div className="py-1">
                  {streak > 0 && (
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-2xl">🔥</span>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {streak} Day Streak
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
