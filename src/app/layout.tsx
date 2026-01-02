import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BgBlob from "./components/BgBlob";
import NotificationProvider from "./components/NotificationProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import CookieConsent from "./components/CookieConsent/CookieConsent";
import FirstTimeVisitor from "./components/FirstTimeVisitor/FirstTimeVisitor";
import { NextStepProvider, NextStep } from "nextstepjs";
import type { Tour } from "nextstepjs";
import VisualNovelCard from "./components/NextStepCard/VisualNovelCard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font--inter",
});

export const metadata: Metadata = {
  title: "Sifthr",
  description: "Learning module against scams",
};

// Define tour steps
const steps: Tour[] = [
  {
    tour: "firstVisitTour",
    steps: [
      {
        icon: <>👋</>,
        title: "Welcome to Sifthr!",
        content: (
          <>
            Hi there! I&apos;m your guide. Let me show you around and help you
            get started with learning about scam prevention.
          </>
        ),
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>📚</>,
        title: "Learning Modules",
        content: (
          <>
            This is where you&apos;ll find all our interactive learning modules
            to help you identify and avoid scams. Click through to start
            learning!
          </>
        ),
        selector: ".app-main",
        side: "top",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
    ],
  },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <LanguageProvider>
          <NotificationProvider>
            <NextStepProvider>
              <NextStep steps={steps} cardComponent={VisualNovelCard}>
                <FirstTimeVisitor>
                  <Navbar />
                  <BgBlob />
                  <main className="app-main">
                    <div className="container">{children}</div>
                  </main>
                  <Footer />
                  <CookieConsent />
                </FirstTimeVisitor>
              </NextStep>
            </NextStepProvider>
          </NotificationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
