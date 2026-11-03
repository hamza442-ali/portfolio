import { ArrowUpRight, ChevronDown } from "lucide-react";
import { featuredProjects } from "@/content/projects";
import { resolveImages } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { Badge, evidenceTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HighlightIcon } from "@/components/ui/HighlightIcon";
import { ProjectGallery } from "@/components/ui/ProjectGallery";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TechIcon } from "@/components/ui/TechIcon";
import { DepEasePipeline, FolionomicsArchitecture } from "@/components/diagrams/ProjectDiagrams";

const diagrams: Record<string, { label: string; Component: React.ComponentType }> = {
  folionomics: { label: "How it fits together", Component: FolionomicsArchitecture },
  depease: { label: "Deployment flow", Component: DepEasePipeline },
};

export function FeaturedWork() {
  return (
    <Section
      id="work"
      number="03"
      title="Featured work"
      lead="Two projects that shaped how I build."
      description="What I personally did is shown as highlights. What the whole product does is a click away."
      tone="alt"
    >
      <div className="space-y-20 lg:space-y-28">
        {featuredProjects.map((project, idx) => {
          const images = resolveImages(project.images);
          const diagram = diagrams[project.id];
          const flip = idx % 2 === 1;
          return (
            <article key={project.id} id={`project-${project.id}`} className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Visual + highlights */}
              <div className={cn("order-2 min-w-0 space-y-5 lg:col-span-7", flip ? "lg:order-2" : "lg:order-1")}>
                <Reveal>
                  <ProjectGallery
                    title={project.title}
                    subtitle={project.subtitle}
                    accent={project.accent}
                    images={images}
                    variant="featured"
                    sizes="(min-width: 1024px) 56vw, 100vw"
                  />
                </Reveal>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.highlights.map((h, i) => (
                    <li key={h.title} className="flex">
                    <Reveal index={i} className="tile flex w-full gap-3 p-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <HighlightIcon name={h.icon} className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-fg">{h.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted">{h.text}</p>
                      </div>
                    </Reveal>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Story */}
              <Reveal className={cn("order-1 min-w-0 lg:col-span-5", flip ? "lg:order-1" : "lg:order-2")}>
                <p className="font-mono text-xs text-muted-2">
                  0{idx + 1} · {project.period}
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-fg">{project.title}</h3>
                <p className="mt-1 text-lg text-muted">{project.subtitle}</p>
                <div className="mt-4">
                  <Badge tone={evidenceTone[project.evidence]}>{project.evidence}</Badge>
                </div>
                <p className="copy mt-6 text-fg/90">{project.summary}</p>
                {project.problem && <p className="copy mt-4 text-muted">{project.problem}</p>}

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                  {project.tags.map((t) => (
                    <li key={t} className="flex items-center gap-1.5 rounded-md border border-border bg-white/[0.02] px-2 py-1 text-xs text-muted">
                      <TechIcon name={t} className="size-3.5" />
                      {t}
                    </li>
                  ))}
                </ul>

                {project.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.links.map((l) => (
                      <Button key={l.href} href={l.href} variant="secondary" size="sm">
                        {l.label} <ArrowUpRight className="size-3.5" />
                      </Button>
                    ))}
                  </div>
                )}

                {diagram && (
                  <details className="group mt-8 rounded-2xl border border-border bg-white/[0.02]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
                      {diagram.label}
                      <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="border-t border-border p-5">
                      <diagram.Component />
                    </div>
                  </details>
                )}

                {project.productCapabilities && (
                  <details className="group mt-3 rounded-2xl border border-border bg-white/[0.02]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
                      What the whole product does
                      <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="space-y-2 border-t border-border p-5">
                      {project.productCapabilities.map((c) => (
                        <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-2/70" />
                          {c}
                        </li>
                      ))}
                      <li className="pt-1 text-xs text-muted-2">Team and product capabilities, not individual authorship.</li>
                    </ul>
                  </details>
                )}
              </Reveal>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
