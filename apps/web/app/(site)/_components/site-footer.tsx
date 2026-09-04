import Link from "next/link";
import { Container } from "@geaklabs/ui";
import { getSiteCopy } from "@geaklabs/db";

export async function SiteFooter() {
  const copy = await getSiteCopy();
  // Values saved in the admin win; environment variables remain as a fallback.
  const email = copy["footer.email"] || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const linkedin = copy["footer.linkedin"] || process.env.NEXT_PUBLIC_LINKEDIN_URL;
  const github = copy["footer.github"] || process.env.NEXT_PUBLIC_GITHUB_URL;

  return (
    <footer id="contact" className="bg-paper">
      <Container size="wide">
        <div className="grid gap-10 border-t border-ink-900 py-14 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="lg:col-span-6">
            <h2 className="text-5xl font-extrabold leading-none tracking-[-0.045em] text-ink-900 sm:text-[56px]">
              {copy["footer.cta"]}
            </h2>
            {email && (
              <a
                href={`mailto:${email}`}
                className="mt-4 inline-block border-b border-ink-900 text-xl font-medium tracking-[-0.01em] text-ink-900 transition-colors hover:border-cyan-ink hover:text-cyan-ink"
              >
                {email}
              </a>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm lg:col-span-3 lg:col-start-10 lg:text-right">
            {linkedin && <FooterLink href={linkedin} external>LinkedIn</FooterLink>}
            {github && <FooterLink href={github} external>GitHub</FooterLink>}
            <FooterLink href="/articles">All essays</FooterLink>
            <FooterLink href="/rss.xml">RSS</FooterLink>
            <span className="mt-4 text-xs text-ink-500">
              © {new Date().getFullYear()} GEAK LABS · Written &amp; built by Olugbenga Akinduko
            </span>
          </div>
        </div>
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
  const cls = "text-ink-900 transition-colors hover:text-cyan-ink";
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
