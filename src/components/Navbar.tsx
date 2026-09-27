import React from 'react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { CURRENCIES } from '../utils/currency';
import { BrandLogo } from './ui/BrandLogo';
import { CustomSelect, SelectOption } from './ui/CustomSelect';

interface NavbarProps {
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  currency: string;
  onSelectCurrency: (curr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onSelectLanguage,
  currency,
  onSelectCurrency,
}) => {
  const t = TRANSLATIONS[language];

  // Currency select options
  const currencyOptions: SelectOption[] = CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.code} · ${c.symbol}`,
  }));

  // Language select options
  const languageOptions: SelectOption[] = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
    { value: 'ur', label: 'اردو' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between min-h-16 py-2 sm:py-0 gap-2 sm:gap-4">
          
          {/* Brand Emblem & Typography */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block">
              <BrandLogo size={36} showText={true} language={language} />
            </div>
            <div className="sm:hidden">
              <BrandLogo size={34} />
            </div>
          </div>

          {/* Currency & Language Custom Dropdowns (Zero Default Selects) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
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
