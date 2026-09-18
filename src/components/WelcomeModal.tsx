import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Scale, Users, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportedLanguage } from '../i18n/translations';
import { BrandLogo } from './ui/BrandLogo';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onStartFresh?: () => void;
  onExploreDemo?: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  language,
  onStartFresh,
  onExploreDemo,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const persistDismissal = () => {
    if (dontShowAgain) {
      localStorage.setItem('mawarith_welcome_dismissed', 'true');
    }
  };

  const handleClose = () => {
    persistDismissal();
    onClose();
  };

  const handleStartFresh = () => {
    persistDismissal();
    if (onStartFresh) {
      onStartFresh();
    } else {
      onClose();
    }
  };

  const handleExploreDemo = () => {
    persistDismissal();
    if (onExploreDemo) {
      onExploreDemo();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isRtl = language === 'ar' || language === 'ur';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-white border border-slate-200 shadow-float rounded-3xl overflow-hidden text-obsidian-900 my-auto"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* High-Contrast Solemn Obsidian Header */}
          <div className="relative bg-obsidian-900 text-white p-6 sm:p-8 border-b border-white/[0.08]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <BrandLogo size={42} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                    {language === 'ar'
                      ? 'مَوارِيث: علم الفرائض وقسمة التركات'
                      : language === 'ur'
                      ? 'مواریث: شرعی تقسیمِ ترکہ کا مستند نظام'
                      : 'Mawarith: Shariah Estate Distribution'}
                  </h2>
                  <p className="text-xs text-brass-300 font-medium mt-1">
                    {language === 'ar'
                      ? 'فريضة محكمة وقسمة عادلة مستندة إلى الكتاب والسنة'
                      : language === 'ur'
                      ? 'قرآن و سنت کی روشنی میں متفقہ شرعی اصول'
                      : 'Scriptural precision anchored in Quran, Sunnah, and Ijma'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl text-obsidian-400 hover:text-white hover:bg-white/[0.1] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prophetic Hadith Callout */}
            <div className="mt-5 p-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] space-y-2">
              <p className="font-arabic text-base sm:text-lg text-white leading-relaxed text-right">
                «تَعَلَّمُوا الْفَرَائِضَ وَعَلِّمُوهَا النَّاسَ، فَإِنَّهُ نِصْفُ الْعِلْمِ، وَهُوَ يُنْسَى، وَهُوَ أَوَّلُ شَيْءٍ يُنْتَزَعُ مِنْ أُمَّتِي»
              </p>
              <div className="flex items-center justify-between text-[11px] text-obsidian-400 font-mono pt-1.5 border-t border-white/[0.08]">
                <span>{language === 'ar' ? 'حديث شريف' : 'Prophetic Sunnah'}</span>
                <span>{language === 'ar' ? 'رواه ابن ماجه (٢٧١٩) والحاكم' : 'Sunan Ibn Majah (2719)'}</span>
              </div>
            </div>
          </div>

          {/* Structured Guidance: Why Mawarith Matters in Modern Estates */}
          <div className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-obsidian-700">
            <p className="leading-relaxed text-obsidian-800 font-medium text-sm">
              {language === 'ar'
                ? 'في ظل تعقد المعاملات المالية المعاصرة — من حسابات بنكية متعددة، وعقارات، وحصص تجارية، وصناديق استثمارية — أوجب الله تعالى قسمة التركات بالميزان الإلهي صيانةً لحقوق الأرامل والأيتام والورثة ومنعاً للنزاعات الأسرية.'
                : language === 'ur'
                ? 'موجودہ دور میں جب مالی اثاثے بینک اکاؤنٹس، جائیدادوں اور کاروباروں میں منقسم ہیں، ترکہ کی درست شرعی تقسیم ایک اہم ترین ضرورت ہے۔ اسلام نے ترکے کی تقسیم کو الہی میزان پر قائم کیا ہے تاکہ تمام ورثاء کے حقوق محفوظ رہیں۔'
                : 'In our interconnected modern world—with multiple bank accounts, real estate, debts, and commercial equity—estate distribution has become increasingly intricate. Islamic law establishes estate division on divine justice (Al-Mizan), safeguarding the unalterable Quranic rights of every heir.'}
            </p>

            {/* The Shariah Distribution Sequence (Tartib Huquq at-Tirka) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-obsidian-900 uppercase tracking-wider border-b border-slate-200/70 pb-2">
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-jade-700" />
                  <span>
                    {language === 'ar' ? 'ترتيب تصفية الحقوق الشرعية' : language === 'ur' ? 'ترکہ سے متعلق شرعی حقوق کی ترتیب' : 'The Strict Shariah Distribution Sequence'}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-obsidian-400 font-normal">
                  {language === 'ar' ? 'قضاء النبي ﷺ' : 'Prophetic Order'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="space-y-1 p-2.5 rounded-xl bg-white border border-slate-200/70">
                  <div className="flex items-center gap-1.5 font-bold text-obsidian-900 font-mono text-jade-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>1. {language === 'ar' ? 'الديون والوصية' : 'Debts & Bequests'}</span>
                  </div>
                  <p className="text-obsidian-600 text-[11px] leading-relaxed">
                    {language === 'ar'
                      ? 'تسديد الديون (بما فيها المهر المؤجل) ثم الوصية لغير وارث (بحد أقصى الثلث) قبل قسمة التركة.'
                      : language === 'ur'
                      ? 'کفن دفن اور قرضوں کی ادائیگی، پھر غیر وارث کے لیے وصیت (زیادہ سے زیادہ تہائی)۔'
                      : 'Funeral costs and debts cleared first, then bequests to non-heirs capped at 1/3.'}
                  </p>
                </div>

                <div className="space-y-1 p-2.5 rounded-xl bg-white border border-slate-200/70">
                  <div className="flex items-center gap-1.5 font-bold text-obsidian-900 font-mono text-jade-700">
                    <Users className="w-3.5 h-3.5" />
                    <span>2. {language === 'ar' ? 'حصر الورثة والحجب' : 'Surviving Heirs & Hajb'}</span>
                  </div>
                  <p className="text-obsidian-600 text-[11px] leading-relaxed">
                    {language === 'ar'
                      ? 'تحديد الورثة الأحياء لحظة الوفاة بدقة وتطبيق قواعد الحجب الشرعي التلقائي.'
                      : language === 'ur'
                      ? 'وفات کے وقت زندہ ورثاء کا اندراج، شرعی حجب کے قواعد خودکار لاگو ہوتے ہیں۔'
                      : 'Immediate and collateral relatives evaluated with automatic blocking rules.'}
                  </p>
                </div>

                <div className="space-y-1 p-2.5 rounded-xl bg-white border border-slate-200/70">
                  <div className="flex items-center gap-1.5 font-bold text-obsidian-900 font-mono text-jade-700">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>3. {language === 'ar' ? 'الصك ومشاركة الأسرة' : 'Decree & Family Share'}</span>
                  </div>
                  <p className="text-obsidian-600 text-[11px] leading-relaxed">
                    {language === 'ar'
                      ? 'استخراج صك رسمي معتمد ومشاركة الملخص الفوري مع العائلة عبر تطبيق واتساب.'
                      : language === 'ur'
                      ? 'مستند تقسیم نامہ اور واٹس ایپ پر اہل خانہ کے ساتھ فوری خلاصہ شیئر کرنے کی سہولت۔'
                      : 'Official printable decree, Daleel citations, and 1-tap WhatsApp family summary.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with Checkbox and Action Button */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-obsidian-600 select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded border-slate-300 text-jade-700 focus:ring-jade-500"
                />
                <span>
                  {language === 'ar'
                    ? 'عدم إظهار هذا البيان تلقائياً عند الدخول'
                    : language === 'ur'
                    ? 'یہ تعارفی پیغام خودکار نہ دکھائیں'
                    : 'Do not show this guidance automatically'}
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExploreDemo}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-obsidian-700 font-semibold text-xs transition-all duration-150 active:scale-95 cursor-pointer"
                >
                  {language === 'ar'
                    ? 'استعراض مسألة تجريبية'
                    : language === 'ur'
                    ? 'نمونہ کیس دیکھیں'
                    : 'Explore Demo Scenario'}
                </button>

                <button
                  type="button"
                  onClick={handleStartFresh}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-jade-700 hover:bg-jade-800 text-white font-semibold text-xs shadow-micro transition-all duration-150 active:scale-95 cursor-pointer"
                >
                  <span>
                    {language === 'ar'
                      ? 'البدء بحساب تركة عائلتي (من الصفر)'
                      : language === 'ur'
                      ? 'اپنے خاندان کا ترکہ شروع کریں'
                      : 'Start Fresh with My Estate'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
