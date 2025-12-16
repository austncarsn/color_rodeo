import { useState, useEffect } from 'react';
import { Plus, Save, GripVertical, Palette } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableColorSwatch } from './DraggableColorSwatch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { usePaletteInput } from '../hooks';
import { UI_TEXT } from '../constants';

interface PaletteManagerProps {
  onSavePalette: (name: string, colors: string[]) => void;
  loadedColors: string[];
  onColorsChange: (colors: string[]) => void;
  selectedColorIndex?: number | null;
  onSelectColor?: (index: number | null) => void;
}

export function PaletteManager({ 
  onSavePalette, 
  loadedColors, 
  onColorsChange,
  selectedColorIndex,
  onSelectColor,
}: PaletteManagerProps) {
  const {
    colors,
    inputValue,
    setInputValue,
    addColors,
    removeColor,
    clearColors,
    loadColors,
  } = usePaletteInput();
  
  const [paletteName, setPaletteName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sync colors to parent whenever they change
  useEffect(() => {
    onColorsChange(colors);
  }, [colors, onColorsChange]);

  useEffect(() => {
    if (loadedColors.length > 0) {
      loadColors(loadedColors);
    }
  }, [loadedColors, loadColors]);

  const handleAddColor = () => {
    addColors(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddColor();
    }
  };
  
  const handleMoveColor = (fromIndex: number, toIndex: number) => {
    const newColors = [...colors];
    const [movedColor] = newColors.splice(fromIndex, 1);
    newColors.splice(toIndex, 0, movedColor);
    loadColors(newColors);
  };

  const handleSave = () => {
    if (paletteName.trim() && colors.length > 0) {
      onSavePalette(paletteName.trim(), colors);
      setPaletteName('');
      clearColors();
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-[#18191D] border-neutral-200 dark:border-[#292B33] shadow-lg">
      <CardHeader className="space-y-1 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg text-neutral-900 dark:text-[#F5F5F7]">
          <div className="w-1 h-6 sm:h-8 bg-[#F2C46B] rounded-full" />
          Create Palette
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-neutral-600 dark:text-[#8C909A]">
          Add colors in hex, RGB, or HSL format. Drag to reorder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={UI_TEXT.PLACEHOLDER_INPUT}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[48px] bg-neutral-50 dark:bg-[#1E1F23] border-neutral-200 dark:border-[#292B33] focus:border-[#F2C46B] dark:focus:border-[#F2C46B] text-neutral-900 dark:text-[#F5F5F7] placeholder:text-neutral-400 dark:placeholder:text-[#8C909A]"
            />
          </div>
          <Button
            onClick={handleAddColor}
            disabled={!inputValue}
            className="min-h-[48px] px-4 sm:px-6 bg-[#F2C46B] hover:bg-[#D4A855] text-[#121212] disabled:opacity-40 disabled:hover:bg-[#F2C46B] shadow-md"
          >
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="text-sm sm:text-base">Add Color</span>
          </Button>
        </div>

        {colors.length > 0 && (
          <>
            <DndProvider backend={HTML5Backend}>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {colors.map((color, index) => (
                  <DraggableColorSwatch
                    key={`${color}-${index}`}
                    color={color}
                    index={index}
                    onRemove={() => removeColor(index)}
                    onMove={handleMoveColor}
                    onClick={() => onSelectColor?.(index === selectedColorIndex ? null : index)}
                    isSelected={index === selectedColorIndex}
                  />
                ))}
              </div>
            </DndProvider>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full min-h-[48px] bg-[#F2C46B] hover:bg-[#D4A855] text-[#121212] shadow-md">
                  <Save className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">Save Palette</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-[#18191D] border-neutral-200 dark:border-[#292B33] sm:max-w-[425px] mx-3">
                <DialogHeader>
                  <DialogTitle className="text-neutral-900 dark:text-[#F5F5F7]">Save Palette</DialogTitle>
                  <DialogDescription className="text-neutral-600 dark:text-[#8C909A]">
                    Give your palette a name to save it for later use.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="palette-name" className="text-neutral-900 dark:text-[#F5F5F7]">Palette Name</Label>
                    <Input
                      id="palette-name"
                      placeholder="My Awesome Palette"
                      value={paletteName}
                      onChange={(e) => setPaletteName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                      className="bg-neutral-50 dark:bg-[#1E1F23] border-neutral-200 dark:border-[#292B33] text-neutral-900 dark:text-[#F5F5F7] min-h-[48px]"
                    />
                  </div>
                  <div className="flex gap-2 sm:gap-3 flex-wrap p-3 sm:p-4 bg-neutral-50 dark:bg-[#1E1F23] rounded-lg border border-neutral-200 dark:border-[#292B33]">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shadow-lg transition-transform hover:scale-110 border border-neutral-200 dark:border-[#292B33]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="min-h-[44px] border-neutral-200 dark:border-[#292B33] text-neutral-900 dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-[#23252B]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!paletteName.trim()}
                    className="min-h-[44px] bg-[#F2C46B] hover:bg-[#D4A855] text-[#121212] disabled:opacity-40"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {colors.length === 0 && (
          <div className="text-center py-10 sm:py-16 px-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-[#1E1F23] dark:to-[#18191D] rounded-xl border-2 border-dashed border-neutral-300 dark:border-[#292B33] transition-all duration-300 hover:border-neutral-400 dark:hover:border-[#F2C46B]/30">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-[#23252B] dark:to-[#292B33] rounded-2xl flex items-center justify-center shadow-lg">
              <Palette className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-600 dark:text-[#8C909A]" />
            </div>
            <p className="text-sm sm:text-base text-neutral-900 dark:text-[#C1C4CF] mb-2" style={{ fontWeight: 500 }}>{UI_TEXT.EMPTY_PALETTE_MESSAGE}</p>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#8C909A] max-w-xs mx-auto leading-relaxed">{UI_TEXT.EMPTY_PALETTE_HINT}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}