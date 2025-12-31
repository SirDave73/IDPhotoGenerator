interface Option {
  value: string;
  label: string;
}

interface OptionSelectorProps {
  title: string;
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
}

export function OptionSelector({ title, options, selected, onSelect }: OptionSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selected === option.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-foreground border border-border hover:bg-accent'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
