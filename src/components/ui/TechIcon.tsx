import { Cloud, Cpu, Database, Sparkles, Workflow } from "lucide-react";
import { techIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

interface TechIconProps {
  name: string;
  className?: string;
  /** Render in brand colour (default) or inherit the current text colour. */
  mono?: boolean;
}

/** Brand logo for a technology, with a sensible generic glyph when no mark exists. */
export function TechIcon({ name, className, mono }: TechIconProps) {
  const icon = techIcon(name);
  if (icon) {
    return (
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-label={icon.title}
        className={cn("size-5 shrink-0", className)}
        style={mono ? undefined : { color: `#${icon.hex}` }}
      >
        <path d={icon.path} fill="currentColor" />
      </svg>
    );
  }
  const Generic =
    name === "AWS" || name.startsWith("AWS ")
      ? Cloud
      : /RAG|Embedding|Prompt|Structured|Streaming|Agents|Retrieval/i.test(name)
        ? Sparkles
        : /REST|CI\/CD|wagmi|Web3/i.test(name)
          ? Workflow
          : /SQL|vector/i.test(name)
            ? Database
            : Cpu;
  return <Generic className={cn("size-5 shrink-0 text-muted", className)} aria-hidden />;
}
