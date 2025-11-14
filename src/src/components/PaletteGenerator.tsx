import { useState, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import {
  generateComplementary,
  generateAnalogous,
  generateTriadic,
  generateTetradic,
  generateMonochromatic,
  generateSplitComplementary,
  generateShades,
  generateTints,
  isValidHex,
} from '../lib/colorUtils';
import {
  generateRandomPalette,
  extractColorsFromImageFile,
  TRENDING_PALETTES,
  getPaletteStyleName,
  type PaletteStyle,
} from '../lib/advancedGenerationUtils';
import { Wand2, Sparkles, Image, Shuffle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PaletteGeneratorProps {
  onGenerate: (colors: string[]) => void;
}

type GenerationType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'monochromatic'
  | 'splitComplementary'
  | 'shades'
  | 'tints';

interface QuickAction {
  type: GenerationType;
  label: string;
  emoji: string;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    type: 'complementary',
    label: 'Complementary',
    emoji: '🔄',
    description: 'Opposite colors for high contrast',
  },
  {
    type: 'analogous',
    label: 'Analogous',
    emoji: '🌈',
    description: 'Harmonious adjacent colors',
  },
  {
    type: 'monochromatic',
    label: 'Monochrome',
    emoji: '🎨',
    description: 'Shades of one color',
  },
  {
    type: 'triadic',
    label: 'Triadic',
    emoji: '🔺',
    description: 'Balanced 3-color harmony',
  },
];

const advancedActions: QuickAction[] = [
  {
    type: 'tetradic',
    label: 'Tetradic',
    emoji: '⬜',
    description: 'Rich 4-color square',
  },
  {
    type: 'splitComplementary',
    label: 'Split Comp.',
    emoji: '✨',
    description: 'Softer complementary',
  },
  {
    type: 'shades',
    label: 'Shades',
    emoji: '🌑',
    description: 'Darker variations',
  },
  {
    type: 'tints',
    label: 'Tints',
    emoji: '☀️',
    description: 'Lighter variations',
  },
];

const randomStyles: Array<{ style: PaletteStyle; name: string; emoji: string }> = [
  { style: 'vibrant', name: 'Vibrant', emoji: '⚡' },
  { style: 'pastel', name: 'Pastel', emoji: '🍭' },
  { style: 'dark', name: 'Dark', emoji: '🌙' },
  { style: 'neon', name: 'Neon', emoji: '💫' },
  { style: 'earth', name: 'Earth', emoji: '🌿' },
  { style: 'ocean', name: 'Ocean', emoji: '🌊' },
];

export function PaletteGenerator({ onGenerate }: PaletteGeneratorProps) {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = (type: GenerationType) => {
    if (!isValidHex(baseColor)) {
      setError('Please enter a valid hex color');
      toast.error('Invalid color format');
      return;
    }

    setError('');
    let generatedColors: string[] = [];

    switch (type) {
      case 'complementary':
        generatedColors = [baseColor, generateComplementary(baseColor)];
        break;
      case 'analogous':
        generatedColors = [baseColor, ...generateAnalogous(baseColor, 2)];
        break;
      case 'triadic':
        generatedColors = [baseColor, ...generateTriadic(baseColor)];
        break;
      case 'tetradic':
        generatedColors = [baseColor, ...generateTetradic(baseColor)];
        break;
      case 'splitComplementary':
        generatedColors = [baseColor, ...generateSplitComplementary(baseColor)];
        break;
      case 'monochromatic':
        generatedColors = generateMonochromatic(baseColor, 5);
        break;
      case 'shades':
        generatedColors = generateShades(baseColor, 5);
        break;
      case 'tints':
        generatedColors = generateTints(baseColor, 5);
        break;
    }

    onGenerate(generatedColors);
    toast.success(`Generated ${type} palette`);
  };

  const handleRandomGenerate = (style: PaletteStyle) => {
    const colors = generateRandomPalette(style, 5);
    onGenerate(colors);
    toast.success(`Generated ${getPaletteStyleName(style)} palette`);
  };

  const handleTrendingPalette = (colors: string[], name: string) => {
    onGenerate(colors);
    toast.success(`Loaded ${name}`);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      toast.loading('Extracting colors from image...');
      const colors = await extractColorsFromImageFile(file, 5);
      onGenerate(colors);
      toast.dismiss();
      toast.success('Colors extracted from image');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to extract colors from image');
      console.error(error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-neutral-900 dark:text-neutral-50" style={{ fontWeight: 500 }}>
              Generate Palette
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Pick a base color and choose a style
            </p>
          </div>
        </div>

        {/* Base Color Input - Prominent */}
        <div className="space-y-2">
          <Label htmlFor="gen-base-color" className="text-neutral-700 dark:text-neutral-300">
            Base Color
          </Label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                id="gen-base-color"
                type="text"
                value={baseColor}
                onChange={(e) => {
                  setBaseColor(e.target.value);
                  setError('');
                }}
                placeholder="#3B82F6"
                className="pr-14 font-mono text-base h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
              />
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                style={{ backgroundColor: isValidHex(baseColor) ? baseColor : '#cccccc' }}
                title="Click to see color"
              />
            </div>
            <input
              type="color"
              value={isValidHex(baseColor) ? baseColor : '#3B82F6'}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-neutral-200 dark:border-neutral-700"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Quick Actions - Most Popular */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-neutral-700 dark:text-neutral-300">
              Quick Generate
            </Label>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Popular choices
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.type}
                onClick={() => handleGenerate(action.type)}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-1 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-amber-500/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {action.emoji}
                  </span>
                  <span className="text-sm text-neutral-900 dark:text-neutral-50" style={{ fontWeight: 500 }}>
                    {action.label}
                  </span>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 text-left">
                  {action.description}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Advanced Options - Collapsible */}
        <div className="space-y-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-left group"
          >
            <Label className="text-neutral-700 dark:text-neutral-300 cursor-pointer">
              Advanced Options
            </Label>
            <ChevronRight 
              className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                showAdvanced ? 'rotate-90' : ''
              }`}
            />
          </button>
          
          {showAdvanced && (
            <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 fade-in duration-300">
              {advancedActions.map((action) => (
                <Button
                  key={action.type}
                  onClick={() => handleGenerate(action.type)}
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 flex flex-col items-start gap-1 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-base group-hover:scale-110 transition-transform">
                      {action.emoji}
                    </span>
                    <span className="text-xs text-neutral-900 dark:text-neutral-50" style={{ fontWeight: 500 }}>
                      {action.label}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 text-left">
                    {action.description}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">
              Or try these
            </span>
          </div>
        </div>

        {/* Random Palettes - Visual Buttons */}
        <div className="space-y-3">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Random Inspiration
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {randomStyles.map((item) => {
              // Generate a preview palette for this style
              const previewColors = generateRandomPalette(item.style, 4);
              
              return (
                <button
                  key={item.style}
                  onClick={() => handleRandomGenerate(item.style)}
                  className="relative h-20 rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 hover:border-amber-500 transition-all duration-200 group hover:scale-105"
                >
                  {/* Color stripes background */}
                  <div className="absolute inset-0 flex">
                    {previewColors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex-1 transition-all duration-300 group-hover:opacity-90"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  {/* Overlay with gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-3">
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform drop-shadow-lg">
                      {item.emoji}
                    </span>
                    <span className="text-white drop-shadow-lg text-sm" style={{ fontWeight: 600 }}>
                      {item.name}
                    </span>
                  </div>
                  
                  {/* Shuffle icon */}
                  <div className="absolute top-2 right-2">
                    <Shuffle className="w-3.5 h-3.5 text-white/70 group-hover:text-white drop-shadow-lg transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Extract from Image
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full h-12 border-dashed border-2 border-neutral-300 dark:border-neutral-600 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-200"
          >
            <Image className="w-4 h-4 mr-2" />
            Upload Image to Extract Colors
          </Button>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Upload a photo to extract its dominant colors
          </p>
        </div>

        {/* Trending Palettes - Compact */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Trending Palettes
          </Label>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {TRENDING_PALETTES.map((palette) => (
              <button
                key={palette.name}
                onClick={() => handleTrendingPalette(palette.colors, palette.name)}
                className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-amber-500/30 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-900 dark:text-neutral-50" style={{ fontWeight: 500 }}>
                    {palette.name}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <div className="flex gap-1">
                  {palette.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-6 rounded transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}