import React, { useState, useMemo } from 'react';
import { Users, User, Heart, GitFork, Shield, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';
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
  const [showNamesSection, setShowNamesSection] = useState(false);

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

  const activeHeirGroups = useMemo(() => {
    const groups: { key: string; label: string; count: number; singularLabel: string }[] = [];

    // Spouses
    if (gender === 'male' && heirs.wivesCount > 0) {
      groups.push({
        key: 'wives',
        label: t.wives,
        count: heirs.wivesCount,
        singularLabel: language === 'ar' ? 'الزوجة' : language === 'ur' ? 'بیوی' : 'Wife',
      });
    }
    if (gender === 'female' && heirs.husband) {
      groups.push({ key: 'husband', label: t.husband, count: 1, singularLabel: t.husband });
    }

    // Parents & Grandparents
    if (heirs.father) groups.push({ key: 'father', label: t.father, count: 1, singularLabel: t.father });
    if (heirs.mother) groups.push({ key: 'mother', label: t.mother, count: 1, singularLabel: t.mother });
    if (heirs.paternalGrandfather) {
      groups.push({ key: 'paternalGrandfather', label: t.paternalGrandfather, count: 1, singularLabel: t.paternalGrandfather });
    }
    if (heirs.maternalGrandmother) {
      groups.push({ key: 'maternalGrandmother', label: t.maternalGrandmother, count: 1, singularLabel: t.maternalGrandmother });
    }
    if (heirs.paternalGrandmother) {
      groups.push({ key: 'paternalGrandmother', label: t.paternalGrandmother, count: 1, singularLabel: t.paternalGrandmother });
    }

    // Descendants
    if (heirs.sonsCount > 0) {
      groups.push({
        key: 'sons',
        label: t.sons,
        count: heirs.sonsCount,
        singularLabel: language === 'ar' ? 'الابن' : language === 'ur' ? 'بیٹا' : 'Son',
      });
    }
    if (heirs.daughtersCount > 0) {
      groups.push({
        key: 'daughters',
        label: t.daughters,
        count: heirs.daughtersCount,
        singularLabel: language === 'ar' ? 'البنت' : language === 'ur' ? 'بیٹی' : 'Daughter',
      });
    }
    if (heirs.grandsonsCount > 0) {
      groups.push({
        key: 'grandsons',
        label: t.grandsons,
        count: heirs.grandsonsCount,
        singularLabel: language === 'ar' ? 'ابن الابن' : language === 'ur' ? 'پوتا' : 'Grandson',
      });
    }
    if (heirs.granddaughtersCount > 0) {
      groups.push({
        key: 'granddaughters',
        label: t.granddaughters,
        count: heirs.granddaughtersCount,
        singularLabel: language === 'ar' ? 'بنت الابن' : language === 'ur' ? 'پوتی' : 'Granddaughter',
      });
    }

    // Siblings
    if (heirs.fullBrothersCount > 0) {
      groups.push({
        key: 'fullBrothers',
        label: t.fullBrothers,
        count: heirs.fullBrothersCount,
        singularLabel: language === 'ar' ? 'الأخ الشقيق' : language === 'ur' ? 'سگا بھائی' : 'Full Brother',
      });
    }
    if (heirs.fullSistersCount > 0) {
      groups.push({
        key: 'fullSisters',
        label: t.fullSisters,
        count: heirs.fullSistersCount,
        singularLabel: language === 'ar' ? 'الأخت الشقيقة' : language === 'ur' ? 'سگی بہن' : 'Full Sister',
      });
    }
    if (heirs.paternalBrothersCount > 0) {
      groups.push({
        key: 'paternalBrothers',
        label: t.paternalBrothers,
        count: heirs.paternalBrothersCount,
        singularLabel: language === 'ar' ? 'الأخ لأب' : language === 'ur' ? 'سوتیلا بھائی' : 'Paternal Brother',
      });
    }
    if (heirs.paternalSistersCount > 0) {
      groups.push({
        key: 'paternalSisters',
        label: t.paternalSisters,
        count: heirs.paternalSistersCount,
        singularLabel: language === 'ar' ? 'الأخت لأب' : language === 'ur' ? 'سوتیلی بہن' : 'Paternal Sister',
      });
    }
    if (heirs.maternalBrothersCount > 0) {
      groups.push({
        key: 'maternalBrothers',
        label: t.maternalBrothers,
        count: heirs.maternalBrothersCount,
        singularLabel: language === 'ar' ? 'الأخ لأم' : language === 'ur' ? 'اخیافی بھائی' : 'Maternal Brother',
      });
    }
    if (heirs.maternalSistersCount > 0) {
      groups.push({
        key: 'maternalSisters',
        label: t.maternalSisters,
        count: heirs.maternalSistersCount,
        singularLabel: language === 'ar' ? 'الأخت لأم' : language === 'ur' ? 'اخیافی بہن' : 'Maternal Sister',
      });
    }

    // Collaterals
    if (heirs.nephewsFullCount > 0) groups.push({ key: 'nephewsFull', label: t.nephewsFull, count: heirs.nephewsFullCount, singularLabel: t.nephewsFull });
    if (heirs.nephewsPaternalCount > 0) groups.push({ key: 'nephewsPaternal', label: t.nephewsPaternal, count: heirs.nephewsPaternalCount, singularLabel: t.nephewsPaternal });
    if (heirs.paternalUnclesFullCount > 0) groups.push({ key: 'paternalUnclesFull', label: t.unclesFull, count: heirs.paternalUnclesFullCount, singularLabel: t.unclesFull });
    if (heirs.paternalUnclesPaternalCount > 0) groups.push({ key: 'paternalUnclesPaternal', label: t.unclesPaternal, count: heirs.paternalUnclesPaternalCount, singularLabel: t.unclesPaternal });
    if (heirs.cousinsFullCount > 0) groups.push({ key: 'cousinsFull', label: t.cousinsFull, count: heirs.cousinsFullCount, singularLabel: t.cousinsFull });
    if (heirs.cousinsPaternalCount > 0) groups.push({ key: 'cousinsPaternal', label: t.cousinsPaternal, count: heirs.cousinsPaternalCount, singularLabel: t.cousinsPaternal });

    return groups;
  }, [heirs, gender, t, language]);

  const handleNameChange = (key: string, index: number, val: string) => {
    const existing = heirs.heirNames ? { ...heirs.heirNames } : {};
    const list = [...(existing[key] || [])];
    list[index] = val;
    existing[key] = list;
    onChangeHeirs({
      ...heirs,
      heirNames: existing,
    });
  };

  const totalNamesEntered = useMemo(() => {
    if (!heirs.heirNames) return 0;
    let count = 0;
    for (const group of activeHeirGroups) {
      const names = heirs.heirNames[group.key] || [];
      for (let i = 0; i < group.count; i++) {
        if (names[i]?.trim()) count++;
      }
    }
    return count;
  }, [heirs.heirNames, activeHeirGroups]);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-float space-y-6">
      
      {/* 1. Deceased Gender Selector (Segmented Spring Toggle) */}
      <div className="border-b border-slate-100 pb-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                <span className="text-xs opacity-70">({language === 'ar' ? 'مورث' : 'Husband/Father'})</span>
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
                <span className="text-xs opacity-70">({language === 'ar' ? 'مورثة' : 'Wife/Mother'})</span>
              </span>
            </button>
          </div>
        </div>

        {/* Optional Deceased Name Input */}
        <div>
          <label className="block text-xs font-semibold text-obsidian-700 mb-1">
            {language === 'ar' ? 'اسم المتوفى (اختياري)' : language === 'ur' ? 'میت کا نام (اختیاری)' : 'Deceased Person Name (Optional)'}
          </label>
          <input
            type="text"
            value={heirs.deceasedName || ''}
            onChange={(e) => onChangeHeirs({ ...heirs, deceasedName: e.target.value })}
            placeholder={language === 'ar' ? 'مثال: محمد بن عبد الله (رحمه الله)' : language === 'ur' ? 'مثال: محمد بن عبد اللہ (مرحوم)' : 'e.g. Muhammad ibn Abdullah'}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200/90 text-obsidian-900 placeholder-obsidian-400 focus:outline-none focus:ring-1 focus:ring-jade-600 focus:border-jade-600 transition-all font-sans"
          />
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
              <span className="text-xs text-obsidian-500">
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
                  <span className="text-xs text-obsidian-500">{item.sub}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  isAlive ? 'bg-jade-700 text-white' : 'bg-slate-100 text-obsidian-600'
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
          <span className="text-xs text-obsidian-500 font-normal">
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

      {/* 6. Optional Personal Heir Names Section */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowNamesSection(!showNamesSection)}
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all text-xs font-semibold text-obsidian-800 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-jade-700" />
            <span>
              {language === 'ar' ? 'تخصيص أسماء الورثة (اختياري)' : language === 'ur' ? 'ورثاء کے ذاتی نام درج کریں (اختیاری)' : 'Personalize Heir Names (Optional)'}
            </span>
            {totalNamesEntered > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-jade-100 text-jade-800 border border-jade-200">
                {totalNamesEntered} {language === 'ar' ? 'اسم مضاف' : 'named'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-obsidian-500 text-xs">
            <span>{showNamesSection ? (language === 'ar' ? 'إخفاء' : 'Hide') : (language === 'ar' ? 'إظهار' : 'Show')}</span>
            {showNamesSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showNamesSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 space-y-3"
          >
            {activeHeirGroups.length === 0 ? (
              <p className="text-xs text-obsidian-500 italic py-2 text-center">
                {language === 'ar' ? 'حدد أصحاب الفروض والعصبات أولاً لتتمكن من تخصيص أسمائهم.' : language === 'ur' ? 'نام درج کرنے کے لیے پہلے اوپر ورثاء کا انتخاب کریں۔' : 'Select surviving relatives above to assign their personal names.'}
              </p>
            ) : (
              <div className="space-y-3">
                {activeHeirGroups.map((group) => {
                  const names = heirs.heirNames?.[group.key] || [];
                  return (
                    <div key={group.key} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-obsidian-800">
                        <span>{group.label}</span>
                        <span className="text-xs text-obsidian-500 font-mono">({group.count})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Array.from({ length: group.count }).map((_, idx) => (
                          <div key={idx} className="relative">
                            <input
                              type="text"
                              value={names[idx] || ''}
                              onChange={(e) => handleNameChange(group.key, idx, e.target.value)}
                              placeholder={`${group.singularLabel} ${group.count > 1 ? idx + 1 : ''}`}
                              className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200/90 text-obsidian-900 placeholder-obsidian-400 focus:outline-none focus:ring-1 focus:ring-jade-600 focus:border-jade-600 font-sans transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>

    </div>
  );
};
