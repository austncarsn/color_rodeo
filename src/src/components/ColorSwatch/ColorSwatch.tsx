import { useState } from 'react';
import { Check, X, ChevronDown, Tag } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useCopyToClipboard } from '../../hooks';
import { getContrastTextColor, formatColor } from '../../lib/colorUtils';
import { getShortColorName } from '../../lib/colorNaming';
import type { ColorSwatchProps } from '../../types/palette';

export function ColorSwatch({ color, onRemove, showRemove = true, onClick, isSelected = false }: ColorSwatchProps) {
  const { copyWithFeedback, isCopied } = useCopyToClipboard();
  const [displayFormat, setDisplayFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [showName, setShowName] = useState(false);

  const handleCopy = async () => {
    const formattedColor = formatColor(color, displayFormat);
    await copyWithFeedback(formattedColor, color);
  };

  const handleClick = (e: React.MouseEvent) => {
    // If there's an onClick handler, use it (for selection)
    if (onClick) {
      onClick();
    } else {
      // Otherwise, copy to clipboard (original behavior)
      handleCopy();
    }
  };

  const cycleFormat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayFormat(prev => {
      if (prev === 'hex') return 'rgb';
      if (prev === 'rgb') return 'hsl';
      return 'hex';
    });
  };

  const toggleName = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowName(prev => !prev);
  };

  const textColor = getContrastTextColor(color);
  const copied = isCopied(color);
  const displayValue = formatColor(color, displayFormat);
  const colorName = getShortColorName(color);

  return (
    <div className="relative group">
      <div
        className={`h-28 rounded-xl border-2 ${
          isSelected 
            ? 'border-neutral-900 dark:border-neutral-50 shadow-[0_0_0_3px_rgba(10,10,10,0.2)] dark:shadow-[0_0_0_3px_rgba(250,250,250,0.2)]' 
            : 'border-neutral-200 dark:border-neutral-700'
        } cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center justify-center overflow-hidden`}
        style={{ backgroundColor: color }}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {showName && (
          <div className={`relative z-10 text-xs ${textColor} drop-shadow-lg tracking-wide mb-1 px-2 py-0.5 bg-black/20 rounded-full`}>
            {colorName}
          </div>
        )}
        
        <div className={`relative z-10 text-sm ${textColor} drop-shadow-lg tracking-wide`}>
          {copied ? (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-200">
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </div>
          ) : (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Click to copy</span>
          )}
        </div>
        <div className={`relative z-10 mt-1 ${textColor} drop-shadow-lg tracking-wider text-sm`}>
          {displayValue}
        </div>
        <div className="relative z-10 flex items-center gap-2 mt-1">
          <button
            onClick={cycleFormat}
            className={`${textColor} opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity duration-200 flex items-center gap-0.5 text-xs`}
          >
            <span>{displayFormat.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <button
            onClick={toggleName}
            className={`${textColor} opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity duration-200 text-xs`}
          >
            <Tag className="w-3 h-3" />
          </button>
        </div>
      </div>
      {showRemove && onRemove && (
        <Button
          variant="destructive"
          size="sm"
          className="absolute -top-2 -right-2 h-7 w-7 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl scale-0 group-hover:scale-100"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}