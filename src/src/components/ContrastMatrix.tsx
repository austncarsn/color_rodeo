import { Grid3x3, Check, X, AlertTriangle, Copy, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';
import { copyToClipboard } from '../lib/clipboard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';

interface ContrastMatrixProps {
  colors: string[];
}

// Calculate relative luminance
function getLuminance(hex: string): number {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

// Calculate contrast ratio between two colors
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Get WCAG compliance level
function getWCAGLevel(ratio: number): {
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  color: string;
  bgColor: string;
} {
  if (ratio >= 7) {
    return { 
      level: 'AAA', 
      color: 'text-green-900 dark:text-green-100', 
      bgColor: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' 
    };
  } else if (ratio >= 4.5) {
    return { 
      level: 'AA', 
      color: 'text-blue-900 dark:text-blue-100', 
      bgColor: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' 
    };
  } else if (ratio >= 3) {
    return { 
      level: 'AA Large', 
      color: 'text-yellow-900 dark:text-yellow-100', 
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700' 
    };
  } else {
    return { 
      level: 'Fail', 
      color: 'text-red-900 dark:text-red-100', 
      bgColor: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' 
    };
  }
}

export function ContrastMatrix({ colors }: ContrastMatrixProps) {
  const [showBestPairs, setShowBestPairs] = useState(true);
  
  if (colors.length === 0) {
    return (
      <div className="bg-white dark:bg-[#18191D] border border-neutral-200 dark:border-[#292B33] rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Grid3x3 className="w-5 h-5 text-neutral-600 dark:text-[#8C909A]" />
          <h3 className="text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 500 }}>Contrast Matrix</h3>
        </div>
        <div className="text-center py-10 sm:py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-[#23252B] dark:to-[#292B33] rounded-2xl flex items-center justify-center">
            <Grid3x3 className="w-8 h-8 text-neutral-400 dark:text-[#8C909A]" />
          </div>
          <p className="text-sm text-neutral-900 dark:text-[#C1C4CF] mb-2" style={{ fontWeight: 500 }}>
            No Colors Yet
          </p>
          <p className="text-xs text-neutral-600 dark:text-[#8C909A] mb-4 max-w-xs mx-auto leading-relaxed">
            Add colors to your palette above to see contrast ratios and WCAG compliance for all color combinations
          </p>
          
          {/* Visual guide */}
          <div className="mt-6 p-4 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-xl max-w-sm mx-auto">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-3" style={{ fontWeight: 500 }}>
              💡 How to add colors:
            </p>
            <ol className="text-xs text-blue-600/80 dark:text-blue-400/80 text-left space-y-1.5 pl-4">
              <li>1. Scroll to "Create Palette" section above</li>
              <li>2. Enter a hex code (e.g., #FF0000)</li>
              <li>3. Click "Add Color" button</li>
              <li>4. Add at least 2 colors to see the matrix</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (colors.length === 1) {
    return (
      <div className="bg-white dark:bg-[#18191D] border border-neutral-200 dark:border-[#292B33] rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Grid3x3 className="w-5 h-5 text-neutral-600 dark:text-[#8C909A]" />
          <h3 className="text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 500 }}>Contrast Matrix</h3>
        </div>
        <div className="text-center py-10">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl border-2 border-neutral-200 dark:border-[#292B33]" style={{ backgroundColor: colors[0] }} />
          <p className="text-sm text-neutral-900 dark:text-[#C1C4CF] mb-2" style={{ fontWeight: 500 }}>
            Add One More Color
          </p>
          <p className="text-xs text-neutral-600 dark:text-[#8C909A] max-w-xs mx-auto leading-relaxed">
            The contrast matrix needs at least 2 colors to show contrast ratios between color pairs
          </p>
        </div>
      </div>
    );
  }

  // Calculate all contrast pairs and their ratings
  const contrastPairs: Array<{
    fg: string;
    bg: string;
    ratio: number;
    level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  }> = [];

  colors.forEach((fgColor, i) => {
    colors.forEach((bgColor, j) => {
      if (i !== j) {
        const ratio = getContrastRatio(fgColor, bgColor);
        const { level } = getWCAGLevel(ratio);
        contrastPairs.push({ fg: fgColor, bg: bgColor, ratio, level });
      }
    });
  });

  // Get statistics
  const aaaCount = contrastPairs.filter(p => p.level === 'AAA').length;
  const aaCount = contrastPairs.filter(p => p.level === 'AA').length;
  const aaLargeCount = contrastPairs.filter(p => p.level === 'AA Large').length;
  const failCount = contrastPairs.filter(p => p.level === 'Fail').length;
  const totalPairs = contrastPairs.length;
  const aaaPercentage = totalPairs > 0 ? Math.round((aaaCount / totalPairs) * 100) : 0;

  // Get best AAA pairs (sorted by highest ratio)
  const bestAAAPairs = contrastPairs
    .filter(p => p.level === 'AAA')
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 6); // Top 6 pairs

  const exportMatrixData = () => {
    let matrixText = 'Contrast Matrix\n\n';
    
    colors.forEach((color1, i) => {
      colors.forEach((color2, j) => {
        if (i !== j) {
          const ratio = getContrastRatio(color1, color2);
          const { level } = getWCAGLevel(ratio);
          matrixText += `${color1} on ${color2}: ${ratio.toFixed(2)}:1 (${level})\n`;
        }
      });
    });

    copyToClipboard(matrixText);
    toast.success('Contrast matrix copied to clipboard');
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-6 border border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h2 className="text-neutral-900 dark:text-neutral-50">Contrast Matrix</h2>
        </div>
        <Button
          onClick={exportMatrixData}
          variant="ghost"
          size="sm"
          className="self-start sm:self-auto"
        >
          <Copy className="w-4 h-4 mr-1" />
          Copy
        </Button>
      </div>

      {/* AAA Score Summary Card */}
      <div className="mb-4 p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-2 border-green-200 dark:border-green-800 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <h3 className="text-sm text-green-900 dark:text-green-100" style={{ fontWeight: 600 }}>
                Accessibility Score
              </h3>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
              {aaaCount > 0 
                ? `${aaaCount} of ${totalPairs} pairs meet AAA standards` 
                : 'No AAA pairs yet - try adjusting colors'}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-3xl sm:text-2xl text-green-600 dark:text-green-400" style={{ fontWeight: 700 }}>
              {aaaPercentage}%
            </div>
            <div className="text-[10px] text-green-700 dark:text-green-300 uppercase tracking-wide">
              AAA Compliant
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-green-200 dark:bg-green-900/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${aaaPercentage}%` }}
          />
        </div>
        
        {/* Quick stats */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-center">
          <div className="p-1.5 sm:p-2 bg-white dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800/50">
            <div className="text-base sm:text-lg text-green-600 dark:text-green-400" style={{ fontWeight: 600 }}>
              {aaaCount}
            </div>
            <div className="text-[8px] sm:text-[9px] text-green-700 dark:text-green-300 uppercase tracking-wide">AAA</div>
          </div>
          <div className="p-1.5 sm:p-2 bg-white dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/50">
            <div className="text-base sm:text-lg text-blue-600 dark:text-blue-400" style={{ fontWeight: 600 }}>
              {aaCount}
            </div>
            <div className="text-[8px] sm:text-[9px] text-blue-700 dark:text-blue-300 uppercase tracking-wide">AA</div>
          </div>
          <div className="p-1.5 sm:p-2 bg-white dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
            <div className="text-base sm:text-lg text-yellow-600 dark:text-yellow-400" style={{ fontWeight: 600 }}>
              {aaLargeCount}
            </div>
            <div className="text-[8px] sm:text-[9px] text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">Large</div>
          </div>
          <div className="p-1.5 sm:p-2 bg-white dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800/50">
            <div className="text-base sm:text-lg text-red-600 dark:text-red-400" style={{ fontWeight: 600 }}>
              {failCount}
            </div>
            <div className="text-[8px] sm:text-[9px] text-red-700 dark:text-red-300 uppercase tracking-wide">Fail</div>
          </div>
        </div>
      </div>

      {/* Best AAA Pairs Section */}
      {bestAAAPairs.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowBestPairs(!showBestPairs)}
            className="w-full flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors mb-3 touch-manipulation"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Star className="w-4 h-4 text-[#F2C46B] flex-shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 min-w-0">
                <span className="text-sm text-neutral-900 dark:text-neutral-50 truncate" style={{ fontWeight: 500 }}>
                  Best AAA Pairs ({bestAAAPairs.length})
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  Highest contrast combinations
                </span>
              </div>
            </div>
            {showBestPairs ? (
              <ChevronUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0 ml-2" />
            )}
          </button>
          
          {showBestPairs && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bestAAAPairs.map((pair, idx) => (
                <div
                  key={idx}
                  className="relative p-3 sm:p-4 rounded-xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-neutral-900 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer group touch-manipulation"
                  onClick={() => {
                    copyToClipboard(`Foreground: ${pair.fg}\nBackground: ${pair.bg}\nRatio: ${pair.ratio.toFixed(2)}:1`);
                    toast.success('Color pair copied to clipboard');
                  }}
                >
                  {/* Rank badge */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs" style={{ fontWeight: 600 }}>
                    {idx + 1}
                  </div>
                  
                  {/* Color preview */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex-1 h-12 sm:h-14 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs relative overflow-hidden"
                      style={{ backgroundColor: pair.bg }}
                    >
                      <span
                        className="px-3 py-1.5 rounded font-mono z-10 text-base sm:text-lg"
                        style={{ 
                          color: pair.fg,
                          backgroundColor: `${pair.bg}dd`
                        }}
                      >
                        Aa
                      </span>
                    </div>
                  </div>
                  
                  {/* Color codes */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-neutral-600 dark:text-neutral-400 flex-shrink-0">Text:</span>
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <div className="w-4 h-4 flex-shrink-0 rounded border border-neutral-300 dark:border-neutral-600" style={{ backgroundColor: pair.fg }} />
                        <code className="text-neutral-900 dark:text-neutral-50 font-mono text-[10px] sm:text-xs truncate">{pair.fg}</code>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-neutral-600 dark:text-neutral-400 flex-shrink-0">Background:</span>
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <div className="w-4 h-4 flex-shrink-0 rounded border border-neutral-300 dark:border-neutral-600" style={{ backgroundColor: pair.bg }} />
                        <code className="text-neutral-900 dark:text-neutral-50 font-mono text-[10px] sm:text-xs truncate">{pair.bg}</code>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ratio badge */}
                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800 flex items-center justify-between">
                    <span className="text-xs text-green-700 dark:text-green-300" style={{ fontWeight: 500 }}>
                      <Check className="w-3 h-3 inline mr-1" />
                      AAA Compliant
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400" style={{ fontWeight: 600 }}>
                      {pair.ratio.toFixed(2)}:1
                    </span>
                  </div>
                  
                  {/* Hover hint */}
                  <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No AAA pairs message */}
      {bestAAAPairs.length === 0 && (
        <div className="mb-4 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-yellow-900 dark:text-yellow-100 mb-1" style={{ fontWeight: 500 }}>
                No AAA Pairs Found
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">
                To achieve AAA contrast (7:1 ratio), try using very light colors with very dark ones, or use the AI Optimizer above for suggestions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">WCAG Compliance:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-neutral-700 dark:text-neutral-300">AAA (≥7:1)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-neutral-700 dark:text-neutral-300">AA (≥4.5:1)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span className="text-neutral-700 dark:text-neutral-300">AA Large (≥3:1)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-neutral-700 dark:text-neutral-300">Fail (&lt;3:1)</span>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-min">
          {/* Header Row */}
          <div className="flex mb-1">
            <div className="w-16 h-16 flex-shrink-0" /> {/* Empty corner */}
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="w-16 h-16 flex-shrink-0 ml-1 rounded border border-neutral-200 dark:border-neutral-700"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Data Rows */}
          {colors.map((bgColor, rowIdx) => (
            <div key={rowIdx} className="flex mb-1">
              {/* Row Header */}
              <div
                className="w-16 h-16 flex-shrink-0 rounded border border-neutral-200 dark:border-neutral-700"
                style={{ backgroundColor: bgColor }}
                title={bgColor}
              />
              
              {/* Cells */}
              {colors.map((fgColor, colIdx) => {
                if (rowIdx === colIdx) {
                  // Same color - diagonal
                  return (
                    <div
                      key={colIdx}
                      className="w-16 h-16 flex-shrink-0 ml-1 rounded border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
                    >
                      <span className="text-xs text-neutral-400">—</span>
                    </div>
                  );
                }

                const ratio = getContrastRatio(fgColor, bgColor);
                const { level, color, bgColor: cellBg } = getWCAGLevel(ratio);

                return (
                  <TooltipProvider key={colIdx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-16 h-16 flex-shrink-0 ml-1 rounded border-2 ${cellBg} ${color} flex flex-col items-center justify-center cursor-help transition-all hover:scale-105 hover:shadow-md`}
                        >
                          <span className="text-xs font-medium">{ratio.toFixed(1)}</span>
                          <span className="text-[10px] mt-0.5">{level}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded border" style={{ backgroundColor: fgColor }} />
                            <span>on</span>
                            <div className="w-4 h-4 rounded border" style={{ backgroundColor: bgColor }} />
                          </div>
                          <p>
                            <strong>Ratio:</strong> {ratio.toFixed(2)}:1
                          </p>
                          <p>
                            <strong>Level:</strong> {level}
                          </p>
                          {level === 'AAA' && (
                            <p className="text-green-600 dark:text-green-400">
                              <Check className="w-3 h-3 inline mr-1" />
                              Perfect for all text sizes
                            </p>
                          )}
                          {level === 'AA' && (
                            <p className="text-blue-600 dark:text-blue-400">
                              <Check className="w-3 h-3 inline mr-1" />
                              Good for normal text
                            </p>
                          )}
                          {level === 'AA Large' && (
                            <p className="text-yellow-600 dark:text-yellow-400">
                              <AlertTriangle className="w-3 h-3 inline mr-1" />
                              Only for large text (18pt+)
                            </p>
                          )}
                          {level === 'Fail' && (
                            <p className="text-red-600 dark:text-red-400">
                              <X className="w-3 h-3 inline mr-1" />
                              Does not meet WCAG
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          {colors.length} colors • {colors.length * (colors.length - 1)} combinations
        </p>
      </div>
    </div>
  );
}