import { useState } from 'react';
import { Eye, AlertCircle, CheckCircle, Info } from 'lucide-react';
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
import {
  simulateColorblindness,
  getColorblindnessName,
  checkContrast,
  scorePaletteAccessibility,
  type ColorblindType,
} from '../lib/accessibilityUtils';

interface AccessibilityCheckerProps {
  colors: string[];
}

export function AccessibilityChecker({ colors }: AccessibilityCheckerProps) {
  const [colorblindMode, setColorblindMode] = useState<ColorblindType>('none');
  const [selectedColor1, setSelectedColor1] = useState<string | null>(null);
  const [selectedColor2, setSelectedColor2] = useState<string | null>(null);

  const score = scorePaletteAccessibility(colors);
  const hasColors = colors.length > 0;

  const contrastResult =
    selectedColor1 && selectedColor2
      ? checkContrast(selectedColor1, selectedColor2)
      : null;

  const simulatedColors = colors.map(color =>
    simulateColorblindness(color, colorblindMode)
  );

  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h3 className="text-neutral-900 dark:text-neutral-50">Accessibility</h3>
        </div>

        {!hasColors && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Add colors to check accessibility
          </p>
        )}

        {hasColors && (
          <>
            {/* Overall Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Overall Score
                </span>
                <span
                  className={`text-2xl ${
                    score.overallScore >= 70
                      ? 'text-green-600 dark:text-green-400'
                      : score.overallScore >= 50
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {score.overallScore}
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    score.overallScore >= 70
                      ? 'bg-green-600'
                      : score.overallScore >= 50
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${score.overallScore}%` }}
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              {score.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                >
                  {score.overallScore >= 70 && idx === 0 ? (
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  )}
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            {/* Colorblind Simulation */}
            <div className="space-y-2">
              <Label className="text-neutral-700 dark:text-neutral-300">
                Colorblind Simulation
              </Label>
              <Select
                value={colorblindMode}
                onValueChange={(value) => setColorblindMode(value as ColorblindType)}
              >
                <SelectTrigger className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Normal Vision</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-Blind)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-Blind)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-Blind)</SelectItem>
                  <SelectItem value="achromatopsia">Achromatopsia (Monochrome)</SelectItem>
                </SelectContent>
              </Select>

              {colorblindMode !== 'none' && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  {simulatedColors.map((color, idx) => (
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
              )}
            </div>

            {/* Contrast Checker */}
            <div className="space-y-2">
              <Label className="text-neutral-700 dark:text-neutral-300">
                Contrast Checker
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Foreground
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {colors.slice(0, 6).map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor1(color)}
                        className={`h-10 rounded border-2 transition-all ${
                          selectedColor1 === color
                            ? 'border-neutral-900 dark:border-neutral-50 scale-110'
                            : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Background
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {colors.slice(0, 6).map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor2(color)}
                        className={`h-10 rounded border-2 transition-all ${
                          selectedColor2 === color
                            ? 'border-neutral-900 dark:border-neutral-50 scale-110'
                            : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {contrastResult && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      Contrast Ratio
                    </span>
                    <span className="text-xl">
                      {contrastResult.ratio}:1
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-neutral-500 dark:text-neutral-400 mb-1">
                        Normal Text
                      </div>
                      <div className="flex items-center gap-2">
                        {contrastResult.normalText.aa ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>AA {contrastResult.normalText.aa ? '✓' : '✗'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {contrastResult.normalText.aaa ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>AAA {contrastResult.normalText.aaa ? '✓' : '✗'}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-neutral-500 dark:text-neutral-400 mb-1">
                        Large Text
                      </div>
                      <div className="flex items-center gap-2">
                        {contrastResult.largeText.aa ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>AA {contrastResult.largeText.aa ? '✓' : '✗'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {contrastResult.largeText.aaa ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>AAA {contrastResult.largeText.aaa ? '✓' : '✗'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <div
                      className="p-3 rounded text-center"
                      style={{
                        backgroundColor: selectedColor2 || '#FFFFFF',
                        color: selectedColor1 || '#000000',
                      }}
                    >
                      <div className="text-sm">Normal text preview</div>
                      <div className="text-lg">Large text preview</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}