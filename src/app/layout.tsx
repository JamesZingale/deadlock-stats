import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeadLox",
  description: "Deadlock Player Stats Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-black`}>
        {/* Header */}
        <header className="w-full bg-gray-300 p-4 flex flex-col">
          {/* Title top-left */}
          <h1 className="text-2xl font-bold text-black">DeadLox</h1>
          {/* Nav links below, centered */}
          <nav className="flex justify-end w-full gap-6 mt-2 text-black">
            <Link href="/">Home</Link>
            <Link href="/heroes">Heroes</Link>
            <Link href="/leaderboard">Leaderboard</Link>
          </nav>
        </header>

        {/* Page content */}
        <main className="relative min-h-screen p-8 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
