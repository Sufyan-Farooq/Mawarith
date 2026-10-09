import { useState } from 'react';
import { BookOpen, Copy, Check, Scale } from 'lucide-react';
import { MawarithResult } from '../engine/types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { workflow } from '../i18n/workflow';
import { formatCurrency } from '../utils/currency';
import { getHeirDisplayName } from '../utils/heirTitles';
interface ResultsViewProps {
  result: MawarithResult; currency: string; language: SupportedLanguage;
  onOpenDaleel: (ids: string[], title: string) => void;
}
export function ResultsView({result,currency,language,onOpenDaleel}: ResultsViewProps) {
  const {summary,heirs,blockedHeirs} = result; const t = TRANSLATIONS[language]; const c = workflow(language);
  const [feedback,setFeedback] = useState<{status:'copied'|'error'; result:MawarithResult; currency:string; language:SupportedLanguage} | null>(null);
  const copyState = feedback?.result === result && feedback.currency === currency && feedback.language === language ? feedback.status : 'idle';
  const money = (value: number) => formatCurrency(value,currency,language);
  const colors = ['#047857','#ad7932','#517c75','#755f50','#64748b','#6f6c96'];
  const copySummary = async () => {
    const lines = ['Mawarith',result.deceasedName || '',`${t.grossEstate}: ${money(summary.grossEstate)}`,`${t.debtsAndBurial}: ${money(summary.burialCosts+summary.debtsTotal)}`,`${t.wasiyyahDeduction}: ${money(summary.wasiyyahApproved)}`,`${c.net}: ${money(summary.netInheritableEstate)}`,...heirs.map(h => `${getHeirDisplayName(h,language)}${h.count > 1 ? ` ×${h.count}` : ''}: ${h.totalFraction.numerator}/${h.totalFraction.denominator} · ${money(h.totalMonetaryValue)}${h.count > 1 ? ` (${money(h.perIndividualMonetaryValue)} ${c.each})` : ''}`), ...(result.surplusRemainderAmount > 0 ? [`${c.remainder}: ${money(result.surplusRemainderAmount)}`] : []), ...result.warnings, c.guidance];
    try { await navigator.clipboard.writeText(lines.filter(Boolean).join('\n')); setFeedback({status:'copied',result,currency,language}); }
    catch { setFeedback({status:'error',result,currency,language}); }
  };
  return <div className="results-content">
    <header className="section-heading evidence-heading"><BookOpen size={23} aria-hidden="true"/><div><h2>{c.breakdown}</h2><p>{language === 'en' ? 'Explore each share and its Quran & Sunnah references.' : language === 'ar' ? 'راجع كل نصيب وأدلته من القرآن والسنة.' : 'ہر حصہ اور قرآن و سنت سے اس کی دلیل دیکھیں۔'}</p></div></header>
    <dl className="estate-summary"><div><dt>{t.grossEstate}</dt><dd>{money(summary.grossEstate)}</dd></div><div><dt>{t.debtsAndBurial}</dt><dd>− {money(summary.burialCosts+summary.debtsTotal)}</dd></div><div><dt>{t.wasiyyahDeduction}</dt><dd>− {money(summary.wasiyyahApproved)}</dd></div><div className="net-total"><dt>{c.net}</dt><dd>{money(summary.netInheritableEstate)}</dd></div></dl>
    {summary.wasiyyahCapped && <p className="calculation-note">{t.wasiyyahNotice}</p>}
    {summary.burialCosts + summary.debtsTotal > summary.grossEstate && <p className="calculation-note">{language === 'en' ? 'Costs and debts exceed the assets. There is no estate available to distribute.' : language === 'ar' ? 'تتجاوز التكاليف والديون الأصول. لا توجد تركة متاحة للتوزيع.' : 'اخراجات اور قرض اثاثوں سے زیادہ ہیں۔ تقسیم کے لیے ترکہ دستیاب نہیں۔'}</p>}
    {heirs.length === 0 ? <div className="results-empty"><Scale size={32}/><h3>{c.empty}</h3><p>{c.emptyHelp}</p></div> : <>
      <div className="share-bar" aria-hidden="true">{heirs.map((h,i) => <span key={h.heirId} style={{width:`${h.percentage}%`,background:colors[i%colors.length]}}/>)}</div>
      <div className="share-list">{heirs.map((h,i) => <article className="share-row" key={h.heirId}>
        <div className="share-row-heading"><h3><span className="share-dot" style={{background:colors[i%colors.length]}}/>{getHeirDisplayName(h,language)}{h.count > 1 && <span className="text-obsidian-500 text-sm font-normal">×{h.count}</span>}</h3><strong>{money(h.totalMonetaryValue)}</strong></div>
        {h.customNames?.filter(Boolean).length ? <p className="text-sm text-jade-800 mt-1">{h.customNames.filter(Boolean).join('، ')}</p> : null}
        <div className="share-row-detail"><span><b dir="ltr">{h.totalFraction.numerator}/{h.totalFraction.denominator}</b><span className="mx-2">·</span>{h.percentage.toFixed(1)}%</span>{h.count > 1 && <span>{money(h.perIndividualMonetaryValue)} {c.each}</span>}</div>
        <div className="share-evidence"><span>{t[h.category]}</span><button onClick={() => onOpenDaleel(h.daleelIds,getHeirDisplayName(h,language))}><BookOpen size={15}/>{c.evidence}</button></div>
        <details className="share-explanation"><summary>{language === 'en' ? 'How this share is calculated' : language === 'ar' ? 'كيف يُحسب هذا النصيب' : 'یہ حصہ کیسے نکالا گیا'}</summary><p>{h.explanation[language]}</p></details>
      </article>)}</div>
      <button className="secondary-button w-full mt-5" onClick={copySummary}>{copyState === 'copied' ? <Check size={17}/> : <Copy size={17}/>} {copyState === 'copied' ? c.copied : c.copy}</button>
      <p className="text-sm text-obsidian-600 mt-2" role="status">{copyState === 'error' ? c.copyError : ''}</p>
    </>}
    {(result.isAwl || result.isRadd || result.isUmariyyatan || result.warnings.length > 0) && <details className="result-notes"><summary>{c.warning}</summary>{result.isAwl && <p>{t.awlBadge}</p>}{result.isRadd && <p>{t.raddBadge}</p>}{result.isUmariyyatan && <p>{t.umariyyatanBadge}</p>}{result.warnings.map(w => <p key={w}>{w}</p>)}</details>}
    {result.surplusRemainderAmount > 0 && <div className="calculation-note flex flex-wrap justify-between gap-2"><span>{c.remainder}</span><strong>{money(result.surplusRemainderAmount)}</strong></div>}
    {blockedHeirs.length > 0 && <details className="result-notes"><summary>{t.blockedRelatives} ({blockedHeirs.length})</summary>{blockedHeirs.map(h => <div key={h.heirId} className="py-3 border-b border-slate-200 last:border-0"><strong>{getHeirDisplayName(h,language)}</strong><p>{h.reason[language]}</p><button className="text-action mt-2" onClick={() => onOpenDaleel(h.daleelIds,getHeirDisplayName(h,language))}><BookOpen size={15}/>{c.evidence}</button></div>)}</details>}
    <p className="guidance-copy mt-6">{c.guidance}</p>
  </div>;
}
