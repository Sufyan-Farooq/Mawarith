import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, ShieldCheck, HeartHandshake, Compass, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportedLanguage } from '../i18n/translations';
import { BrandLogo } from './ui/BrandLogo';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('mawarith_welcome_dismissed');
    if (stored === 'true' && isOpen) {
      // Parent can open explicitly if requested by user
    }
  }, [isOpen]);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('mawarith_welcome_dismissed', 'true');
    }
    onClose();
  };

  if (!isOpen) return null;

  const isRtl = language === 'ar' || language === 'ur';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
          className="w-full max-w-2xl bg-white border border-slate-200/90 shadow-float rounded-3xl overflow-hidden text-obsidian-900 my-auto"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Header Banner with Sacred Geometry & Decorative Tint */}
          <div className="relative bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-jade-950 text-white p-6 sm:p-8 overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-jade-500/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-brass-500/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <BrandLogo size={42} />
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-brass-400 bg-brass-400/10 px-2.5 py-0.5 rounded-full border border-brass-400/20 mb-1">
                    <Sparkles className="w-3 h-3 text-brass-400" />
                    <span>
                      {language === 'ar'
                        ? 'مرحباً بك في منصة مَوارِيث'
                        : language === 'ur'
                        ? 'منصۂ مواریث میں خوش آمدید'
                        : 'Welcome to Mawarith Platform'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {language === 'ar'
                      ? 'أهمية علم الفرائض في عصرنا الحاضر'
                      : language === 'ur'
                      ? 'دورِ حاضر میں علمِ میراث کی شرعی اہمیت'
                      : 'The Vital Importance of Inheritance in Today’s World'}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-xl text-obsidian-400 hover:text-white hover:bg-white/[0.1] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prophet's Hadith on Fara'id */}
            <div className="relative z-10 mt-5 p-4 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-xs space-y-2">
              <div className="flex items-center gap-2 text-brass-300 font-semibold text-[11px]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {language === 'ar'
                    ? 'حديث نبوي شريف عن رسول الله ﷺ'
                    : language === 'ur'
                    ? 'فرمانِ رسول اکرم ﷺ'
                    : 'Prophetic Guidance (Sunnah)'}
                </span>
              </div>
              <p className="font-arabic text-sm sm:text-base text-white/95 leading-relaxed">
                «تَعَلَّمُوا الْفَرَائِضَ وَعَلِّمُوهَا النَّاسَ، فَإِنَّهُ نِصْفُ الْعِلْمِ، وَهُوَ يُنْسَى، وَهُوَ أَوَّلُ شَيْءٍ يُنْتَزَعُ مِنْ أُمَّتِي»
              </p>
              <p className="text-[11px] text-obsidian-300 font-mono">
                {language === 'ar'
                  ? 'رواه ابن ماجه (٢٧١٩) والحاكم في المستدرك'
                  : language === 'ur'
                  ? 'سنن ابن ماجہ (2719) اور حاکم فی المستدرک'
                  : 'Narrated by Ibn Majah (2719) and Al-Hakim in Al-Mustadrak'}
              </p>
            </div>
          </div>

          {/* Core Content: Why Mawarith Matters Today */}
          <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-obsidian-700">
            <p className="leading-relaxed text-obsidian-800 font-medium">
              {language === 'ar'
                ? 'في ظل تعقد المعاملات المالية المعاصرة — من حسابات بنكية متعددة، وعقارات، وحصص تجارية، وصناديق استثمارية — أصبحت قسمة التركات مسألة بالغة الحساسية، وغالباً ما تنشأ عنها قطيعة الأرحام وتأخير حقوق الورثة.'
                : language === 'ur'
                ? 'موجودہ دور میں جب مالی اثاثے بینک اکاؤنٹس، جائیدادوں اور کاروباروں میں تقسیم ہیں، ترکہ کی درست شرعی تقسیم ایک اہم ترین ضرورت ہے۔ عدم آگاہی کی وجہ سے اکثر خاندانی تنازعات اور کمزور ورثاء کے حقوق ضائع ہو جاتے ہیں۔'
                : 'In our interconnected modern world—with multiple bank accounts, complex real estate, business equity, and international holdings—estate distribution has become increasingly intricate. Lack of clarity often leads to protracted family disputes and delayed rights.'}
            </p>

            {/* Three Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-2xl bg-jade-50/60 border border-jade-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-xl bg-jade-100 text-jade-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-obsidian-900 text-xs">
                  {language === 'ar' ? 'حماية حقوق الضعفاء' : language === 'ur' ? 'حقوق کا تحفظ' : 'Protecting Rights'}
                </h4>
                <p className="text-[11px] text-obsidian-600 leading-relaxed">
                  {language === 'ar'
                    ? 'صيانة أنصبة الأمهات والأرامل والبنات والأيتام كما شرعها الله بقطعية لا لبس فيها.'
                    : language === 'ur'
                    ? 'بیواؤں، بیٹیوں اور یتیموں کے شرعی حصص کا قطعی تحفظ۔'
                    : 'Guarantees the unalterable Quranic shares of widows, daughters, and orphans.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-brass-50/60 border border-brass-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-xl bg-brass-100 text-brass-800 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-obsidian-900 text-xs">
                  {language === 'ar' ? 'حفظ المودة والأرحام' : language === 'ur' ? 'خاندانی یگانگت' : 'Family Peace'}
                </h4>
                <p className="text-[11px] text-obsidian-600 leading-relaxed">
                  {language === 'ar'
                    ? 'استبدال النزاعات والشكوك ببرهان رياضي وفقهي شفاف يُرضي جميع النفوس بالعدل الإلهي.'
                    : language === 'ur'
                    ? 'شک و شبہات کے خاتمے اور خاندانی محبت کو برقرار رکھنے کے لیے شفاف حساب۔'
                    : 'Replaces ambiguity with mathematical precision and scriptural Daleel proofs.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="w-7 h-7 rounded-xl bg-slate-100 text-obsidian-800 flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-obsidian-900 text-xs">
                  {language === 'ar' ? 'إبراء الذمة الشرعية' : language === 'ur' ? 'بری الذمہ ہونا' : 'Spiritual Assurance'}
                </h4>
                <p className="text-[11px] text-obsidian-600 leading-relaxed">
                  {language === 'ar'
                    ? 'تنفيذ فريضة الله عز وجل وامتثال أمره: ﴿فَرِيضَةً مِّنَ اللَّهِ إِنَّ اللَّهَ كَانَ عَلِيمًا حَكِيمًا﴾.'
                    : language === 'ur'
                    ? 'اللہ تعالیٰ کے حکم پر عمل پیرا ہو کر ترکہ کو پاک صاف کرنا۔'
                    : 'Fulfills the divine decree of Surah An-Nisa: "An obligation ordained by Allah".'}
                </p>
              </div>
            </div>

            {/* Footer Notice & Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-obsidian-500 select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded border-slate-300 text-jade-700 focus:ring-jade-500"
                />
                <span>
                  {language === 'ar'
                    ? 'عدم إظهار هذه الرسالة الترحيبية مجدداً'
                    : language === 'ur'
                    ? 'یہ تعارفی پیغام دوبارہ نہ دکھائیں'
                    : 'Don’t show this welcome message automatically'}
                </span>
              </label>

              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-jade-700 hover:bg-jade-800 text-white font-semibold text-xs shadow-micro transition-all duration-150 active:scale-95"
              >
                <span>
                  {language === 'ar'
                    ? 'ابدأ استكشاف المنصة'
                    : language === 'ur'
                    ? 'مواریث شروع کریں'
                    : 'Explore Mawarith'}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
