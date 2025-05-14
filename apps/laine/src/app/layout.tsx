import type { Metadata } from "next";
import { ClerkProvider, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Lato } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

const lato = Lato({
  weight: ["400", "700"],
  variable: "--font-lato",
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laine AI by AiroDental",
  description: "AiroDental Laine AI Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased`}>
          <header className="p-4 border-b flex justify-between items-center bg-background shadow-sm sticky top-0 z-50">
            <Link href="/" className="text-xl font-bold font-heading text-primary">Laine AI</Link>
            <div>
              <SignedIn><UserButton afterSignOutUrl="https://laine.prereq.xyz" /></SignedIn>
              <SignedOut>
                <a href="https://prereq.xyz/sign-in" className="text-sm font-medium text-primary hover:underline">Sign In</a>
              </SignedOut>
            </div>
          </header>
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
