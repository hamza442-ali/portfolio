import { ArrowUpRight, Loader } from "lucide-react";
import { otherProjects } from "@/content/projects";
import { resolveImages } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { Badge, evidenceTone } from "@/components/ui/Badge";
import { HighlightIcon } from "@/components/ui/HighlightIcon";
import { ProjectGallery } from "@/components/ui/ProjectGallery";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TechIcon } from "@/components/ui/TechIcon";
import { TiltCard } from "@/components/ui/TiltCard";
import { projectDiagrams } from "@/components/diagrams/ArchitectureDiagrams";

export function Projects() {
  return (
    <Section id="projects" number="04" title="More work" lead="Side projects and what's on the bench." description="Every card says what kind of project it is. Links appear only where a public demo exists.">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {otherProjects.map((p, i) => {
          const images = resolveImages(p.images);
          return (
            <li key={p.id} className="flex">
              <Reveal index={i} className="flex w-full">
                <TiltCard className={cn("tile flex w-full flex-col p-4", p.inProgress && "border-dashed border-amber-400/30")}>
                  <ProjectGallery
                    title={p.title}
                    accent={p.accent}
                    images={images}
                    diagram={projectDiagrams[p.id]}
                    variant="card"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  />
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Badge tone={evidenceTone[p.evidence]}>
                      {p.inProgress && <Loader className="size-3 animate-spin-slow" />}
                      {p.evidence}
                    </Badge>
                    <span className="font-mono text-xs text-muted-2">{p.period}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-fg">{p.title}</h3>
                  <p className="text-sm text-muted">{p.subtitle}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-fg/85">{p.summary}</p>
                  <ul className="mt-4 space-y-2">
                    {p.highlights.map((h) => (
                      <li key={h.title} className="flex gap-2.5 text-sm text-muted">
                        <HighlightIcon name={h.icon} className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span>
                          <span className="text-fg">{h.title}.</span> {h.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                      {p.tags.map((t) => (
                        <li key={t} title={t} className="flex size-7 items-center justify-center rounded-md border border-border bg-white/[0.02]">
                          <TechIcon name={t} className="size-3.5" />
                          <span className="sr-only">{t}</span>
                        </li>
                      ))}
                    </ul>
                    {p.links[0] && (
                      <a
                        href={p.links[0].href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-fg"
                      >
                        {p.links[0].label} <ArrowUpRight className="size-3.5" />
                      </a>
                    )}
                  </div>
                </TiltCard>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
