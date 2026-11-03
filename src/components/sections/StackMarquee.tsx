import { profile } from "@/content/profile";
import { Marquee } from "@/components/ui/Marquee";
import { TechIcon } from "@/components/ui/TechIcon";

export function StackMarquee() {
  return (
    <div className="relative border-y border-border bg-surface/50 py-5" aria-label="Main technologies">
      <Marquee
        duration={55}
        items={profile.stackMarquee.map((name) => (
          <span key={name} className="flex items-center gap-2.5 text-sm font-medium text-muted">
            <TechIcon name={name} className="size-5 opacity-90" />
            {name}
          </span>
        ))}
      />
    </div>
  );
}
