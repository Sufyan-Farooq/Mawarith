import React, { useState } from 'react';
import { BookOpen, AlertCircle, Printer, ArrowRight, Ban, CheckCircle, Layers, ChevronDown, ChevronUp, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MawarithResult, DeceasedGender, EstateInput } from '../engine/types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { formatCurrency } from '../utils/currency';
import { getHeirDisplayName } from '../utils/heirTitles';

interface ResultsViewProps {
  result: MawarithResult;
  estate?: EstateInput;
  gender: DeceasedGender;
  currency: string;
  language: SupportedLanguage;
  onOpenDaleel: (daleelIds: string[], title: string) => void;
  onOpenCertificate: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  estate,
  gender: _gender,
  currency,
  language,
  onOpenDaleel,
  onOpenCertificate,
}) => {
  const t = TRANSLATIONS[language];

  const { summary, heirs, blockedHeirs, isAwl, isRadd, isUmariyyatan } = result;

  const [showStackedBreakdown, setShowStackedBreakdown] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const handleCopyWhatsAppSummary = async () => {
    const isAr = language === 'ar';
    const isUr = language === 'ur';

    let text = '';
    if (isAr) {
      text = `*بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ*\n`;
      text += `*ملخص قسمة التركة الشرعية (منصة مَوارِيث)*\n`;
      text += `─────────────────────────\n`;
      text += `• *إجمالي التركة:* ${formatCurrency(summary.grossEstate, currency, language)}\n`;
      text += `• *مؤن التجهيز والديون:* -${formatCurrency(summary.burialCosts + summary.debtsTotal, currency, language)}\n`;
      if (summary.wasiyyahApproved > 0) {
        text += `• *الوصية الشرعية (لغير وارث):* -${formatCurrency(summary.wasiyyahApproved, currency, language)}\n`;
      }
      text += `• *صافي التركة للإرث:* ${formatCurrency(summary.netInheritableEstate, currency, language)}\n`;
      text += `─────────────────────────\n`;
      text += `*السهام والأنصبة المقدرة للورثة:*\n`;
      heirs.forEach((h) => {
        text += `▸ *${getHeirDisplayName(h, language)}* (${h.count}):\n`;
        text += `   الفرض: ${h.totalFraction.numerator}/${h.totalFraction.denominator} (${h.percentage.toFixed(1)}%)\n`;
        text += `   النصيب: ${formatCurrency(h.totalMonetaryValue, currency, language)}`;
        if (h.count > 1) {
          text += ` (لكل فرد: ${formatCurrency(h.perIndividualMonetaryValue, currency, language)})`;
        }
        text += `\n`;
      });
      text += `─────────────────────────\n`;
      text += `حُسبت الفريضة وفق أصول الفقه الإسلامي المعتمد (الكتاب والسنة وإجماع الصحابة).`;
    } else if (isUr) {
      text = `*بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ*\n`;
      text += `*شرعی تقسیمِ ترکہ کا خلاصہ (مواریث پلیٹ فارم)*\n`;
      text += `─────────────────────────\n`;
      text += `• *کل ترکہ:* ${formatCurrency(summary.grossEstate, currency, language)}\n`;
      text += `• *کفن دفن اور قرض:* -${formatCurrency(summary.burialCosts + summary.debtsTotal, currency, language)}\n`;
      if (summary.wasiyyahApproved > 0) {
        text += `• *وصیت (غیر وارث کے لیے):* -${formatCurrency(summary.wasiyyahApproved, currency, language)}\n`;
      }
      text += `• *خالص ترکہ تقسیم کے لیے:* ${formatCurrency(summary.netInheritableEstate, currency, language)}\n`;
      text += `─────────────────────────\n`;
      text += `*ورثاء اور ان کے شرعی حصص:*\n`;
      heirs.forEach((h) => {
        text += `▸ *${getHeirDisplayName(h, language)}* (تعداد: ${h.count}):\n`;
        text += `   حصہ: ${h.totalFraction.numerator}/${h.totalFraction.denominator} (${h.percentage.toFixed(1)}%)\n`;
        text += `   رقم: ${formatCurrency(h.totalMonetaryValue, currency, language)}`;
        if (h.count > 1) {
          text += ` (فی کس: ${formatCurrency(h.perIndividualMonetaryValue, currency, language)})`;
        }
        text += `\n`;
      });
      text += `─────────────────────────\n`;
      text += `حساب کتاب قرآن و سنت اور متفقہ فقہی اصولوں کے عین مطابق ہے۔`;
    } else {
      text = `*Bismillāh ar-Rahmān ar-Rahīm*\n`;
      text += `*Shariah Estate Distribution Summary (Mawarith)*\n`;
      text += `─────────────────────────\n`;
      text += `• *Gross Estate:* ${formatCurrency(summary.grossEstate, currency, language)}\n`;
      text += `• *Burial & Debts Cleared:* -${formatCurrency(summary.burialCosts + summary.debtsTotal, currency, language)}\n`;
      if (summary.wasiyyahApproved > 0) {
        text += `• *Bequest (Wasiyyah):* -${formatCurrency(summary.wasiyyahApproved, currency, language)}\n`;
      }
      text += `• *Net Distributable Estate:* ${formatCurrency(summary.netInheritableEstate, currency, language)}\n`;
      text += `─────────────────────────\n`;
      text += `*Entitled Legal Heirs & Prescribed Shares:*\n`;
      heirs.forEach((h) => {
        text += `▸ *${getHeirDisplayName(h, language)}* (Count: ${h.count}):\n`;
        text += `   Share: ${h.totalFraction.numerator}/${h.totalFraction.denominator} (${h.percentage.toFixed(1)}%)\n`;
        text += `   Amount: ${formatCurrency(h.totalMonetaryValue, currency, language)}`;
        if (h.count > 1) {
          text += ` (${formatCurrency(h.perIndividualMonetaryValue, currency, language)} each)`;
        }
        text += `\n`;
      });
      text += `─────────────────────────\n`;
      text += `Calculated strictly in accordance with classical Sunni jurisprudence (Jumhur).`;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch {
      // Fallback
    }
  };

  const stackedItemsList = [
    ...(estate?.cashItems || []),
    ...(estate?.realEstateItems || []),
    ...(estate?.goldJewelryItems || []),
    ...(estate?.otherAssetsItems || []),
    ...(estate?.debtsItems || []),
  ].filter((i) => i && i.amount > 0);

  // Proportional palette for visual distribution bar
  const colorPalette = [
    '#047857', // jade-700
    '#d97706', // brass-600
    '#0d9488', // teal-600
    '#b45309', // amber-700
    '#2563eb', // blue-600
    '#7c3aed', // violet-600
    '#475569', // slate-600
    '#ca8a04', // yellow-600
  ];

  return (
    <div className="space-y-6">

      {/* 1. Hero Calculation Surface (Obsidian Luxury Card with Sheen) */}
      <div className="relative rounded-2xl bg-obsidian-900 text-white p-5 sm:p-6 border border-white/[0.08] shadow-float overflow-hidden">
        {/* Subtle Ambient Top Edge Highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-jade-500/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              {t.resultsTitle}
            </h2>
            <p className="text-xs text-obsidian-400 mt-1 max-w-sm">
              {t.scholarBasis}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* WhatsApp Family Share Button */}
            <button
              type="button"
              onClick={handleCopyWhatsAppSummary}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95 cursor-pointer ${
                copiedToast
                  ? 'bg-jade-700 border-jade-600 text-white'
                  : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/[0.12]'
              }`}
              title="Copy formatted summary for WhatsApp / SMS"
            >
              {copiedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-jade-200" />
                  <span>{language === 'ar' ? 'تم النسخ بنجاح' : language === 'ur' ? 'کاپی ہو گیا' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-brass-400" />
                  <span>{language === 'ar' ? 'مشاركة الأسرة (واتساب)' : language === 'ur' ? 'اہل خانہ کو بھیجیں' : 'Family Share (WhatsApp)'}</span>
                </>
              )}
            </button>

            {/* Print Decree Button */}
            <button
              type="button"
              onClick={onOpenCertificate}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs border border-white/[0.12] transition-all duration-200 active:scale-95 shadow-sheen cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-brass-400" />
              <span>{t.printCertificate}</span>
            </button>
          </div>
        </div>

        {/* Financial Flow Breakdown */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/[0.08] text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="block text-obsidian-400 text-[11px]">{t.grossEstate}</span>
            <span className="font-mono font-bold text-white text-sm sm:text-base mt-0.5 block">
              {formatCurrency(summary.grossEstate, currency, language)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="block text-rose-300/80 text-[11px]">{t.debtsAndBurial}</span>
            <span className="font-mono font-bold text-rose-300 text-sm sm:text-base mt-0.5 block">
              -{formatCurrency(summary.burialCosts + summary.debtsTotal, currency, language)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="block text-brass-300/80 text-[11px]">{t.wasiyyahDeduction}</span>
            <span className="font-mono font-bold text-brass-300 text-sm sm:text-base mt-0.5 block">
              -{formatCurrency(summary.wasiyyahApproved, currency, language)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-jade-950/60 border border-jade-600/40">
            <span className="block text-jade-300 text-[11px] font-semibold">{t.netInheritable}</span>
            <span className="font-mono font-bold text-jade-400 text-sm sm:text-base mt-0.5 block">
              {formatCurrency(summary.netInheritableEstate, currency, language)}
            </span>
          </div>
        </div>

        {/* Stacked Assets Breakdown (Account 1, Account 2, Property 1...) */}
        {stackedItemsList.length > 0 && (
          <div className="relative z-10 mt-4 pt-3 border-t border-white/[0.08] text-xs">
            <button
              type="button"
              onClick={() => setShowStackedBreakdown(!showStackedBreakdown)}
              className="w-full flex items-center justify-between text-[11px] font-semibold text-obsidian-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-jade-400" />
                <span>
                  {language === 'ar'
                    ? `تفاصيل الأصول المشطورة (${stackedItemsList.length} بنود)`
                    : language === 'ur'
                    ? `مفردات ترکہ و اکاؤنٹس (${stackedItemsList.length} اشیاء)`
                    : `Itemized Assets & Accounts (${stackedItemsList.length} items)`}
                </span>
              </div>
              {showStackedBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showStackedBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pt-2.5 space-y-1.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px]">
                    {stackedItemsList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]"
                      >
                        <span className="text-obsidian-300 font-sans truncate me-2">{item.name}</span>
                        <span className="font-bold text-brass-300 shrink-0">
                          {formatCurrency(item.amount, currency, language)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 2. Classical Jurisprudence Alerts (Al-Umariyyatan, Al-'Awl, Al-Radd) */}
      {isUmariyyatan && (
        <div className="p-4 rounded-xl border border-amber-200/90 bg-amber-50/40 shadow-micro flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100/80 text-amber-800 shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-bold text-sm text-obsidian-900">{t.umariyyatanBadge}</div>
            <p className="text-obsidian-700 leading-relaxed">
              {language === 'ar'
                ? 'انعقدت المسألة العمرية (الغراوان): نالت الأم ثلث الباقي بعد نصيب الزوج ليأخذ الأب ضعف نصيبها تعصيباً عملاً بقضاء عمر بن الخطاب رضي الله عنه وإجماع الصحابة.'
                : language === 'ur'
                ? 'مسئلہ عمریہ لاگو ہوا: شوہر/بیوی، ماں اور باپ اکیلے موجود ہیں۔ ماں کو شریک حیات کے حصے کے بعد باقی کا تہائی دیا گیا تاکہ باپ کو ماں سے دوگنا مل سکے (قضاء عمر بن الخطاب)۔'
                : 'Al-Gharrawan (Umariyyatan) applied: Mother receives 1/3 of the remainder after spouse share, so father receives twice her share, preserving Shariah balance.'}
            </p>
          </div>
        </div>
      )}

      {isAwl && (
        <div className="p-4 rounded-xl border border-amber-200/90 bg-amber-50/40 shadow-micro flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100/80 text-amber-800 shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-bold text-sm text-obsidian-900">{t.awlBadge}</div>
            <p className="text-obsidian-700 leading-relaxed">
              {language === 'ar'
                ? `عالت المسألة من ${result.baseDenominator} إلى ${result.adjustedDenominator} نظراً لتزاحم الفروض الشرعية، ودخل النقص النسبي العادل على جميع الورثة دون حرمان أحد.`
                : language === 'ur'
                ? `مقررہ حصص ترکے سے بڑھ جانے کی وجہ سے اصل مسئلہ ${result.baseDenominator} سے بڑھ کر ${result.adjustedDenominator} ہو گیا، اور تمام ورثاء کے حصے میں مساوی تناسب سے کمی کی گئی۔`
                : `Al-'Awl applied: Prescribed fractions exceeded 1. Base expanded from ${result.baseDenominator} to ${result.adjustedDenominator}, proportionally scaling all shares justly.`}
            </p>
          </div>
        </div>
      )}

      {isRadd && (
        <div className="p-4 rounded-xl border border-jade-200/90 bg-jade-50/40 shadow-micro flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-jade-100/80 text-jade-800 shrink-0 mt-0.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-bold text-sm text-obsidian-900">{t.raddBadge}</div>
            <p className="text-obsidian-700 leading-relaxed">
              {language === 'ar'
                ? 'عادت زيادة التركة (الرد) على أصحاب الفروض النسبية بنسبة سهامهم، عدا الزوجين وفق فتوى الشيخين ابن باز وابن عثيمين وهيئة كبار العلماء.'
                : language === 'ur'
                ? 'عصبہ نہ ہونے کی وجہ سے بچا ہوا ترکہ قرآنی وارثوں پر ان کے حصص کے تناسب سے واپس لوٹا دیا گیا (سوائے شریک حیات کے، ابن باز و ابن عثیمین کا راجح فتویٰ)۔'
                : 'Al-Radd applied: Total shares were less than 1 and no Asabah existed. Surplus was redistributed among blood heirs (excluding spouse) in proportion to their shares (Fatwa Ibn Baz & Ibn Uthaymeen).'}
            </p>
          </div>
        </div>
      )}

      {/* 3. Live Spring-Animated Proportional Bar */}
      {heirs.length > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-micro space-y-2">
          <div className="flex items-center justify-between text-xs text-obsidian-700">
            <span className="font-bold">{language === 'ar' ? 'التمثيل النسبي لتوزيع الفريضة' : language === 'ur' ? 'تقسیم کا بصری تناسب' : 'Proportional Share Distribution'}</span>
            <span className="font-mono text-[11px] text-obsidian-400">100% Shariah Compliant</span>
          </div>

          <div className="h-3 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
            {heirs.map((h, i) => (
              <motion.div
                key={h.heirId}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(2, h.percentage)}%` }}
                transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
                style={{ backgroundColor: colorPalette[i % colorPalette.length] }}
                className="h-full relative group cursor-pointer"
              >
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-obsidian-900 text-white text-[10px] px-2 py-0.5 rounded shadow-float whitespace-nowrap pointer-events-none z-20 transition-opacity">
                  {getHeirDisplayName(h, language)}: {h.percentage.toFixed(1)}%
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Legend Tags */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {heirs.map((h, i) => (
              <div key={h.heirId} className="flex items-center gap-1.5 text-[11px] text-obsidian-600">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: colorPalette[i % colorPalette.length] }}
                />
                <span>{getHeirDisplayName(h, language)}</span>
                <span className="font-mono text-obsidian-400">({h.percentage.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Rich Interactive Heritage Ledger Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-float overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-obsidian-900">
            {t.heirsBreakdown} ({heirs.length})
          </h3>
          <span className="text-xs text-obsidian-400 font-mono">
            {language === 'ar' ? 'قسمة شرعية مبرأة للذمة' : 'Islamic Division Ledger'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] text-obsidian-500 uppercase tracking-wider border-b border-slate-100">
                <th className="text-start px-4 py-3 font-semibold">
                  {language === 'ar' ? 'الوارث الشرعي' : language === 'ur' ? 'شرعی وارث' : 'Legal Heir'}
                </th>
                <th className="text-center px-3 py-3 font-semibold">
                  {language === 'ar' ? 'الفرض القرآني' : language === 'ur' ? 'قرآنی حصہ' : 'Share'}
                </th>
                <th className="text-center px-3 py-3 font-semibold">%</th>
                <th className="text-end px-4 py-3 font-semibold">
                  {language === 'ar' ? 'إجمالي النصيب' : language === 'ur' ? 'کل حصہ' : 'Total Amount'}
                </th>
                <th className="text-center px-4 py-3 font-semibold">
                  {language === 'ar' ? 'الدليل الفقهي' : language === 'ur' ? 'شرعی دلیل' : 'Proof'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {heirs.map((h) => (
                <tr key={h.heirId} className="hover:bg-slate-50/70 transition-colors">
                  {/* Heir Name and Category Badge */}
                  <td className="px-4 py-3 text-start">
                    <div className="font-bold text-obsidian-900 flex items-center gap-1.5">
                      <span>{getHeirDisplayName(h, language)}</span>
                      {h.count > 1 && (
                        <span className="text-[11px] font-medium text-obsidian-400">
                          (×{h.count})
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-obsidian-400 block mt-0.5">
                      {t[h.category] || h.category}
                    </span>
                  </td>

                  {/* Fractional Fraction Disc */}
                  <td className="px-3 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-jade-50 text-jade-800 border border-jade-200/60">
                      {h.totalFraction.numerator}/{h.totalFraction.denominator}
                    </span>
                  </td>

                  {/* Percentage */}
                  <td className="px-3 py-3 text-center font-mono text-xs text-obsidian-500">
                    {h.percentage.toFixed(1)}%
                  </td>

                  {/* Monetary Amount */}
                  <td className="px-4 py-3 text-end">
                    <span className="font-mono font-bold text-obsidian-950 text-sm block">
                      {formatCurrency(h.totalMonetaryValue, currency, language)}
                    </span>
                    {h.count > 1 && (
                      <span className="text-[11px] text-obsidian-400 font-mono block">
                        {formatCurrency(h.perIndividualMonetaryValue, currency, language)} {language === 'ar' ? '/ فرد' : '/ each'}
                      </span>
                    )}
                  </td>

                  {/* Daleel Button with Golden Badge */}
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onOpenDaleel(h.daleelIds, getHeirDisplayName(h, language))}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-brass-700 bg-brass-50 hover:bg-brass-100 border border-brass-300/60 transition-all active:scale-95 shadow-micro"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-brass-600" />
                      <span>{t.viewDaleel}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Excluded Relatives (Al-Mahjubun - حجب الحرمان) */}
      <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-obsidian-700">
            <Ban className="w-4 h-4 text-obsidian-400" />
            <span>{t.blockedRelatives}</span>
            <span className="text-[11px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-obsidian-500">
              {blockedHeirs.length}
            </span>
          </div>
        </div>

        {blockedHeirs.length === 0 ? (
          <p className="text-xs text-obsidian-400 italic">
            {t.noBlockedRelatives}
          </p>
        ) : (
          <div className="divide-y divide-slate-200/60 border border-slate-200/60 rounded-xl bg-white overflow-hidden">
            {blockedHeirs.map((b) => (
              <div
                key={b.heirId}
                className="p-3 text-xs flex items-start justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-obsidian-800">
                    {getHeirDisplayName(b, language)} ({b.count})
                  </span>
                  <p className="text-obsidian-500 leading-relaxed">
                    {b.reason[language]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenDaleel(b.daleelIds, getHeirDisplayName(b, language))}
                  className="shrink-0 text-xs font-semibold text-brass-700 hover:text-brass-800 flex items-center gap-1 transition-colors"
                >
                  <span>{t.viewDaleel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
