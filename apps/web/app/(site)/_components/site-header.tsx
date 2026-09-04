import Link from "next/link";
import { Container, GeakMark } from "@geaklabs/ui";
import { getSiteCopy } from "@geaklabs/db";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/articles", label: "Writing" },
  { href: "/about", label: "About" },
];

export async function SiteHeader() {
  const copy = await getSiteCopy();

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md">
      <Container size="wide">
        <div className="flex h-[72px] items-center justify-between gap-6 border-b border-ink-900 lg:grid lg:grid-cols-12">
          <Link
            href="/"
            className="flex items-center gap-2.5 lg:col-span-3"
            aria-label="GEAK LABS home"
          >
            <GeakMark className="h-[22px] w-[22px]" />
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-900">
              Geak&nbsp;Labs
            </span>
          </Link>
          <span className="hidden text-[13px] text-ink-500 lg:col-span-3 lg:block">
            Olugbenga Akinduko
          </span>
          <span className="hidden text-[13px] text-ink-500 lg:col-span-3 lg:block">
            {copy["header.tagline"]}
          </span>
          <nav className="flex items-center justify-end gap-5 text-[13px] font-medium sm:gap-7 lg:col-span-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-ink-900 transition-colors hover:text-cyan-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/#contact" className="text-cyan-ink transition-colors hover:text-ink-900">
              Contact
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
