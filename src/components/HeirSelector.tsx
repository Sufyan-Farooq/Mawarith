import { Check, Plus } from 'lucide-react';
import { HeirsInput, DeceasedGender } from '../engine/types';
import { SupportedLanguage, TRANSLATIONS, Translations } from '../i18n/translations';
import { workflow } from '../i18n/workflow';
import { TactileStepper } from './ui/TactileStepper';
type Relative = { key: keyof HeirsInput; label: keyof Translations; id: string; boolean?: boolean };
const immediate: Relative[] = [
  {key:'sonsCount',label:'sons',id:'sons'}, {key:'daughtersCount',label:'daughters',id:'daughters'},
  {key:'father',label:'father',id:'father',boolean:true}, {key:'mother',label:'mother',id:'mother',boolean:true},
];
const extended: Relative[] = [
  {key:'grandsonsCount',label:'grandsons',id:'grandsons'}, {key:'granddaughtersCount',label:'granddaughters',id:'granddaughters'},
  {key:'paternalGrandfather',label:'paternalGrandfather',id:'paternalGrandfather',boolean:true},
  {key:'maternalGrandmother',label:'maternalGrandmother',id:'maternalGrandmother',boolean:true},
  {key:'paternalGrandmother',label:'paternalGrandmother',id:'paternalGrandmother',boolean:true},
  {key:'fullBrothersCount',label:'fullBrothers',id:'fullBrothers'}, {key:'fullSistersCount',label:'fullSisters',id:'fullSisters'},
  {key:'paternalBrothersCount',label:'paternalBrothers',id:'paternalBrothers'}, {key:'paternalSistersCount',label:'paternalSisters',id:'paternalSisters'},
  {key:'maternalBrothersCount',label:'maternalBrothers',id:'maternalBrothers'}, {key:'maternalSistersCount',label:'maternalSisters',id:'maternalSisters'},
  {key:'nephewsFullCount',label:'nephewsFull',id:'nephewsFull'}, {key:'nephewsPaternalCount',label:'nephewsPaternal',id:'nephewsPaternal'},
  {key:'paternalUnclesFullCount',label:'unclesFull',id:'unclesFull'}, {key:'paternalUnclesPaternalCount',label:'unclesPaternal',id:'unclesPaternal'},
  {key:'cousinsFullCount',label:'cousinsFull',id:'cousinsFull'}, {key:'cousinsPaternalCount',label:'cousinsPaternal',id:'cousinsPaternal'},
];
interface HeirSelectorProps {
  gender: DeceasedGender; onChangeGender: (g: DeceasedGender) => void;
  heirs: HeirsInput; onChangeHeirs: (h: HeirsInput) => void; language: SupportedLanguage;
}
export function HeirSelector({gender,onChangeGender,heirs,onChangeHeirs,language}: HeirSelectorProps) {
  const t = TRANSLATIONS[language]; const c = workflow(language);
  const spouse: Relative = gender === 'male' ? {key:'wivesCount',label:'wives',id:'wives'} : {key:'husband',label:'husband',id:'husband',boolean:true};
  const relatives = [spouse,...immediate,...extended];
  const active = relatives.filter(r => Boolean(heirs[r.key]));
  const extendedCount = extended.reduce((sum,r) => sum + Number(heirs[r.key]),0);
  const renderRelative = (r: Relative) => r.boolean ? <button key={r.key} className={`relative-toggle ${heirs[r.key] ? 'is-selected' : ''}`} aria-pressed={Boolean(heirs[r.key])} onClick={() => onChangeHeirs({...heirs,[r.key]:!heirs[r.key]})}><span>{t[r.label]}</span><span className="selection-mark" aria-hidden="true">{heirs[r.key] ? <Check size={16}/> : <Plus size={16}/>}</span></button> : <TactileStepper language={language} key={r.key} label={t[r.label]} value={Number(heirs[r.key])} onChange={v => onChangeHeirs({...heirs,[r.key]:v})} max={r.key === 'wivesCount' ? 4 : 20}/>;
  return <div className="family-form">
    <header className="section-heading"><h2>{c.family}</h2><p>{t.relativesSubtitle}</p></header>
    <fieldset className="gender-field"><legend>{t.gender}</legend><div className="gender-buttons">{(['male','female'] as const).map(g => <button key={g} aria-pressed={gender === g} onClick={() => {onChangeGender(g); onChangeHeirs({...heirs, ...(g === 'male' ? {husband:false} : {wivesCount:0})});}}>{c[g]}</button>)}</div></fieldset>
    <section className="family-section"><h3>{t.spouses}</h3>{renderRelative(spouse)}</section>
    <section className="family-section"><h3>{language === 'en' ? 'Children & parents' : language === 'ar' ? 'الأبناء والوالدان' : 'اولاد اور والدین'}</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{immediate.map(renderRelative)}</div></section>
    <details className="family-details" key={`${gender}-${extendedCount > 0}`} open={extendedCount > 0 || undefined}><summary>{c.moreFamily}{extendedCount > 0 && <span className="selected-count">{extendedCount} {c.selected}</span>}</summary><p>{c.moreFamilyHelp}</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">{extended.map(renderRelative)}</div></details>
    <details className="family-details"><summary>{c.optionalNames}</summary><label className="name-label">{c.deceased}<input value={heirs.deceasedName || ''} onChange={e => onChangeHeirs({...heirs,deceasedName:e.target.value})}/></label>
      {active.map(r => <div key={r.key} className="mt-4"><p className="text-sm font-semibold mb-2">{t[r.label]}</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{Array.from({length:Number(heirs[r.key])}).map((_,i) => <input key={i} className="name-input" aria-label={`${t[r.label]} ${i+1}`} placeholder={`${t[r.label]} ${i+1}`} value={heirs.heirNames?.[r.id]?.[i] || ''} onChange={e => {const names = [...(heirs.heirNames?.[r.id] || [])]; names[i] = e.target.value; onChangeHeirs({...heirs,heirNames:{...heirs.heirNames,[r.id]:names}});}}/>)}</div></div>)}
    </details>
  </div>;
}
