import React from 'react';
import { AmountInput } from './AmountInput';
import { workflow } from '../../i18n/workflow';
import { Plus, Trash2, Layers } from 'lucide-react';
import { EstateItem } from '../../engine/types';
import { SupportedLanguage } from '../../i18n/translations';
import { formatCurrency } from '../../utils/currency';

interface StackedAssetCardProps {
  label: string;
  categoryTotal: number;
  items?: EstateItem[];
  defaultItemPrefix: string; // e.g., 'Account', 'Property', 'Item', 'Asset'
  currency: string;
  language: SupportedLanguage;
  presets?: number[];
  onChange: (total: number, items: EstateItem[]) => void;
}

export const StackedAssetCard: React.FC<StackedAssetCardProps> = ({
  label,
  categoryTotal,
  items,
  defaultItemPrefix,
  currency,
  language,
  presets = [10000, 50000, 200000],
  onChange,
}) => {
  const c = workflow(language);
  const isRtl = language === 'ar' || language === 'ur';

  // Automatically in stacked mode if items exist and have length > 0
  const isStacked = Boolean(items && items.length > 0);

  // Labels based on language
  const tStack = {
    en: {
      stackBtn: `Stack items (${defaultItemPrefix} 1, ${defaultItemPrefix} 2...)`,
      addItem: `Add ${defaultItemPrefix}`,
      singleInput: 'Single input',
      stackedBadge: 'Stacked',
      total: 'Category Total',
      namePlaceholder: `${defaultItemPrefix} name...`,
    },
    ar: {
      stackBtn: `تفصيل البنود (${defaultItemPrefix === 'Account' ? 'حساب ١، حساب ٢...' : defaultItemPrefix === 'Property' ? 'عقار ١، عقار ٢...' : 'بند ١، بند ٢...'})`,
      addItem: `إضافة ${defaultItemPrefix === 'Account' ? 'حساب' : defaultItemPrefix === 'Property' ? 'عقار' : 'بند'}`,
      singleInput: 'مبلغ إجمالي',
      stackedBadge: 'مفصل',
      total: 'إجمالي البند',
      namePlaceholder: `اسم ${defaultItemPrefix === 'Account' ? 'الحساب' : defaultItemPrefix === 'Property' ? 'العقار' : 'البند'}...`,
    },
    ur: {
      stackBtn: `الگ الگ درج کریں (${defaultItemPrefix === 'Account' ? 'اکاؤنٹ 1، اکاؤنٹ 2...' : defaultItemPrefix === 'Property' ? 'جائیداد 1، جائیداد 2...' : 'چیز 1، چیز 2...'})`,
      addItem: `مزید ${defaultItemPrefix === 'Account' ? 'اکاؤنٹ' : defaultItemPrefix === 'Property' ? 'جائیداد' : 'اندراج'} شامل کریں`,
      singleInput: 'یکشت رقم',
      stackedBadge: 'الگ الگ اشیاء',
      total: 'کل میزان',
      namePlaceholder: `نام درج کریں...`,
    },
  }[language] || {
    stackBtn: `Stack items (${defaultItemPrefix} 1, ${defaultItemPrefix} 2...)`,
    addItem: `Add ${defaultItemPrefix}`,
    singleInput: 'Single input',
    stackedBadge: 'Stacked',
    total: 'Category Total',
    namePlaceholder: `${defaultItemPrefix} name...`,
  };

  const handleStartStacking = () => {
    const currentVal = categoryTotal || 0;
    const initialItems: EstateItem[] = [
      {
        id: `item-${Date.now()}-1`,
        name: `${language === 'en' ? defaultItemPrefix : language === 'ar' ? 'بند' : 'اندراج'} 1`,
        amount: currentVal,
      },
      {
        id: `item-${Date.now()}-2`,
        name: `${language === 'en' ? defaultItemPrefix : language === 'ar' ? 'بند' : 'اندراج'} 2`,
        amount: 0,
      },
    ];
    onChange(currentVal, initialItems);
  };

  const handleRevertToSingle = () => {
    onChange(categoryTotal || 0, []);
  };

  const handleAddItem = () => {
    const currentItems = items && items.length > 0 ? [...items] : [];
    const nextIndex = currentItems.length + 1;
    const newItem: EstateItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: `${language === 'en' ? defaultItemPrefix : language === 'ar' ? 'بند' : 'اندراج'} ${nextIndex}`,
      amount: 0,
    };
    const updated = [...currentItems, newItem];
    const sum = updated.reduce((s, i) => s + (i.amount || 0), 0);
    onChange(sum, updated);
  };

  const handleRemoveItem = (id: string) => {
    const currentItems = items || [];
    const updated = currentItems.filter((i) => i.id !== id);
    if (updated.length === 0) {
      onChange(0, []);
    } else {
      const sum = updated.reduce((s, i) => s + (i.amount || 0), 0);
      onChange(sum, updated);
    }
  };

  const handleItemNameChange = (id: string, name: string) => {
    const updated = (items || []).map((i) => (i.id === id ? { ...i, name } : i));
    onChange(categoryTotal || 0, updated);
  };

  const handleItemAmountChange = (id: string, amount: number) => {
    const updated = (items || []).map(i => i.id === id ? {...i, amount} : i);
    onChange(updated.reduce((sum,i) => sum + i.amount,0),updated);
  };

  const addPreset = (delta: number) => {
    onChange((categoryTotal || 0) + delta, []);
  };

  return (
    <div
      className="asset-field space-y-3"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-obsidian-800 tracking-tight">
            {label}
          </label>
          {isStacked && items && items.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-jade-100/70 text-jade-800 font-mono">
              <Layers className="w-2.5 h-2.5" />
              <span>{items.length} {tStack.stackedBadge}</span>
            </span>
          )}
        </div>

        {/* Mode Switcher Button */}
        {isStacked ? (
          <button
            type="button"
            onClick={handleRevertToSingle}
            className="text-xs font-medium text-obsidian-500 hover:text-obsidian-800 hover:underline transition-colors"
          >
            {c.total}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStartStacking}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-jade-50 hover:bg-jade-100 text-jade-700 text-xs font-semibold transition-colors border border-jade-200/60"
          >
            <Layers className="w-3 h-3 text-jade-600" />
            <span>{c.itemize}</span>
          </button>
        )}
      </div>

      {/* Mode 1: Stacked / Itemized Items List */}
      {isStacked ? (
        <div className="space-y-2">
          <div className="space-y-2">
            {(items || []).map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center gap-2 bg-white rounded-lg p-1.5 border border-slate-200/80 shadow-micro focus-within:border-jade-600 focus-within:ring-1 focus-within:ring-jade-500/20"
              >
                {/* Item Label / Name Input */}
                <input
                  type="text"
                  aria-label={`${label} ${idx + 1}: ${tStack.namePlaceholder}`}
                  value={item.name}
                  onChange={(e) => handleItemNameChange(item.id, e.target.value)}
                  placeholder={tStack.namePlaceholder}
                  className="w-1/3 min-w-0 bg-transparent text-xs font-semibold text-obsidian-800 px-2 py-1 focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
                />

                <span className="text-slate-200 font-thin">|</span>

                {/* Currency Badge & Amount Input */}
                <div className="flex-1 min-w-0 flex items-center">
                  <span className="text-xs font-bold font-mono text-jade-700 select-none pe-1.5">
                    {currency}
                  </span>
                  <AmountInput
                    aria-label={`${label} ${idx + 1}: ${currency}`}
                    value={item.amount}
                    onAmountChange={amount => handleItemAmountChange(item.id,amount)}
                    placeholder="0"
                    className="w-full min-w-0 bg-transparent font-mono text-xs sm:text-sm font-bold text-obsidian-900 focus:outline-none placeholder:text-slate-300"
                  />
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1 text-obsidian-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  aria-label={`${language === 'ar' ? 'حذف' : language === 'ur' ? 'حذف کریں' : 'Remove'} ${item.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Row: Add Item + Total Sum */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-obsidian-700 text-xs font-semibold border border-slate-200/90 shadow-micro transition-colors active:scale-95"
            >
              <Plus className="w-3 h-3 text-jade-600" />
              <span>{c.add}</span>
            </button>

            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-xs text-obsidian-500 font-sans">{tStack.total}:</span>
              <span className="font-bold text-jade-700 text-sm">
                {formatCurrency(categoryTotal, currency, language)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Quick Single Value Input with Presets */
        <div className="space-y-2">
          <div className="relative flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 transition-all duration-200 shadow-micro focus-within:border-jade-600 focus-within:ring-2 focus-within:ring-jade-500/15">
            <span className="text-xs font-bold font-mono text-jade-700 select-none pe-2 border-e border-slate-100">
              {currency}
            </span>
            <AmountInput
              aria-label={label}
              value={categoryTotal}
              onAmountChange={value => onChange(value,[])}
              placeholder="0"
              className="w-full min-w-0 bg-transparent ps-2.5 font-mono text-sm sm:text-base font-bold text-obsidian-900 focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => addPreset(preset)}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-100/80 hover:bg-jade-50 hover:text-jade-800 text-xs font-mono font-medium text-obsidian-600 border border-slate-200/60 transition-colors active:scale-95"
              >
                <Plus className="w-2.5 h-2.5 opacity-60" />
                <span>{preset >= 1000 ? `${preset / 1000}k` : preset}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
