import { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { Button } from '../../components/ui/button';

const tips = [
  "Click any color swatch to open the Color Inspector for detailed analysis",
  "Press Ctrl+S to quickly save your current palette",
  "Drag color swatches to reorder them in your palette",
  "Try the harmony visualizer to explore color relationships",
  "Export your palettes to multiple formats including CSS, Tailwind, and more",
];

export function QuickTips() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  if (!isVisible) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center mt-0.5">
          <Lightbulb className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Quick Tip</p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {tips[currentTip]}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-white/[0.08] flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
