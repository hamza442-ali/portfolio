import { aiJourney, aiJourneyHeadline, aiRoadmap } from "@/content/ai-journey";
import { proofLevelMeta } from "@/content/skills";
import { Badge, proofTone } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function AIJourney() {
  return (
    <Section id="ai" number="06" title="AI engineering" lead={aiJourneyHeadline} description="Three levels of proof, kept deliberately distinct.">
      <ol className="relative grid gap-4 lg:grid-cols-3">
        <span aria-hidden className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-accent/60 via-accent-2/40 to-transparent lg:block" />
        {aiJourney.map((tier, i) => (
          <li key={tier.id} className="flex">
            <Reveal index={i} className="tile relative flex w-full flex-col">
              <span className="absolute right-5 top-5 font-mono text-3xl font-semibold text-white/[0.06]">0{i + 1}</span>
              <Badge tone={proofTone[tier.level]} className="w-fit">
                {proofLevelMeta[tier.level].label}
              </Badge>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-fg">{tier.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{tier.description}</p>
              <ul className="mt-4 space-y-1.5">
                {tier.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-sm text-fg/85">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-2/80" />
                    {pt}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-8 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-xs text-muted-2">Next on the roadmap, not yet built:</span>
        {aiRoadmap.map((item) => (
          <span key={item} className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-2">
            {item}
          </span>
        ))}
      </Reveal>
    </Section>
  );
}
