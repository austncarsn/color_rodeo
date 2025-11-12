import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Palette, CircleDot } from 'lucide-react';
import {
  generateHarmony,
  getHarmonyDescription,
  type HarmonyType,
} from '../lib/colorHarmony';
import { hexToHsl } from '../lib/colorUtils';
import { toast } from 'sonner@2.0.3';

interface ColorHarmonyVisualizerProps {
  colors: string[];
  onGenerateColors: (colors: string[]) => void;
}

const HARMONY_TYPES: { value: HarmonyType; label: string }[] = [
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'split-complementary', label: 'Split Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'tetradic', label: 'Tetradic' },
  { value: 'square', label: 'Square' },
];

export function ColorHarmonyVisualizer({ colors, onGenerateColors }: ColorHarmonyVisualizerProps) {
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('complementary');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const hasColors = colors.length > 0;
  const baseColor = hasColors ? colors[selectedColorIndex] : '#3B82F6';

  const harmony = generateHarmony(baseColor, harmonyType);
  const description = getHarmonyDescription(harmonyType);

  const handleGenerate = () => {
    onGenerateColors(harmony.colors);
    toast.success(`Generated ${harmonyType} harmony`);
  };

  // Color wheel visualization
  const wheelSize = 280;
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const radius = 120;

  const renderColorWheel = () => {
    const segments = 360;
    const segmentAngle = 360 / segments;

    return (
      <svg width={wheelSize} height={wheelSize} className="mx-auto">
        {/* Color wheel segments */}
        {Array.from({ length: segments }).map((_, i) => {
          const angle1 = i * segmentAngle;
          const angle2 = (i + 1) * segmentAngle;
          const rad1 = ((angle1 - 90) * Math.PI) / 180;
          const rad2 = ((angle2 - 90) * Math.PI) / 180;

          const x1 = centerX + Math.cos(rad1) * radius;
          const y1 = centerY + Math.sin(rad1) * radius;
          const x2 = centerX + Math.cos(rad2) * radius;
          const y2 = centerY + Math.sin(rad2) * radius;

          const color = `hsl(${angle1}, 100%, 50%)`;

          return (
            <path
              key={i}
              d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
              fill={color}
            />
          );
        })}

        {/* Center white circle */}
        <circle cx={centerX} cy={centerY} r={radius * 0.4} fill="white" />

        {/* Harmony angle lines and dots */}
        {harmony.angles.map((angle, idx) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const x = centerX + Math.cos(rad) * radius;
          const y = centerY + Math.sin(rad) * radius;
          const color = harmony.colors[idx];

          return (
            <g key={idx}>
              {/* Line from center to color */}
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={color}
                strokeWidth="2"
                opacity="0.5"
              />
              {/* Color dot */}
              <circle
                cx={x}
                cy={y}
                r="12"
                fill={color}
                stroke="white"
                strokeWidth="3"
              />
            </g>
          );
        })}

        {/* Connecting lines for harmony relationships */}
        {harmony.type !== 'monochromatic' && harmony.angles.length > 1 && (
          <g>
            {harmony.angles.map((_, idx) => {
              if (idx === 0) return null;
              const rad1 = ((harmony.angles[idx - 1] - 90) * Math.PI) / 180;
              const rad2 = ((harmony.angles[idx] - 90) * Math.PI) / 180;
              const x1 = centerX + Math.cos(rad1) * radius;
              const y1 = centerY + Math.sin(rad1) * radius;
              const x2 = centerX + Math.cos(rad2) * radius;
              const y2 = centerY + Math.sin(rad2) * radius;

              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
              );
            })}
            {/* Close the shape for certain harmonies */}
            {(harmony.type === 'triadic' || harmony.type === 'square' || harmony.type === 'tetradic') && (
              <line
                x1={centerX + Math.cos(((harmony.angles[harmony.angles.length - 1] - 90) * Math.PI) / 180) * radius}
                y1={centerY + Math.sin(((harmony.angles[harmony.angles.length - 1] - 90) * Math.PI) / 180) * radius}
                x2={centerX + Math.cos(((harmony.angles[0] - 90) * Math.PI) / 180) * radius}
                y2={centerY + Math.sin(((harmony.angles[0] - 90) * Math.PI) / 180) * radius}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
            )}
          </g>
        )}
      </svg>
    );
  };

  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CircleDot className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h3 className="text-neutral-900 dark:text-neutral-50">Color Harmony</h3>
        </div>

        {/* Base Color Selection */}
        {hasColors && (
          <div className="space-y-2">
            <Label className="text-neutral-700 dark:text-neutral-300">Base Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {colors.slice(0, 12).map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`h-10 rounded border-2 transition-all ${
                    selectedColorIndex === idx
                      ? 'border-neutral-900 dark:border-neutral-50 scale-110'
                      : 'border-neutral-300 dark:border-neutral-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Harmony Type */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">Harmony Type</Label>
          <Select
            value={harmonyType}
            onValueChange={(value) => setHarmonyType(value as HarmonyType)}
          >
            <SelectTrigger className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HARMONY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
        </div>

        {/* Color Wheel Visualization */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
          {renderColorWheel()}
        </div>

        {/* Generated Colors Preview */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">Generated Colors</Label>
          <div className="grid grid-cols-5 gap-2">
            {harmony.colors.map((color, idx) => (
              <div key={idx} className="space-y-1">
                <div
                  className="w-full h-16 rounded border border-neutral-300 dark:border-neutral-600"
                  style={{ backgroundColor: color }}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center font-mono">
                  {color}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <Button
          onClick={handleGenerate}
          className="w-full bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900"
        >
          <Palette className="w-4 h-4 mr-2" />
          Apply Harmony to Palette
        </Button>

        {/* Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-900 dark:text-blue-100">
          <p className="mb-1">
            <strong>How it works:</strong>
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            The color wheel shows your harmony relationships. Dots represent colors, lines show the
            angles between them.
          </p>
        </div>
      </div>
    </Card>
  );
}