import { proofLevelMeta } from "@/content/skills";
import type { ProofLevel } from "@/content/types";
import { Dot, proofTone } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { SkillTabs } from "./SkillTabs";

const levels: ProofLevel[] = ["professional", "project", "learning"];

export function Skills() {
  return (
    <Section
      id="skills"
      number="05"
      title="Skills"
      lead="Labelled by how I've used them."
      description="No percentage bars. Each tool is marked as used in professional work, built in my own projects, or learning now."
      tone="alt"
      aside={
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Legend">
          {levels.map((lvl) => (
            <li key={lvl} className="flex items-center gap-2">
              <Dot tone={proofTone[lvl]} /> {proofLevelMeta[lvl].label}
            </li>
          ))}
        </ul>
      }
    >
      <SkillTabs />
    </Section>
  );
}
