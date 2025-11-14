import { Trash2, Upload, Copy, Bookmark } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ColorSwatch } from './ColorSwatch';
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

  return (
    <Card className="bg-white dark:bg-[#18191D] border-neutral-200 dark:border-[#292B33] shadow-lg">
      <CardHeader className="space-y-1 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg text-neutral-900 dark:text-[#F5F5F7]">
          <div className="w-1 h-6 sm:h-8 bg-[#F2C46B] rounded-full" />
          Saved Palettes
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-neutral-600 dark:text-[#8C909A]">
          Your saved color palettes
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
                className="group border border-neutral-200 dark:border-[#292B33] rounded-xl p-4 sm:p-5 bg-neutral-50 dark:bg-[#1E1F23] hover:shadow-xl hover:border-[#F2C46B]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <h3 className="mb-1 text-sm sm:text-base text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 500 }}>
                      {palette.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#8C909A]">
                      {palette.colors.length} colors
                    </p>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoadPalette(palette.colors)}
                      title="Load palette"
                      className="min-h-[36px] sm:min-h-[40px] px-2 sm:px-3 border-neutral-200 dark:border-[#292B33] hover:bg-[#F2C46B]/10 hover:border-[#F2C46B] dark:hover:bg-[#23252B] text-neutral-900 dark:text-[#C1C4CF] hover:text-neutral-900 dark:hover:text-[#F5F5F7]"
                    >
                      <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAll(palette.colors, palette.id)}
                      title="Copy all colors"
                      className="min-h-[36px] sm:min-h-[40px] px-2 sm:px-3 border-neutral-200 dark:border-[#292B33] hover:bg-[#F2C46B]/10 hover:border-[#F2C46B] dark:hover:bg-[#23252B] text-neutral-900 dark:text-[#C1C4CF] hover:text-neutral-900 dark:hover:text-[#F5F5F7]"
                    >
                      {isCopied(palette.id) ? (
                        <>
                          <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline text-xs sm:text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline text-xs sm:text-sm">Copy</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeletePalette(palette.id)}
                      title="Delete palette"
                      className="min-h-[36px] sm:min-h-[40px] px-2 sm:px-3"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {palette.colors.map((color, index) => (
                    <ColorSwatch
                      key={`${color}-${index}`}
                      color={color}
                      showRemove={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}