import { Button } from '../../components/ui/button';

interface PalettePresetsProps {
  onLoadPreset: (colors: string[]) => void;
}

const presets = [
  {
    name: 'Branding',
    colors: ['#2563eb', '#7c3aed', '#db2777', '#f59e0b'],
  },
  {
    name: 'UI Dark',
    colors: ['#0a0a0a', '#171717', '#262626', '#404040', '#737373'],
  },
  {
    name: 'UI Light',
    colors: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3'],
  },
  {
    name: 'Data Viz',
    colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'],
  },
  {
    name: 'Pastel',
    colors: ['#fecaca', '#fed7aa', '#fef3c7', '#d9f99d', '#a7f3d0', '#bfdbfe'],
  },
  {
    name: 'Neutrals',
    colors: ['#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a', '#a1a1aa'],
  },
];

export function PalettePresets({ onLoadPreset }: PalettePresetsProps) {
  return (
    <div className="space-y-3 px-3 sm:px-0">
      <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-[#8C909A] tracking-wide uppercase text-center">Quick Start Presets</p>
      <div className="flex flex-wrap justify-center gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => onLoadPreset(preset.colors)}
            className="group relative overflow-hidden min-h-[44px] px-3 sm:px-4 border-neutral-200 dark:border-[#292B33] bg-white dark:bg-[#1E1F23] hover:bg-neutral-50 dark:hover:bg-[#23252B] hover:border-[#F2C46B]/30 transition-all duration-300"
          >
            {/* Color preview stripe */}
            <div className="absolute bottom-0 left-0 right-0 h-1 flex">
              {preset.colors.slice(0, 4).map((color, idx) => (
                <div
                  key={idx}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="relative text-xs sm:text-sm text-neutral-600 dark:text-[#C1C4CF] group-hover:text-neutral-900 dark:group-hover:text-[#F5F5F7] tracking-wide">
              {preset.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}