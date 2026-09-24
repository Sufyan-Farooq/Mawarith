import React, { useState } from 'react';
import { RotateCcw, BookOpenCheck, AlertCircle, Undo2, ArrowDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DeceasedGender, EstateInput, HeirsInput, MawarithResult } from '../engine/types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/samples';
import { EstateLedger } from './EstateLedger';
import { HeirSelector } from './HeirSelector';
import { ResultsView } from './ResultsView';
import { CustomSelect, SelectOption } from './ui/CustomSelect';
import { formatCurrency } from '../utils/currency';

interface VisualStudioProps {
  gender: DeceasedGender;
  onChangeGender: (g: DeceasedGender) => void;
  estate: EstateInput;
  onChangeEstate: (e: EstateInput | ((prev: EstateInput) => EstateInput)) => void;
  heirs: HeirsInput;
  onChangeHeirs: (h: HeirsInput) => void;
  result: MawarithResult;
  currency: string;
  language: SupportedLanguage;
  onOpenDaleel: (daleelIds: string[], title: string) => void;
  onOpenCertificate: () => void;
  onLoadScenario: (scenario: SampleScenario) => void;
  onReset: () => void;
  activeScenarioId?: string | null;
  onUndoReset?: () => void;
  canUndoReset?: boolean;
}

export const VisualStudio: React.FC<VisualStudioProps> = ({
  gender,
  onChangeGender,
  estate,
  onChangeEstate,
  heirs,
  onChangeHeirs,
  result,
  currency,
  language,
  onOpenDaleel,
  onOpenCertificate,
  onLoadScenario,
  onReset,
  activeScenarioId,
  onUndoReset,
  canUndoReset,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar' || language === 'ur';
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeScenario = SAMPLE_SCENARIOS.find((s) => s.id === activeScenarioId);

  const hasEnteredData =
    (estate.cash > 0 || estate.realEstate > 0 || estate.goldJewelry > 0 || estate.otherAssets > 0 || estate.debtsUnsecured > 0) ||
    (heirs.sonsCount > 0 || heirs.daughtersCount > 0 || heirs.wivesCount > 0 || heirs.husband || heirs.father || heirs.mother || heirs.fullBrothersCount > 0) ||
    Boolean(heirs.deceasedName?.trim());

  const handleRequestReset = () => {
    if (hasEnteredData) {
      setShowResetConfirm(true);
    } else {
      onReset();
    }
  };

  // Format classical scenarios as CustomSelect options
  const scenarioOptions: SelectOption[] = SAMPLE_SCENARIOS.map((s) => ({
    value: s.id,
    label: s.name[language],
    sublabel: s.description[language].slice(0, 45) + '...',
  }));

  return (
    <div className="space-y-6 pb-20 lg:pb-0" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Top Controls Bar: Classical Case Studies & Rapid Reset */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-micro flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-jade-50 text-jade-700 flex items-center justify-center border border-jade-200/60 shadow-micro">
            <BookOpenCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-obsidian-900 flex flex-wrap items-center gap-2">
              {t.sampleScenarios}
              {activeScenario && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t.viewingSample}
                </span>
              )}
            </span>
            <span className="text-[11px] text-obsidian-500">
              {activeScenario ? activeScenario.name[language] : t.selectSample}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <CustomSelect
            options={scenarioOptions}
            value={activeScenarioId || ''}
            onChange={(val) => {
              const selected = SAMPLE_SCENARIOS.find((s) => s.id === val);
              if (selected) onLoadScenario(selected);
            }}
            placeholder={
              language === 'ar' 
                ? 'اختر مسألة فقهية نموذجية...' 
                : language === 'ur' 
                ? 'مشہور فقہی مسئلہ لوڈ کریں...' 
                : 'Load classical case study...'
            }
            className="flex-1 sm:flex-initial sm:min-w-[18rem]"
          />

          {canUndoReset && onUndoReset && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onUndoReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-jade-50 hover:bg-jade-100 text-jade-900 border border-jade-200 text-xs font-semibold shadow-micro transition-all cursor-pointer"
              title="Undo reset"
            >
              <Undo2 className="w-3.5 h-3.5 text-jade-700" />
              <span>{t.undo}</span>
            </motion.button>
          )}

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={handleRequestReset}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-obsidian-800 font-semibold text-xs shadow-micro transition-all active:scale-95 cursor-pointer"
            title={t.startFreshDesc}
          >
            <RotateCcw className="w-3.5 h-3.5 text-obsidian-500" />
            <span>{t.startFresh}</span>
          </motion.button>
        </div>
      </div>

      {/* Confirmation Modal when Resetting Entered Data */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="w-full max-w-md p-6 rounded-2xl bg-white border border-slate-200 shadow-float space-y-4"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100/90 text-amber-900 border border-amber-200 shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-obsidian-900">
                    {t.confirmResetTitle}
                  </h3>
                  <p className="text-xs text-obsidian-500 mt-1 leading-relaxed">
                    {t.confirmResetDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-obsidian-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetConfirm(false);
                    onReset();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-micro cursor-pointer transition-colors"
                >
                  {t.confirmResetConfirm}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Studio Grid (7 cols Input, 5 cols Sticky Live Results) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Input Forms */}
        <div className="lg:col-span-7 space-y-6">
          <EstateLedger
            estate={estate}
            onChangeEstate={onChangeEstate}
            currency={currency}
            language={language}
          />

          <HeirSelector
            gender={gender}
            onChangeGender={onChangeGender}
            heirs={heirs}
            onChangeHeirs={onChangeHeirs}
            language={language}
          />
        </div>

        {/* Right Sticky Calculation Ledger */}
        <div id="results-panel" className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 scroll-mt-28">
          <ResultsView
            result={result}
            estate={estate}
            gender={gender}
            currency={currency}
            language={language}
            onOpenDaleel={onOpenDaleel}
            onOpenCertificate={onOpenCertificate}
            onLoadSample={() => onLoadScenario(SAMPLE_SCENARIOS[0])}
          />
        </div>

      </div>

      <div className="fixed inset-x-3 bottom-3 z-30 lg:hidden">
        <button
          type="button"
          onClick={() => document.getElementById('results-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="w-full flex items-center justify-between gap-4 rounded-2xl bg-obsidian-900 text-white px-4 py-3 border border-white/10 shadow-float active:scale-[0.99] transition-transform"
          aria-label={language === 'ar' ? 'عرض نتائج الميراث' : language === 'ur' ? 'تقسیم کے نتائج دیکھیں' : 'View inheritance results'}
        >
          <span className="text-start min-w-0">
            <span className="block text-[10px] uppercase tracking-wider text-obsidian-400 font-semibold">
              {language === 'ar' ? 'صافي التركة' : language === 'ur' ? 'خالص ترکہ' : 'Net estate'}
            </span>
            <span className="block font-mono text-sm font-bold text-white truncate">
              {formatCurrency(result.summary.netInheritableEstate, currency, language)}
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-jade-600 px-3.5 py-2 text-xs font-bold shrink-0">
            {language === 'ar' ? 'عرض النتائج' : language === 'ur' ? 'نتائج دیکھیں' : 'View results'}
            <ArrowDown className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

    </div>
  );
};
