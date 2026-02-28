import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          // Set theme before hydration to avoid flashes.
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');var s=(t==='light'||t==='dark')?t:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=s;document.documentElement.style.colorScheme=s;}catch(e){}})();",
          }}
        />
      </head>
      <body className="antialiased font-sans bg-app text-app">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
