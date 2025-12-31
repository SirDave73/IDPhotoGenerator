import { Check } from 'lucide-react';
import type { BackgroundColor } from '@/types';

interface ColorOption {
  value: BackgroundColor;
  label: string;
  color: string;
}

interface ColorSelectorProps {
  selected: BackgroundColor;
  onSelect: (color: BackgroundColor) => void;
}

const colorOptions: ColorOption[] = [
  { value: 'white', label: 'White', color: '#FFFFFF' },
  { value: 'gray', label: 'Gray', color: '#9CA3AF' },
  { value: 'blue', label: 'Blue', color: '#3B82F6' },
];

export function ColorSelector({ selected, onSelect }: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-foreground">Background Color</h3>
      <div className="flex gap-3">
        {colorOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`w-14 h-14 rounded-lg border-2 transition-all flex items-center justify-center ${
                selected === option.value
                  ? 'border-primary shadow-md scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{ backgroundColor: option.color }}
            >
              {selected === option.value && (
                <Check className="w-5 h-5 text-foreground" strokeWidth={3} />
              )}
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
