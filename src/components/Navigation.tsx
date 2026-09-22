"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Scorer" },
  { href: "/batch", label: "Batch" },
  { href: "/about", label: "Methodology" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 border border-gold flex items-center justify-center">
            <span className="text-gold font-serif text-sm font-bold leading-none">C</span>
          </div>
          <span className="font-serif text-white text-base tracking-wide group-hover:text-gold transition-colors">
            Caprae Scoring Engine
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "text-gold border-b border-gold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
