"use client";

import { Command } from "cmdk";
import { Check, Copy, Download, Mail, Phone, Calendar } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { useCallback, useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { navItems } from "@/lib/site";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Ctrl/Cmd+K palette for jumping to sections and reaching contact links. */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = useCallback(
    (id: string) => {
      onOpenChange(false);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [onOpenChange],
  );

  const openUrl = useCallback(
    (url: string) => {
      onOpenChange(false);
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [onOpenChange],
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onOpenChange(false);
      }, 900);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }, [onOpenChange]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      overlayClassName="fixed inset-0 z-[90] bg-bg/70 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[18vh] z-[95] w-[min(92vw,34rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-2xl shadow-black/60"
      loop
    >
      <div className="flex items-center gap-3 border-b border-border px-4">
        <span className="font-mono text-xs text-accent">&gt;</span>
        <Command.Input
          autoFocus
          placeholder="Jump to a section or reach out…"
          className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted-2"
        />
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">
          ESC
        </kbd>
      </div>
      <Command.List className="max-h-[50vh] overflow-y-auto overscroll-contain p-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-muted-2">
        <Command.Empty className="px-3 py-8 text-center text-sm text-muted">No results.</Command.Empty>

        <Command.Group heading="Navigate">
          {navItems.map((item) => (
            <Item key={item.id} onSelect={() => go(item.id)} shortcut={`#${item.id}`}>
              {item.label}
            </Item>
          ))}
        </Command.Group>

        <Command.Group heading="Contact">
          <Item onSelect={copyEmail} icon={copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}>
            {copied ? "Copied!" : "Copy email address"}
          </Item>
          <Item onSelect={() => openUrl(`mailto:${profile.email}`)} icon={<Mail className="size-4" />}>
            Send an email
          </Item>
          <Item onSelect={() => openUrl(profile.phoneHref)} icon={<Phone className="size-4" />}>
            Call {profile.phone}
          </Item>
          {profile.calendarUrl && (
            <Item onSelect={() => openUrl(profile.calendarUrl!)} icon={<Calendar className="size-4" />}>
              Book a call
            </Item>
          )}
        </Command.Group>

        <Command.Group heading="Links">
          <Item onSelect={() => openUrl(profile.social.github)} icon={<GitHubIcon className="size-4" />}>
            GitHub
          </Item>
          <Item onSelect={() => openUrl(profile.social.linkedin)} icon={<LinkedInIcon className="size-4" />}>
            LinkedIn
          </Item>
          {profile.cvUrl && (
            <Item onSelect={() => openUrl(profile.cvUrl!)} icon={<Download className="size-4" />}>
              Download CV
            </Item>
          )}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}

function Item({
  children,
  onSelect,
  icon,
  shortcut,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg/90 outline-none transition-colors data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-fg"
    >
      {icon && <span className="text-muted">{icon}</span>}
      <span className="flex-1">{children}</span>
      {shortcut && <span className="font-mono text-[10px] text-muted-2">{shortcut}</span>}
    </Command.Item>
  );
}
