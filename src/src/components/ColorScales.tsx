import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Layers, Copy, Download } from 'lucide-react';
import {
  generateColorScale,
  exportScaleTailwind,
  exportScaleCSS,
  exportScaleSCSS,
  type ColorScale,
} from '../lib/colorScales';
import { getColorName } from '../lib/colorNaming';
import { useCopyToClipboard } from '../hooks';
import { toast } from 'sonner@2.0.3';

interface ColorScalesProps {
  colors: string[];
  onGenerateColors: (colors: string[]) => void;
}

export function ColorScales({ colors, onGenerateColors }: ColorScalesProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [method, setMethod] = useState<'material' | 'tailwind' | 'custom'>('tailwind');
  const [colorName, setColorName] = useState<string>('primary');
  const { copyToClipboard } = useCopyToClipboard();

  const hasColors = colors.length > 0;
  const selectedColor = hasColors ? colors[selectedColorIndex] : null;

  const scale: ColorScale | null = selectedColor
    ? generateColorScale(selectedColor, method)
    : null;

  const scaleArray = scale ? Object.values(scale) : [];

  const handleAddToPalette = () => {
    if (scaleArray.length > 0) {
      onGenerateColors(scaleArray);
      toast.success('Color scale added to palette');
    }
  };

  const handleCopyTailwind = () => {
    if (scale) {
      const config = exportScaleTailwind(colorName, scale);
      copyToClipboard(config, 'Tailwind config copied!');
    }
  };

  const handleCopyCSS = () => {
    if (scale) {
      const css = exportScaleCSS(colorName, scale);
      copyToClipboard(css, 'CSS variables copied!');
    }
  };

  const handleCopySCSS = () => {
    if (scale) {
      const scss = exportScaleSCSS(colorName, scale);
      copyToClipboard(scss, 'SCSS variables copied!');
    }
  };

  const handleDownloadJSON = () => {
    if (!scale) return;

    const json = JSON.stringify({ [colorName]: scale }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${colorName}-scale.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Color scale downloaded');
  };

  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h3 className="text-neutral-900 dark:text-neutral-50">Color Scales</h3>
        </div>

        {!hasColors && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Add colors to generate scales
          </p>
        )}

        {hasColors && (
          <>
            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-neutral-700 dark:text-neutral-300">Base Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {colors.slice(0, 10).map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`h-12 rounded border-2 transition-all ${
                      selectedColorIndex === idx
                        ? 'border-neutral-900 dark:border-neutral-50 scale-110'
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {selectedColor && (
              <>
                {/* Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-neutral-700 dark:text-neutral-300">
                      Scale Method
                    </Label>
                    <Select
                      value={method}
                      onValueChange={(value) =>
                        setMethod(value as 'material' | 'tailwind' | 'custom')
                      }
                    >
                      <SelectTrigger className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tailwind">Tailwind</SelectItem>
                        <SelectItem value="material">Material Design</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-neutral-700 dark:text-neutral-300">
                      Color Name
                    </Label>
                    <Input
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      placeholder="primary"
                      className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                    />
                  </div>
                </div>

                {/* Scale Preview */}
                {scale && (
                  <div className="space-y-2">
                    <Label className="text-neutral-700 dark:text-neutral-300">
                      Generated Scale
                    </Label>
                    <div className="space-y-2">
                      {Object.entries(scale).map(([shade, color]) => (
                        <div
                          key={shade}
                          className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700"
                        >
                          <div
                            className="w-16 h-8 rounded border border-neutral-300 dark:border-neutral-600 flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-neutral-900 dark:text-neutral-50">
                                {colorName}-{shade}
                              </span>
                              <code className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                                {color}
                              </code>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(color, `${colorName}-${shade} copied!`)
                            }
                            className="h-8 w-8 p-0 flex-shrink-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={handleAddToPalette}
                    className="w-full bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    Add Scale to Palette
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleCopyTailwind}
                      variant="outline"
                      size="sm"
                      className="border-neutral-200 dark:border-neutral-700"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Tailwind
                    </Button>
                    <Button
                      onClick={handleCopyCSS}
                      variant="outline"
                      size="sm"
                      className="border-neutral-200 dark:border-neutral-700"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      CSS
                    </Button>
                    <Button
                      onClick={handleCopySCSS}
                      variant="outline"
                      size="sm"
                      className="border-neutral-200 dark:border-neutral-700"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      SCSS
                    </Button>
                    <Button
                      onClick={handleDownloadJSON}
                      variant="outline"
                      size="sm"
                      className="border-neutral-200 dark:border-neutral-700"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      JSON
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-900 dark:text-blue-100">
                  <p className="mb-1">
                    <strong>Tip:</strong> Color scales are perfect for design systems
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Use {colorName}-500 as your base, lighter shades for backgrounds,
                    darker for text
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}