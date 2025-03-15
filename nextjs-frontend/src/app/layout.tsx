import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fit to Go",
  description: "Social Interaction Module",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <header className="bg-blue-600 text-white py-4 shadow-lg">
          <div className="container mx-auto flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/CS4227-Fit-to-Go/images/icon512.png"
                alt="Fit to Go Logo"
                className="h-12 w-12"
              />
              <h1 className="text-3xl font-bold">Fit to Go</h1>
            </Link>
          </div>
        </header>
        <main className="container mx-auto mt-4">
          <div className="bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 p-4 mb-4">
            Note: Back-end doesn't work on GitHub Pages but works fully when hosted through Docker locally.
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
