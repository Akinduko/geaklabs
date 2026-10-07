import Link from "next/link";
import { Container } from "@geaklabs/ui";
import { getSiteCopy } from "@geaklabs/db";

export async function SiteFooter() {
  const copy = await getSiteCopy();
  // Values saved in the admin win; environment variables remain as a fallback.
  const email = copy["footer.email"] || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const linkedin = copy["footer.linkedin"] || process.env.NEXT_PUBLIC_LINKEDIN_URL;
  const github = copy["footer.github"] || process.env.NEXT_PUBLIC_GITHUB_URL;
  const faith = copy["nav.faith"] || "Faith";

  const groups = [
    {
      title: "Read",
      links: [
        { href: "/articles", label: "Notes" },
        { href: "/faith", label: faith },
        { href: "/journal", label: "Journal" },
        { href: "/series", label: "Series" },
        { href: "/work", label: "Work" },
        { href: "/about", label: "About" },
      ],
    },
    {
      title: "Subscribe",
      links: [
        { href: "/rss.xml", label: "Notes feed" },
        { href: "/faith/rss.xml", label: `${faith} feed` },
        { href: "/journal/rss.xml", label: "Journal feed" },
      ],
    },
    {
      title: "Elsewhere",
      links: [
        ...(linkedin ? [{ href: linkedin, label: "LinkedIn", external: true }] : []),
        ...(github ? [{ href: github, label: "GitHub", external: true }] : []),
      ],
    },
  ].filter((g) => g.links.length > 0);

  return (
    <footer id="contact" className="bg-paper">
      <Container size="wide">
        <div className="grid gap-12 border-t border-ink-900 py-14 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <h2 className="text-5xl font-extrabold leading-none tracking-[-0.045em] text-ink-900 sm:text-[56px]">
              {copy["footer.cta"]}
            </h2>
            {email && (
              <a
                href={`mailto:${email}`}
                className="mt-5 inline-block border-b border-ink-900 text-xl font-medium tracking-[-0.01em] text-ink-900 transition-colors hover:border-cyan-ink hover:text-cyan-ink"
              >
                {email}
              </a>
            )}
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-7"
          >
            {groups.map((g) => (
              <div key={g.title} className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-ink-900">{g.title}</span>
                {g.links.map((l) => (
                  <FooterLink key={l.href} href={l.href} external={"external" in l && l.external}>
                    {l.label}
                  </FooterLink>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <p className="border-t border-rule py-6 text-xs text-ink-500">
          © {new Date().getFullYear()} GEAK LABS · Written &amp; built by Olugbenga Akinduko
        </p>
      </Container>
    </footer>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const cls = "text-ink-700 transition-colors hover:text-cyan-ink";
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
