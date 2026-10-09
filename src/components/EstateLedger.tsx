import { EstateInput, EstateItem } from '../engine/types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { workflow } from '../i18n/workflow';
import { formatCurrency } from '../utils/currency';
import { MoneyInput } from './ui/MoneyInput';
import { StackedAssetCard } from './ui/StackedAssetCard';
interface EstateLedgerProps {
  estate: EstateInput; onChangeEstate: (e: EstateInput | ((prev: EstateInput) => EstateInput)) => void;
  currency: string; language: SupportedLanguage;
}
export function EstateLedger({ estate, onChangeEstate, currency, language }: EstateLedgerProps) {
  const t = TRANSLATIONS[language]; const c = workflow(language);
  const update = (key: keyof EstateInput, value: number | boolean) => onChangeEstate(prev => ({ ...prev, [key]: value }));
  const category = (key: keyof EstateInput, itemKey: keyof EstateInput, amount: number, items: EstateItem[]) => onChangeEstate(prev => ({...prev, [key]: amount, [itemKey]: items}));
  const gross = estate.cash + estate.realEstate + estate.goldJewelry + estate.otherAssets;
  const maximum = Math.max(0, gross - estate.burialCosts - estate.debtsCollateral - estate.debtsUnsecured) / 3;
  return <div className="estate-form">
    <header className="section-heading"><h2>{c.estate}</h2><p>{language === 'en' ? 'Enter the value of everything left behind.' : language === 'ar' ? 'أدخل قيمة جميع الأصول التي تركها المتوفى.' : 'مرحوم کے چھوڑے ہوئے تمام اثاثوں کی مالیت درج کریں۔'}</p></header>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
      <StackedAssetCard label={t.cashSavings} categoryTotal={estate.cash} items={estate.cashItems} defaultItemPrefix="Account" currency={currency} language={language} presets={[]} onChange={(v, items) => category('cash','cashItems',v,items)}/>
      <StackedAssetCard label={t.realEstate} categoryTotal={estate.realEstate} items={estate.realEstateItems} defaultItemPrefix="Property" currency={currency} language={language} presets={[]} onChange={(v, items) => category('realEstate','realEstateItems',v,items)}/>
      <StackedAssetCard label={t.goldJewelry} categoryTotal={estate.goldJewelry} items={estate.goldJewelryItems} defaultItemPrefix="Item" currency={currency} language={language} presets={[]} onChange={(v, items) => category('goldJewelry','goldJewelryItems',v,items)}/>
      <StackedAssetCard label={t.otherAssets} categoryTotal={estate.otherAssets} items={estate.otherAssetsItems} defaultItemPrefix="Asset" currency={currency} language={language} presets={[]} onChange={(v, items) => category('otherAssets','otherAssetsItems',v,items)}/>
    </div>
    <div className="subtotal-line"><span>{t.grossEstate}</span><strong>{formatCurrency(gross,currency,language)}</strong></div>
    <section className="deductions-section"><header className="section-heading"><h3>{c.deductions}</h3><p>{c.deductionsHelp}</p></header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <MoneyInput label={t.funeralExpenses} value={estate.burialCosts} onChange={v => update('burialCosts',v)} currency={currency} language={language} presets={[]}/>
        <MoneyInput label={t.debtsOwed} value={estate.debtsUnsecured} onChange={v => update('debtsUnsecured',v)} currency={currency} language={language} presets={[]}/>
        <MoneyInput label={c.secured} value={estate.debtsCollateral} onChange={v => update('debtsCollateral',v)} currency={currency} language={language} presets={[]}/>
        <MoneyInput label={t.wasiyyahBequest} sublabel={`${language === 'en' ? 'Limit' : language === 'ar' ? 'الحد' : 'حد'}: ${formatCurrency(maximum,currency,language)}`} value={estate.wasiyyahAmount} onChange={v => update('wasiyyahAmount',v)} currency={currency} language={language} presets={[]}/>
      </div>
      {estate.wasiyyahAmount > 0 && <label className="bequest-checkbox"><input type="checkbox" checked={estate.wasiyyahRecipientIsHeir || false} onChange={e => update('wasiyyahRecipientIsHeir',e.target.checked)}/><span>{language === 'en' ? 'The bequest recipient is also an heir' : language === 'ar' ? 'الموصى له أحد الورثة' : 'وصیت وصول کرنے والا بھی وارث ہے'}</span></label>}
      {(estate.wasiyyahAmount > maximum || (estate.wasiyyahAmount > 0 && estate.wasiyyahRecipientIsHeir)) && <p className="calculation-note mt-4" role="status">{t.wasiyyahNotice}</p>}
    </section>
  </div>;
}
