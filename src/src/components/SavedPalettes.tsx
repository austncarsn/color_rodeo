import { Trash2, Upload, Copy, Bookmark, Star, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import type { ColorPalette } from '../types/palette';
import { useCopyToClipboard } from '../hooks';
import { UI_TEXT } from '../constants';

interface SavedPalettesProps {
  palettes: ColorPalette[];
  onDeletePalette: (id: string) => void;
  onLoadPalette: (colors: string[]) => void;
}

export function SavedPalettes({ palettes, onDeletePalette, onLoadPalette }: SavedPalettesProps) {
  const { copyWithFeedback, isCopied } = useCopyToClipboard();

  const handleCopyAll = async (colors: string[], id: string) => {
    const success = await copyWithFeedback(colors.join(', '), id);
    if (!success) {
      console.error('Failed to copy palette colors to clipboard');
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="bg-white dark:bg-[#18191D] border-neutral-200 dark:border-[#292B33] shadow-lg">
      <CardHeader className="space-y-1 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg text-neutral-900 dark:text-[#F5F5F7]">
          <div className="w-1 h-6 sm:h-8 bg-[#F2C46B] rounded-full" />
          Saved Palettes
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-neutral-600 dark:text-[#8C909A]">
          {palettes.length > 0 ? `${palettes.length} saved palette${palettes.length !== 1 ? 's' : ''}` : 'Your saved color palettes'}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {palettes.length === 0 ? (
          <div className="text-center py-10 sm:py-16 px-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-[#1E1F23] dark:to-[#18191D] rounded-xl border-2 border-dashed border-neutral-300 dark:border-[#292B33] transition-all duration-300 hover:border-neutral-400 dark:hover:border-[#F2C46B]/30">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-[#23252B] dark:to-[#292B33] rounded-2xl flex items-center justify-center shadow-lg">
              <Bookmark className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-600 dark:text-[#8C909A]" />
            </div>
            <p className="text-sm sm:text-base text-neutral-900 dark:text-[#C1C4CF] mb-2" style={{ fontWeight: 500 }}>{UI_TEXT.EMPTY_SAVED_MESSAGE}</p>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#8C909A] max-w-xs mx-auto leading-relaxed">{UI_TEXT.EMPTY_SAVED_HINT}</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {palettes.map((palette) => (
              <div
                key={palette.id}
                className="group border border-neutral-200 dark:border-[#292B33] rounded-xl bg-white dark:bg-[#1E1F23] hover:shadow-xl hover:border-[#F2C46B]/50 dark:hover:border-[#F2C46B]/30 transition-all duration-300 overflow-hidden"
              >
                {/* Large Color Preview Strip */}
                <div className="h-20 sm:h-24 flex">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1 transition-all duration-300 hover:scale-105 relative group/color cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => onLoadPalette(palette.colors)}
                    >
                      {/* Hover tooltip with color code */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/color:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-xs font-mono" style={{ fontWeight: 500 }}>
                          {color.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Palette Info & Actions */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 text-sm sm:text-base text-neutral-900 dark:text-[#F5F5F7] truncate" style={{ fontWeight: 500 }}>
                        {palette.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-[#8C909A]">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {palette.colors.length} colors
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(palette.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onLoadPalette(palette.colors)}
                      size="sm"
                      className="flex-1 h-9 bg-[#F2C46B] hover:bg-[#D4A855] text-[#121212] shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      Load
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAll(palette.colors, palette.id)}
                      className="h-9 px-3 border-neutral-200 dark:border-[#292B33] hover:bg-neutral-100 dark:hover:bg-[#23252B]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {isCopied(palette.id) && <span className="ml-1.5 text-xs">✓</span>}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Delete "${palette.name}"?`)) {
                          onDeletePalette(palette.id);
                        }
                      }}
                      className="h-9 px-3 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}