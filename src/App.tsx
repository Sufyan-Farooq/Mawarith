import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VisualStudio } from './components/VisualStudio';
import { ChatInterface } from './components/ChatInterface';
import { DaleelModal } from './components/DaleelModal';
import { CertificateModal } from './components/CertificateModal';
import { WelcomeModal } from './components/WelcomeModal';
import { BetaDisclaimerBanner } from './components/BetaDisclaimerBanner';
import { DeceasedGender, EstateInput, HeirsInput } from './engine/types';
import { calculateInheritance } from './engine/calculator';
import { SupportedLanguage, TRANSLATIONS } from './i18n/translations';
import { SampleScenario } from './data/samples';
import { BrandLogo } from './components/ui/BrandLogo';

const initialEstate: EstateInput = {
  cash: 180000,
  realEstate: 0,
  goldJewelry: 0,
  otherAssets: 0,
  burialCosts: 2000,
  debtsCollateral: 0,
  debtsUnsecured: 3000,
  wasiyyahAmount: 15000,
  wasiyyahRecipientIsHeir: false,
  cashItems: [
    { id: 'c1', name: 'Account 1', amount: 100000 },
    { id: 'c2', name: 'Account 2', amount: 80000 },
  ],
};

const initialHeirs: HeirsInput = {
  wivesCount: 1,
  husband: false,
  father: true,
  mother: true,
  paternalGrandfather: false,
  maternalGrandmother: false,
  paternalGrandmother: false,
  sonsCount: 1,
  daughtersCount: 2,
  grandsonsCount: 0,
  granddaughtersCount: 0,
  fullBrothersCount: 0,
  fullSistersCount: 0,
  paternalBrothersCount: 0,
  paternalSistersCount: 0,
  maternalBrothersCount: 0,
  maternalSistersCount: 0,
  nephewsFullCount: 0,
  nephewsPaternalCount: 0,
  paternalUnclesFullCount: 0,
  paternalUnclesPaternalCount: 0,
  cousinsFullCount: 0,
  cousinsPaternalCount: 0,
  deceasedName: '',
  heirNames: {},
};

export const App: React.FC = () => {
  // Navigation & Localization
  const [currentMode, setCurrentMode] = useState<'studio' | 'chat'>('studio');
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('mawarith_language') as SupportedLanguage) || 'en';
  });
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('mawarith_currency') || 'SAR';
  });

  // Islamic Estate State
  const [gender, setGender] = useState<DeceasedGender>('male');
  const [estate, setEstate] = useState<EstateInput>(initialEstate);
  const [heirs, setHeirs] = useState<HeirsInput>(initialHeirs);

  // Daleel & Certificate Modals
  const [daleelModal, setDaleelModal] = useState<{
    isOpen: boolean;
    daleelIds: string[];
    title: string;
  }>({
    isOpen: false,
    daleelIds: [],
    title: '',
  });

  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => {
    return localStorage.getItem('mawarith_welcome_dismissed') !== 'true';
  });

  // Sync RTL direction on HTML root
  useEffect(() => {
    const isRtl = language === 'ar' || language === 'ur';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('mawarith_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mawarith_currency', currency);
  }, [currency]);

  // Instant Live Shariah Calculation
  const calculationResult = useMemo(() => {
    return calculateInheritance(gender, estate, heirs);
  }, [gender, estate, heirs]);

  const handleLoadScenario = (scenario: SampleScenario) => {
    setGender(scenario.gender);
    setEstate(scenario.estate);
    setHeirs(scenario.heirs);
  };

  const handleReset = () => {
    setGender('male');
    setEstate({
      cash: 0,
      realEstate: 0,
      goldJewelry: 0,
      otherAssets: 0,
      burialCosts: 0,
      debtsCollateral: 0,
      debtsUnsecured: 0,
      wasiyyahAmount: 0,
      cashItems: [],
      realEstateItems: [],
      goldJewelryItems: [],
      otherAssetsItems: [],
      debtsItems: [],
    });
    setHeirs({
      wivesCount: 0,
      husband: false,
      father: false,
      mother: false,
      paternalGrandfather: false,
      maternalGrandmother: false,
      paternalGrandmother: false,
      sonsCount: 0,
      daughtersCount: 0,
      grandsonsCount: 0,
      granddaughtersCount: 0,
      fullBrothersCount: 0,
      fullSistersCount: 0,
      paternalBrothersCount: 0,
      paternalSistersCount: 0,
      maternalBrothersCount: 0,
      maternalSistersCount: 0,
      nephewsFullCount: 0,
      nephewsPaternalCount: 0,
      paternalUnclesFullCount: 0,
      paternalUnclesPaternalCount: 0,
      cousinsFullCount: 0,
      cousinsPaternalCount: 0,
      deceasedName: '',
      heirNames: {},
    });
  };

  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar' || language === 'ur';

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-obsidian-900 selection:bg-jade-500/20 selection:text-jade-950">
      
      {/* Top Ambient Hairline Lighting */}
      <div className="hairline-highlight" />

      {/* Top Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        language={language}
        onSelectLanguage={setLanguage}
        currency={currency}
        onSelectCurrency={setCurrency}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Beta Testing Advisory Banner */}
        <BetaDisclaimerBanner
          language={language}
          onOpenWelcome={() => setIsWelcomeOpen(true)}
        />

        {currentMode === 'studio' ? (
          <VisualStudio
            gender={gender}
            onChangeGender={setGender}
            estate={estate}
            onChangeEstate={setEstate}
            heirs={heirs}
            onChangeHeirs={setHeirs}
            result={calculationResult}
            currency={currency}
            language={language}
            onOpenDaleel={(daleelIds, title) => setDaleelModal({ isOpen: true, daleelIds, title })}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            onLoadScenario={handleLoadScenario}
            onReset={handleReset}
          />
        ) : (
          <ChatInterface
            language={language}
            onSwitchToStudioWithData={(g, e, h) => {
              setGender(g);
              setEstate(e);
              setHeirs(h);
              setCurrentMode('studio');
            }}
          />
        )}
      </main>

      {/* Brand-Elevated Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/70 py-6 mt-12" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-obsidian-500">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={22} />
            <span className="font-semibold text-obsidian-800">{t.appName}</span>
            <span className="text-obsidian-300">•</span>
            <span>{t.appSubtitle}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-obsidian-400 font-medium">
            <button
              type="button"
              onClick={() => setIsWelcomeOpen(true)}
              className="text-jade-700 hover:text-jade-800 underline underline-offset-2 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'أهمية الفرائض' : language === 'ur' ? 'علمِ میراث کی اہمیت' : 'Why Mawarith?'}
            </button>
            <span>•</span>
            <span>{t.scholarBasis}</span>
            <span>•</span>
            <span className="font-mono bg-jade-50 text-jade-800 px-2 py-0.5 rounded border border-jade-200/60 font-semibold">
              v1.0.0 Beta
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        language={language}
      />

      <DaleelModal
        daleelIds={daleelModal.daleelIds}
        isOpen={daleelModal.isOpen}
        onClose={() => setDaleelModal({ isOpen: false, daleelIds: [], title: '' })}
        language={language}
        heirTitle={daleelModal.title}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        result={calculationResult}
        estate={estate}
        gender={gender}
        currency={currency}
        language={language}
      />

    </div>
  );
};
export default App;
