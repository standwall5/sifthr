"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/lib/models/types";
import { signout } from "@/lib/auth-actions";
import { supabase } from "@/app/lib/supabaseClient";
import { clearGuestData } from "@/app/lib/guestService";
import { useGuestMode } from "@/app/context/GuestModeContext";

interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const { isGuest, refreshGuestStatus } = useGuestMode();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const fetchUser = async () => {
    // Get Supabase auth user
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      // Fetch your app's user data from the database
      const { data: appUser } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", authUser.id)
        .single();

      if (appUser) {
        setUser(appUser);
        fetchStreak();
      }
    } else {
      // No user logged in
      setUser(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // Initial fetch
    fetchUser();

    // Listen for auth state changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // User logged in - refetch user data
        fetchUser();
        refreshGuestStatus();
      } else {
        // User logged out - clear user data
        setUser(null);
        setStreak(0);
        setIsLoading(false);
        refreshGuestStatus();
      }
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleExitGuestMode = () => {
    clearGuestData();
    setIsDropdownOpen(false);
    refreshGuestStatus();
    router.push("/");
  };

  const loggedIn = !!user;
  const isAdmin = user?.is_admin || false;

  return (
    <nav>
      <ul>
        <li className="brand-icon">
          <Link href={loggedIn || isGuest ? "/home" : "/"}>
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

        {/* Show navigation for both logged in users AND guests */}
        {!isLoading && (loggedIn || isGuest) && (
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
          </>
        )}

        {/* For non-logged in users (not guests), show only public pages */}
        {!isLoading && !loggedIn && !isGuest && (
          <>
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
          </>
        )}

        {/* User Icon - Shows for both logged in users and guests */}
        {!isLoading && (loggedIn || isGuest) && (
          <li id="user-icon" className="relative">
            <div style={{ position: "relative" }}>
              <Image
                src={user?.profile_picture_url || "/assets/images/userIcon.png"}
                alt={isGuest ? "Guest User" : "User Profile"}
                width={70}
                height={70}
                className="cursor-pointer user-profile-image"
                onClick={() => setIsDropdownOpen((o) => !o)}
                style={{
                  borderRadius: "50%",
                  border: `2px solid var(--purple)`,
                }}
              />
              {/* Guest Mode Badge */}
              {isGuest && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    fontSize: "1.2rem",
                    background: "white",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  🎭
                </span>
              )}
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border dark:border-gray-700">
                <div className="py-1">
                  {/* For authenticated users - show streak */}
                  {loggedIn && streak > 0 && (
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

                  {/* For guests - show guest notice */}
                  {isGuest && (
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-2xl">🎭</span>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            Guest Mode
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Link
                    href={isGuest ? "/guest-profile" : "/profile"}
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

                  {/* Different bottom action for guests vs authenticated users */}
                  {isGuest ? (
                    <button
                      onClick={handleExitGuestMode}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Exit Guest Mode
                    </button>
                  ) : (
                    <button
                      onClick={signout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  )}
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
