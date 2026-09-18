import React from 'react';
import { Users, User, Heart, GitFork, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { HeirsInput, DeceasedGender } from '../engine/types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { TactileStepper } from './ui/TactileStepper';

interface HeirSelectorProps {
  gender: DeceasedGender;
  onChangeGender: (gender: DeceasedGender) => void;
  heirs: HeirsInput;
  onChangeHeirs: (updated: HeirsInput) => void;
  language: SupportedLanguage;
}

export const HeirSelector: React.FC<HeirSelectorProps> = ({
  gender,
  onChangeGender,
  heirs,
  onChangeHeirs,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const updateNumeric = (key: keyof HeirsInput, val: number) => {
    onChangeHeirs({
      ...heirs,
      [key]: val,
    });
  };

  const toggleBoolean = (key: keyof HeirsInput) => {
    onChangeHeirs({
      ...heirs,
      [key]: !heirs[key],
    });
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-float space-y-6">
      
      {/* 1. Deceased Gender Selector (Segmented Spring Toggle) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-obsidian-900 tracking-tight flex items-center gap-2">
            <User className="w-4 h-4 text-jade-700" />
            <span>{t.deceasedDetails}</span>
          </h2>
          <p className="text-xs text-obsidian-500 mt-0.5">
            {language === 'ar' ? 'يحدد أحكام الزوجية والفروض المقدرة' : language === 'ur' ? 'شریک حیات کے حصص کا تعین' : 'Determines spousal rules and Quranic fractions'}
          </p>
        </div>

        {/* Segmented Radio Buttons */}
        <div className="relative flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 w-fit">
          <button
            type="button"
            onClick={() => {
              onChangeGender('male');
              onChangeHeirs({ ...heirs, husband: false });
            }}
            className={`relative z-10 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${
              gender === 'male' ? 'text-white' : 'text-obsidian-700 hover:text-obsidian-900'
            }`}
          >
            {gender === 'male' && (
              <motion.div
                layoutId="gender-selector-active"
                className="absolute inset-0 rounded-lg bg-obsidian-900 shadow-float"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>{t.male}</span>
              <span className="text-[11px] opacity-70">({language === 'ar' ? 'مورث' : 'Husband/Father'})</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeGender('female');
              onChangeHeirs({ ...heirs, wivesCount: 0 });
            }}
            className={`relative z-10 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${
              gender === 'female' ? 'text-white' : 'text-obsidian-700 hover:text-obsidian-900'
            }`}
          >
            {gender === 'female' && (
              <motion.div
                layoutId="gender-selector-active"
                className="absolute inset-0 rounded-lg bg-obsidian-900 shadow-float"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>{t.female}</span>
              <span className="text-[11px] opacity-70">({language === 'ar' ? 'مورثة' : 'Wife/Mother'})</span>
            </span>
          </button>
        </div>
      </div>

      {/* 2. Surviving Relatives Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-obsidian-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-jade-700" />
            <span>{t.survivingRelatives}</span>
          </h3>
          <p className="text-xs text-obsidian-500 mt-0.5">
            {t.relativesSubtitle}
          </p>
        </div>
      </div>

      {/* Ring 1: Spouses (الزوجية) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-obsidian-700 uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>{t.spouses}</span>
        </div>

        {gender === 'male' ? (
          <TactileStepper
            label={t.wives}
            sublabel={language === 'ar' ? 'يشتركن في الربع (دون فرع وارث) أو الثمن بالسوية' : language === 'ur' ? 'برابر کی شریک (1/4 یا 1/8)' : 'Share 1/4 (no children) or 1/8 equally'}
            value={heirs.wivesCount}
            onChange={(val) => updateNumeric('wivesCount', val)}
            max={4}
          />
        ) : (
          <div className="flex items-center justify-between py-2.5 px-3 rounded-xl border border-slate-200/80 bg-white">
            <div>
              <span className="text-xs font-bold text-obsidian-800 block">{t.husband}</span>
              <span className="text-[11px] text-obsidian-400">
                {language === 'ar' ? 'له النصف (دون فرع وارث) أو الربع' : language === 'ur' ? 'نصف یا چوتھائی کا حقدار' : 'Takes 1/2 or 1/4'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggleBoolean('husband')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                heirs.husband
                  ? 'bg-jade-700 text-white shadow-micro'
                  : 'bg-slate-100 hover:bg-slate-200 text-obsidian-700'
              }`}
            >
              {heirs.husband 
                ? (language === 'ar' ? 'نعم (حي)' : language === 'ur' ? 'حیات ہے' : 'Alive') 
                : (language === 'ar' ? 'غير موجود' : language === 'ur' ? 'موجود نہیں' : 'Not Alive')}
            </button>
          </div>
        )}
      </div>

      {/* Ring 2: Descendants - Children & Grandchildren (الفروع) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-obsidian-700 uppercase tracking-wider">
          <GitFork className="w-3.5 h-3.5 text-jade-600" />
          <span>{t.childrenAndGrandchildren}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <TactileStepper
            label={t.sons}
            sublabel={language === 'ar' ? 'عصبة بالنفس (يحجبون الحواشي)' : 'Asabah bi-Nafs (blocks collaterals)'}
            value={heirs.sonsCount}
            onChange={(val) => updateNumeric('sonsCount', val)}
          />

          <TactileStepper
            label={t.daughters}
            sublabel={language === 'ar' ? 'النصف للواحدة، الثلثان لأكثر' : '1/2 for single, 2/3 for two or more'}
            value={heirs.daughtersCount}
            onChange={(val) => updateNumeric('daughtersCount', val)}
          />

          <TactileStepper
            label={t.grandsons}
            sublabel={language === 'ar' ? 'ابن الابن وإن نزل' : 'Grandson from son'}
            value={heirs.grandsonsCount}
            onChange={(val) => updateNumeric('grandsonsCount', val)}
          />

          <TactileStepper
            label={t.granddaughters}
            sublabel={language === 'ar' ? 'بنت الابن وإن نزلت' : 'Granddaughter from son'}
            value={heirs.granddaughtersCount}
            onChange={(val) => updateNumeric('granddaughtersCount', val)}
          />
        </div>
      </div>

      {/* Ring 3: Ascendants - Parents & Grandparents (الأصول) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-obsidian-700 uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-brass-600" />
          <span>{t.parentsAndGrandparents}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {[
            { key: 'father', label: t.father, sub: language === 'ar' ? 'الأب' : 'Father' },
            { key: 'mother', label: t.mother, sub: language === 'ar' ? 'الأم' : 'Mother' },
            { key: 'paternalGrandfather', label: t.paternalGrandfather, sub: language === 'ar' ? 'الجد لأب' : 'Paternal Grandfather' },
            { key: 'maternalGrandmother', label: t.maternalGrandmother, sub: language === 'ar' ? 'الجدة لأم' : 'Maternal Grandmother' },
            { key: 'paternalGrandmother', label: t.paternalGrandmother, sub: language === 'ar' ? 'الجدة لأب' : 'Paternal Grandmother' },
          ].map((item) => {
            const isAlive = Boolean(heirs[item.key as keyof HeirsInput]);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleBoolean(item.key as keyof HeirsInput)}
                className={`p-3 rounded-xl border text-start flex items-center justify-between transition-all duration-200 active:scale-95 ${
                  isAlive
                    ? 'bg-jade-50/70 border-jade-600 text-jade-950 shadow-micro'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 text-obsidian-700'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{item.label}</span>
                  <span className="text-[10px] text-obsidian-400">{item.sub}</span>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  isAlive ? 'bg-jade-700 text-white' : 'bg-slate-100 text-obsidian-500'
                }`}>
                  {isAlive 
                    ? (language === 'ar' ? 'حي' : language === 'ur' ? 'حیات' : 'Alive') 
                    : (language === 'ar' ? 'متوفى' : language === 'ur' ? 'مرحوم' : 'No')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ring 4: Siblings (الحواشي - الإخوة والأخوات) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-obsidian-700 uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-obsidian-600" />
          <span>{t.siblings}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <TactileStepper
            label={t.fullBrothers}
            value={heirs.fullBrothersCount}
            onChange={(val) => updateNumeric('fullBrothersCount', val)}
          />

          <TactileStepper
            label={t.fullSisters}
            value={heirs.fullSistersCount}
            onChange={(val) => updateNumeric('fullSistersCount', val)}
          />

          <TactileStepper
            label={t.paternalBrothers}
            value={heirs.paternalBrothersCount}
            onChange={(val) => updateNumeric('paternalBrothersCount', val)}
          />

          <TactileStepper
            label={t.paternalSisters}
            value={heirs.paternalSistersCount}
            onChange={(val) => updateNumeric('paternalSistersCount', val)}
          />

          <TactileStepper
            label={t.maternalBrothers}
            value={heirs.maternalBrothersCount}
            onChange={(val) => updateNumeric('maternalBrothersCount', val)}
          />

          <TactileStepper
            label={t.maternalSisters}
            value={heirs.maternalSistersCount}
            onChange={(val) => updateNumeric('maternalSistersCount', val)}
          />
        </div>
      </div>

      {/* Ring 5: Collaterals (العصبات) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-semibold text-obsidian-500 border-t border-slate-100 pt-3">
          <span>{t.collaterals}</span>
          <span className="text-[11px] text-obsidian-400 font-normal">
            {language === 'ar' ? 'العصبة بالنفس عند انعدام الأقرب' : 'Agnatic collaterals'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <TactileStepper
            label={t.nephewsFull}
            value={heirs.nephewsFullCount}
            onChange={(val) => updateNumeric('nephewsFullCount', val)}
          />

          <TactileStepper
            label={t.nephewsPaternal}
            value={heirs.nephewsPaternalCount}
            onChange={(val) => updateNumeric('nephewsPaternalCount', val)}
          />

          <TactileStepper
            label={t.unclesFull}
            value={heirs.paternalUnclesFullCount}
            onChange={(val) => updateNumeric('paternalUnclesFullCount', val)}
          />

          <TactileStepper
            label={t.unclesPaternal}
            value={heirs.paternalUnclesPaternalCount}
            onChange={(val) => updateNumeric('paternalUnclesPaternalCount', val)}
          />

          <TactileStepper
            label={t.cousinsFull}
            value={heirs.cousinsFullCount}
            onChange={(val) => updateNumeric('cousinsFullCount', val)}
          />

          <TactileStepper
            label={t.cousinsPaternal}
            value={heirs.cousinsPaternalCount}
            onChange={(val) => updateNumeric('cousinsPaternalCount', val)}
          />
        </div>
      </div>

    </div>
  );
};
