"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Calculator" },
  { href: "/history", label: "History" },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="bg-white border-b border-outline-variant shadow-sm w-full sticky top-0 z-50">
      <div className="flex justify-between items-center h-16 max-w-container_max_width mx-auto px-4 md:px-8">
        <div className="text-lg font-bold text-primary tracking-wide">
          Silver Cross Bonus Calculator
        </div>
        <nav className="flex items-center space-x-8 h-full">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "text-body-sm tracking-tight transition-colors h-full flex items-center " +
                  (active
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-on-surface-variant font-medium hover:text-primary")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
