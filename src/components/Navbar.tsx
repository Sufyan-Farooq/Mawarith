import React from 'react';
import { LayoutGrid, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { CURRENCIES } from '../utils/currency';
import { BrandLogo } from './ui/BrandLogo';
import { CustomSelect, SelectOption } from './ui/CustomSelect';

interface NavbarProps {
  currentMode: 'chat' | 'studio';
  onSelectMode: (mode: 'chat' | 'studio') => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  currency: string;
  onSelectCurrency: (curr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  language,
  onSelectLanguage,
  currency,
  onSelectCurrency,
}) => {
  const t = TRANSLATIONS[language];

  // Currency select options
  const currencyOptions: SelectOption[] = CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.code} (${c.symbol})`,
  }));

  // Language select options
  const languageOptions: SelectOption[] = [
    { value: 'en', label: 'English (EN)' },
    { value: 'ar', label: 'العربية (AR)' },
    { value: 'ur', label: 'اردو (UR)' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Emblem & Typography */}
          <div className="flex items-center gap-3">
            <BrandLogo size={36} showText={true} language={language} />
          </div>

          {/* Framer-grade Sliding Pill Switcher */}
          <nav className="relative flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/70">
            {/* Visual Studio Tab */}
            <button
              type="button"
              onClick={() => onSelectMode('studio')}
              className={`relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${
                currentMode === 'studio' ? 'text-white' : 'text-obsidian-600 hover:text-obsidian-900'
              }`}
            >
              {currentMode === 'studio' && (
                <motion.div
                  layoutId="active-mode-indicator"
                  className="absolute inset-0 rounded-lg bg-obsidian-900 shadow-float"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                />
              )}
              <LayoutGrid className="relative z-10 w-4 h-4" />
              <span className="relative z-10">{t.visualMode}</span>
            </button>

            {/* AI Advisor Tab */}
            <button
              type="button"
              onClick={() => onSelectMode('chat')}
              className={`relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${
                currentMode === 'chat' ? 'text-white' : 'text-obsidian-600 hover:text-obsidian-900'
              }`}
            >
              {currentMode === 'chat' && (
                <motion.div
                  layoutId="active-mode-indicator"
                  className="absolute inset-0 rounded-lg bg-obsidian-900 shadow-float"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                />
              )}
              <MessageSquare className="relative z-10 w-4 h-4" />
              <span className="relative z-10">{t.conversationalMode}</span>
            </button>
          </nav>

          {/* Currency & Language Custom Dropdowns (Zero Default Selects) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <CustomSelect
              options={currencyOptions}
              value={currency}
              onChange={onSelectCurrency}
              size="sm"
            />

            <CustomSelect
              options={languageOptions}
              value={language}
              onChange={(val) => onSelectLanguage(val as SupportedLanguage)}
              size="sm"
            />
          </div>

        </div>
      </div>
    </header>
  );
};
