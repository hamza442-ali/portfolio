import { ArrowUp } from "lucide-react";
import { profile } from "@/content/profile";
import { navItems } from "@/lib/site";
import { LocalTime } from "./LocalTime";

export function Footer() {
  const year = new Date().getFullYear();
  const updated = new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" });

  return (
    <footer className="relative border-t border-border">
      <div className="container-x flex flex-col gap-10 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-sm text-fg">
              ali<span className="text-muted">.hamza</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{profile.shortBio}</p>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-2">
              <span className="inline-block size-1.5 rounded-full bg-emerald-400" aria-hidden />
              {profile.location.label} · <LocalTime /> local
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="mb-4 text-xs uppercase tracking-[0.14em] text-muted-2">Sections</p>
            <ul className="grid grid-cols-2 gap-2 text-sm text-muted">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="transition-colors hover:text-fg">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.14em] text-muted-2">Elsewhere</p>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              <li>
                <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                  GitHub
                </a>
              </li>
              <li>
                <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-fg">
                  {profile.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-2 sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name}. Built with Next.js, deployed on Vercel. Last updated {updated}.
          </p>
          <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-fg">
            Back to top <ArrowUp className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
