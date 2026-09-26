import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  language?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 32,
  className = '',
  showText = false,
  language = 'en',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Handcrafted Sacred Geometry Emblem (Rub el Hizb + Mathematical Division Astrolabe) */}
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-xl bg-obsidian-900 text-brass-400 p-1.5 shadow-float border border-white/[0.08]"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-brass-400 transition-transform duration-500 hover:rotate-45"
        >
          {/* Subtle Outer Boundary Ring */}
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1.5 1.5" className="opacity-40" />
          
          {/* Interlocking 8-Pointed Star Squares (Rub el Hizb ۞) */}
          <rect x="7" y="7" width="18" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.2" className="opacity-90" />
          <rect x="7" y="7" width="18" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.2" transform="rotate(45 16 16)" className="opacity-90" />
          
          {/* Center Division Compass Lines */}
          <line x1="16" y1="4" x2="16" y2="28" stroke="currentColor" strokeWidth="0.75" className="opacity-50" />
          <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="0.75" className="opacity-50" />
          
          {/* Core Central Astrolabe Hub */}
          <circle cx="16" cy="16" r="3" fill="currentColor" className="text-jade-500" />
          <circle cx="16" cy="16" r="1" fill="#070a0d" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-bold text-base tracking-tight text-obsidian-900 font-sans">
              Mawarith
            </span>
            <span className="font-arabic font-bold text-sm text-jade-700 pb-0.5">
              {language === 'ur' ? 'مواریث' : 'مَوارِيث'}
            </span>
          </div>
          <span className="text-xs text-obsidian-500 font-medium leading-none mt-1">
            {language === 'ar' ? 'علم الفرائض والمواريث' : language === 'ur' ? 'شرعی تقسیمِ ترکہ' : 'Shariah Inheritance System'}
          </span>
        </div>
      )}
    </div>
  );
};
