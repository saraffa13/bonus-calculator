import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Silver Cross Bonus Calculator",
  description: "Calculate effective per-unit price for Buy X Get Y Free deals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Silver Cross Bonus Calculator
            </Link>
            <nav className="flex gap-1 text-sm">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
              >
                Calculator
              </Link>
              <Link
                href="/history"
                className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
              >
                History
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
