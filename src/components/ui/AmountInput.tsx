import { InputHTMLAttributes, useState } from 'react';
type AmountInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {value: number; onAmountChange: (value: number) => void};
export function AmountInput({value,onAmountChange,...props}: AmountInputProps) {
  const [draft,setDraft] = useState<string | null>(null);
  return <input {...props} type="text" inputMode="decimal" value={draft ?? (value ? value.toLocaleString(undefined,{maximumFractionDigits:2}) : '')}
    onFocus={event => {setDraft(value ? String(value) : ''); props.onFocus?.(event);}}
    onBlur={event => {setDraft(null); props.onBlur?.(event);}}
    onChange={event => {
      const normalized = event.target.value.replace(/[٠-٩۰-۹]/g, ch => String(ch.charCodeAt(0) - (ch.charCodeAt(0) >= 1776 ? 1776 : 1632))).replace(/٫/g,'.').replace(/[,٬]/g,'');
      if (!/^\d*\.?\d{0,2}$/.test(normalized)) return;
      const amount = Number(normalized);
      if (!Number.isFinite(amount) || amount > Number.MAX_SAFE_INTEGER) return;
      setDraft(normalized); onAmountChange(amount);
    }}/>
}
