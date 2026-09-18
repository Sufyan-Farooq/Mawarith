import React, { useState } from 'react';
import { X, Printer, Copy, Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const isRtl = language === 'ar' || language === 'ur';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = async () => {
    const isAr = language === 'ar';
    const isUr = language === 'ur';

    let text = isAr
      ? `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nصك توزيع الفريضة الشرعية\n(﴿ فَرِيضَةً مِّنَ اللَّهِ ۗ إِنَّ اللَّهَ كَانَ عَلِيمًا حَكِيمًا ﴾ [النساء: ١١])\n\n`
      : isUr
      ? `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nتقسیمِ ترکہ کا شرعی گوشوارہ\n(﴿ فَرِيضَةً مِّنَ اللَّهِ ۗ إِنَّ اللَّهَ كَانَ عَلِيمًا حَكِيمًا ﴾)\n\n`
      : `Bismillāh ar-Rahmān ar-Rahīm\nDecree of Islamic Estate Distribution\n\n`;

    const deceasedDisplay = result.deceasedName?.trim()
      ? `${result.deceasedName.trim()} (${gender === 'male' ? (isAr ? 'رجل' : 'Male') : (isAr ? 'امرأة' : 'Female')})`
      : gender === 'male' ? (isAr ? 'رجل (مورث)' : 'Male') : (isAr ? 'امرأة (مورثة)' : 'Female');

    text += `• ${isAr ? 'المتوفى' : isUr ? 'میت' : 'Deceased'}: ${deceasedDisplay}\n`;
    text += `• ${isAr ? 'إجمالي التركة' : 'Gross Estate'}: ${formatCurrency(result.summary.grossEstate, currency, language)}\n`;
    text += `• ${isAr ? 'مؤن التجهيز والديون' : 'Burial & Debts'}: -${formatCurrency(result.summary.burialCosts + result.summary.debtsTotal, currency, language)}\n`;
    text += `• ${isAr ? 'صافي التركة للإرث' : 'Net Distributable Estate'}: ${formatCurrency(result.summary.netInheritableEstate, currency, language)}\n\n`;
    text += `${isAr ? 'بيان سهام الورثة المستحقين:' : 'Entitled Heirs Distribution:'}\n`;

    result.heirs.forEach((h) => {
      const namesStr = h.customNames && h.customNames.filter(Boolean).length > 0
        ? ` [${h.customNames.filter(Boolean).join('، ')}]`
        : '';
      text += `- ${getHeirDisplayName(h, language)}${namesStr} (${h.count}): ${h.totalFraction.numerator}/${h.totalFraction.denominator} (${h.percentage.toFixed(2)}%) = ${formatCurrency(h.totalMonetaryValue, currency, language)}\n`;
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-900/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-medium border border-white/[0.12] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-jade-400" />
                    <span>{language === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-obsidian-300" />
                    <span>{language === 'ar' ? 'نسخ النص' : 'Copy Text'}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-jade-700 hover:bg-jade-600 text-white text-xs font-semibold shadow-micro transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'طباعة الصك' : language === 'ur' ? 'پرنٹ کریں' : 'Print Decree'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-obsidian-400 hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-8 sm:p-12 space-y-6 print:p-6 bg-white">
            {/* Basmalah & Heading */}
            <div className="text-center space-y-2 pb-6 border-b border-slate-200">
              <p className="font-arabic text-3xl text-obsidian-900 font-bold tracking-wide">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-obsidian-900 tracking-tight font-sans">
                {language === 'ar' ? 'صك توزيع الفريضة الشرعية' : language === 'ur' ? 'تقسیمِ ترکہ کا شرعی گوشوارہ' : 'Decree of Islamic Estate Distribution'}
              </h1>
              <div className="pt-2 space-y-1">
                <p className="font-arabic text-lg sm:text-xl text-jade-800 font-medium leading-relaxed" dir="rtl">
                  ﴿ فَرِيضَةً مِّنَ اللَّهِ ۗ إِنَّ اللَّهَ كَانَ عَلِيمًا حَكِيمًا ﴾
                </p>
                <p className="text-[11px] text-obsidian-500 font-sans tracking-wide">
                  {language === 'ar' ? '[سورة النساء: آية ١١]' : language === 'ur' ? '[سورۃ النساء: آیت 11]' : '[Surah An-Nisa: 11]'}
                </p>
              </div>
            </div>

            {/* Deceased & Estate Ledger Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="block text-obsidian-400 font-medium">{language === 'ar' ? 'المتوفى' : language === 'ur' ? 'میت' : 'Deceased'}</span>
                <span className="font-bold text-obsidian-900 text-sm block truncate">
                  {result.deceasedName?.trim() ? result.deceasedName.trim() : (
                    gender === 'male'
                      ? (language === 'ar' ? 'رجل (مورث)' : language === 'ur' ? 'مرد (مرحوم)' : 'Male (Deceased)')
                      : (language === 'ar' ? 'امرأة (مورثة)' : language === 'ur' ? 'عورت (مرحومہ)' : 'Female (Deceased)')
                  )}
                </span>
                {result.deceasedName?.trim() && (
                  <span className="text-[10px] text-obsidian-400 block">
                    {gender === 'male' ? (language === 'ar' ? 'رجل (مورث)' : language === 'ur' ? 'مرد' : 'Male') : (language === 'ar' ? 'امرأة (مورثة)' : language === 'ur' ? 'عورت' : 'Female')}
                  </span>
                )}
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
                          <div>{getHeirDisplayName(h, language)}</div>
                          {h.customNames && h.customNames.filter(Boolean).length > 0 && (
                            <div className="text-[11px] font-normal text-obsidian-500 mt-0.5">
                              {h.customNames.filter(Boolean).join('، ')}
                            </div>
                          )}
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

            {/* Formal Execution Ratification Blocks (Print & Court Ready) */}
            <div className="pt-6 border-t border-slate-200 text-xs">
              <div className="text-[11px] font-bold text-obsidian-700 uppercase tracking-wider mb-4">
                {language === 'ar' ? 'اعتماد ومصادقة أصحاب الشأن' : language === 'ur' ? 'تصدیق و دستخط وارثان و گواہان' : 'Formal Ratification & Execution Signatures'}
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl border border-dashed border-slate-300 space-y-8 bg-slate-50/50">
                  <span className="block font-semibold text-obsidian-800 text-[11px]">
                    {language === 'ar' ? 'المصفي / وصي التركة' : language === 'ur' ? 'وصی ترکہ / منتظم' : 'Estate Executor'}
                  </span>
                  <div className="border-t border-slate-300 pt-1 text-[10px] text-obsidian-400">
                    {language === 'ar' ? 'التوقيع والتاريخ' : 'Signature & Date'}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-dashed border-slate-300 space-y-8 bg-slate-50/50">
                  <span className="block font-semibold text-obsidian-800 text-[11px]">
                    {language === 'ar' ? 'ممثل الورثة الشرعيين' : language === 'ur' ? 'نمائندہ ورثاء' : 'Heirs Representative'}
                  </span>
                  <div className="border-t border-slate-300 pt-1 text-[10px] text-obsidian-400">
                    {language === 'ar' ? 'التوقيع والتاريخ' : 'Signature & Date'}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-dashed border-slate-300 space-y-8 bg-slate-50/50">
                  <span className="block font-semibold text-obsidian-800 text-[11px]">
                    {language === 'ar' ? 'الشاهد / المفتي المعتمد' : language === 'ur' ? 'گواہ / مستند مفتی' : 'Witness / Certifying Scholar'}
                  </span>
                  <div className="border-t border-slate-300 pt-1 text-[10px] text-obsidian-400">
                    {language === 'ar' ? 'التوقيع والختم' : 'Signature & Seal'}
                  </div>
                </div>
              </div>
            </div>

            {/* Shariah Verification Statement & Seal */}
            <div className="pt-4 border-t border-slate-200 text-xs text-obsidian-600 space-y-2">
              <p className="leading-relaxed text-[11px]">
                {language === 'ar'
                  ? 'تم حساب هذه الفريضة وفق الأحكام الشرعية المعتمدة في الفقه الإسلامي، استناداً إلى نصوص القرآن العظيم في سورة النساء وصحيح أحاديث المصطفى ﷺ، وفتاوى كبار العلماء (الشيخ ابن باز، الشيخ ابن عثيمين، والشيخ صالح الفوزان).'
                  : language === 'ur'
                  ? 'یہ شرعی حساب کتاب قرآن مجید کی آیات، صحیح احادیثِ نبوی، اور کبار علماء (شیخ ابن باز، شیخ ابن عثیمین اور شیخ صالح الفوزان) کے متفقہ فتاویٰ کے عین مطابق مرتب کیا گیا ہے۔'
                  : 'This calculation was conducted strictly under Islamic jurisprudence according to the Holy Quran (Surah An-Nisa), authentic Sunnah, and rulings of mainstream Sunni scholars including Shaykh Ibn Baz, Shaykh Ibn Uthaymeen, and Shaykh Salih al-Fawzan.'}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif italic text-obsidian-400 text-[11px]">
                  Mawarith Certification Engine v1.0 (Beta)
                </span>
                <span className="font-mono text-obsidian-500 text-[11px]">
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
