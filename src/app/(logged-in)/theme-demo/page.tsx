"use client";

import React from "react";
import MediumCard from "@/app/components/MediumCard";
import ThemeToggle from "@/app/components/ThemeToggle";
import { useTheme } from "@/app/context/ThemeContext";
import styles from "./theme-demo.module.css";

export default function ThemeDemoPage() {
  const { theme } = useTheme();

  return (
    <div className={styles.demoWrapper}>
      <div className={styles.header}>
        <h1>Theme Demo</h1>
        <p>Showcase of the AdEducate color scheme in {theme} mode</p>
        <ThemeToggle showLabel={true} />
      </div>

      <div className={styles.grid}>
        {/* Color Palette */}
        <MediumCard>
          <h2>Primary Colors</h2>
          <div className={styles.colorGrid}>
            <div className={styles.colorSwatch}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: "var(--bg)" }}
              ></div>
              <span>Background</span>
              <code>var(--bg)</code>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: "var(--text)" }}
              ></div>
              <span>Text</span>
              <code>var(--text)</code>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: "var(--card-bg)" }}
              ></div>
              <span>Card Background</span>
              <code>var(--card-bg)</code>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: "var(--border-color)" }}
              ></div>
              <span>Border</span>
              <code>var(--border-color)</code>
            </div>
          </div>
        </MediumCard>

        {/* Accent Colors */}
        <MediumCard>
          <h2>Accent Colors</h2>
          <div className={styles.colorGrid}>
            <div className={styles.colorSwatch}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: "var(--lime)" }}
              ></div>
              <span>Lime</span>
              <code>var(--lime)</code>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: "var(--purple)" }}
              ></div>
              <span>Purple</span>
              <code>var(--purple)</code>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: "var(--blue)" }}
              ></div>
              <span>Blue</span>
              <code>var(--blue)</code>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: "var(--yellow)" }}
              ></div>
              <span>Yellow</span>
              <code>var(--yellow)</code>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: "var(--red)" }}
              ></div>
              <span>Red</span>
              <code>var(--red)</code>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: "var(--green)" }}
              ></div>
              <span>Green</span>
              <code>var(--green)</code>
            </div>
          </div>
        </MediumCard>

        {/* Typography */}
        <MediumCard>
          <h2>Typography</h2>
          <div className={styles.typography}>
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>
              This is a paragraph with regular text. The quick brown fox jumps
              over the lazy dog.
            </p>
            <p style={{ color: "var(--text-secondary)" }}>
              This is secondary text with reduced opacity.
            </p>
            <a href="#" className="nav-link">
              This is a navigation link
            </a>
          </div>
        </MediumCard>

        {/* Buttons */}
        <MediumCard>
          <h2>Buttons</h2>
          <div className={styles.buttonDemo}>
            <button className="custom-button">Custom Button</button>
            <button
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                color: "var(--text)",
                cursor: "pointer",
              }}
            >
              Standard Button
            </button>
            <button
              style={{
                backgroundColor: "var(--purple)",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                color: "white",
                cursor: "pointer",
              }}
            >
              Purple Button
            </button>
          </div>
        </MediumCard>

        {/* Cards */}
        <MediumCard>
          <h2>Card Examples</h2>
          <div className={styles.cardExample}>
            <div
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <h3>Regular Card</h3>
              <p>This is a standard card with border.</p>
            </div>
            <div
              style={{
                backgroundColor: "var(--card-bg-highlight)",
                border: "1px solid var(--border-color)",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <h3>Highlighted Card</h3>
              <p>This card uses the highlight background.</p>
            </div>
          </div>
        </MediumCard>

        {/* Theme Info */}
        <MediumCard>
          <h2>Current Theme Info</h2>
          <div className={styles.themeInfo}>
            <p>
              <strong>Active Theme:</strong> {theme}
            </p>
            <p>
              <strong>Mode:</strong>{" "}
              {theme === "light" ? "Light Mode" : "Dark Mode"}
            </p>
            <p>
              <strong>Primary Background:</strong>{" "}
              {theme === "light" ? "#ffffff (White)" : "#1a1a1a (Near-Black)"}
            </p>
            <p>
              <strong>Text Color:</strong>{" "}
              {theme === "light" ? "#1a1a1a (Near-Black)" : "#ffffff (White)"}
            </p>
          </div>
        </MediumCard>
      </div>
    </div>
  );
}
