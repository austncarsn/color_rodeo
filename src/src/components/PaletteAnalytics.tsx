import { BarChart3, TrendingUp, Eye, Droplet } from 'lucide-react';
import { hexToHsl, isLightColor } from '../lib/colorUtils';

interface PaletteAnalyticsProps {
  colors: string[];
}

export function PaletteAnalytics({ colors }: PaletteAnalyticsProps) {
  if (colors.length === 0) {
    return (
      <div className="p-6 text-center bg-neutral-50 dark:bg-[#1E1F23] rounded-xl border border-neutral-200 dark:border-[#292B33]">
        <p className="text-sm text-neutral-500 dark:text-[#8C909A]">
          Add colors to see analytics
        </p>
      </div>
    );
  }

  // Calculate analytics
  const lightColors = colors.filter(isLightColor).length;
  const darkColors = colors.length - lightColors;
  const lightDarkRatio = colors.length > 0 ? (lightColors / colors.length) * 100 : 0;

  // Calculate average brightness
  const avgBrightness = colors.reduce((sum, color) => {
    const hsl = hexToHsl(color);
    return sum + hsl.l;
  }, 0) / colors.length;

  // Calculate saturation spread
  const saturations = colors.map(color => hexToHsl(color).s);
  const avgSaturation = saturations.reduce((sum, s) => sum + s, 0) / saturations.length;
  const maxSaturation = Math.max(...saturations);
  const minSaturation = Math.min(...saturations);
  const saturationRange = maxSaturation - minSaturation;

  // Calculate hue diversity (how spread out the hues are)
  const hues = colors.map(color => hexToHsl(color).h);
  const uniqueHueRanges = new Set(hues.map(h => Math.floor(h / 30))).size; // Divide color wheel into 12 segments
  const hueDiversity = (uniqueHueRanges / 12) * 100;

  // Determine palette harmony score (simple algorithm)
  let harmonyScore = 0;
  
  // Good saturation range (30-70 is ideal)
  if (saturationRange >= 30 && saturationRange <= 70) harmonyScore += 25;
  else if (saturationRange < 30) harmonyScore += 15;
  
  // Good lightness balance (40-60 is ideal average)
  if (avgBrightness >= 40 && avgBrightness <= 60) harmonyScore += 25;
  else if (avgBrightness >= 30 && avgBrightness <= 70) harmonyScore += 15;
  
  // Good light/dark ratio (40-60% is ideal)
  if (lightDarkRatio >= 40 && lightDarkRatio <= 60) harmonyScore += 25;
  else if (lightDarkRatio >= 30 && lightDarkRatio <= 70) harmonyScore += 15;
  
  // Hue diversity bonus
  if (hueDiversity >= 25) harmonyScore += 25;
  else if (hueDiversity >= 15) harmonyScore += 15;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F2C46B]/10 border border-[#F2C46B]/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#D4A855] dark:text-[#F2C46B]" />
          </div>
          <div>
            <h3 className="text-sm text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 500 }}>
              Palette Analytics
            </h3>
            <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
              {colors.length} color{colors.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Harmony Score */}
      <div className="p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-[#1E1F23] dark:to-[#18191D] rounded-xl border border-neutral-200 dark:border-[#292B33]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neutral-600 dark:text-[#8C909A]" />
            <span className="text-sm text-neutral-700 dark:text-[#C1C4CF]" style={{ fontWeight: 500 }}>
              Harmony Score
            </span>
          </div>
          <div className="text-right">
            <div className={`text-2xl ${getScoreColor(harmonyScore)}`} style={{ fontWeight: 600 }}>
              {harmonyScore}
            </div>
            <div className={`text-xs ${getScoreColor(harmonyScore)}`} style={{ fontWeight: 500 }}>
              {getScoreLabel(harmonyScore)}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-neutral-200 dark:bg-[#292B33] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              harmonyScore >= 80 ? 'bg-green-500' :
              harmonyScore >= 60 ? 'bg-blue-500' :
              harmonyScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${harmonyScore}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Average Brightness */}
        <div className="p-3 bg-white dark:bg-[#1E1F23] rounded-xl border border-neutral-200 dark:border-[#292B33]">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-3.5 h-3.5 text-neutral-500 dark:text-[#8C909A]" />
            <span className="text-xs text-neutral-600 dark:text-[#8C909A]">Avg Brightness</span>
          </div>
          <div className="text-lg text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 600 }}>
            {Math.round(avgBrightness)}%
          </div>
          <div className="mt-1.5 h-1.5 bg-neutral-200 dark:bg-[#292B33] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-black to-white transition-all duration-300"
              style={{ width: `${avgBrightness}%` }}
            />
          </div>
        </div>

        {/* Average Saturation */}
        <div className="p-3 bg-white dark:bg-[#1E1F23] rounded-xl border border-neutral-200 dark:border-[#292B33]">
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="w-3.5 h-3.5 text-neutral-500 dark:text-[#8C909A]" />
            <span className="text-xs text-neutral-600 dark:text-[#8C909A]">Avg Saturation</span>
          </div>
          <div className="text-lg text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 600 }}>
            {Math.round(avgSaturation)}%
          </div>
          <div className="mt-1.5 h-1.5 bg-neutral-200 dark:bg-[#292B33] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neutral-400 to-red-500 transition-all duration-300"
              style={{ width: `${avgSaturation}%` }}
            />
          </div>
        </div>

        {/* Light/Dark Ratio */}
        <div className="p-3 bg-white dark:bg-[#1E1F23] rounded-xl border border-neutral-200 dark:border-[#292B33]">
          <div className="text-xs text-neutral-600 dark:text-[#8C909A] mb-2">Light/Dark</div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-sm text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 600 }}>
                {lightColors} / {darkColors}
              </div>
              <div className="text-xs text-neutral-500 dark:text-[#8C909A]">
                {Math.round(lightDarkRatio)}% light
              </div>
            </div>
          </div>
        </div>

        {/* Hue Diversity */}
        <div className="p-3 bg-white dark:bg-[#1E1F23] rounded-xl border border-neutral-200 dark:border-[#292B33]">
          <div className="text-xs text-neutral-600 dark:text-[#8C909A] mb-2">Hue Diversity</div>
          <div className="text-lg text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 600 }}>
            {Math.round(hueDiversity)}%
          </div>
          <div className="text-xs text-neutral-500 dark:text-[#8C909A]">
            {uniqueHueRanges} of 12 ranges
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="p-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="text-xs text-blue-600 dark:text-blue-400" style={{ fontWeight: 500 }}>
          💡 Quick Insights
        </div>
        <ul className="mt-2 space-y-1 text-xs text-blue-600/80 dark:text-blue-400/80">
          {avgBrightness < 30 && <li>• Palette is quite dark - consider adding lighter tones</li>}
          {avgBrightness > 70 && <li>• Palette is quite light - consider adding darker tones</li>}
          {saturationRange < 20 && <li>• Low saturation variety - try more vibrant colors</li>}
          {hueDiversity < 15 && <li>• Limited hue range - explore complementary colors</li>}
          {harmonyScore >= 80 && <li>• Excellent balance and harmony! 🎨</li>}
          {lightColors === 0 && <li>• All dark colors - add light colors for contrast</li>}
          {darkColors === 0 && <li>• All light colors - add dark colors for depth</li>}
        </ul>
      </div>
    </div>
  );
}
