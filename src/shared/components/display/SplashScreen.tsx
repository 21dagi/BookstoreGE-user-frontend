import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/shared/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { resolvedTheme } = useThemeStore();
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 400);
    const t2 = setTimeout(() => setPhase('out'), 1800);
    const t3 = setTimeout(() => onFinish(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className={[
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500',
        phase === 'out' ? 'opacity-0' : 'opacity-100',
        isDark ? 'bg-[#0D0A0B]' : 'bg-[#FAF6F2]',
      ].join(' ')}
    >
      {/* Radial glow behind logo */}
      <div
        className={[
          'absolute w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none',
          isDark ? 'bg-[#7a2330]' : 'bg-[#F4C08A]',
        ].join(' ')}
      />

      {/* Logo */}
      <div
        className={[
          'relative flex items-center justify-center transition-all duration-500',
          phase === 'in' ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
        ].join(' ')}
      >
        <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10">
          <img
            src="/app-logo.png"
            alt="የኰኵሐ ሃይማኖት ሰንበት ት/ቤት"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Loading dots */}
      <div
        className={[
          'absolute bottom-16 flex items-center gap-1.5 transition-opacity duration-300',
          phase === 'hold' ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={[
              'w-1.5 h-1.5 rounded-full',
              isDark ? 'bg-white/30' : 'bg-[#7a2330]/30',
            ].join(' ')}
            style={{ animation: `splash-pulse 1s ${i * 0.2}s ease-in-out infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes splash-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
};
