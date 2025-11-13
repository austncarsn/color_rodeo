import { useState, useEffect } from 'react';
import { Plus, Save, GripVertical } from 'lucide-react';
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
      onColorsChange([]);
    }
  }, [loadedColors, onColorsChange, loadColors]);

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
    <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-neutral-900 dark:text-neutral-50">
          <div className="w-1 h-8 bg-neutral-900 dark:bg-neutral-50 rounded-full" />
          Create Palette
        </CardTitle>
        <CardDescription className="text-neutral-600 dark:text-neutral-400">
          Add colors in hex, RGB, or HSL format. Drag to reorder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={UI_TEXT.PLACEHOLDER_INPUT}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[44px] bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-50 text-neutral-900 dark:text-neutral-50"
            />
          </div>
          <Button
            onClick={handleAddColor}
            disabled={!inputValue}
            className="min-h-[44px] bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-lg"
          >
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>

        {colors.length > 0 && (
          <>
            <DndProvider backend={HTML5Backend}>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
                <Button className="w-full min-h-[44px] bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-lg">
                  <Save className="w-4 h-4 mr-2" />
                  Save Palette
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-neutral-900 dark:text-neutral-50">Save Palette</DialogTitle>
                  <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                    Give your palette a name to save it for later use.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="palette-name" className="text-neutral-900 dark:text-neutral-50">Palette Name</Label>
                    <Input
                      id="palette-name"
                      placeholder="My Awesome Palette"
                      value={paletteName}
                      onChange={(e) => setPaletteName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                      className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
                    />
                  </div>
                  <div className="flex gap-3 flex-wrap p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-lg shadow-lg transition-transform hover:scale-110 border border-neutral-200 dark:border-neutral-700"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!paletteName.trim()}
                    className="bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {colors.length === 0 && (
          <div className="text-center py-16 px-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-200 dark:bg-neutral-700 rounded-2xl flex items-center justify-center">
              <Plus className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-1">{UI_TEXT.EMPTY_PALETTE_MESSAGE}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">{UI_TEXT.EMPTY_PALETTE_HINT}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}