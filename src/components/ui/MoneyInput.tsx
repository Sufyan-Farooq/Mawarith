import React, { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';

interface MoneyInputProps {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (val: number) => void;
  currency: string;
  language?: string;
  placeholder?: string;
  presets?: number[];
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  label,
  sublabel,
  value,
  onChange,
  currency,
  language: _language,
  placeholder = '0',
  presets = [5000, 25000, 100000],
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const num = parseFloat(raw);
    onChange(isNaN(num) ? 0 : Math.max(0, num));
  };

  const addPreset = (delta: number) => {
    onChange((value || 0) + delta);
  };

  const handleReset = () => {
    onChange(0);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-obsidian-800 tracking-tight">
          {label}
        </label>
        {sublabel && (
          <span className="text-xs text-obsidian-500">
            {sublabel}
          </span>
        )}
      </div>

      {/* Main Input Surface */}
      <div
        className={`relative flex items-center rounded-xl border bg-white px-3 py-2 transition-all duration-200 shadow-micro ${
          isFocused
            ? 'border-jade-600 ring-2 ring-jade-500/15 shadow-float'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="text-xs font-bold font-mono text-jade-700 select-none pe-2 border-e border-slate-100">
          {currency}
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={value ? value.toLocaleString() : ''}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent ps-2.5 font-mono text-sm sm:text-base font-bold text-obsidian-900 focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
        />
        {value > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded-md text-obsidian-300 hover:text-obsidian-600 hover:bg-slate-100 transition-colors"
            title="Reset to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick-increment Presets */}
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
  );
};
