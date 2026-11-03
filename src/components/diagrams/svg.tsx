import type { ReactNode } from "react";

/**
 * Tiny SVG toolkit for architecture diagrams. Everything is plain SVG so the
 * drawings stay crisp at any size (card cover, lightbox, print) and inherit the
 * site fonts. Coordinates are in a 1200 × 675 viewBox unless stated otherwise.
 */

export type Tone = "accent" | "violet" | "pink" | "emerald" | "amber" | "neutral";

export const toneColor: Record<Tone, string> = {
  accent: "#22d3ee",
  violet: "#a78bfa",
  pink: "#f472b6",
  emerald: "#34d399",
  amber: "#fbbf24",
  neutral: "#8a90a5",
};

const FG = "#f2f3f8";
const MUTED = "#b6bbcc";
const MUTED_2 = "#8a90a5";
const BG = "#0a0c12";
const SANS = "var(--font-geist-sans), system-ui, sans-serif";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";

interface DiagramProps {
  /** Full textual description for screen readers. */
  label: string;
  width?: number;
  height?: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Diagram({ label, width = 1200, height = 675, title, subtitle, children, className }: DiagramProps) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className={className ?? "block h-auto w-full"}
      style={{ fontFamily: SANS }}
    >
      <defs>
        <pattern id="dg-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#ffffff" opacity="0.07" />
        </pattern>
        {(Object.keys(toneColor) as Tone[]).map((t) => (
          <marker key={t} id={`dg-arrow-${t}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={toneColor[t]} />
          </marker>
        ))}
      </defs>
      <rect width={width} height={height} fill={BG} />
      <rect width={width} height={height} fill="url(#dg-grid)" />
      <text x="40" y="52" fontSize="24" fontWeight="600" fill={FG} letterSpacing="-0.5">
        {title}
      </text>
      {subtitle && (
        <text x="40" y="78" fontSize="14" fill={MUTED_2} fontFamily={MONO}>
          {subtitle}
        </text>
      )}
      {children}
    </svg>
  );
}

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle?: string;
  lines?: string[];
  tone?: Tone;
  /** Small chip in the top-right corner, e.g. "external". */
  tag?: string;
  mono?: boolean;
}

export function Box({ x, y, w, h, title, subtitle, lines = [], tone = "neutral", tag, mono }: BoxProps) {
  const c = toneColor[tone];
  const pad = 18;
  let cy = y + pad + 18;
  const titleY = cy;
  cy += subtitle ? 20 : 0;
  const subtitleY = cy;
  cy += 16;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="14" fill="#ffffff" fillOpacity="0.035" stroke={c} strokeOpacity="0.75" strokeWidth="1.5" />
      <rect x={x} y={y} width={w} height="4" rx="2" fill={c} opacity="0.9" />
      <text x={x + pad} y={titleY} fontSize="18" fontWeight="600" fill={FG}>
        {title}
      </text>
      {subtitle && (
        <text x={x + pad} y={subtitleY} fontSize="13" fill={MUTED_2}>
          {subtitle}
        </text>
      )}
      {tag && <Chip x={x + w - pad} y={y + pad - 2} text={tag} tone={tone} align="end" />}
      {lines.map((line, i) => {
        const ly = cy + 10 + i * 22;
        return (
          <g key={line}>
            <circle cx={x + pad + 4} cy={ly - 4} r="2.5" fill={c} opacity="0.9" />
            <text x={x + pad + 16} y={ly} fontSize="13.5" fill={MUTED} fontFamily={mono ? MONO : SANS}>
              {line}
            </text>
          </g>
        );
      })}
    </g>
  );
}

interface GroupProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  tone?: Tone;
}

/** Dashed container with an uppercase mono label. */
export function Group({ x, y, w, h, label, tone = "neutral" }: GroupProps) {
  const c = toneColor[tone];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="18" fill={c} fillOpacity="0.03" stroke={c} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="6 6" />
      <text x={x + 18} y={y + 24} fontSize="11.5" fontFamily={MONO} fill={c} letterSpacing="2" opacity="0.9">
        {label.toUpperCase()}
      </text>
    </g>
  );
}

interface ChipProps {
  x: number;
  y: number;
  text: string;
  tone?: Tone;
  align?: "start" | "end" | "middle";
}

export function Chip({ x, y, text, tone = "neutral", align = "start" }: ChipProps) {
  const c = toneColor[tone];
  const w = text.length * 6.6 + 16;
  const left = align === "end" ? x - w : align === "middle" ? x - w / 2 : x;
  return (
    <g>
      <rect x={left} y={y - 11} width={w} height="20" rx="10" fill={c} fillOpacity="0.14" stroke={c} strokeOpacity="0.5" />
      <text x={left + w / 2} y={y + 3} fontSize="11" fontFamily={MONO} fill={c} textAnchor="middle">
        {text}
      </text>
    </g>
  );
}

interface ArrowProps {
  /** Polyline points, first = tail, last = head. */
  points: [number, number][];
  label?: string;
  tone?: Tone;
  dashed?: boolean;
  /** Arrowheads at both ends. */
  both?: boolean;
  /** Where to place the label along the path (0–1). */
  at?: number;
  /** Nudge the label. */
  dx?: number;
  dy?: number;
}

export function Arrow({ points, label, tone = "neutral", dashed, both, at = 0.5, dx = 0, dy = 0 }: ArrowProps) {
  const c = toneColor[tone];
  const d = points.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px} ${py}`).join(" ");
  const [lx, ly] = pointAlong(points, at);
  const w = label ? label.length * 6.8 + 16 : 0;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={c}
        strokeOpacity="0.8"
        strokeWidth="1.75"
        strokeDasharray={dashed ? "5 5" : undefined}
        markerEnd={`url(#dg-arrow-${tone})`}
        markerStart={both ? `url(#dg-arrow-${tone})` : undefined}
      />
      {label && (
        <g>
          <rect x={lx + dx - w / 2} y={ly + dy - 11} width={w} height="22" rx="11" fill={BG} stroke={c} strokeOpacity="0.4" />
          <text x={lx + dx} y={ly + dy + 4} fontSize="11.5" fontFamily={MONO} fill={c} textAnchor="middle">
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

function pointAlong(points: [number, number][], t: number): [number, number] {
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const len = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    segs.push(len);
    total += len;
  }
  let target = total * t;
  for (let i = 1; i < points.length; i++) {
    const len = segs[i - 1];
    if (target <= len || i === points.length - 1) {
      const r = len === 0 ? 0 : target / len;
      return [points[i - 1][0] + (points[i][0] - points[i - 1][0]) * r, points[i - 1][1] + (points[i][1] - points[i - 1][1]) * r];
    }
    target -= len;
  }
  return points[0];
}

/** Small "database" cylinder glyph. */
export function Cylinder({ x, y, w, h, title, lines = [], tone = "neutral" }: Omit<BoxProps, "subtitle" | "tag" | "mono">) {
  const c = toneColor[tone];
  const ry = 12;
  return (
    <g>
      <path
        d={`M${x} ${y + ry} a${w / 2} ${ry} 0 0 1 ${w} 0 v${h - 2 * ry} a${w / 2} ${ry} 0 0 1 -${w} 0 z`}
        fill="#ffffff"
        fillOpacity="0.035"
        stroke={c}
        strokeOpacity="0.75"
        strokeWidth="1.5"
      />
      <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry} fill={c} fillOpacity="0.12" stroke={c} strokeOpacity="0.75" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + ry + 36} fontSize="17" fontWeight="600" fill={FG} textAnchor="middle">
        {title}
      </text>
      {lines.map((line, i) => (
        <text key={line} x={x + w / 2} y={y + ry + 58 + i * 20} fontSize="13" fill={MUTED} textAnchor="middle">
          {line}
        </text>
      ))}
    </g>
  );
}

/** Plain caption text. */
export function Note({ x, y, text, tone = "neutral", anchor = "start" }: { x: number; y: number; text: string; tone?: Tone; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} fontSize="12.5" fill={toneColor[tone]} fontFamily={MONO} textAnchor={anchor} opacity="0.9">
      {text}
    </text>
  );
}
