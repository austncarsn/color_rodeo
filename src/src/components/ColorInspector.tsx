import { useState } from 'react';
import { X, Copy, Check, Eye } from 'lucide-react';
import { hexToRgb, hexToHsl, isLightColor } from '../lib/colorUtils';
import { toast } from 'sonner';

interface ColorInspectorProps {
  color: string | null;
  onClose: () => void;
  backgroundColor?: string;
}

export function ColorInspector({ color, onClose }: ColorInspectorProps) {
  if (!color) return null;
  
  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);
  const isLight = isLightColor(color);
  
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(format);
      setTimeout(() => setCopyFeedback(null), 2000);
      toast.success(`${format} copied!`);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full sm:w-auto sm:min-w-[400px] sm:max-w-md bg-white dark:bg-[#18191D] rounded-t-3xl sm:rounded-2xl border-t border-neutral-200 dark:border-t-[#292B33] sm:border border-neutral-200 dark:border-[#292B33] shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-4 duration-300 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-neutral-300 dark:bg-[#292B33] rounded-full" />
        </div>

        {/* Header with large color preview */}
        <div className="relative h-32 sm:h-40" style={{ backgroundColor: color }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/20 dark:bg-white/10 backdrop-blur-sm hover:bg-black/30 dark:hover:bg-white/20 transition-colors flex items-center justify-center group"
            aria-label="Close inspector"
          >
            <X className={`w-5 h-5 ${isLight ? 'text-neutral-900' : 'text-white'} group-hover:scale-110 transition-transform`} />
          </button>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h2 className={`text-3xl sm:text-4xl font-mono tracking-widest mb-2 ${isLight ? 'text-neutral-900' : 'text-white'}`} style={{ fontWeight: 600 }}>
                {color.toUpperCase()}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <Eye className={`w-4 h-4 ${isLight ? 'text-neutral-700' : 'text-white/80'}`} />
                <span className={`text-sm ${isLight ? 'text-neutral-700' : 'text-white/80'}`} style={{ fontWeight: 500 }}>
                  Color Inspector
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Color Formats */}
          <div>
            <h3 className="text-sm text-neutral-600 dark:text-[#8C909A] mb-3" style={{ fontWeight: 500 }}>
              Color Formats
            </h3>
            <div className="space-y-2">
              {/* HEX */}
              <button
                onClick={() => copyToClipboard(color, 'HEX')}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-xl hover:border-[#F2C46B] dark:hover:border-[#F2C46B] transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="px-2 sm:px-3 py-1 bg-white dark:bg-[#18191D] border border-neutral-200 dark:border-[#292B33] rounded-lg">
                    <span className="text-xs text-neutral-600 dark:text-[#8C909A]" style={{ fontWeight: 500 }}>HEX</span>
                  </div>
                  <code className="font-mono text-sm sm:text-base text-neutral-900 dark:text-[#F5F5F7] truncate">{color.toUpperCase()}</code>
                </div>
                {copyFeedback === 'HEX' ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 dark:text-[#8C909A] group-hover:text-[#D4A855] dark:group-hover:text-[#F2C46B] transition-colors flex-shrink-0" />
                )}
              </button>

              {/* RGB */}
              <button
                onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-xl hover:border-[#F2C46B] dark:hover:border-[#F2C46B] transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="px-2 sm:px-3 py-1 bg-white dark:bg-[#18191D] border border-neutral-200 dark:border-[#292B33] rounded-lg">
                    <span className="text-xs text-neutral-600 dark:text-[#8C909A]" style={{ fontWeight: 500 }}>RGB</span>
                  </div>
                  <code className="font-mono text-sm sm:text-base text-neutral-900 dark:text-[#F5F5F7] truncate">
                    {rgb.r}, {rgb.g}, {rgb.b}
                  </code>
                </div>
                {copyFeedback === 'RGB' ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 dark:text-[#8C909A] group-hover:text-[#D4A855] dark:group-hover:text-[#F2C46B] transition-colors flex-shrink-0" />
                )}
              </button>

              {/* HSL */}
              <button
                onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-xl hover:border-[#F2C46B] dark:hover:border-[#F2C46B] transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="px-2 sm:px-3 py-1 bg-white dark:bg-[#18191D] border border-neutral-200 dark:border-[#292B33] rounded-lg">
                    <span className="text-xs text-neutral-600 dark:text-[#8C909A]" style={{ fontWeight: 500 }}>HSL</span>
                  </div>
                  <code className="font-mono text-sm sm:text-base text-neutral-900 dark:text-[#F5F5F7] truncate">
                    {hsl.h}°, {hsl.s}%, {hsl.l}%
                  </code>
                </div>
                {copyFeedback === 'HSL' ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 dark:text-[#8C909A] group-hover:text-[#D4A855] dark:group-hover:text-[#F2C46B] transition-colors flex-shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Color Properties */}
          <div>
            <h3 className="text-sm text-neutral-600 dark:text-[#8C909A] mb-3" style={{ fontWeight: 500 }}>
              Color Properties
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-xl">
                <div className="text-xs text-neutral-500 dark:text-[#8C909A] mb-1">Hue</div>
                <div className="text-lg sm:text-xl text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 600 }}>{hsl.h}°</div>
                <div className="mt-2 h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-full" />
              </div>
              <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-xl">
                <div className="text-xs text-neutral-500 dark:text-[#8C909A] mb-1">Saturation</div>
                <div className="text-lg sm:text-xl text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 600 }}>{hsl.s}%</div>
                <div className="mt-2 h-2 bg-gradient-to-r from-neutral-300 to-current rounded-full" style={{ color }} />
              </div>
              <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-xl">
                <div className="text-xs text-neutral-500 dark:text-[#8C909A] mb-1">Lightness</div>
                <div className="text-lg sm:text-xl text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 600 }}>{hsl.l}%</div>
                <div className="mt-2 h-2 bg-gradient-to-r from-black via-current to-white rounded-full" style={{ color }} />
              </div>
              <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-xl">
                <div className="text-xs text-neutral-500 dark:text-[#8C909A] mb-1">Brightness</div>
                <div className="text-lg sm:text-xl text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 600 }}>
                  {isLight ? 'Light' : 'Dark'}
                </div>
                <div className="mt-2 h-2 bg-gradient-to-r from-black to-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Accessibility Info */}
          <div className="p-3 sm:p-4 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-2 sm:gap-3">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mb-1" style={{ fontWeight: 500 }}>
                  Recommended Text Color
                </div>
                <div className="text-xs text-blue-600/80 dark:text-blue-400/80">
                  Use {isLight ? 'dark text (e.g., #000000)' : 'light text (e.g., #FFFFFF)'} for optimal contrast
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}