import React from 'react';
import { RotateCcw, BookOpenCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { DeceasedGender, EstateInput, HeirsInput, MawarithResult } from '../engine/types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/samples';
import { EstateLedger } from './EstateLedger';
import { HeirSelector } from './HeirSelector';
import { ResultsView } from './ResultsView';
import { CustomSelect, SelectOption } from './ui/CustomSelect';

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
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar' || language === 'ur';

  // Format classical scenarios as CustomSelect options
  const scenarioOptions: SelectOption[] = SAMPLE_SCENARIOS.map((s) => ({
    value: s.id,
    label: s.name[language],
    sublabel: s.description[language].slice(0, 45) + '...',
  }));

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top Controls Bar: Classical Case Studies & Rapid Reset */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-float flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-jade-50 text-jade-700 flex items-center justify-center border border-jade-200/60 shadow-micro">
            <BookOpenCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-obsidian-900 block">
              {t.sampleScenarios}
            </span>
            <span className="text-[11px] text-obsidian-500">
              {t.selectSample}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CustomSelect
            options={scenarioOptions}
            value=""
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

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onReset}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-obsidian-600 hover:text-obsidian-900 shadow-micro transition-colors cursor-pointer"
            title={language === 'ar' ? 'إعادة ضبط الحساب' : language === 'ur' ? 'دوبارہ شروع کریں' : 'Reset Everything'}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

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
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <ResultsView
            result={result}
            estate={estate}
            gender={gender}
            currency={currency}
            language={language}
            onOpenDaleel={onOpenDaleel}
            onOpenCertificate={onOpenCertificate}
          />
        </div>

      </div>

    </div>
  );
};
