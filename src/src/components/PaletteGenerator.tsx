import { useState, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
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
import { Wand2, Palette, Sparkles, Image, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

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

interface GenerationOption {
  type: GenerationType;
  label: string;
  description: string;
}

const generationOptions: GenerationOption[] = [
  {
    type: 'complementary',
    label: 'Complementary',
    description: 'Opposite on color wheel',
  },
  {
    type: 'analogous',
    label: 'Analogous',
    description: 'Adjacent colors',
  },
  {
    type: 'triadic',
    label: 'Triadic',
    description: '120° apart',
  },
  {
    type: 'tetradic',
    label: 'Tetradic',
    description: '90° square',
  },
  {
    type: 'splitComplementary',
    label: 'Split Complementary',
    description: 'Complementary variation',
  },
  {
    type: 'monochromatic',
    label: 'Monochromatic',
    description: 'Single hue variations',
  },
  {
    type: 'shades',
    label: 'Shades',
    description: 'Darker variations',
  },
  {
    type: 'tints',
    label: 'Tints',
    description: 'Lighter variations',
  },
];

const paletteStyles: PaletteStyle[] = [
  'vibrant',
  'pastel',
  'dark',
  'light',
  'neon',
  'earth',
  'ocean',
  'sunset',
  'forest',
  'monochrome',
];

export function PaletteGenerator({ onGenerate }: PaletteGeneratorProps) {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [error, setError] = useState('');
  const [randomStyle, setRandomStyle] = useState<PaletteStyle>('vibrant');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = (type: GenerationType) => {
    if (!isValidHex(baseColor)) {
      setError('Please enter a valid hex color');
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
  };

  const handleRandomGenerate = () => {
    const colors = generateRandomPalette(randomStyle, 5);
    onGenerate(colors);
    toast.success(`Generated ${getPaletteStyleName(randomStyle)} palette`);
  };

  const handleTrendingPalette = (colors: string[]) => {
    onGenerate(colors);
    toast.success('Loaded trending palette');
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
    <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h3 className="text-neutral-900 dark:text-neutral-50">Generate Palette</h3>
        </div>

        <Tabs defaultValue="theory" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="theory">
              <Palette className="w-4 h-4 mr-1" />
              Color Theory
            </TabsTrigger>
            <TabsTrigger value="random">
              <Sparkles className="w-4 h-4 mr-1" />
              Random
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </TabsTrigger>
          </TabsList>

          {/* Color Theory Tab */}
          <TabsContent value="theory" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="base-color" className="text-neutral-700 dark:text-neutral-300">
                Base Color
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="base-color"
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="pr-12 font-mono"
                  />
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded border border-neutral-300 dark:border-neutral-600"
                    style={{ backgroundColor: isValidHex(baseColor) ? baseColor : '#cccccc' }}
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {generationOptions.map((option) => (
                <Button
                  key={option.type}
                  onClick={() => handleGenerate(option.type)}
                  variant="outline"
                  className="flex flex-col items-start h-auto p-3 text-left border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span className="text-sm text-neutral-900 dark:text-neutral-50">
                    {option.label}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {option.description}
                  </span>
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* Random Tab */}
          <TabsContent value="random" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-neutral-700 dark:text-neutral-300">
                Palette Style
              </Label>
              <Select
                value={randomStyle}
                onValueChange={(value) => setRandomStyle(value as PaletteStyle)}
              >
                <SelectTrigger className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paletteStyles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {getPaletteStyleName(style)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleRandomGenerate}
              className="w-full bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Random Palette
            </Button>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Label className="text-neutral-700 dark:text-neutral-300 mb-2 block">
                <Image className="w-4 h-4 inline mr-1" />
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
                className="w-full border-neutral-200 dark:border-neutral-700"
              >
                <Image className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                Upload an image to extract its dominant colors
              </p>
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-2 mt-4">
            {TRENDING_PALETTES.map((palette) => (
              <button
                key={palette.name}
                onClick={() => handleTrendingPalette(palette.colors)}
                className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-900 dark:text-neutral-50">
                    {palette.name}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {palette.description}
                  </span>
                </div>
                <div className="flex gap-1">
                  {palette.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-8 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}