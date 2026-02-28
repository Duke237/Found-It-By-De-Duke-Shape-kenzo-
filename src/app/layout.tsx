import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FindIt — Lost & Found Platform | Reunite With What Matters Most",
  description:
    "Report lost items, browse found submissions, and connect with finders in your community. AI-powered matching helps reunite thousands of items every day.",
  keywords: [
    "lost and found",
    "report lost item",
    "found items",
    "item recovery",
    "community lost found",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans bg-app text-app">{children}</body>
    </html>
  );
}
