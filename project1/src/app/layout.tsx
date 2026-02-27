import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NEXTJS",
  description: "My Next.js App",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        {/* Navbar */}
        <header className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Fun app</h1>
            <nav className="space-x-4">
              <Link href="/profile" className="hover:text-blue-600">
                Profile
              </Link>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link href="/signup" className="hover:text-blue-600">
                Signup
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-10">
          <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Docs app. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}