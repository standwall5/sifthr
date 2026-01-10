"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/solid";

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();

  // Don't show breadcrumbs on home or root pages
  if (!pathname || pathname === "/" || pathname === "/home") {
    return null;
  }

  // Split the pathname into segments
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Create breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      href,
      label,
      isLast: index === pathSegments.length - 1,
    };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        padding: "1rem 0",
        marginTop: "-6rem",
        marginBottom: "2rem",
        backgroundColor: "var(--bg)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        <ol
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            listStyle: "none",
          }}
        >
          {/* Home link */}
          <li style={{ display: "flex", alignItems: "center" }}>
            <Link
              href="/home"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--purple)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              <HomeIcon style={{ width: "1rem", height: "1rem" }} />
              <span>Home</span>
            </Link>
          </li>

          {/* Breadcrumb trail */}
          {breadcrumbItems.map((item) => (
            <li
              key={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ChevronRightIcon
                style={{
                  width: "1rem",
                  height: "1rem",
                  color: "var(--text-secondary)",
                  opacity: 0.5,
                }}
              />
              {item.isLast ? (
                <span
                  style={{
                    color: "var(--text)",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  style={{
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--purple)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
