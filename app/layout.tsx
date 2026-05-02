import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/TopNav";

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
      <body className="bg-background min-h-screen text-on-background antialiased">
        <TopNav />
        <main className="max-w-container_max_width mx-auto px-gutter py-section_margin flex flex-col gap-stack_gap">
          {children}
        </main>
      </body>
    </html>
  );
}
