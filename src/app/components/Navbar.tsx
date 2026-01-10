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
import ThemeToggle from "@/app/components/ThemeToggle";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  FireIcon,
  PlusCircleIcon,
  AcademicCapIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { isGuest, refreshGuestStatus } = useGuestMode();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

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
          // Fetch streak
          try {
            const response = await fetch("/api/streaks/current");
            if (response.ok) {
              const data = await response.json();
              setStreak(data.streak?.current_streak || 0);
            }
          } catch (error) {
            console.error("Error fetching streak:", error);
          }
        }
      } else {
        // No user logged in
        setUser(null);
      }

      setIsLoading(false);
    };

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
  }, [refreshGuestStatus]);

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
              alt="AdEducate Logo"
              width={100}
              height={40}
            />
            <h1>
              Ad<span>Educate</span>
            </h1>
          </Link>
        </li>

        {/* Show navigation for both logged in users AND guests */}
        {!isLoading && (loggedIn || isGuest) && (
          <>
            {isAdmin && (
              <li>
                <Link
                  className="nav-link"
                  id="adminButton"
                  href="/admin"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <PlusCircleIcon
                    style={{ width: "1.25rem", height: "1.25rem" }}
                  />
                  Add Content
                </Link>
              </li>
            )}
            <li>
              <Link
                className="nav-link"
                href="/learning-modules"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AcademicCapIcon
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
                Modules
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href="/quizzes"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <ClipboardDocumentListIcon
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
                Quizzes
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href="/latest-news"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <NewspaperIcon
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
                Latest News
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href="/support"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <QuestionMarkCircleIcon
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
                Support
              </Link>
            </li>
          </>
        )}

        {/* For non-logged in users (not guests), show only public pages */}
        {!isLoading && !loggedIn && !isGuest && (
          <>
            <li>
              <Link
                className="nav-link"
                href="/latest-news"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <NewspaperIcon
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
                Latest News
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href="/support"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <QuestionMarkCircleIcon
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
                Support
              </Link>
            </li>
          </>
        )}

        {/* Theme Toggle - Shows for everyone */}
        {!isLoading && (
          <li>
            <ThemeToggle />
          </li>
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
              <div
                className="absolute right-0 mt-2 w-56 rounded-md shadow-lg z-50"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="py-1">
                  {/* For authenticated users - show streak */}
                  {loggedIn && streak > 0 && (
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <FireIcon
                          style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            color: "#ff6b35",
                          }}
                        />
                        <div>
                          <div
                            className="font-bold"
                            style={{ color: "var(--text)" }}
                          >
                            {streak} Day Streak
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* For guests - show guest notice */}
                  {isGuest && (
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-2xl">🎭</span>
                        <div>
                          <div
                            className="font-bold"
                            style={{ color: "var(--text)" }}
                          >
                            Guest Mode
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Link
                    href={isGuest ? "/guest-profile" : "/profile"}
                    className="block px-4 py-2 text-sm transition-colors"
                    style={{
                      color: "var(--text)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--card-bg-highlight)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <UserCircleIcon
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm transition-colors"
                    style={{
                      color: "var(--text)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--card-bg-highlight)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Cog6ToothIcon
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                    Settings
                  </Link>

                  {/* Different bottom action for guests vs authenticated users */}
                  {isGuest ? (
                    <button
                      onClick={handleExitGuestMode}
                      className="block w-full text-left px-4 py-2 text-sm transition-colors"
                      style={{
                        color: "var(--text)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--card-bg-highlight)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <ArrowRightOnRectangleIcon
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      />
                      Exit Guest Mode
                    </button>
                  ) : (
                    <button
                      onClick={signout}
                      className="block w-full text-left px-4 py-2 text-sm transition-colors"
                      style={{
                        color: "var(--text)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--card-bg-highlight)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <ArrowRightOnRectangleIcon
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      />
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
