import { useState, useEffect } from 'react';
import { Sliders, RotateCw, Droplet, Sun, Palette } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Slider } from '../../components/ui/slider';
import { toast } from 'sonner@2.0.3';

interface ColorAdjustmentPanelProps {
  colors: string[];
  selectedColorIndex: number | null;
  onColorChange: (index: number, newColor: string) => void;
}

// Color conversion utilities
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

export function ColorAdjustmentPanel({ 
  colors, 
  selectedColorIndex, 
  onColorChange 
}: ColorAdjustmentPanelProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);
  
  const selectedColor = selectedColorIndex !== null ? colors[selectedColorIndex] : null;

  // Update sliders when selected color changes
  useEffect(() => {
    if (selectedColor) {
      const hsl = hexToHSL(selectedColor);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
    }
  }, [selectedColor]);

  const handleAdjustment = (type: 'hue' | 'saturation' | 'lightness', value: number[]) => {
    if (selectedColorIndex === null) return;

    const newValue = value[0];
    let newHue = hue;
    let newSat = saturation;
    let newLight = lightness;

    switch (type) {
      case 'hue':
        newHue = newValue;
        setHue(newValue);
        break;
      case 'saturation':
        newSat = newValue;
        setSaturation(newValue);
        break;
      case 'lightness':
        newLight = newValue;
        setLightness(newValue);
        break;
    }

    const newColor = hslToHex(newHue, newSat, newLight);
    onColorChange(selectedColorIndex, newColor);
  };

  const generateTints = () => {
    if (!selectedColor || selectedColorIndex === null) return;
    
    const hsl = hexToHSL(selectedColor);
    const tints: string[] = [];
    
    // Generate 5 tints (lighter versions)
    for (let i = 1; i <= 5; i++) {
      const newLightness = Math.min(100, hsl.l + (i * 10));
      tints.push(hslToHex(hsl.h, hsl.s, newLightness));
    }
    
    toast.success(`Generated ${tints.length} tints`);
    return tints;
  };

  const generateShades = () => {
    if (!selectedColor || selectedColorIndex === null) return;
    
    const hsl = hexToHSL(selectedColor);
    const shades: string[] = [];
    
    // Generate 5 shades (darker versions)
    for (let i = 1; i <= 5; i++) {
      const newLightness = Math.max(0, hsl.l - (i * 10));
      shades.push(hslToHex(hsl.h, hsl.s, newLightness));
    }
    
    toast.success(`Generated ${shades.length} shades`);
    return shades;
  };

  const resetColor = () => {
    if (!selectedColor) return;
    const hsl = hexToHSL(selectedColor);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    toast.success('Color adjustments reset');
  };

  if (!selectedColor) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h2 className="text-neutral-900 dark:text-neutral-50">Color Adjustments</h2>
        </div>
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          <Palette className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Select a color to adjust</p>
          <p className="text-sm mt-1">Click any color in your palette above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h2 className="text-neutral-900 dark:text-neutral-50">Color Adjustments</h2>
        </div>
        <Button
          onClick={resetColor}
          variant="ghost"
          size="sm"
        >
          <RotateCw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Color Preview */}
      <div className="mb-6">
        <div 
          className="w-full h-20 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 mb-2"
          style={{ backgroundColor: selectedColor }}
        />
        <div className="text-center">
          <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded">
            {selectedColor.toUpperCase()}
          </code>
        </div>
      </div>

      {/* Hue Slider */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
              <Palette className="w-4 h-4" />
              Hue
            </label>
            <span className="text-sm text-neutral-900 dark:text-neutral-50">{hue}°</span>
          </div>
          <Slider
            value={[hue]}
            onValueChange={(value) => handleAdjustment('hue', value)}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
        </div>

        {/* Saturation Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
              <Droplet className="w-4 h-4" />
              Saturation
            </label>
            <span className="text-sm text-neutral-900 dark:text-neutral-50">{saturation}%</span>
          </div>
          <Slider
            value={[saturation]}
            onValueChange={(value) => handleAdjustment('saturation', value)}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Lightness Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
              <Sun className="w-4 h-4" />
              Lightness
            </label>
            <span className="text-sm text-neutral-900 dark:text-neutral-50">{lightness}%</span>
          </div>
          <Slider
            value={[lightness]}
            onValueChange={(value) => handleAdjustment('lightness', value)}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={generateTints}
          variant="outline"
          size="sm"
          className="border-neutral-200 dark:border-neutral-700"
        >
          Generate Tints
        </Button>
        <Button
          onClick={generateShades}
          variant="outline"
          size="sm"
          className="border-neutral-200 dark:border-neutral-700"
        >
          Generate Shades
        </Button>
      </div>
    </div>
  );
}