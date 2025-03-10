import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header with logo and title */}
        <header className="bg-blue-600 text-white py-4 shadow-lg">
          <div className="container mx-auto flex items-center space-x-4">
            {/* Logo */}
            <img
              src="/CS4227-Fit-to-Go/images/icon512.png"
              alt="Fit to Go Logo"
              className="h-12 w-12"
            />
            {/* Title */}
            <h1 className="text-3xl font-bold">Fit to Go</h1>
          </div>
        </header>
        {/* Main content */}
        <main className="container mx-auto mt-4">{children}</main>
      </body>
    </html>
  );
}
