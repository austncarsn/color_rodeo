import { Trash2, Upload, Copy } from 'lucide-react';
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
    <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-neutral-900 dark:text-neutral-50">
          <div className="w-1 h-8 bg-neutral-900 dark:bg-neutral-50 rounded-full" />
          Saved Palettes
        </CardTitle>
        <CardDescription className="text-neutral-600 dark:text-neutral-400">
          Your saved color palettes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {palettes.length === 0 ? (
          <div className="text-center py-16 px-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-200 dark:bg-neutral-700 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-1">{UI_TEXT.EMPTY_SAVED_MESSAGE}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">{UI_TEXT.EMPTY_SAVED_HINT}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {palettes.map((palette) => (
              <div
                key={palette.id}
                className="group border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 bg-neutral-50 dark:bg-neutral-800 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="mb-1 text-neutral-900 dark:text-neutral-50">
                      {palette.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {palette.colors.length} colors
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoadPalette(palette.colors)}
                      title="Load palette"
                      className="border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAll(palette.colors, palette.id)}
                      title="Copy all colors"
                      className="border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
                    >
                      {isCopied(palette.id) ? (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeletePalette(palette.id)}
                      title="Delete palette"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
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