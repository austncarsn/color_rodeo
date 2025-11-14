import { X, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCopyToClipboard } from '../hooks';
import { hexToRgb, hexToHsl } from '../lib/colorUtils';
import { getContrastRatio } from '../lib/accessibilityUtils';

interface ColorInspectorProps {
  color: string | null;
  onClose: () => void;
  backgroundColor?: string;
}

export function ColorInspector({ color, onClose, backgroundColor = '#ffffff' }: ColorInspectorProps) {
  const { copyWithFeedback, isCopied } = useCopyToClipboard();

  if (!color) return null;

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);
  const contrastRatio = getContrastRatio(color, backgroundColor);
  const contrastRatioDark = getContrastRatio(color, '#0a0a0a');
  
  const formats = [
    { label: 'HEX', value: color.toUpperCase(), token: '--color-primary' },
    { label: 'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'N/A', token: '--color-primary-rgb' },
    { label: 'HSL', value: hsl ? `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)` : 'N/A', token: '--color-primary-hsl' },
  ];

  const getWCAGLevel = (ratio: number) => {
    if (ratio >= 7) return { level: 'AAA', color: 'emerald' };
    if (ratio >= 4.5) return { level: 'AA', color: 'amber' };
    return { level: 'Fail', color: 'red' };
  };

  const wcagLight = getWCAGLevel(contrastRatio);
  const wcagDark = getWCAGLevel(contrastRatioDark);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Inspector Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] md:w-[420px] bg-white dark:bg-[#18191D] border-l border-neutral-200 dark:border-[#292B33] shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300 custom-scrollbar">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg text-neutral-900 dark:text-[#F5F5F7] tracking-wide" style={{ fontWeight: 500 }}>
              Color Inspector
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 text-neutral-500 dark:text-[#8C909A] hover:text-neutral-900 dark:hover:text-[#F5F5F7] hover:bg-neutral-100 dark:hover:bg-[#23252B] transition-all duration-200"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Color preview - Enhanced */}
          <div className="space-y-3">
            <div
              className="h-32 sm:h-40 rounded-xl sm:rounded-2xl border border-neutral-200 dark:border-[#292B33] shadow-lg relative overflow-hidden group"
              style={{ backgroundColor: color }}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Color value overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/[0.1]">
                  <code className="text-white text-sm sm:text-base tracking-wider">{color.toUpperCase()}</code>
                </div>
              </div>
            </div>
            <p className="text-center text-neutral-500 dark:text-[#8C909A] text-[10px] sm:text-xs tracking-wide uppercase">Current Color</p>
          </div>

          {/* Color formats */}
          <div className="space-y-3">
            <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-[#8C909A] tracking-wide uppercase">Color Formats</p>
            {formats.map((format) => (
              <div key={format.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-neutral-500 dark:text-[#8C909A] uppercase tracking-wider">{format.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyWithFeedback(format.value, format.value)}
                    className="h-7 sm:h-8 px-2 text-neutral-500 dark:text-[#8C909A] hover:text-neutral-900 dark:hover:text-[#F5F5F7] hover:bg-neutral-100 dark:hover:bg-[#23252B] transition-all duration-200 hover:scale-105"
                  >
                    {isCopied(format.value) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
                <div className="px-3 py-2 sm:py-2.5 bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-lg hover:bg-neutral-100 dark:hover:bg-[#23252B] hover:border-[#F2C46B]/30 transition-all duration-200 group cursor-pointer" onClick={() => copyWithFeedback(format.value, format.value)}>
                  <code className="text-xs text-neutral-700 dark:text-[#C1C4CF] tracking-wide group-hover:text-neutral-900 dark:group-hover:text-[#F5F5F7] transition-colors">{format.value}</code>
                </div>
              </div>
            ))}
          </div>

          {/* CSS Token */}
          <div className="space-y-2">
            <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-[#8C909A] tracking-wide uppercase">CSS Token</p>
            <div className="flex items-center justify-between px-3 py-2 sm:py-2.5 bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-lg hover:bg-neutral-100 dark:hover:bg-[#23252B] hover:border-[#F2C46B]/30 transition-all duration-200 group cursor-pointer" onClick={() => copyWithFeedback(formats[0].token, formats[0].token)}>
              <code className="text-xs text-neutral-700 dark:text-[#C1C4CF] tracking-wide group-hover:text-neutral-900 dark:group-hover:text-[#F5F5F7] transition-colors">{formats[0].token}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  copyWithFeedback(formats[0].token, formats[0].token);
                }}
                className="h-7 sm:h-8 px-2 text-neutral-500 dark:text-[#8C909A] hover:text-neutral-900 dark:hover:text-[#F5F5F7] hover:bg-neutral-100 dark:hover:bg-[#23252B] transition-all duration-200"
              >
                {isCopied(formats[0].token) ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* WCAG Contrast */}
          <div className="space-y-3">
            <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-[#8C909A] tracking-wide uppercase">WCAG Contrast Ratios</p>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm p-2.5 sm:p-3 rounded-lg bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] hover:border-[#F2C46B]/30 transition-colors duration-200">
                <span className="text-neutral-600 dark:text-[#8C909A] text-[10px] sm:text-xs">vs Light Background</span>
                <div className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md ${
                  wcagLight.color === 'emerald' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                  wcagLight.color === 'amber' ? 'bg-amber-500/20 border border-amber-500/30' :
                  'bg-red-500/20 border border-red-500/30'
                }`}>
                  <span className={`text-[10px] sm:text-xs ${
                    wcagLight.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                    wcagLight.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {wcagLight.level} {contrastRatio.toFixed(2)}:1
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm p-2.5 sm:p-3 rounded-lg bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] hover:border-[#F2C46B]/30 transition-colors duration-200">
                <span className="text-neutral-600 dark:text-[#8C909A] text-[10px] sm:text-xs">vs Dark Background</span>
                <div className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md ${
                  wcagDark.color === 'emerald' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                  wcagDark.color === 'amber' ? 'bg-amber-500/20 border border-amber-500/30' :
                  'bg-red-500/20 border border-red-500/30'
                }`}>
                  <span className={`text-[10px] sm:text-xs ${
                    wcagDark.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                    wcagDark.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {wcagDark.level} {contrastRatioDark.toFixed(2)}:1
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-lg">
              <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-[#8C909A] leading-relaxed">
                <strong className="text-neutral-700 dark:text-[#C1C4CF]">AAA</strong> (7:1+) = Excellent for all text<br />
                <strong className="text-neutral-700 dark:text-[#C1C4CF]">AA</strong> (4.5:1+) = Good for body text<br />
                <strong className="text-neutral-700 dark:text-[#C1C4CF]">Fail</strong> (&lt;4.5:1) = UI elements only
              </p>
            </div>
          </div>

          {/* Usage tags */}
          <div className="space-y-2">
            <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-[#8C909A] tracking-wide uppercase">Recommended Usage</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {contrastRatio >= 4.5 && (
                <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full transition-all duration-200 hover:bg-emerald-500/15 hover:scale-105 cursor-default">
                  <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400">Text on Light</span>
                </div>
              )}
              {contrastRatioDark >= 4.5 && (
                <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full transition-all duration-200 hover:bg-emerald-500/15 hover:scale-105 cursor-default">
                  <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400">Text on Dark</span>
                </div>
              )}
              <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full transition-all duration-200 hover:bg-cyan-500/15 hover:scale-105 cursor-default">
                <span className="text-[10px] sm:text-xs text-cyan-600 dark:text-cyan-400">UI Element</span>
              </div>
              <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full transition-all duration-200 hover:bg-purple-500/15 hover:scale-105 cursor-default">
                <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400">Brand Accent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}