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
import { Menu } from "@mantine/core";
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
  CameraIcon,
} from "@heroicons/react/24/outline";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { isGuest, refreshGuestStatus } = useGuestMode();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
                href="/camera"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <CameraIcon style={{ width: "1.25rem", height: "1.25rem" }} />
                Ad Detector
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
          <li id="user-icon">
            <Menu
              shadow="xl"
              width={260}
              position="bottom-end"
              offset={8}
              transitionProps={{ transition: 'fade-down', duration: 200 }}
              styles={{
                dropdown: {
                  backgroundColor: 'var(--card-bg)',
                  border: '2px solid var(--purple)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '4px 0',
                  overflow: 'hidden',
                },
                item: {
                  borderRadius: '0',
                  padding: '12px 20px',
                  margin: '0',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text)',
                  transition: 'all 0.2s ease',
                  '&[data-hovered]': {
                    backgroundColor: 'var(--card-bg-highlight)',
                  },
                },
                divider: {
                  borderColor: 'var(--border-color)',
                  margin: '8px 0',
                },
              }}
            >
              <Menu.Target>
                <div style={{ position: "relative", cursor: "pointer" }}>
                  <Image
                    src={user?.profile_picture_url || "/assets/images/userIcon.png"}
                    alt={isGuest ? "Guest User" : "User Profile"}
                    width={70}
                    height={70}
                    className="user-profile-image"
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
              </Menu.Target>

              <Menu.Dropdown>
                {/* Streak or Guest Badge */}
                {loggedIn && streak > 0 && (
                  <>
                    <div style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                            borderRadius: '12px',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FireIcon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text)' }}>
                            {streak} Day Streak
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Keep it up! 🔥
                          </div>
                        </div>
                      </div>
                    </div>
                    <Menu.Divider />
                  </>
                )}

                {isGuest && (
                  <>
                    <div style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            background: 'linear-gradient(135deg, var(--purple), var(--blue))',
                            borderRadius: '12px',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: '1.5rem' }}>🎭</span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text)' }}>
                            Guest Mode
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Exploring AdEducate
                          </div>
                        </div>
                      </div>
                    </div>
                    <Menu.Divider />
                  </>
                )}

                {/* Menu Items */}
                <Menu.Item
                  component={Link}
                  href={isGuest ? "/guest-profile" : "/profile"}
                  leftSection={<UserCircleIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--purple)' }} />}
                >
                  Profile
                </Menu.Item>

                <Menu.Item
                  component={Link}
                  href="/settings"
                  leftSection={<Cog6ToothIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--purple)' }} />}
                >
                  Settings
                </Menu.Item>

                <Menu.Divider />

                {/* Sign Out / Exit Guest Mode */}
                <Menu.Item
                  onClick={isGuest ? handleExitGuestMode : signout}
                  leftSection={<ArrowRightOnRectangleIcon style={{ width: '1.25rem', height: '1.25rem' }} />}
                  styles={{
                    item: {
                      color: 'var(--red)',
                      '&[data-hovered]': {
                        backgroundColor: 'rgba(235, 102, 102, 0.1)',
                      },
                    },
                  }}
                >
                  {isGuest ? "Exit Guest Mode" : "Sign Out"}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </li>
        )}
      </ul>
      <div className="backdrop"></div>
    </nav>
  );
};

export default Navbar;
