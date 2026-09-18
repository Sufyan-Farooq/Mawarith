import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';

interface TactileStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const TactileStepper: React.FC<TactileStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 20,
  label,
  sublabel,
  className = '',
}) => {
  const canDecrement = value > min;
  const canIncrement = value < max;

  const handleDecrement = () => {
    if (canDecrement) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (canIncrement) onChange(value + 1);
  };

  return (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-xl border transition-all duration-200 ${
      value > 0
        ? 'bg-jade-50/40 border-jade-600/30 shadow-micro'
        : 'bg-white border-slate-200/80 hover:border-slate-300'
    } ${className}`}>
      {label && (
        <div className="flex flex-col pe-3">
          <span className={`text-xs font-semibold ${value > 0 ? 'text-jade-950 font-bold' : 'text-obsidian-800'}`}>
            {label}
          </span>
          {sublabel && (
            <span className="text-[11px] text-obsidian-400">
              {sublabel}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1.5 ms-auto">
        <motion.button
          type="button"
          whileTap={canDecrement ? { scale: 0.88 } : {}}
          onClick={handleDecrement}
          disabled={!canDecrement}
          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
            canDecrement
              ? 'bg-white text-obsidian-800 border-slate-300 hover:bg-slate-100 hover:border-slate-400 active:bg-slate-200 shadow-micro'
              : 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
        </motion.button>

        <span className={`w-7 text-center font-mono text-sm font-bold ${
          value > 0 ? 'text-jade-900' : 'text-slate-400'
        }`}>
          {value}
        </span>

        <motion.button
          type="button"
          whileTap={canIncrement ? { scale: 0.88 } : {}}
          onClick={handleIncrement}
          disabled={!canIncrement}
          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
            canIncrement
              ? 'bg-white text-obsidian-800 border-slate-300 hover:bg-jade-50 hover:text-jade-800 hover:border-jade-300 active:bg-jade-100 shadow-micro'
              : 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
};
