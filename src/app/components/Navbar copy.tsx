"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FireIcon } from "@heroicons/react/24/outline";
import { User } from "@/lib/models/types";
import { signout } from "@/lib/auth-actions";
import { createClient } from "@/utils/supabase/client";

interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const supabase = createClient();

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

  useEffect(() => {
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

    // Fetch on mount
    fetchUser();

    // Listen for auth state changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // User logged in - refetch user data
        fetchUser();
      } else {
        // User logged out - clear user data
        setUser(null);
        setStreak(0);
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loggedIn = !!user;
  const isAdmin = user?.is_admin || false;

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
              src={user.profile_picture_url || "/assets/images/userIcon.png"}
              alt="User Profile"
              width={70}
              height={70}
              className="cursor-pointer user-profile-image"
              onClick={() => setIsDropdownOpen((o) => !o)}
              style={{ borderRadius: "50%", border: "2px solid var(--purple)" }}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border dark:border-gray-700">
                <div className="py-1">
                  {streak > 0 && (
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm">
                        <FireIcon className="w-6 h-6 text-orange-500" />
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
                    onClick={signout}
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
