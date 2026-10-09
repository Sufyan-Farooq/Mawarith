import { SupportedLanguage } from '../i18n/translations';
import { CURRENCIES } from '../utils/currency';
import { BrandLogo } from './ui/BrandLogo';
interface NavbarProps {language: SupportedLanguage; onSelectLanguage: (l: SupportedLanguage) => void; currency: string; onSelectCurrency: (c: string) => void;}
export function Navbar({language,onSelectLanguage,currency,onSelectCurrency}: NavbarProps) {
  return <header className="app-header"><div className="header-content"><a href="#" className="brand-link" aria-label="Mawarith"><BrandLogo size={38}/><span className="brand-type"><span lang="ar" dir="rtl" className="brand-arabic">{language === 'ur' ? 'مواریث' : 'مَوارِيث'}</span><span className="brand-latin" lang="en">Mawarith</span></span></a><div className="header-settings">
    <select aria-label={language === 'en' ? 'Currency' : language === 'ar' ? 'العملة' : 'کرنسی'} value={currency} onChange={e => onSelectCurrency(e.target.value)}>{CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}</select>
    <select aria-label={language === 'en' ? 'Language' : language === 'ar' ? 'اللغة' : 'زبان'} value={language} onChange={e => onSelectLanguage(e.target.value as SupportedLanguage)}><option value="en">English</option><option value="ar">العربية</option><option value="ur">اردو</option></select>
  </div></div></header>;
}
