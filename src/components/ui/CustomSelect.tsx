import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        if (currentIndex < options.length - 1) {
          onChange(options[currentIndex + 1].value);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        if (currentIndex > 0) {
          onChange(options[currentIndex - 1].value);
        }
      }
    }
  };

  const isSmall = size === 'sm';

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`inline-flex items-center justify-between gap-2 rounded-lg border transition-all duration-200 ${
          isOpen
            ? 'border-jade-600 ring-2 ring-jade-500/15 bg-white text-obsidian-900 shadow-float'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-obsidian-800 shadow-micro'
        } ${isSmall ? 'px-2.5 py-1 text-xs font-medium' : 'px-3.5 py-2 text-sm font-medium'}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-obsidian-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-jade-700' : ''
          }`}
        />
      </button>

      {/* Floating Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 3, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 mt-1.5 w-max min-w-full max-h-60 overflow-y-auto rounded-xl bg-white border border-slate-200/90 p-1 shadow-float text-obsidian-900 focus:outline-none"
            style={{ minWidth: '10rem' }}
          >
            <div role="listbox" className="space-y-0.5">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? 'bg-jade-50/80 text-jade-900 font-semibold'
                        : 'text-obsidian-700 hover:bg-slate-100 hover:text-obsidian-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.icon}
                      <span>{option.label}</span>
                      {option.sublabel && (
                        <span className="text-[11px] text-obsidian-400 font-normal">
                          {option.sublabel}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-jade-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
