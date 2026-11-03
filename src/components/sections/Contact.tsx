import { Calendar, Download, Mail, Phone } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/content/profile";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <Section
      id="contact"
      number="08"
      title="Contact"
      lead="Let's build something that holds up."
      description="Open to full-stack, backend and applied AI roles, and to interesting projects. Email is fastest."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <Reveal className="space-y-3">
          <ContactRow icon={<Mail className="size-4" />} label="Email">
            <a href={`mailto:${profile.email}`} className="break-all text-fg transition-colors hover:text-accent">
              {profile.email}
            </a>
            <CopyButton value={profile.email} label="Copy email" />
          </ContactRow>
          <ContactRow icon={<Phone className="size-4" />} label="Phone">
            <a href={profile.phoneHref} className="text-fg transition-colors hover:text-accent">
              {profile.phone}
            </a>
            <CopyButton value={profile.phone} label="Copy phone number" />
          </ContactRow>
          <div className="flex flex-wrap gap-3 pt-2">
            {profile.calendarUrl && (
              <Button href={profile.calendarUrl}>
                <Calendar className="size-4" /> Book a Call
              </Button>
            )}
            <Button href={profile.social.linkedin} variant="secondary">
              <LinkedInIcon className="size-4" /> LinkedIn
            </Button>
            <Button href={profile.social.github} variant="secondary">
              <GitHubIcon className="size-4" /> GitHub
            </Button>
            {profile.cvUrl && (
              <Button href={profile.cvUrl} variant="secondary" external={false}>
                <Download className="size-4" /> CV
              </Button>
            )}
          </div>
        </Reveal>
        <Reveal index={1}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="tile flex items-center gap-4 p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-2">{label}</p>
        <div className="mt-0.5 flex items-center justify-between gap-3">{children}</div>
      </div>
    </div>
  );
}
