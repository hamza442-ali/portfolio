import type { ReactNode } from "react";

/**
 * Vehicles Pixel rides across the screen. Each spec describes:
 *  - the drawing (back layer behind Pixel, optional front layer in front of him)
 *  - where Pixel sits inside the vehicle box (in viewBox units)
 *  - how the vehicle moves (ground / sky-sine / arc) and how long a crossing takes
 *  - Pixel's riding pose, as the joint CSS variables CatSvg reads
 */

export type PathKind = "ground" | "sky-sine" | "arc";

export interface VehicleSpec {
  id: string;
  /** Short line Pixel says before walking off to fetch it. */
  line: string;
  viewBox: { w: number; h: number };
  /** Vehicle box width as a multiple of Pixel's standing size. */
  boxScale: number;
  /** Pixel width as a multiple of his standing size. */
  riderScale: number;
  /** Pixel's horizontal centre and foot line, in viewBox units. */
  rider: { cx: number; bottom: number };
  path: PathKind;
  seconds: number;
  /** Wheel radius in viewBox units, for rolling rotation. */
  wheelRadius?: number;
  pose: Record<string, string>;
  /** Pedalling: animate legs with progress. */
  pedals?: boolean;
  back: ReactNode;
  front?: ReactNode;
}

const shell = "url(#v-shell)";
const stroke = "#3b4463";

function Defs() {
  return (
    <defs>
      <linearGradient id="v-shell" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a3044" />
        <stop offset="1" stopColor="#161a28" />
      </linearGradient>
      <radialGradient id="v-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#22d3ee" stopOpacity="0.9" />
        <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="wheel">
      <circle cx={cx} cy={cy} r={r} fill="#0b0d16" stroke={stroke} strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke={stroke} strokeWidth="1.5" />
      {[0, 60, 120].map((a) => (
        <line
          key={a}
          x1={cx + r * 0.55 * Math.cos((a * Math.PI) / 180)}
          y1={cy + r * 0.55 * Math.sin((a * Math.PI) / 180)}
          x2={cx - r * 0.55 * Math.cos((a * Math.PI) / 180)}
          y2={cy - r * 0.55 * Math.sin((a * Math.PI) / 180)}
          stroke={stroke}
          strokeWidth="1.5"
        />
      ))}
      <circle cx={cx} cy={cy} r="2.6" fill="#22d3ee" />
    </g>
  );
}

const VB = "0 0 160 110";
const svgClass = "absolute inset-0 h-full w-full overflow-visible";

