"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GeakMark, cn } from "@geaklabs/ui";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/posts", label: "Posts" },
  { href: "/categories", label: "Categories" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/services", label: "What I do" },
  { href: "/copy", label: "Site copy" },
];

export function Sidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-ink-200 bg-paper">
      <div className="flex h-16 items-center gap-2.5 border-b border-ink-100 px-6">
        <GeakMark gradient className="h-6 w-6" />
        <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink-900">
          Studio
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 font-display text-sm transition-colors",
                active
                  ? "bg-ink-900 text-paper"
                  : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-100 p-3">
        <p className="px-3 pb-2 font-display text-xs text-ink-400">{userName ?? "Admin"}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-lg px-3 py-2 text-left font-display text-sm text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
