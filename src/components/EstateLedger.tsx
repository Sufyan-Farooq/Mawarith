import React from 'react';
import { AlertCircle, ShieldAlert, Scale, ArrowDownRight } from 'lucide-react';
import { EstateInput, EstateItem } from '../engine/types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { formatCurrency } from '../utils/currency';
import { MoneyInput } from './ui/MoneyInput';
import { StackedAssetCard } from './ui/StackedAssetCard';

interface EstateLedgerProps {
  estate: EstateInput;
  onChangeEstate: (updated: EstateInput | ((prev: EstateInput) => EstateInput)) => void;
  currency: string;
  language: SupportedLanguage;
}

export const EstateLedger: React.FC<EstateLedgerProps> = ({
  estate,
  onChangeEstate,
  currency,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const updateField = (field: keyof EstateInput, value: any) => {
    onChangeEstate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateCategory = (
    totalField: keyof EstateInput,
    itemsField: keyof EstateInput,
    total: number,
    items?: EstateItem[]
  ) => {
    onChangeEstate((prev) => ({
      ...prev,
      [totalField]: total,
      [itemsField]: items ?? [],
    }));
  };

  const grossEstate = (estate.cash || 0) + (estate.realEstate || 0) + (estate.goldJewelry || 0) + (estate.otherAssets || 0);
  const totalDebtsAndBurial = (estate.burialCosts || 0) + (estate.debtsCollateral || 0) + (estate.debtsUnsecured || 0);
  const estateAfterDebts = Math.max(0, grossEstate - totalDebtsAndBurial);
  const maxWasiyyahAllowed = estateAfterDebts / 3;
  const isWasiyyahExceeded = (estate.wasiyyahAmount || 0) > maxWasiyyahAllowed;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-float space-y-6">
      {/* Section Header with Brand Emblem Accent */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-obsidian-900 tracking-tight flex items-center gap-2">
            <Scale className="w-4 h-4 text-jade-700" />
            <span>{t.estateAndBelongings}</span>
          </h2>
          <p className="text-xs text-obsidian-500 mt-0.5">
            {t.estateSubtitle}
          </p>
        </div>

        {/* Real-Time Gross Metric Pill */}
        <div className="text-end">
          <span className="text-xs font-medium text-obsidian-500 block">
            {t.grossEstate}
          </span>
          <span className="font-mono text-base font-bold text-jade-700">
            {formatCurrency(grossEstate, currency, language)}
          </span>
        </div>
      </div>

      {/* Assets Grid using StackedAssetCards (Supports Account 1, Account 2, Property 1, Property 2, etc.) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StackedAssetCard
          label={t.cashSavings}
          categoryTotal={estate.cash || 0}
          items={estate.cashItems}
          defaultItemPrefix="Account"
          currency={currency}
          language={language}
          presets={[10000, 50000, 200000]}
          onChange={(val, items) => updateCategory('cash', 'cashItems', val, items)}
        />

        <StackedAssetCard
          label={t.realEstate}
          categoryTotal={estate.realEstate || 0}
          items={estate.realEstateItems}
          defaultItemPrefix="Property"
          currency={currency}
          language={language}
          presets={[100000, 250000, 500000]}
          onChange={(val, items) => updateCategory('realEstate', 'realEstateItems', val, items)}
        />

        <StackedAssetCard
          label={t.goldJewelry}
          categoryTotal={estate.goldJewelry || 0}
          items={estate.goldJewelryItems}
          defaultItemPrefix="Item"
          currency={currency}
          language={language}
          presets={[5000, 20000, 50000]}
          onChange={(val, items) => updateCategory('goldJewelry', 'goldJewelryItems', val, items)}
        />

        <StackedAssetCard
          label={t.otherAssets}
          categoryTotal={estate.otherAssets || 0}
          items={estate.otherAssetsItems}
          defaultItemPrefix="Asset"
          currency={currency}
          language={language}
          presets={[10000, 25000, 50000]}
          onChange={(val, items) => updateCategory('otherAssets', 'otherAssetsItems', val, items)}
        />
      </div>

      {/* Pre-Inheritance Obligations Panel (Funeral, Debts, Wasiyyah) */}
      <div className="rounded-xl bg-slate-50/80 border border-slate-200/80 p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
          <div className="flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4 text-brass-600" />
            <span className="text-xs font-bold text-obsidian-800">
              {language === 'ar' ? 'الحقوق المتعلقة بالتركة' : language === 'ur' ? 'ترکہ سے قبل کی ادائیگیاں' : 'Pre-Inheritance Obligations'}
            </span>
          </div>
          <span className="text-xs text-obsidian-500">
            {language === 'ar' ? '(تجهيز، ديون، وصية)' : language === 'ur' ? '(تجہیز، قرض، وصیت)' : 'Order: Funeral → Debts → Wasiyyah'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MoneyInput
            label={t.funeralExpenses}
            value={estate.burialCosts || 0}
            onChange={(val) => updateField('burialCosts', val)}
            currency={currency}
            language={language}
            presets={[1000, 2500, 5000]}
          />

          <MoneyInput
            label={t.debtsOwed}
            value={estate.debtsUnsecured || 0}
            onChange={(val) => updateField('debtsUnsecured', val)}
            currency={currency}
            language={language}
            presets={[2000, 10000, 50000]}
          />

          <MoneyInput
            label={t.wasiyyahBequest}
            sublabel={`Max 1/3: ${formatCurrency(maxWasiyyahAllowed, currency, language)}`}
            value={estate.wasiyyahAmount || 0}
            onChange={(val) => updateField('wasiyyahAmount', val)}
            currency={currency}
            language={language}
            presets={[5000, 15000, 50000]}
          />
        </div>

        {/* Wasiyyah Warning & Legal Heir Rule */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-200/60">
          <label className="flex items-center gap-2 text-obsidian-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={estate.wasiyyahRecipientIsHeir || false}
              onChange={(e) => updateField('wasiyyahRecipientIsHeir', e.target.checked)}
              className="rounded text-jade-700 focus:ring-jade-600 border-slate-300 w-4 h-4"
            />
            <span className="text-obsidian-600 font-medium">
              {language === 'ar' ? 'هل الموصى له أحد الورثة الشرعيين؟' : language === 'ur' ? 'کیا وصیت کسی شرعی وارث کے نام ہے؟' : 'Is the bequest made to a legal heir?'}
            </span>
          </label>

          {isWasiyyahExceeded && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{t.wasiyyahNotice}</span>
            </div>
          )}
        </div>

        {estate.wasiyyahRecipientIsHeir && (
          <div className="rounded-lg bg-amber-50/80 border border-amber-200/80 p-3 text-xs text-amber-950 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">
              {language === 'ar'
                ? 'تنبيه شرعي: لا تصح الوصية لوارث لقول النبي ﷺ: "إن الله قد أعطى كل ذي حق حقه، فلا وصية لوارث" (رواه أبو داود والترمذي)، إلا بإجازة جميع الورثة البالغين الرشداء.'
                : language === 'ur'
                ? 'شرعی تنبیہ: وارث کے حق میں وصیت باطل ہے، رسول اللہ ﷺ کا ارشاد ہے: "بے شک اللہ نے ہر حقدار کو اس کا حق دے دیا ہے، پس کسی وارث کے لیے وصیت نہیں" (ابوداؤد و ترمذی)۔'
                : 'Shariah Principle: A bequest to a legal heir is null under the Hadith: "Allah has given each their right, so there is no bequest for an heir" (Abu Dawud, Tirmidhi), unless all adult heirs consent.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
