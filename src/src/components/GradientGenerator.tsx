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
import { Slider } from '../../components/ui/slider';
import { Palette, Copy, Download } from 'lucide-react';
import {
  generateGradient,
  generateMultiStopGradient,
  createGradient,
  generateGradientCSS,
  generateSVGLinearGradient,
  generateSVGRadialGradient,
  type GradientType,
  type GradientDirection,
} from '../lib/gradientUtils';
import { useCopyToClipboard } from '../hooks';
import { toast } from 'sonner@2.0.3';

interface GradientGeneratorProps {
  colors: string[];
  onGenerateColors: (colors: string[]) => void;
}

export function GradientGenerator({ colors, onGenerateColors }: GradientGeneratorProps) {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [direction, setDirection] = useState<GradientDirection>('to right');
  const [steps, setSteps] = useState<number>(5);
  const [method, setMethod] = useState<'rgb' | 'hsl'>('rgb');
  const { copyToClipboard } = useCopyToClipboard();

  const selectedColors = colors.slice(0, 2);
  const hasEnoughColors = selectedColors.length >= 2;

  const gradientColors = hasEnoughColors
    ? colors.length === 2
      ? generateGradient(colors[0], colors[1], steps, method)
      : generateMultiStopGradient(colors, steps)
    : [];

  const gradient = hasEnoughColors
    ? createGradient(gradientColors, gradientType, direction)
    : null;

  const gradientCSS = gradient ? generateGradientCSS(gradient) : '';

  const handleGenerateToColors = () => {
    if (gradientColors.length > 0) {
      onGenerateColors(gradientColors);
      toast.success(`Generated ${gradientColors.length} colors from gradient`);
    }
  };

  const handleCopyCSS = () => {
    copyToClipboard(gradientCSS, 'Gradient CSS copied!');
  };

  const handleDownloadSVG = () => {
    if (!gradient) return;

    const svgGradient =
      gradientType === 'linear'
        ? generateSVGLinearGradient('gradient1', gradient)
        : generateSVGRadialGradient('gradient1', gradient);

    const svg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${svgGradient}
  </defs>
  <rect width="400" height="200" fill="url(#gradient1)" />
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient.svg';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Gradient SVG downloaded');
  };

  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h3 className="text-neutral-900 dark:text-neutral-50">Gradient Generator</h3>
        </div>

        {!hasEnoughColors && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Add at least 2 colors to create gradients
          </p>
        )}

        {hasEnoughColors && (
          <>
            {/* Preview */}
            <div
              className="w-full h-32 rounded-lg border border-neutral-300 dark:border-neutral-600"
              style={{ background: gradientCSS }}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-2">
                <Label className="text-neutral-700 dark:text-neutral-300">Type</Label>
                <Select
                  value={gradientType}
                  onValueChange={(value) => setGradientType(value as GradientType)}
                >
                  <SelectTrigger className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="conic">Conic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Direction (for linear only) */}
              {gradientType === 'linear' && (
                <div className="space-y-2">
                  <Label className="text-neutral-700 dark:text-neutral-300">Direction</Label>
                  <Select
                    value={direction}
                    onValueChange={(value) => setDirection(value as GradientDirection)}
                  >
                    <SelectTrigger className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to right">To Right</SelectItem>
                      <SelectItem value="to left">To Left</SelectItem>
                      <SelectItem value="to bottom">To Bottom</SelectItem>
                      <SelectItem value="to top">To Top</SelectItem>
                      <SelectItem value="to bottom right">To Bottom Right</SelectItem>
                      <SelectItem value="to bottom left">To Bottom Left</SelectItem>
                      <SelectItem value="to top right">To Top Right</SelectItem>
                      <SelectItem value="to top left">To Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Method */}
              <div className="space-y-2">
                <Label className="text-neutral-700 dark:text-neutral-300">
                  Interpolation
                </Label>
                <Select
                  value={method}
                  onValueChange={(value) => setMethod(value as 'rgb' | 'hsl')}
                >
                  <SelectTrigger className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rgb">RGB (Direct)</SelectItem>
                    <SelectItem value="hsl">HSL (Smooth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Steps Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-neutral-700 dark:text-neutral-300">
                  Steps: {steps}
                </Label>
              </div>
              <Slider
                value={[steps]}
                onValueChange={(value) => setSteps(value[0])}
                min={2}
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            {/* Generated Colors Preview */}
            <div className="space-y-2">
              <Label className="text-neutral-700 dark:text-neutral-300">
                Generated Colors
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {gradientColors.map((color, idx) => (
                  <div key={idx} className="space-y-1">
                    <div
                      className="w-full h-12 rounded border border-neutral-300 dark:border-neutral-600"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center font-mono">
                      {color}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CSS Output */}
            <div className="space-y-2">
              <Label className="text-neutral-700 dark:text-neutral-300">CSS</Label>
              <div className="relative">
                <Input
                  value={`background: ${gradientCSS};`}
                  readOnly
                  className="pr-10 font-mono text-xs"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyCSS}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleGenerateToColors}
                variant="outline"
                className="border-neutral-200 dark:border-neutral-700"
              >
                <Palette className="w-4 h-4 mr-2" />
                Add to Palette
              </Button>
              <Button
                onClick={handleDownloadSVG}
                variant="outline"
                className="border-neutral-200 dark:border-neutral-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download SVG
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}