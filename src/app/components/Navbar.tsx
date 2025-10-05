"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "../lib/auth";
import { signOut } from "@/app/lib/actions/auth-actions";
import { useRouter } from "next/navigation";

type Session = typeof auth.$Infer.Session;

const Navbar = ({ session }: { session: Session | null }) => {
  const isAdmin = session?.user?.isAdmin || false;

  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <nav>
      <ul>
        <li className="brand-icon">
          <Link href="/">
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
          <Link className="nav-link" href="/features/quizzes/pages/quizzes.php">
            Quizzes
          </Link>
        </li>
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

        {session && (
          <li id="user-icon">
                <Image
                  src="/assets/images/userIcon.png"
                  alt=""
                  width={70}
                  height={70}
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                />
                <div className="dropdown-menu">
                  <div className="dropdown-item"></div>
                  <Link href="/profile">
                    Profile
                  </Link>
                  <Link
                    onClick={handleSignOut}
                    href="#"
                  >
                    Sign Out
                  </Link>
            </div>
          </li>
        )}
      </ul>
      <div className="backdrop"></div>
    </nav>
  );
};

export default Navbar;
