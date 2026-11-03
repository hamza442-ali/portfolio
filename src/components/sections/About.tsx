import Image from "next/image";
import { Boxes, Cloud, Languages, MapPin, Sparkles } from "lucide-react";
import { profile } from "@/content/profile";
import { getImageMeta, publicFileExists } from "@/lib/assets";
import { LocalTime } from "@/components/layout/LocalTime";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const pillarIcons = [Boxes, Cloud, Sparkles];

export function About() {
  const headshot = publicFileExists(profile.headshot) ? profile.headshot : null;
  const headshotMeta = getImageMeta(headshot);

  return (
    <Section id="about" number="01" title="About" lead={profile.about.lead} tone="alt">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {/* Portrait */}
        <Reveal className="tile relative min-h-72 overflow-hidden p-0 md:row-span-2 lg:col-span-2">
          {headshot ? (
            <>
              <Image
                src={headshot}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(min-width: 1024px) 24rem, (min-width: 768px) 50vw, 100vw"
                placeholder={headshotMeta ? "blur" : "empty"}
                blurDataURL={headshotMeta?.blurDataURL}
                className="object-cover object-top"
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-5 pb-4 pt-16">
                <p className="text-base font-semibold text-white">{profile.name}</p>
                <p className="text-sm text-white/75">{profile.title}</p>
              </div>
            </>
          ) : (
            <div className="noise flex h-full min-h-72 items-end bg-[radial-gradient(80%_80%_at_20%_10%,rgba(34,211,238,0.18),transparent_60%),radial-gradient(70%_70%_at_90%_90%,rgba(167,139,250,0.2),transparent_60%),var(--surface-2)] p-6">
              <div>
                <p className="text-gradient font-mono text-6xl font-semibold tracking-tighter">AH</p>
                <p className="mt-1 text-sm text-muted">{profile.title}</p>
              </div>
            </div>
          )}
        </Reveal>

        {/* Bio */}
        <Reveal index={1} className="tile md:col-span-1 lg:col-span-4">
          <div className="space-y-4">
            {profile.about.paragraphs.map((p) => (
              <p key={p} className="copy text-muted">
                {p}
              </p>
            ))}
          </div>
          <p className="copy mt-6 border-l-2 border-accent/60 pl-4 text-fg/90">{profile.about.direction}</p>
        </Reveal>

        {/* Now */}
        <Reveal index={2} className="tile lg:col-span-2">
          <TileLabel>Now</TileLabel>
          <ul className="mt-3 space-y-2.5">
            {profile.about.now.map((n) => (
              <li key={n} className="flex items-start gap-2.5 text-[15px] text-fg/90">
                <span className="relative mt-[7px] flex size-2 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                {n}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Location */}
        <Reveal index={3} className="tile lg:col-span-1">
          <TileLabel icon={<MapPin className="size-3.5" />}>Based in</TileLabel>
          <p className="mt-3 text-lg font-semibold text-fg">{profile.location.city}</p>
          <p className="text-sm text-muted">{profile.location.country}</p>
          <p className="mt-3 text-sm text-muted-2">
            <LocalTime /> local
          </p>
        </Reveal>

        {/* Languages */}
        <Reveal index={4} className="tile lg:col-span-1">
          <TileLabel icon={<Languages className="size-3.5" />}>Languages</TileLabel>
          <ul className="mt-3 space-y-1.5 text-sm">
            {profile.languages.map((l) => (
              <li key={l.name} className="flex items-baseline justify-between gap-2">
                <span className="text-fg">{l.name}</span>
                <span className="text-muted-2">{l.level}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Pillars */}
        {profile.about.pillars.map((pillar, i) => {
          const Icon = pillarIcons[i] ?? Boxes;
          return (
            <Reveal key={pillar.title} index={5 + i} className="tile lg:col-span-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-fg">{pillar.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{pillar.text}</p>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function TileLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-2">
      {icon}
      {children}
    </p>
  );
}
