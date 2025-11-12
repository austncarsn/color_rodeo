import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import {
  ArrowUpDown,
  Shuffle,
  BarChart3,
  Filter,
  Grid3x3,
} from 'lucide-react';
import {
  sortByHue,
  sortBySaturation,
  sortByLightness,
  sortByLuminance,
  shuffleColors,
  reverseColors,
  getPaletteStats,
  groupByHueFamily,
} from '../lib/paletteUtils';
import { toast } from 'sonner@2.0.3';

interface PaletteUtilitiesProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
}

export function PaletteUtilities({ colors, onColorsChange }: PaletteUtilitiesProps) {
  const hasColors = colors.length > 0;
  const stats = hasColors ? getPaletteStats(colors) : null;

  const handleSort = (method: 'hue' | 'saturation' | 'lightness' | 'luminance') => {
    let sorted: string[];
    switch (method) {
      case 'hue':
        sorted = sortByHue(colors);
        toast.success('Sorted by hue');
        break;
      case 'saturation':
        sorted = sortBySaturation(colors);
        toast.success('Sorted by saturation');
        break;
      case 'lightness':
        sorted = sortByLightness(colors);
        toast.success('Sorted by lightness');
        break;
      case 'luminance':
        sorted = sortByLuminance(colors);
        toast.success('Sorted by luminance');
        break;
    }
    onColorsChange(sorted);
  };

  const handleShuffle = () => {
    onColorsChange(shuffleColors(colors));
    toast.success('Palette shuffled');
  };

  const handleReverse = () => {
    onColorsChange(reverseColors(colors));
    toast.success('Palette reversed');
  };

  const handleGroupByFamily = () => {
    const families = groupByHueFamily(colors);
    const grouped = Object.values(families).flat();
    onColorsChange(grouped);
    toast.success('Grouped by color family');
  };

  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h3 className="text-neutral-900 dark:text-neutral-50">Palette Utilities</h3>
        </div>

        {!hasColors && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Add colors to use utilities
          </p>
        )}

        {hasColors && (
          <>
            {/* Statistics */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Palette Statistics
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-neutral-500 dark:text-neutral-400">Colors</div>
                  <div className="text-neutral-900 dark:text-neutral-50">
                    {stats?.count}
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 dark:text-neutral-400">Diversity</div>
                  <div className="text-neutral-900 dark:text-neutral-50">
                    {stats?.diversity}%
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 dark:text-neutral-400">Avg Saturation</div>
                  <div className="text-neutral-900 dark:text-neutral-50">
                    {stats?.avgSaturation}%
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 dark:text-neutral-400">Avg Lightness</div>
                  <div className="text-neutral-900 dark:text-neutral-50">
                    {stats?.avgLightness}%
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-neutral-500 dark:text-neutral-400">Hue Coverage</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        className="bg-neutral-900 dark:bg-neutral-50 h-2 rounded-full transition-all"
                        style={{ width: `${(stats?.hueSpread || 0) / 3.6}%` }}
                      />
                    </div>
                    <span className="text-neutral-900 dark:text-neutral-50 text-sm">
                      {stats?.hueSpread}°
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <Label className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Sort Colors
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleSort('hue')}
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 dark:border-neutral-700"
                >
                  By Hue
                </Button>
                <Button
                  onClick={() => handleSort('saturation')}
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 dark:border-neutral-700"
                >
                  By Saturation
                </Button>
                <Button
                  onClick={() => handleSort('lightness')}
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 dark:border-neutral-700"
                >
                  By Lightness
                </Button>
                <Button
                  onClick={() => handleSort('luminance')}
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 dark:border-neutral-700"
                >
                  By Luminance
                </Button>
              </div>
            </div>

            {/* Transform Options */}
            <div className="space-y-2">
              <Label className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                <Shuffle className="w-4 h-4" />
                Transform
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={handleShuffle}
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 dark:border-neutral-700"
                >
                  <Shuffle className="w-4 h-4 mr-1" />
                  Shuffle
                </Button>
                <Button
                  onClick={handleReverse}
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 dark:border-neutral-700"
                >
                  Reverse
                </Button>
                <Button
                  onClick={handleGroupByFamily}
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 dark:border-neutral-700"
                >
                  <Grid3x3 className="w-4 h-4 mr-1" />
                  Group
                </Button>
              </div>
            </div>

            {/* Color Families Preview */}
            {(() => {
              const families = groupByHueFamily(colors);
              return Object.keys(families).length > 1 ? (
                <div className="space-y-2">
                  <Label className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Color Families
                  </Label>
                  <div className="space-y-2">
                    {Object.entries(families).map(([family, familyColors]) => (
                      <div
                        key={family}
                        className="p-2 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            {family}
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {familyColors.length}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {familyColors.map((color, idx) => (
                            <div
                              key={idx}
                              className="flex-1 h-6 rounded"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </>
        )}
      </div>
    </Card>
  );
}