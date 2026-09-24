import React, { useState } from 'react';
import { Scale, ChevronRight, X, BookOpen } from 'lucide-react';
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
      className="rounded-2xl border border-amber-200/90 bg-amber-50/60 p-4 text-xs shadow-micro mb-6"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Mizan (Scales of Justice) Icon */}
          <div className="p-2 rounded-xl bg-amber-100/90 text-amber-900 shrink-0 mt-0.5 border border-amber-200/80">
            <Scale className="w-4 h-4" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-obsidian-900 text-xs sm:text-sm">
                {language === 'ar'
                  ? 'تنبيه استرشادي وإبراء للذمة الشرعية'
                  : language === 'ur'
                  ? 'شرعی و قانونی رہنمائی برائے تقسیمِ ترکہ'
                  : 'Advisory Notice & Shariah Cross-Verification'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200/70 text-amber-900 border border-amber-300/80">
                v1.0 Beta
              </span>
            </div>

            <p className="sm:hidden text-obsidian-700 leading-relaxed text-[11px]">
              {language === 'ar'
                ? 'المنصة تجريبية؛ راجع النتائج مع عالم موثوق قبل تنفيذ القسمة.'
                : language === 'ur'
                ? 'یہ بیٹا ورژن ہے؛ عملی تقسیم سے پہلے مستند عالم سے تصدیق ضرور کرائیں۔'
                : 'Beta guidance only—verify results with a qualified scholar before distributing an estate.'}
            </p>

            <p className="hidden sm:block text-obsidian-700 leading-relaxed text-xs max-w-4xl">
              {language === 'ar'
                ? 'تم بناء خوارزميات المنصة وفق قواعد الفقه الإسلامي المعتمدة وتحقيقات كبار العلماء. ونظراً لدقة مسائل التركات وتشعباتها، فالمنصة قيد الاختبار النشط ويُنصح بمراجعة النتائج مع المحاكم الشرعية والعلماء المعتمدين قبل التنفيذ الفعلي لإبراء الذمة.'
                : language === 'ur'
                ? 'مواریث پلیٹ فارم مستند فقہی اصولوں پر مبنی ہے اور ابھی آزمائشی مرحلے (Beta) میں ہے۔ حقیقی و قانونی تقسیم کے لیے حتمی نفاذ سے قبل نتائج کی تصدیق مستند علماء یا متعلقہ عدالت سے لازماً کرائیں۔'
                : 'Mawarith strictly applies majority Sunni jurisprudence (Jumhur) and authentic scriptural Daleel. As the platform is in active beta testing, families should cross-verify complex calculations with certified scholars and judicial authorities for binding legal execution.'}
            </p>

            <div className="pt-1.5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenWelcome}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-jade-800 hover:text-jade-950 underline underline-offset-2 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-jade-700" />
                <span>
                  {language === 'ar'
                    ? 'الأصول الفقهية للمنصة وأهمية الفرائض'
                    : language === 'ur'
                    ? 'منصہ کے شرعی اصول اور میراث کی اہمیت'
                    : 'Read platform jurisprudence principles'}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian-800 hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss advisory"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
