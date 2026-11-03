import { Section } from "@/components/ui/Section";
import { ExperienceTimeline } from "./ExperienceTimeline";

export function Experience() {
  return (
    <Section
      id="experience"
      number="02"
      title="Experience"
      lead="Three years, three teams, shipped work."
      description="Two full-time product roles and one part-time, overlapping. About three years of elapsed experience since October 2023."
    >
      <ExperienceTimeline />
    </Section>
  );
}
