import { SupportedLanguage } from '../../i18n/translations';
export function HeritageRule() {
  return <div className="heritage-rule" aria-hidden="true"><span/><svg viewBox="0 0 32 32" width="24" height="24" fill="none"><path d="M16 2 20.1 6.1 26 6 25.9 11.9 30 16 25.9 20.1 26 26 20.1 25.9 16 30 11.9 25.9 6 26 6.1 20.1 2 16 6.1 11.9 6 6 11.9 6.1Z" stroke="currentColor"/><path d="m16 9 7 7-7 7-7-7Z" stroke="currentColor"/><circle cx="16" cy="16" r="2" fill="currentColor"/></svg><span/></div>;
}
export function HeritageSignature({language}: {language: SupportedLanguage}) {
  return <div className="heritage-signature"><span lang="ar" dir="rtl" className="heritage-wordmark">مَوارِيث</span><HeritageRule/><span className="heritage-meaning">{language === 'en' ? 'The knowledge of inheritance' : language === 'ar' ? 'علم الفرائض والمواريث' : 'علمِ وراثت'}</span></div>;
}
