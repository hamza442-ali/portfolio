/**
 * "Pixel": a chubby cat rendered with volume shading (key light top-left,
 * darker rims, soft contact shadows, glossy eyes) instead of cartoon outlines.
 *
 * Skeleton classes are unchanged so the walk cycle, rides and peeks keep
 * working: thigh-l/r > shin-l/r, arm-l/r, body, tail, eye > eye-move >
 * eye-open | eye-happy, mouth, chest (bell), zz.
 *
 * viewBox 0 0 80 92, feet on y=90.
 */
export function CatSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 92" className={className} aria-hidden focusable="false">
      <defs>
        {/* fur: lit from top-left, falling off to a deep rim */}
        <radialGradient id="px-head" cx="38%" cy="32%" r="72%">
          <stop offset="0" stopColor="#6b739a" />
          <stop offset="0.55" stopColor="#434b6f" />
          <stop offset="1" stopColor="#1f2439" />
        </radialGradient>
        <radialGradient id="px-body" cx="40%" cy="28%" r="78%">
          <stop offset="0" stopColor="#5d6689" />
          <stop offset="0.6" stopColor="#3b4262" />
          <stop offset="1" stopColor="#1d2236" />
        </radialGradient>
        <linearGradient id="px-limb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#555d80" />
          <stop offset="0.5" stopColor="#3d4466" />
          <stop offset="1" stopColor="#232841" />
        </linearGradient>
        <linearGradient id="px-limb-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d557a" />
          <stop offset="1" stopColor="#262b45" />
        </linearGradient>
        <radialGradient id="px-light" cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#eef0f7" />
          <stop offset="0.6" stopColor="#c4c9db" />
          <stop offset="1" stopColor="#9096ad" />
        </radialGradient>
        <radialGradient id="px-ear" cx="50%" cy="60%" r="60%">
          <stop offset="0" stopColor="#fbcfe8" />
          <stop offset="1" stopColor="#db5fa0" />
        </radialGradient>
        <radialGradient id="px-iris" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#bdf7ff" />
          <stop offset="0.45" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#0b7f93" />
        </radialGradient>
        <radialGradient id="px-bell" cx="38%" cy="32%" r="70%">
          <stop offset="0" stopColor="#e6fdff" />
          <stop offset="0.4" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#0e7490" />
        </radialGradient>
        <linearGradient id="px-collar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#5b3fc4" />
        </linearGradient>
        <radialGradient id="px-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0.85" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <filter id="px-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
        <filter id="px-softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      {/* ground contact shadow */}
      <ellipse className="shadow" cx="40" cy="90" rx="20" ry="2.6" fill="#000" opacity="0.6" filter="url(#px-soft)" />

      {/* ---------- legs (hip pivot at top of group, knee pivot at top of shin) ---------- */}
      <g className="thigh-l">
        <rect x="28" y="62" width="10" height="15" rx="5" fill="url(#px-limb)" />
        <rect x="28" y="62" width="10" height="6" rx="3" fill="#161a2b" opacity="0.35" />
        <g className="shin-l">
          <rect x="29" y="75" width="8" height="12" rx="4" fill="url(#px-limb-v)" />
          <ellipse cx="33" cy="87.5" rx="7.5" ry="3.4" fill="#3a4160" />
          <ellipse cx="33" cy="86.6" rx="7" ry="2.8" fill="url(#px-limb)" />
          <circle cx="29.5" cy="87.2" r="0.9" fill="#1a1f32" />
          <circle cx="33" cy="87.6" r="0.9" fill="#1a1f32" />
          <circle cx="36.5" cy="87.2" r="0.9" fill="#1a1f32" />
        </g>
      </g>
      <g className="thigh-r">
        <rect x="42" y="62" width="10" height="15" rx="5" fill="url(#px-limb)" />
        <rect x="42" y="62" width="10" height="6" rx="3" fill="#161a2b" opacity="0.35" />
        <g className="shin-r">
          <rect x="43" y="75" width="8" height="12" rx="4" fill="url(#px-limb-v)" />
          <ellipse cx="47" cy="87.5" rx="7.5" ry="3.4" fill="#3a4160" />
          <ellipse cx="47" cy="86.6" rx="7" ry="2.8" fill="url(#px-limb)" />
          <circle cx="43.5" cy="87.2" r="0.9" fill="#1a1f32" />
          <circle cx="47" cy="87.6" r="0.9" fill="#1a1f32" />
          <circle cx="50.5" cy="87.2" r="0.9" fill="#1a1f32" />
        </g>
      </g>

      <g className="body">
        {/* ---------- tail (behind everything else in the body) ---------- */}
        <g className="tail">
          <path d="M53 63 Q75 65 72 45 Q71 36 63 37" stroke="#1a1f32" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M53 63 Q75 65 72 45 Q71 36 63 37" stroke="url(#px-limb-v)" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M53 63 Q75 65 72 45 Q71 36 63 37" stroke="#7a82a8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35" strokeDasharray="0 6 30 40" />
          <circle cx="63" cy="37" r="3.6" fill="url(#px-light)" />
        </g>

        {/* ---------- arms: shoulder cap overlaps the torso so they read as attached ---------- */}
        <g className="arm-l">
          <rect x="15" y="47" width="9" height="19" rx="4.5" fill="url(#px-limb)" />
          <circle cx="19.5" cy="50" r="5" fill="url(#px-body)" />
          <circle cx="19.5" cy="66" r="4.4" fill="url(#px-limb)" />
          <circle cx="17.3" cy="67.6" r="0.9" fill="#1a1f32" />
          <circle cx="19.5" cy="68.4" r="0.9" fill="#1a1f32" />
          <circle cx="21.7" cy="67.6" r="0.9" fill="#1a1f32" />
        </g>
        <g className="arm-r">
          <rect x="56" y="47" width="9" height="19" rx="4.5" fill="url(#px-limb)" />
          <circle cx="60.5" cy="50" r="5" fill="url(#px-body)" />
          <circle cx="60.5" cy="66" r="4.4" fill="url(#px-limb)" />
          <circle cx="58.3" cy="67.6" r="0.9" fill="#1a1f32" />
          <circle cx="60.5" cy="68.4" r="0.9" fill="#1a1f32" />
          <circle cx="62.7" cy="67.6" r="0.9" fill="#1a1f32" />
        </g>

        {/* ---------- torso ---------- */}
        <path d="M22 56 Q22 43 40 43 Q58 43 58 56 L58 60 Q58 72 40 72 Q22 72 22 60 Z" fill="url(#px-body)" />
        {/* belly */}
        <ellipse cx="40" cy="60.5" rx="11" ry="9.5" fill="url(#px-light)" />
        <ellipse cx="40" cy="64" rx="9" ry="5" fill="#8d93ab" opacity="0.25" filter="url(#px-soft)" />
        {/* neck shadow cast by the head */}
        <ellipse cx="40" cy="47.5" rx="15" ry="4" fill="#0b0e18" opacity="0.5" filter="url(#px-soft)" />

        {/* ---------- collar + bell ---------- */}
        <path d="M25.5 45 Q40 52.5 54.5 45 Q40 49.5 25.5 45 Z" fill="url(#px-collar)" />
        <path d="M27 45.2 Q40 51 53 45.2" stroke="#e9ddff" strokeWidth="0.8" fill="none" opacity="0.5" />
        <circle cx="40" cy="51" r="7" fill="url(#px-glow)" opacity="0.8" />
        <circle className="chest" cx="40" cy="51" r="3.3" fill="url(#px-bell)" />
        <circle cx="38.9" cy="49.9" r="0.9" fill="#ffffff" opacity="0.9" />

        {/* ---------- ears ---------- */}
        <path d="M18.5 28 Q19 12 24.5 7.5 Q31 13 36.5 20.5 Z" fill="url(#px-head)" />
        <path d="M61.5 28 Q61 12 55.5 7.5 Q49 13 43.5 20.5 Z" fill="url(#px-head)" />
        <path d="M22 25 Q22.5 14.5 25 11 Q29.5 15.5 33 20.5 Z" fill="url(#px-ear)" opacity="0.9" />
        <path d="M58 25 Q57.5 14.5 55 11 Q50.5 15.5 47 20.5 Z" fill="url(#px-ear)" opacity="0.9" />

        {/* ---------- head ---------- */}
        {/* cheek fluff */}
        <ellipse cx="22" cy="36" rx="7.5" ry="6.5" fill="url(#px-head)" />
        <ellipse cx="58" cy="36" rx="7.5" ry="6.5" fill="url(#px-head)" />
        <path d="M15 33 L12.5 31 L15.5 36 L12 36.5 L16 38.5 Z" fill="#3a4262" />
        <path d="M65 33 L67.5 31 L64.5 36 L68 36.5 L64 38.5 Z" fill="#3a4262" />
        <ellipse cx="40" cy="31" rx="23" ry="19" fill="url(#px-head)" />
        {/* key-light sheen */}
        <ellipse cx="31" cy="19" rx="10" ry="4.5" fill="#ffffff" opacity="0.07" transform="rotate(-18 31 19)" />
        {/* forehead stripes */}
        <path d="M35.5 15.5 Q35 18 34.5 21.5 M40 14.5 Q40 17.5 40 21 M44.5 15.5 Q45 18 45.5 21.5" stroke="#1a1f32" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />

        {/* muzzle pads */}
        <ellipse cx="35.5" cy="38.5" rx="6.5" ry="5" fill="url(#px-light)" />
        <ellipse cx="44.5" cy="38.5" rx="6.5" ry="5" fill="url(#px-light)" />
        <ellipse cx="40" cy="42" rx="7" ry="2.5" fill="#0b0e18" opacity="0.2" filter="url(#px-soft)" />

        {/* ---------- eyes: outer group blinks, inner group tracks the cursor ---------- */}
        <g className="eye eye-l">
          <ellipse cx="31" cy="31" rx="5.2" ry="6" fill="#0b0e18" opacity="0.55" />
          <g className="eye-move">
            <g className="eye-open">
              <ellipse cx="31" cy="30.5" rx="4.6" ry="5.4" fill="url(#px-iris)" />
              <ellipse cx="31" cy="31" rx="1.6" ry="3.9" fill="#070910" />
              <path d="M26.6 29 Q31 24.6 35.4 29 Q31 27.4 26.6 29 Z" fill="#070910" opacity="0.35" />
              <circle cx="32.8" cy="28.2" r="1.5" fill="#ffffff" />
              <circle cx="29.6" cy="33" r="0.7" fill="#ffffff" opacity="0.7" />
            </g>
            <path className="eye-happy" d="M26.5 32 Q31 26.5 35.5 32" stroke="#22d3ee" strokeWidth="2.3" strokeLinecap="round" fill="none" />
          </g>
        </g>
        <g className="eye eye-r">
          <ellipse cx="49" cy="31" rx="5.2" ry="6" fill="#0b0e18" opacity="0.55" />
          <g className="eye-move">
            <g className="eye-open">
              <ellipse cx="49" cy="30.5" rx="4.6" ry="5.4" fill="url(#px-iris)" />
              <ellipse cx="49" cy="31" rx="1.6" ry="3.9" fill="#070910" />
              <path d="M44.6 29 Q49 24.6 53.4 29 Q49 27.4 44.6 29 Z" fill="#070910" opacity="0.35" />
              <circle cx="50.8" cy="28.2" r="1.5" fill="#ffffff" />
              <circle cx="47.6" cy="33" r="0.7" fill="#ffffff" opacity="0.7" />
            </g>
            <path className="eye-happy" d="M44.5 32 Q49 26.5 53.5 32" stroke="#22d3ee" strokeWidth="2.3" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* nose + mouth */}
        <path d="M37.6 36.3 Q40 35.3 42.4 36.3 Q41.6 39.3 40 39.6 Q38.4 39.3 37.6 36.3 Z" fill="url(#px-ear)" />
        <circle cx="39" cy="36.9" r="0.6" fill="#ffffff" opacity="0.6" />
        <path className="mouth" d="M36.2 40 Q38.1 42.6 40 40.2 Q41.9 42.6 43.8 40" stroke="#1a1f32" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.85" />

        {/* whiskers */}
        <path d="M28 37 Q22 35 15.5 34.5 M28 39.5 Q21 40 15 41.5 M28.5 42 Q22.5 44 17 46" stroke="#d8dcea" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M52 37 Q58 35 64.5 34.5 M52 39.5 Q59 40 65 41.5 M51.5 42 Q57.5 44 63 46" stroke="#d8dcea" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* cheeks */}
        <ellipse cx="25.5" cy="37.5" rx="2.6" ry="1.6" fill="#f472b6" opacity="0.35" filter="url(#px-soft)" />
        <ellipse cx="54.5" cy="37.5" rx="2.6" ry="1.6" fill="#f472b6" opacity="0.35" filter="url(#px-soft)" />

        {/* sleep glyphs (shown only while sleeping) */}
        <path className="zz zz-1" d="M63 12 h5 l-5 5 h5" stroke="#aab0c4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path className="zz zz-2" d="M70 5 h3.5 l-3.5 3.5 h3.5" stroke="#aab0c4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}
