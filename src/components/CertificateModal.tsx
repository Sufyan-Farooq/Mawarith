import React from 'react';
import { X, Printer, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MawarithResult, DeceasedGender, EstateInput } from '../engine/types';
import { SupportedLanguage } from '../i18n/translations';
import { formatCurrency } from '../utils/currency';
import { BrandLogo } from './ui/BrandLogo';
import { getHeirDisplayName } from '../utils/heirTitles';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: MawarithResult;
  estate?: EstateInput;
  gender: DeceasedGender;
  currency: string;
  language: SupportedLanguage;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  result,
  estate,
  gender,
  currency,
  language,
}) => {
  if (!isOpen) return null;

  const isRtl = language === 'ar' || language === 'ur';

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-900/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
          className="w-full max-w-3xl bg-white border border-slate-200/90 shadow-float rounded-2xl overflow-hidden text-obsidian-900 print:border-none print:shadow-none print:rounded-none"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Action Bar (hidden in print) */}
          <div className="px-6 py-3.5 bg-obsidian-900 text-white flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <BrandLogo size={24} />
              <span className="text-xs font-semibold text-white">
                {language === 'ar' ? 'معاينة صك التوزيع الشرعي' : language === 'ur' ? 'شرعی تقسیم نامہ کا جائزہ' : 'Official Shariah Estate Decree'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-jade-700 hover:bg-jade-600 text-white text-xs font-semibold shadow-micro transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'طباعة الصك' : language === 'ur' ? 'پرنٹ کریں' : 'Print Decree'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-obsidian-400 hover:text-white hover:bg-white/[0.1] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-8 sm:p-12 space-y-6 print:p-6 bg-white">
            {/* Basmalah & Heading */}
            <div className="text-center space-y-2.5 pb-6 border-b border-slate-200">
              <p className="font-arabic text-3xl text-obsidian-900 font-bold tracking-wide">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brass-50 border border-brass-200/80 rounded-full text-xs font-bold text-brass-800">
                <Award className="w-3.5 h-3.5 text-brass-600" />
                <span>
                  {language === 'ar' ? 'صك قسمة تركة شرعية مستندة إلى الكتاب والسنة' : language === 'ur' ? 'شرعی تقسیم نامہ بر بنیاد کتاب و سنت' : 'Official Islamic Estate Distribution Certificate'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-obsidian-900 tracking-tight">
                {language === 'ar' ? 'بيان توزيع الفريضة الشرعية' : language === 'ur' ? 'تقسیمِ ترکہ کا شرعی گوشوارہ' : 'Statement of Shariah Estate Division'}
              </h1>
              <p className="font-arabic text-sm text-obsidian-600">
                {language === 'ar'
                  ? '﴿ فَرِيضَةً مِّنَ اللَّهِ ۗ إِنَّ اللَّهَ كَانَ عَلِيمًا حَكِيمًا ﴾ [النساء: ١١]'
                  : '﴿ فَرِيضَةً مِّنَ اللَّهِ ۗ إِنَّ اللَّهَ كَانَ عَلِيمًا حَكِيمًا ﴾ [Surah An-Nisa: 11]'}
              </p>
            </div>

            {/* Deceased & Estate Ledger Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="block text-obsidian-400 font-medium">{language === 'ar' ? 'المتوفى' : language === 'ur' ? 'میت' : 'Deceased'}</span>
                <span className="font-bold text-obsidian-900 text-sm">
                  {gender === 'male' ? (language === 'ar' ? 'رجل (مورث)' : language === 'ur' ? 'مرد (مرحوم)' : 'Male') : (language === 'ar' ? 'امرأة (مورثة)' : language === 'ur' ? 'عورت (مرحومہ)' : 'Female')}
                </span>
              </div>
              <div>
                <span className="block text-obsidian-400 font-medium">{language === 'ar' ? 'إجمالي التركة' : language === 'ur' ? 'کل ترکہ' : 'Gross Estate'}</span>
                <span className="font-bold text-obsidian-900 text-sm">{formatCurrency(result.summary.grossEstate, currency, language)}</span>
              </div>
              <div>
                <span className="block text-obsidian-400 font-medium">{language === 'ar' ? 'التجهيز والديون' : language === 'ur' ? 'کفن دفن و قرض' : 'Burial & Debts'}</span>
                <span className="font-bold text-obsidian-900 text-sm">-{formatCurrency(result.summary.burialCosts + result.summary.debtsTotal, currency, language)}</span>
              </div>
              <div>
                <span className="block text-jade-700 font-medium">{language === 'ar' ? 'صافي التركة للإرث' : language === 'ur' ? 'خالص ترکہ' : 'Net Inheritable'}</span>
                <span className="font-bold text-jade-700 text-sm">{formatCurrency(result.summary.netInheritableEstate, currency, language)}</span>
              </div>
            </div>

            {/* Itemized Stacked Breakdown (if any accounts / properties exist) */}
            {(() => {
              const allItems = [
                ...(estate?.cashItems || []),
                ...(estate?.realEstateItems || []),
                ...(estate?.goldJewelryItems || []),
                ...(estate?.otherAssetsItems || []),
                ...(estate?.debtsItems || []),
              ].filter((i) => i && i.amount > 0);

              if (allItems.length === 0) return null;

              return (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <span className="font-bold text-obsidian-700 block text-[11px] uppercase tracking-wider">
                    {language === 'ar'
                      ? 'مفردات التركة والأملاك المسجلة'
                      : language === 'ur'
                      ? 'ترکہ کی تفصیلی اشیاء و اکاؤنٹس کا گوشوارہ'
                      : 'Itemized Assets, Accounts & Property Breakdown'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 font-mono text-xs shadow-micro"
                      >
                        <span className="text-obsidian-700 font-sans truncate me-2 font-medium">{item.name}</span>
                        <span className="font-bold text-obsidian-900 shrink-0">
                          {formatCurrency(item.amount, currency, language)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Heirs Division Table */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-obsidian-700 uppercase tracking-wider">
                {language === 'ar' ? 'جدول سهام الورثة المستحقين' : language === 'ur' ? 'مستحق ورثاء کے شرعی حصص کا جدول' : 'Entitled Heirs Distribution Table'}
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 border-b border-slate-200 text-obsidian-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الوارث' : language === 'ur' ? 'وارث' : 'Heir'}</th>
                      <th className="py-2.5 px-3 text-center">{language === 'ar' ? 'العدد' : language === 'ur' ? 'تعداد' : 'Count'}</th>
                      <th className="py-2.5 px-3 text-center">{language === 'ar' ? 'الفرض / الإرث' : language === 'ur' ? 'شرعی حصہ' : 'Share'}</th>
                      <th className="py-2.5 px-3 text-center">%</th>
                      <th className="py-2.5 px-3 text-end">{language === 'ar' ? 'إجمالي النصيب' : language === 'ur' ? 'کل رقم' : 'Total Amount'}</th>
                      <th className="py-2.5 px-3 text-end">{language === 'ar' ? 'نصيب الفرد' : language === 'ur' ? 'فی کس' : 'Per Person'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.heirs.map((h, i) => (
                      <tr key={i}>
                        <td className="py-2.5 px-3 font-semibold text-obsidian-900 text-start">
                          {getHeirDisplayName(h, language)}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">{h.count}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-jade-700">
                          {h.totalFraction.numerator}/{h.totalFraction.denominator}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-obsidian-500">
                          {h.percentage.toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-3 text-end font-mono font-bold text-obsidian-900">
                          {formatCurrency(h.totalMonetaryValue, currency, language)}
                        </td>
                        <td className="py-2.5 px-3 text-end font-mono text-obsidian-600">
                          {formatCurrency(h.perIndividualMonetaryValue, currency, language)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shariah Verification Statement & Seal */}
            <div className="pt-5 border-t border-slate-200 text-xs text-obsidian-600 space-y-3">
              <p className="leading-relaxed">
                {language === 'ar'
                  ? 'تم حساب هذه الفريضة وفق الأحكام الشرعية المعتمدة في الفقه الإسلامي، استناداً إلى نصوص القرآن العظيم في سورة النساء وصحيح أحاديث المصطفى ﷺ، وفتاوى كبار العلماء (الشيخ ابن باز، الشيخ ابن عثيمين، والشيخ صالح الفوزان).'
                  : language === 'ur'
                  ? 'یہ شرعی حساب کتاب قرآن مجید کی آیات، صحیح احادیثِ نبوی، اور کبار علماء (شیخ ابن باز، شیخ ابن عثیمین اور شیخ صالح الفوزان) کے متفقہ فتاویٰ کے عین مطابق مرتب کیا گیا ہے۔'
                  : 'This calculation was conducted strictly under Islamic jurisprudence according to the Holy Quran (Surah An-Nisa), authentic Sunnah, and rulings of mainstream Sunni scholars including Shaykh Ibn Baz, Shaykh Ibn Uthaymeen, and Shaykh Salih al-Fawzan.'}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="font-serif italic text-obsidian-400">
                  Mawarith Certification Engine v1.0 (Beta)
                </span>
                <span className="font-mono text-obsidian-500">
                  {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
