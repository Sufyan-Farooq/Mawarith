import { ArrowRight, X } from 'lucide-react';
import { SupportedLanguage } from '../i18n/translations';
import { workflow } from '../i18n/workflow';
import { HeritageRule } from './ui/HeritageSignature';
import { BrandLogo } from './ui/BrandLogo';
import { Dialog } from './ui/Dialog';
interface WelcomeModalProps {
  isOpen: boolean; onClose: () => void; language: SupportedLanguage;
  onStartFresh: () => void; onExploreDemo: () => void;
}
export function WelcomeModal({ isOpen, onClose, language, onStartFresh, onExploreDemo }: WelcomeModalProps) {
  const c = workflow(language);
  const dismiss = (action: () => void) => { localStorage.setItem('mawarith_welcome_dismissed', 'true'); action(); };
  return <Dialog open={isOpen} onClose={() => dismiss(onClose)} titleId="welcome-title">
    <div className="welcome-content" dir={language === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex items-center justify-between mb-8"><BrandLogo size={40} /><button className="icon-button" onClick={() => dismiss(onClose)} aria-label={c.close}><X size={20} /></button></div>
      <p className="welcome-bismillah" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p><HeritageRule/>
      <h2 id="welcome-title" className="text-3xl font-semibold tracking-tight leading-tight">{c.welcome}</h2>
      <p className="mt-4 text-obsidian-600 leading-relaxed">{c.welcomeBody}</p>
      <ol className="welcome-steps">{c.steps.map((step, i) => <li key={step}><span>{i + 1}</span><p>{step}</p></li>)}</ol>
      <p className="guidance-copy mb-6">{c.guidance}</p>
      <button className="primary-button w-full" onClick={() => dismiss(onStartFresh)}>{c.start}<ArrowRight size={18} className={language === 'en' ? '' : 'rotate-180'} /></button>
      <button className="secondary-button w-full mt-3" onClick={() => dismiss(onExploreDemo)}>{c.example}</button>
    </div>
  </Dialog>;
}
