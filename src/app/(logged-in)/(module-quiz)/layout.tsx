import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  return <div className="container">{children}</div>;
}
