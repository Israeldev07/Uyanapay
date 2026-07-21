export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, overflow: 'visible' }}
    >
      <defs>
        {/* Glow & Soft Shadow for 3D effect */}
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0e1526" floodOpacity="0.25" />
        </filter>

        {/* Highlight Gradient (metallic raised edges) */}
        <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9cc2ff" />
          <stop offset="35%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#1e5eff" />
          <stop offset="100%" stopColor="#0b3066" />
        </linearGradient>

        {/* Metallic body gradient */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Inner groove gradient (for the hollowed ribbon look) */}
        <linearGradient id="grooveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      {/* Group applying shadow */}
      <g filter="url(#logoShadow)">
        {/* ============ U-Y Monogram Base Path ============ */}
        {/* Layer 1: Edge Highlight (Thickest) */}
        <path
          d="M 18,22 L 18,56 C 18,72 28,78 44,78 C 60,78 60,56 60,56 L 60,35 C 60,23 76,23 76,35 L 94,20"
          stroke="url(#edgeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Layer 2: Main Body */}
        <path
          d="M 18,22 L 18,56 C 18,72 28,78 44,78 C 60,78 60,56 60,56 L 60,35 C 60,23 76,23 76,35 L 94,20"
          stroke="url(#bodyGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Layer 3: Inner Groove */}
        <path
          d="M 18,22 L 18,56 C 18,72 28,78 44,78 C 60,78 60,56 60,56 L 60,35 C 60,23 76,23 76,35 L 94,20"
          stroke="url(#grooveGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ============ Y Descender Loop (Overlapping tail) ============ */}
        {/* Layer 1: Edge Highlight */}
        <path
          d="M 76,35 L 76,52 C 76,72 62,88 44,90 C 30,92 20,84 20,72"
          stroke="url(#edgeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Layer 2: Main Body */}
        <path
          d="M 76,35 L 76,52 C 76,72 62,88 44,90 C 30,92 20,84 20,72"
          stroke="url(#bodyGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Layer 3: Inner Groove */}
        <path
          d="M 76,35 L 76,52 C 76,72 62,88 44,90 C 30,92 20,84 20,72"
          stroke="url(#grooveGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function LogoText({ dark = false, size = 20 }: { dark?: boolean; size?: number }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-grotesk)',
        fontWeight: 700,
        fontSize: size,
        letterSpacing: '-.02em',
      }}
    >
      <span style={{ color: dark ? '#fff' : '#0E1526' }}>U</span>
      <span style={{ color: dark ? '#5b86ff' : '#1E5EFF' }}>Yanapay</span>
    </div>
  );
}
