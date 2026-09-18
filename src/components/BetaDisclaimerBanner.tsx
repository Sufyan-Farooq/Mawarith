import React, { useState } from 'react';
import { FlaskConical, AlertTriangle, Sparkles, X, ChevronRight } from 'lucide-react';
import { SupportedLanguage } from '../i18n/translations';

interface BetaDisclaimerBannerProps {
  language: SupportedLanguage;
  onOpenWelcome: () => void;
}

export const BetaDisclaimerBanner: React.FC<BetaDisclaimerBannerProps> = ({
  language,
  onOpenWelcome,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const isRtl = language === 'ar' || language === 'ur';

  return (
    <div
      className="relative rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-amber-50/40 to-white p-3.5 sm:p-4 text-xs shadow-micro transition-all duration-200 mb-6"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Icon Badge */}
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5 border border-amber-200/70">
            <FlaskConical className="w-4 h-4" />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-obsidian-900 text-xs sm:text-sm">
                {language === 'ar'
                  ? 'منصة قيد الاختبار والتطوير (إصدار تجريبي v1.0)'
                  : language === 'ur'
                  ? 'آزمائشی ورژن (Beta v1.0) — کام جاری ہے'
                  : 'Public Beta & Testing Phase (Mawarith v1.0)'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300/60 uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3 text-amber-700" />
                <span>Beta</span>
              </span>
            </div>

            <p className="text-obsidian-700 leading-relaxed text-[11px] sm:text-xs">
              {language === 'ar'
                ? 'المنصة حالياً قيد الاختبار والتدقيق النشط. على الرغم من بناء المحرك على أصول الفقه الإسلامي المعتمدة ومراجعة النصوص الشرعية، فقد تحتوي بعض الحالات النادرة على عدم دقة ونحن نعمل على تحسينها باستمرار. يُرجى مراجعة وتأكيد أي قسمة تركة فعلية مع العلماء المعتمدين والمحاكم الشرعية لإبراء الذمة.'
                : language === 'ur'
                ? 'مواریث پلیٹ فارم ابھی آزمائشی جانچ کے مرحلے میں ہے اور ہم اس پر مسلسل کام کر رہے ہیں۔ اگرچہ یہ قواعد معتبر فقہی اصولوں پر بنائے گئے ہیں، لیکن پیچیدہ صورتوں میں ممکنہ فروگزاشت کے پیشِ نظر قانونی و حقیقی تقسیم کے لیے مستند علماء اور شرعی عدالتوں سے رجوع فرمائیں۔'
                : 'Mawarith is actively in public beta and ongoing testing. While our engine is built upon classical Sunni jurisprudence and authenticated Daleel citations, certain complex edge cases may still contain nuances we are actively refining. For binding real-world distributions, please cross-verify with certified Islamic scholars and legal authorities.'}
            </p>

            <div className="pt-1.5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenWelcome}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-jade-800 hover:text-jade-950 underline underline-offset-2 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-jade-700" />
                <span>
                  {language === 'ar'
                    ? 'لماذا علم الفرائض مهم في عصرنا؟ (اقرأ البيان)'
                    : language === 'ur'
                    ? 'دورِ حاضر میں وراثت کی اہمیت (تفصیل دیکھیں)'
                    : 'Why Islamic Inheritance matters today (Read intro)'}
                </span>
                <ChevronRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian-700 hover:bg-black/5 transition-colors shrink-0"
          title="Dismiss advisory"
          aria-label="Dismiss advisory"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
