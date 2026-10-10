'use client';

import React from 'react';
import { useSettingsStore } from '@/stores/settings-store';

export const UniverseBackground = () => {
  const resolvedTheme = useSettingsStore((s) => s.resolvedTheme);
  const isLight = resolvedTheme === 'light';

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Subtle modern radial background */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: isLight
            ? `
              radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.06) 0%, transparent 40%)
            `
            : `
              radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.04) 0%, transparent 40%)
            `,
        }}
      />
      {/* Crisp technical dot grid */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: isLight
            ? `radial-gradient(rgba(15, 23, 42, 0.12) 1px, transparent 1px)`
            : `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          opacity: isLight ? 0.7 : 0.04,
        }}
      />
    </div>
  );
};
