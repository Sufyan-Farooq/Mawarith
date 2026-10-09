import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { VisualStudio } from './components/VisualStudio';
const DaleelModal = lazy(() => import('./components/DaleelModal').then(module => ({ default: module.DaleelModal })));
import { WelcomeModal } from './components/WelcomeModal';
import { DeceasedGender, EstateInput, HeirsInput } from './engine/types';
import { calculateInheritance } from './engine/calculator';
import { SupportedLanguage } from './i18n/translations';
import { SampleScenario } from './data/samples';
import { SAMPLE_SCENARIOS } from './data/samples';
import { workflow } from './i18n/workflow';

const initialEstate: EstateInput = {
  cash: 0,
  realEstate: 0,
  goldJewelry: 0,
  otherAssets: 0,
  burialCosts: 0,
  debtsCollateral: 0,
  debtsUnsecured: 0,
  wasiyyahAmount: 0,
  wasiyyahRecipientIsHeir: false,
  cashItems: [],
};

const initialHeirs: HeirsInput = {
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
};

export const App: React.FC = () => {
  // Navigation & Localization
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('mawarith_language');
    return saved === 'ar' || saved === 'ur' ? saved : 'en';
  });
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('mawarith_currency') || 'SAR';
  });

  // Islamic Estate State
  const [gender, setGender] = useState<DeceasedGender>('male');
  const [estate, setEstate] = useState<EstateInput>(initialEstate);
  const [heirs, setHeirs] = useState<HeirsInput>(initialHeirs);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [undoState, setUndoState] = useState<{
    gender: DeceasedGender;
    estate: EstateInput;
    heirs: HeirsInput;
    scenarioId: string | null;
  } | null>(null);

  // Supporting evidence and first-use guidance
  const [daleelModal, setDaleelModal] = useState<{
    isOpen: boolean;
    daleelIds: string[];
    title: string;
  }>({
    isOpen: false,
    daleelIds: [],
    title: '',
  });

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

  const handleGenderChange = (g: DeceasedGender) => {
    setGender(g);
    setActiveScenarioId(null);
  };

  const handleEstateChange = (updater: EstateInput | ((prev: EstateInput) => EstateInput)) => {
    setEstate(updater);
    setActiveScenarioId(null);
  };

  const handleHeirsChange = (updated: HeirsInput) => {
    setHeirs(updated);
    setActiveScenarioId(null);
  };

  const handleLoadScenario = (scenario: SampleScenario) => {
    setGender(scenario.gender);
    setEstate(scenario.estate);
    setHeirs(scenario.heirs);
    setActiveScenarioId(scenario.id);
  };

  const handleReset = () => {
    if (activeScenarioId || Object.values(estate).some(v => typeof v === 'number' && v > 0) || Object.entries(heirs).some(([key,v]) => key !== 'heirNames' && Boolean(v))) setUndoState({
      gender,
      estate,
      heirs,
      scenarioId: activeScenarioId,
    });
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
    setActiveScenarioId(null);
  };

  const handleUndoReset = () => {
    if (!undoState) return;
    setGender(undoState.gender);
    setEstate(undoState.estate);
    setHeirs(undoState.heirs);
    setActiveScenarioId(undoState.scenarioId);
    setUndoState(null);
  };

  const c = workflow(language);
  const isRtl = language === 'ar' || language === 'ur';

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-obsidian-900 selection:bg-jade-500/20 selection:text-jade-950">
      

      {/* Top Navigation */}
      <Navbar
        language={language}
        onSelectLanguage={setLanguage}
        currency={currency}
        onSelectCurrency={setCurrency}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <VisualStudio
            gender={gender}
            onChangeGender={handleGenderChange}
            estate={estate}
            onChangeEstate={handleEstateChange}
            heirs={heirs}
            onChangeHeirs={handleHeirsChange}
            result={calculationResult}
            currency={currency}
            language={language}
            onOpenDaleel={(daleelIds, title) => setDaleelModal({ isOpen: true, daleelIds, title })}
            onLoadScenario={handleLoadScenario}
            onReset={handleReset}
            activeScenarioId={activeScenarioId}
            onUndoReset={handleUndoReset}
            canUndoReset={Boolean(undoState)}
        />
      </main>

      <footer className="app-footer" dir={isRtl ? 'rtl' : 'ltr'}>
        <span>{language === 'en' ? 'Mawarith · Islamic inheritance calculator' : language === 'ar' ? 'مواريث · حاسبة الميراث الإسلامي' : 'مواریث · اسلامی وراثت کا حساب'}</span>
        <button onClick={() => setIsWelcomeOpen(true)}>{c.help}</button>
      </footer>

      {/* Modals */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        language={language}
        onStartFresh={() => {
          handleReset();
          setIsWelcomeOpen(false);
        }}
        onExploreDemo={() => {
          handleLoadScenario(SAMPLE_SCENARIOS[0]);
          setIsWelcomeOpen(false);
        }}
      />

      <Suspense fallback={null}><DaleelModal
        daleelIds={daleelModal.daleelIds}
        isOpen={daleelModal.isOpen}
        onClose={() => setDaleelModal({ isOpen: false, daleelIds: [], title: '' })}
        language={language}
        heirTitle={daleelModal.title}
      /></Suspense>



    </div>
  );
};
export default App;
