import React from 'react';
import { X, BookOpen, Scroll, Award, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DALEEL_DATABASE, DaleelItem } from '../data/daleel/database';
import { SupportedLanguage } from '../i18n/translations';

interface DaleelModalProps {
  daleelIds: string[];
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  heirTitle?: string;
}

export const DaleelModal: React.FC<DaleelModalProps> = ({
  daleelIds,
  isOpen,
  onClose,
  language,
  heirTitle,
}) => {
  if (!isOpen || daleelIds.length === 0) return null;

  const isRtl = language === 'ar' || language === 'ur';

  const items: DaleelItem[] = daleelIds
    .map((id) => DALEEL_DATABASE[id])
    .filter(Boolean);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
          className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white border border-slate-200/90 shadow-float rounded-2xl overflow-hidden text-obsidian-900"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-obsidian-900 text-white border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {language === 'ar' ? 'الأدلة الشرعية والتحقيق الفقهي' : language === 'ur' ? 'شرعی دلائل اور فقہی تحقیق' : 'Authentic Shariah Daleel & Proofs'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-jade-500/20 text-jade-300 rounded-full border border-jade-500/30">
                  <CheckCircle2 className="w-3 h-3 text-jade-400" />
                  <span>{language === 'ar' ? 'موثق' : 'Verified'}</span>
                </span>
              </div>
              {heirTitle && (
                <p className="text-xs text-brass-300 font-medium mt-0.5">{heirTitle}</p>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-obsidian-400 hover:text-white hover:bg-white/[0.1] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Stream */}
          <div className="p-6 overflow-y-auto space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-obsidian-300" />
                <p className="text-sm font-medium text-obsidian-600">
                  {language === 'ar'
                    ? 'الأدلة الفقهية المستندة إلى الكتاب والسنة جاري مراجعتها وتوثيقها.'
                    : language === 'ur'
                    ? 'قرآن و سنت پر مبنی شرعی دلائل کی تفاصیل شامل کی جا رہی ہیں۔'
                    : 'Shariah scriptural evidence is being referenced.'}
                </p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="space-y-4 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0"
                >
                {/* Type & Citation Source */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                      item.type === 'quran'
                        ? 'bg-jade-50 text-jade-900 border border-jade-200'
                        : item.type === 'hadith'
                        ? 'bg-brass-50 text-brass-900 border border-brass-200'
                        : 'bg-slate-100 text-obsidian-800 border border-slate-200'
                    }`}>
                      {item.type === 'quran' ? (
                        <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> القرآن الكريم</span>
                      ) : item.type === 'hadith' ? (
                        <span className="flex items-center gap-1.5"><Scroll className="w-3.5 h-3.5" /> الحديث النبوي الشريف</span>
                      ) : (
                        <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> إجماع العلماء</span>
                      )}
                    </span>
                    <span className="text-xs font-semibold text-obsidian-800">
                      {item.title[language]}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-obsidian-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {item.source}
                  </span>
                </div>

                {/* Quranic / Hadith Arabic Script */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-right">
                  <p className="font-arabic text-xl sm:text-2xl leading-[2.2] text-obsidian-950 selection:bg-jade-100">
                    {item.arabicText}
                  </p>
                </div>

                {/* Verified Translations */}
                <div className="space-y-2.5 text-xs sm:text-sm text-obsidian-700">
                  <div className="ps-3 border-s-2 border-slate-300">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-obsidian-400 mb-1 font-sans">
                      English Translation
                    </span>
                    <p className="leading-relaxed text-obsidian-800">
                      {item.englishTranslation}
                    </p>
                  </div>

                  <div className="ps-3 border-s-2 border-slate-300" dir="rtl">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-obsidian-400 mb-1 font-sans">
                      اردو ترجمہ
                    </span>
                    <p className="font-urdu text-base leading-loose text-obsidian-800">
                      {item.urduTranslation}
                    </p>
                  </div>
                </div>

                {/* Scholarly Commentary (Ibn Baz, Ibn Uthaymeen, al-Fawzan) */}
                <div className="p-3.5 rounded-xl bg-brass-50/70 border border-brass-200/70 text-xs leading-relaxed text-brass-950">
                  <div className="flex items-center gap-1.5 font-bold text-brass-900 mb-1">
                    <Award className="w-3.5 h-3.5 text-brass-700" />
                    <span>
                      {language === 'ar' ? 'فتاوى كبار العلماء (ابن باز، ابن عثيمين، الفوزان):' : language === 'ur' ? 'علماء کے مستند فتاویٰ (ابن باز، ابن عثیمین، الفوزان):' : 'Scholarly Rulings (Ibn Baz, Ibn Uthaymeen, al-Fawzan):'}
                    </span>
                  </div>
                  <p>{item.scholarlyNotes[language]}</p>
                </div>
              </div>
            ))
          )}
        </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-obsidian-500">
            <span>Mawarith Shariah Authentication Engine</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-obsidian-800 transition-colors"
            >
              {language === 'ar' ? 'إغلاق' : language === 'ur' ? 'بند کریں' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
