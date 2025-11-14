import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { isValidHex, generateComplementary, generateAnalogous, generateTriadic } from '../lib/colorUtils';

interface BaseColorInputProps {
  onGenerate: (colors: string[]) => void;
}

export function BaseColorInput({ onGenerate }: BaseColorInputProps) {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [error, setError] = useState('');

  const handleGenerate = () => {
    if (!isValidHex(baseColor)) {
      setError('Please enter a valid hex color');
      return;
    }
    
    setError('');
    // Generate a complementary palette with base color + complementary + analogous colors
    const complementary = generateComplementary(baseColor);
    const analogous = generateAnalogous(baseColor, 2, 30);
    const palette = [baseColor, complementary, ...analogous];
    onGenerate(palette);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="space-y-3 px-3 sm:px-0">
      {/* Step label */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="px-3 sm:px-4 py-1.5 rounded-full bg-[#F2C46B]/10 dark:bg-[#F2C46B]/10 border border-[#F2C46B]/20 dark:border-[#F2C46B]/20">
          <span className="text-[10px] sm:text-xs text-[#D4A855] dark:text-[#F2C46B] tracking-wide">Step 1 · Choose a base color</span>
        </div>
      </div>

      {/* Input group */}
      <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Input
            type="text"
            value={baseColor}
            onChange={(e) => {
              setBaseColor(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="#3B82F6"
            className="h-12 sm:h-14 px-12 sm:px-14 text-center text-base sm:text-lg tracking-wider bg-neutral-100 dark:bg-[#1E1F23] border-neutral-300 dark:border-[#292B33] focus:border-[#F2C46B] dark:focus:border-[#F2C46B] text-neutral-900 dark:text-[#F5F5F7] placeholder:text-neutral-400 dark:placeholder:text-[#8C909A] rounded-xl font-mono"
          />
          {/* Color preview dot */}
          {isValidHex(baseColor) && (
            <div
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/40 dark:border-white/20 shadow-lg"
              style={{ backgroundColor: baseColor }}
            />
          )}
        </div>
        <Button
          onClick={handleGenerate}
          className="min-h-[48px] sm:h-14 px-5 sm:px-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-purple-500 hover:shadow-2xl text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 border-0 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-orange-500 via-yellow-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline tracking-wide text-sm sm:text-base" style={{ fontWeight: 500 }}>
              Generate Palette
            </span>
            <span className="sm:hidden tracking-wide text-sm" style={{ fontWeight: 500 }}>
              Generate
            </span>
          </span>
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 text-center animate-in fade-in duration-200">{error}</p>
      )}

      {/* Helper text */}
      <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-[#8C909A] text-center tracking-wide">
        You can tweak everything later
      </p>
    </div>
  );
}