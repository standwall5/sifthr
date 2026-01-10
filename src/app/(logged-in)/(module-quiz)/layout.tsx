import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

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
