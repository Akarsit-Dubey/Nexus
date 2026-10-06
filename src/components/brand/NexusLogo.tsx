import React from 'react';

interface NexusLogoProps {
  className?: string;
  size?: number;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({ className = 'h-7 w-7', size }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-label="NEXUS Logo"
    >
      <defs>
        {/* Main Brand Gradient */}
        <linearGradient id="nexus-poly-grad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        {/* Ambient Glow */}
        <radialGradient id="nexus-nucleus-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </radialGradient>

        {/* Background rounded base */}
        <linearGradient id="nexus-base-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Container Base */}
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="16"
        fill="url(#nexus-base-grad)"
        stroke="#38bdf8"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />

      {/* Subtle Central Core Ambient Glow */}
      <circle cx="32" cy="32" r="16" fill="url(#nexus-nucleus-glow)" />

      {/* Cross orbital arcs linking constellation */}
      <path
        d="M 18 32 C 26 22, 38 22, 46 32"
        stroke="#38bdf8"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <path
        d="M 18 32 C 26 42, 38 42, 46 32"
        stroke="#c084fc"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />

      {/* Interconnecting 'N' universe constellation lines */}
      <line
        x1="18"
        y1="46"
        x2="18"
        y2="18"
        stroke="url(#nexus-poly-grad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="18"
        x2="46"
        y2="46"
        stroke="url(#nexus-poly-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="46"
        y1="46"
        x2="46"
        y2="18"
        stroke="url(#nexus-poly-grad)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Constellation Nodes */}
      {/* Top Left Node */}
      <circle cx="18" cy="18" r="4.5" fill="#020617" stroke="#38bdf8" strokeWidth="2.5" />
      <circle cx="18" cy="18" r="2" fill="#38bdf8" />

      {/* Bottom Left Node */}
      <circle cx="18" cy="46" r="3.5" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="18" cy="46" r="1.5" fill="#38bdf8" />

      {/* Central Nexus Core */}
      <circle cx="32" cy="32" r="5" fill="#020617" stroke="#a855f7" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="2" fill="#ffffff" />

      {/* Top Right Node */}
      <circle cx="46" cy="18" r="3.5" fill="#020617" stroke="#c084fc" strokeWidth="2" />
      <circle cx="46" cy="18" r="1.5" fill="#c084fc" />

      {/* Bottom Right Node */}
      <circle cx="46" cy="46" r="4.5" fill="#020617" stroke="#c084fc" strokeWidth="2.5" />
      <circle cx="46" cy="46" r="2" fill="#c084fc" />
    </svg>
  );
};
