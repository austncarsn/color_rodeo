import { useState, useEffect } from 'react';
import { Sparkles, Palette, Pipette } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { isValidHex, generateComplementary, generateAnalogous } from '../lib/colorUtils';

interface BaseColorInputProps {
  onGenerate: (colors: string[]) => void;
}

export function BaseColorInput({ onGenerate }: BaseColorInputProps) {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [error, setError] = useState('');
  const [previewColors, setPreviewColors] = useState<string[]>([]);

  // Generate preview colors in real-time
  useEffect(() => {
    if (isValidHex(baseColor)) {
      const complementary = generateComplementary(baseColor);
      const analogous = generateAnalogous(baseColor, 2, 30);
      setPreviewColors([baseColor, complementary, ...analogous]);
      setError('');
    } else {
      setPreviewColors([]);
    }
  }, [baseColor]);

  const handleGenerate = () => {
    if (!isValidHex(baseColor)) {
      setError('Please enter a valid hex color');
      return;
    }
    
    setError('');
    onGenerate(previewColors);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const handleRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    setBaseColor(randomColor);
  };

  // Get luminance to determine if text should be light or dark
  const getTextColor = (hex: string): string => {
    if (!isValidHex(hex)) return '#000000';
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="space-y-6">
      {/* Step label */}
      <div className="flex items-center justify-center gap-2">
        <div className="px-4 py-2 rounded-full bg-[#F2C46B]/10 dark:bg-[#F2C46B]/10 border border-[#F2C46B]/20 dark:border-[#F2C46B]/20">
          <span className="text-xs text-[#D4A855] dark:text-[#F2C46B] tracking-wide" style={{ fontWeight: 500 }}>
            Step 1 · Choose your base color
          </span>
        </div>
      </div>

      {/* Enhanced Input Container */}
      <div className="relative max-w-2xl mx-auto">
        {/* Main Input Card */}
        <div className={`relative bg-white dark:bg-[#1E1F23] rounded-2xl border-2 transition-all duration-300 ${
          isValidHex(baseColor) 
            ? 'border-[#F2C46B] dark:border-[#F2C46B] shadow-[0_0_0_4px_rgba(242,196,107,0.1)]' 
            : 'border-neutral-200 dark:border-[#292B33]'
        }`}>
          
          {/* Input Section */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Text Input */}
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={baseColor}
                  onChange={(e) => {
                    setBaseColor(e.target.value.toUpperCase());
                    setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="#3B82F6"
                  className="h-14 sm:h-16 px-6 text-center text-lg sm:text-xl tracking-widest bg-neutral-50 dark:bg-[#18191D] border-neutral-200 dark:border-[#292B33] focus:border-[#F2C46B] dark:focus:border-[#F2C46B] text-neutral-900 dark:text-[#F5F5F7] placeholder:text-neutral-400 dark:placeholder:text-[#8C909A] rounded-xl font-mono"
                  style={{ fontWeight: 600 }}
                />
                {/* Color picker input (native) - hidden behind icon */}
                <input
                  type="color"
                  value={isValidHex(baseColor) ? baseColor : '#3B82F6'}
                  onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg cursor-pointer"
                  style={{ opacity: 0 }}
                  title="Pick a color"
                />
                {/* Color preview icon */}
                {isValidHex(baseColor) && (
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border-2 border-neutral-300 dark:border-[#292B33] pointer-events-none"
                    style={{ backgroundColor: baseColor }}
                  />
                )}
                {!isValidHex(baseColor) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-neutral-200 dark:bg-[#292B33] flex items-center justify-center pointer-events-none">
                    <Pipette className="w-4 h-4 text-neutral-500 dark:text-[#8C909A]" />
                  </div>
                )}
              </div>

              {/* Random Color Button */}
              <Button
                onClick={handleRandomColor}
                variant="outline"
                className="h-14 sm:h-16 px-6 bg-neutral-50 dark:bg-[#18191D] border-neutral-200 dark:border-[#292B33] hover:bg-neutral-100 dark:hover:bg-[#23252B] hover:border-[#F2C46B] dark:hover:border-[#F2C46B] transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 text-neutral-600 dark:text-[#C1C4CF]" />
                <span className="hidden sm:inline ml-2 text-sm" style={{ fontWeight: 500 }}>Random</span>
              </Button>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 text-center mt-3 animate-in fade-in duration-200">
                {error}
              </p>
            )}

            {/* Live Preview Palette */}
            {isValidHex(baseColor) && previewColors.length > 0 && (
              <div className="mt-6 p-4 bg-neutral-50 dark:bg-[#18191D] rounded-xl border border-neutral-200 dark:border-[#292B33]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-neutral-600 dark:text-[#8C909A]" style={{ fontWeight: 500 }}>
                    Preview Palette
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-[#8C909A]">
                    {previewColors.length} colors
                  </span>
                </div>
                <div className="flex gap-2">
                  {previewColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-16 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer group relative overflow-hidden"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {/* Hover overlay with color code */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-xs font-mono" style={{ fontWeight: 500 }}>
                          {color.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button - Large and Prominent */}
            <Button
              onClick={handleGenerate}
              disabled={!isValidHex(baseColor)}
              className="w-full mt-6 h-14 sm:h-16 text-base sm:text-lg bg-[#F2C46B] hover:bg-[#D4A855] text-[#121212] border-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_rgba(212,168,85,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_24px_rgba(212,168,85,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-xl"
              style={{ fontWeight: 600 }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Palette
            </Button>

            {/* Helper text */}
            <p className="text-xs text-center text-neutral-500 dark:text-[#8C909A] mt-4 tracking-wide">
              Press <kbd className="px-2 py-1 bg-neutral-200 dark:bg-[#292B33] rounded text-[10px] font-mono">Enter</kbd> or click Generate to create your palette
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}