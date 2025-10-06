"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "../lib/authClient";
import { useRouter } from "next/navigation";

type Session = any;
const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    function refreshSession() {
      authClient.getSession().then(setSession);
    }
    refreshSession();
    window.addEventListener("auth:changed", refreshSession);
    return () => window.removeEventListener("auth:changed", refreshSession);
  }, []);

  const isAdmin = session?.user?.isAdmin || false;

  async function handleSignOut() {
    await authClient.signOut();
    setSession(null);
    router.push("/");
  }

  console.log("Session in navbar:", session); // Debug log

  return (
    <nav>
      <ul>
        <li className="brand-icon">
          <Link href={session && session.data ? "/home" : "/"}>
            {/* // Remove the import line for SifthrLogo */}
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
        {session && session.data && (
          <>
            {isAdmin && (
              <li>
                <Link className="nav-link" id="adminButton" href="/admin">
                  Add Content
                </Link>
              </li>
            )}
            <li>
              <Link
                className="nav-link"
                href="/features/learning-module/pages/modules.php"
              >
                Modules
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href="/features/quizzes/pages/quizzes.php"
              >
                Quizzes
              </Link>
            </li>
          </>
        )}

        <li>
          <Link className="nav-link" href="quizzes.php">
            Latest News
          </Link>
        </li>
        <li>
          <Link className="nav-link" href="quizzes.php">
            Support
          </Link>
        </li>
        {/* <!-- <li>
      <a href="#" id="dark-mode" className="nav-link">Dark Mode</a>
    </li> --> */}

        {session && session.data && (
          <li id="user-icon" className="relative">
            <Image
              src="/assets/images/userIcon.png"
              alt="User Profile"
              width={70}
              height={70}
              className="cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
