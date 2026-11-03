import { ArrowUpRight, Award, GraduationCap } from "lucide-react";
import { certifications, education } from "@/content/education";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Education() {
  return (
    <Section id="education" number="07" title="Education" lead="Where the foundations come from." tone="alt">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <ol className="space-y-4">
          {education.map((e, i) => (
            <li key={e.id}>
              <Reveal index={i} className="tile flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <GraduationCap className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-fg">{e.program}</h3>
                    <span className="font-mono text-xs text-muted-2">{e.period}</span>
                  </div>
                  <p className="mt-0.5 text-[15px] text-muted">{e.institution}</p>
                  <p className="text-sm text-muted-2">{e.location}</p>
                  <ul className="mt-3 space-y-1.5">
                    {e.details.map((d) => (
                      <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-fg/85">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/60" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {e.note && <p className="mt-3 text-xs text-muted-2">{e.note}</p>}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <ol className="space-y-4">
          {certifications.map((c, i) => (
            <li key={c.id}>
              <Reveal index={i} className="tile flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-2/10 text-accent-2">
                  <Award className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold tracking-tight text-fg">{c.title}</h3>
                  <p className="mt-0.5 text-sm text-muted">
                    {c.issuer}
                    {c.year && <span className="text-muted-2"> · {c.year}</span>}
                  </p>
                  {c.link && (
                    <a href={c.link.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-accent transition-colors hover:text-fg">
                      {c.link.label} <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
