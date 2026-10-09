import { useState, useLayoutEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, RotateCcw, Undo2, X } from 'lucide-react';
import { DeceasedGender, EstateInput, HeirsInput, MawarithResult } from '../engine/types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { workflow } from '../i18n/workflow';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/samples';
import { EstateLedger } from './EstateLedger';
import { HeirSelector } from './HeirSelector';
import { ResultsView } from './ResultsView';
import { HeritageSignature } from './ui/HeritageSignature';
import { Dialog } from './ui/Dialog';
interface VisualStudioProps {
  gender: DeceasedGender; onChangeGender: (g: DeceasedGender) => void;
  estate: EstateInput; onChangeEstate: (e: EstateInput | ((prev: EstateInput) => EstateInput)) => void;
  heirs: HeirsInput; onChangeHeirs: (h: HeirsInput) => void; result: MawarithResult;
  currency: string; language: SupportedLanguage;
  onOpenDaleel: (ids: string[], title: string) => void;
  onLoadScenario: (scenario: SampleScenario) => void; onReset: () => void;
  activeScenarioId?: string | null; onUndoReset?: () => void; canUndoReset?: boolean;
}
export function VisualStudio(props: VisualStudioProps) {
  const { language, estate, heirs, result, activeScenarioId, onLoadScenario, onReset, canUndoReset, onUndoReset } = props;
  const c = workflow(language); const t = TRANSLATIONS[language];
  const [step, setStep] = useState<'estate' | 'family' | 'results'>('estate');
  const [inputStep,setInputStep] = useState<'estate'|'family'>('estate');
  const [confirmReset, setConfirmReset] = useState(false);
  const scenario = SAMPLE_SCENARIOS.find(s => s.id === activeScenarioId);
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const target = document.getElementById(step === 'results' && window.matchMedia('(min-width: 1024px)').matches ? 'results-panel' : 'calculator-flow');
    target?.scrollIntoView({behavior: 'instant',block: 'start'});
    const heading = target?.querySelector<HTMLElement>('h2');
    heading?.setAttribute('tabindex','-1'); heading?.focus({preventScroll:true});
  }, [step]);
  const navigate = (next: typeof step) => { if (next !== 'results') setInputStep(next); setStep(next); };
  const renderSteps = () => (['estate','family','results'] as const).map((item,i) => <button key={item} aria-current={step === item ? 'step' : undefined} onClick={() => navigate(item)}><span>{i+1}</span>{c[item]}</button>);
  const reset = () => { onReset(); setConfirmReset(false); navigate('estate'); };
  const hasData = Object.values(estate).some(value => typeof value === 'number' && value > 0) || Object.entries(heirs).some(([key, value]) => key !== 'heirNames' && Boolean(value));
  return <div dir={language === 'en' ? 'ltr' : 'rtl'}>
    <div className="page-intro"><div className="intro-copy"><h1>{c.title}</h1><p>{c.intro}</p></div><HeritageSignature language={language}/></div>
    <div className="workspace-tools">
      <details className="example-picker"><summary>{c.examples}</summary><div className="example-menu">{SAMPLE_SCENARIOS.map(s => <button key={s.id} onClick={e => { onLoadScenario(s); e.currentTarget.closest('details')?.removeAttribute('open'); navigate('estate'); }}><strong>{s.name[language]}</strong><span>{s.description[language]}</span></button>)}</div></details>
      <div className="flex gap-3 items-center">{canUndoReset && <button className="text-action" onClick={() => { onUndoReset?.(); navigate('estate'); }}><Undo2 size={16}/>{c.undo}</button>}<button className="text-action" onClick={() => hasData ? setConfirmReset(true) : reset()}><RotateCcw size={16}/>{c.reset}</button></div>
    </div>
    {scenario && <div className="sample-notice"><strong>{c.sample}: {scenario.name[language]}</strong><p>{c.sampleNote}</p></div>}
    <div id="calculator-flow" className="calculator-grid">
      <section className={`input-workspace ${step === 'results' ? 'mobile-hidden' : ''}`}>
        <nav className="flow-nav" aria-label={language === 'en' ? 'Calculation steps' : c.help}>
          {renderSteps()}
        </nav>
        <div className="input-content">
          {inputStep !== 'family' ? <EstateLedger estate={props.estate} onChangeEstate={props.onChangeEstate} currency={props.currency} language={language}/> : <HeirSelector gender={props.gender} onChangeGender={props.onChangeGender} heirs={heirs} onChangeHeirs={props.onChangeHeirs} language={language}/>}
          <div className="flow-actions">{inputStep === 'family' && <button className="text-action" onClick={() => navigate('estate')}><ArrowLeft size={17}/>{c.back}</button>}<button className="primary-button" onClick={() => navigate(inputStep === 'family' ? 'results' : 'family')}>{inputStep === 'family' ? c.review : c.next}<ArrowRight size={18} className={language === 'en' ? '' : 'rotate-180'}/></button></div>
        </div>
      </section>
      <aside id="results-panel" className={`results-workspace ${step !== 'results' ? 'mobile-hidden' : ''}`}>
        {step === 'results' && <nav className="flow-nav results-nav lg:hidden" aria-label={c.help}>{renderSteps()}</nav>}
        <ResultsView result={result} currency={props.currency} language={language} onOpenDaleel={props.onOpenDaleel}/>
      </aside>
    </div>
    <Dialog open={confirmReset} onClose={() => setConfirmReset(false)} titleId="reset-title"><div className="welcome-content"><div className="flex justify-between gap-4"><h2 id="reset-title" className="text-xl font-semibold">{t.confirmResetTitle}</h2><button className="icon-button" aria-label={c.close} onClick={() => setConfirmReset(false)}><X size={20}/></button></div><p className="text-obsidian-600 mt-4 mb-6">{t.confirmResetDesc}</p><div className="flex flex-wrap justify-end gap-3"><button className="secondary-button" onClick={() => setConfirmReset(false)}>{t.cancel}</button><button className="primary-button" onClick={reset}>{c.reset}</button></div></div></Dialog>
  </div>;
}
