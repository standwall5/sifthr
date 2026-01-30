import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { HandRaisedIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import "./globals.css";
import Navbar from "./components/Navbar";
import Breadcrumbs from "./components/Breadcrumbs";
import Footer from "./components/Footer";
import BgBlob from "./components/BgBlob";
import NotificationProvider from "./components/NotificationProvider";
import Chatbot from "./components/Chatbot";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { GuestModeProvider } from "./context/GuestModeContext";
import CookieConsent from "./components/CookieConsent/CookieConsent";
import FirstTimeVisitor from "./components/FirstTimeVisitor/FirstTimeVisitor";
import { NextStepProvider, NextStep } from "nextstepjs";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Tour } from "nextstepjs";
import VisualNovelCard from "./components/NextStepCard/VisualNovelCard";
import {
  homeTour,
  moduleTour,
  quizTour,
  profileTour,
  chatbotTour,
} from "./lib/tours";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "AdEducate",
  description:
    "E-learning platform to identify fake social media advertisements",
};

// Define tour steps - combine all tours
const steps: Tour[] = [
  homeTour,
  moduleTour,
  quizTour,
  profileTour,
  chatbotTour,
  {
    tour: "firstVisitTour",
    steps: [
      {
        icon: <HandRaisedIcon className="w-6 h-6" />,
        title: "Welcome to AdEducate!",
        content: (
          <>
            Hi there! I&apos;m your guide. Let me show you around and help you
            get started with learning about spotting fake advertisements.
          </>
        ),
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <BookOpenIcon className="w-6 h-6" />,
        title: "Learning Modules",
        content: (
          <>
            This is where you&apos;ll find all our interactive learning modules
            to help you identify and avoid fake ads. Click through to start
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
        className={`${ibmPlexSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LanguageProvider>
            <GuestModeProvider>
              <NotificationProvider>
                <MantineProvider>
                  <NextStepProvider>
                    <NextStep steps={steps} cardComponent={VisualNovelCard}>
                      <FirstTimeVisitor>
                        <Navbar />
                        <BgBlob />
                        <Breadcrumbs />
                        <main className="app-main">
                          <div className="container">{children}</div>
                        </main>
                        <Footer />
                        <CookieConsent />
                        <Chatbot />
                      </FirstTimeVisitor>
                    </NextStep>
                  </NextStepProvider>
                </MantineProvider>
              </NotificationProvider>
            </GuestModeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
