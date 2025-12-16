import { Grid3x3, Check, X, AlertTriangle, Copy } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner@2.0.3';
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

    navigator.clipboard.writeText(matrixText);
    toast.success('Contrast matrix copied to clipboard');
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h2 className="text-neutral-900 dark:text-neutral-50">Contrast Matrix</h2>
        </div>
        <Button
          onClick={exportMatrixData}
          variant="ghost"
          size="sm"
        >
          <Copy className="w-4 h-4 mr-1" />
          Copy
        </Button>
      </div>

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