export const VEHICLES: VehicleSpec[] = [
  {
    id: "scooter",
    line: "Brb, scooter time!",
    viewBox: { w: 160, h: 110 },
    boxScale: 1.9,
    riderScale: 1,
    rider: { cx: 60, bottom: 82 },
    path: "ground",
    seconds: 10,
    wheelRadius: 14,
    pose: { "--thigh-l": "-72deg", "--shin-l": "96deg", "--thigh-r": "-62deg", "--shin-r": "92deg", "--arm-l": "-62deg", "--arm-r": "-58deg" },
    back: (
      <svg viewBox={VB} className={svgClass} aria-hidden>
        <Defs />
        {/* exhaust puffs */}
        <circle className="puff puff-1" cx="16" cy="80" r="3" fill="#8f94a6" />
        <circle className="puff puff-2" cx="9" cy="75" r="4" fill="#8f94a6" />
        <circle className="puff puff-3" cx="3" cy="69" r="5" fill="#8f94a6" />
        <Wheel cx={40} cy={90} r={14} />
        <Wheel cx={126} cy={90} r={14} />
        {/* rear body + seat */}
        <path d="M24 72 Q26 86 50 86 L50 62 Q30 60 24 72 Z" fill={shell} stroke={stroke} />
        <rect x="30" y="54" width="46" height="11" rx="5.5" fill="#1b1f2d" stroke={stroke} />
        {/* floorboard */}
        <rect x="48" y="79" width="60" height="7" rx="3.5" fill="#1b1f2d" stroke={stroke} />
        {/* front shield + steering */}
        <path d="M104 84 L120 40 L130 40 L118 84 Z" fill={shell} stroke={stroke} />
        <rect x="112" y="35" width="30" height="4.5" rx="2.25" fill={stroke} />
        <circle cx="128" cy="50" r="9" fill="url(#v-glow)" />
        <circle cx="128" cy="50" r="4.5" fill="#22d3ee" />
        <circle cx="30" cy="60" r="2.5" fill="#f472b6" />
      </svg>
    ),
  },
  {
    id: "bicycle",
    line: "Bike ride!",
    viewBox: { w: 160, h: 110 },
    boxScale: 1.9,
    riderScale: 1,
    rider: { cx: 72, bottom: 84 },
    path: "ground",
    seconds: 11,
    wheelRadius: 17,
    pedals: true,
    pose: { "--arm-l": "-58deg", "--arm-r": "-54deg" },
    back: (
      <svg viewBox={VB} className={svgClass} aria-hidden>
        <Defs />
        <Wheel cx={34} cy={88} r={17} />
        <Wheel cx={126} cy={88} r={17} />
        <g stroke="#8f94a6" strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d="M34 88 L66 42 L114 44 L126 88 M34 88 L84 88 L66 42 M84 88 L114 44" />
        </g>
        <rect x="54" y="37" width="20" height="6" rx="3" fill="#1b1f2d" stroke={stroke} />
        <rect x="108" y="36" width="18" height="4.5" rx="2.25" fill={stroke} />
        <circle cx="118" cy="52" r="7" fill="url(#v-glow)" />
        <circle cx="118" cy="52" r="3" fill="#22d3ee" />
        <g className="crank">
          <line x1="84" y1="78" x2="84" y2="98" stroke="#8f94a6" strokeWidth="2.5" />
          <rect x="79" y="75" width="10" height="4" rx="2" fill="#3b4463" />
          <rect x="79" y="97" width="10" height="4" rx="2" fill="#3b4463" />
        </g>
        <circle cx="84" cy="88" r="4" fill="#1b1f2d" stroke={stroke} />
      </svg>
    ),
  },
  {
    id: "skateboard",
    line: "Watch this.",
    viewBox: { w: 160, h: 110 },
    boxScale: 1.6,
    riderScale: 1,
    rider: { cx: 80, bottom: 90 },
    path: "ground",
    seconds: 8.5,
    wheelRadius: 6,
    pose: { "--thigh-l": "-14deg", "--shin-l": "12deg", "--thigh-r": "16deg", "--shin-r": "8deg", "--arm-l": "-28deg", "--arm-r": "34deg" },
    back: (
      <svg viewBox={VB} className={svgClass} aria-hidden>
        <Defs />
        <Wheel cx={50} cy={101} r={6} />
        <Wheel cx={110} cy={101} r={6} />
        <path d="M24 95 Q30 86 42 90 L118 90 Q130 86 136 95 Q130 100 118 97 L42 97 Q30 100 24 95 Z" fill="#1b1f2d" stroke={stroke} />
        <path d="M44 93.5 L116 93.5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: "plane",
    line: "Taking off!",
    viewBox: { w: 160, h: 110 },
    boxScale: 2.2,
    riderScale: 0.85,
    rider: { cx: 84, bottom: 80 }, // seated deep enough that the fuselage hides the legs
    path: "sky-sine",
    seconds: 13,
    pose: { "--arm-l": "-52deg", "--arm-r": "-48deg" },
    back: (
      <svg viewBox={VB} className={svgClass} aria-hidden>
        <Defs />
        {/* tail fin + rear wing */}
        <path d="M24 42 L42 42 L48 66 L22 66 Z" fill={shell} stroke={stroke} />
        <path d="M18 66 L50 66 L54 74 L14 74 Z" fill="#1b1f2d" stroke={stroke} />
        {/* main wing (behind cockpit) */}
        <path d="M58 64 L112 64 L122 76 L52 76 Z" fill={shell} stroke={stroke} />
      </svg>
    ),
    front: (
      <svg viewBox={VB} className={svgClass} aria-hidden>
        <Defs />
        {/* fuselage covers Pixel's body, leaving head and ears in the cockpit */}
        <path d="M20 68 Q20 50 46 50 L100 50 Q136 50 150 68 Q136 86 100 86 L46 86 Q20 86 20 68 Z" fill={shell} stroke={stroke} />
        <path d="M102 50 L116 36 L120 50 Z" fill="rgba(34,211,238,0.22)" stroke="#22d3ee" strokeWidth="1.2" />
        <path d="M60 51 Q62 44 72 44 L98 44 L100 50" fill="none" stroke={stroke} strokeWidth="1.5" />
        <circle cx="38" cy="60" r="2.2" fill="#f472b6" />
        <circle cx="130" cy="60" r="2.2" fill="#22d3ee" />
        {/* landing gear */}
        <path d="M60 86 L60 94 M100 86 L100 94" stroke={stroke} strokeWidth="2.5" />
        <circle cx="60" cy="97" r="4.5" fill="#0b0d16" stroke={stroke} strokeWidth="2" />
        <circle cx="100" cy="97" r="4.5" fill="#0b0d16" stroke={stroke} strokeWidth="2" />
        {/* propeller */}
        <rect className="prop" x="150" y="44" width="4" height="48" rx="2" fill="#8f94a6" />
        <circle cx="152" cy="68" r="4.5" fill="#22d3ee" />
      </svg>
    ),
  },
  {
    id: "jetpack",
    line: "To the sky!",
    viewBox: { w: 80, h: 92 },
    boxScale: 1,
    riderScale: 1,
    rider: { cx: 40, bottom: 92 },
    path: "arc",
    seconds: 10,
    pose: { "--thigh-l": "24deg", "--shin-l": "14deg", "--thigh-r": "16deg", "--shin-r": "10deg", "--arm-l": "-150deg", "--arm-r": "-140deg" },
    back: (
      <svg viewBox="0 0 80 92" className={svgClass} aria-hidden>
        <Defs />
        <rect x="19" y="40" width="12" height="32" rx="6" fill={shell} stroke={stroke} />
        <rect x="49" y="40" width="12" height="32" rx="6" fill={shell} stroke={stroke} />
        <rect x="31" y="50" width="18" height="6" rx="3" fill="#1b1f2d" stroke={stroke} />
        <g className="flame">
          <path d="M20 72 L30 72 L25 92 Z" fill="#a78bfa" />
          <path d="M22.5 72 L27.5 72 L25 85 Z" fill="#22d3ee" />
        </g>
        <g className="flame flame-2">
          <path d="M50 72 L60 72 L55 92 Z" fill="#a78bfa" />
          <path d="M52.5 72 L57.5 72 L55 85 Z" fill="#22d3ee" />
        </g>
      </svg>
    ),
  },
];
