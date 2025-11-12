/**
 * Palette manipulation and sorting utilities
 */

import { hexToHsl, hexToRgb } from './colorUtils';

/**
 * Sort colors by hue (color wheel order)
 * @param colors - Array of hex colors
 * @returns Sorted array
 */
export function sortByHue(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const hslA = hexToHsl(a);
    const hslB = hexToHsl(b);
    return hslA.h - hslB.h;
  });
}

/**
 * Sort colors by saturation (least to most saturated)
 * @param colors - Array of hex colors
 * @returns Sorted array
 */
export function sortBySaturation(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const hslA = hexToHsl(a);
    const hslB = hexToHsl(b);
    return hslA.s - hslB.s;
  });
}

/**
 * Sort colors by lightness (darkest to lightest)
 * @param colors - Array of hex colors
 * @returns Sorted array
 */
export function sortByLightness(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const hslA = hexToHsl(a);
    const hslB = hexToHsl(b);
    return hslA.l - hslB.l;
  });
}

/**
 * Sort colors by luminance (perceived brightness)
 * @param colors - Array of hex colors
 * @returns Sorted array
 */
export function sortByLuminance(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const lumA = getPerceivedLuminance(a);
    const lumB = getPerceivedLuminance(b);
    return lumA - lumB;
  });
}

/**
 * Calculate perceived luminance (how bright a color appears)
 */
function getPerceivedLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  // Using the formula for relative luminance
  return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
}

/**
 * Shuffle colors randomly
 * @param colors - Array of hex colors
 * @returns Shuffled array
 */
export function shuffleColors(colors: string[]): string[] {
  const shuffled = [...colors];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Reverse color order
 * @param colors - Array of hex colors
 * @returns Reversed array
 */
export function reverseColors(colors: string[]): string[] {
  return [...colors].reverse();
}

/**
 * Remove duplicate colors
 * @param colors - Array of hex colors
 * @returns Array without duplicates
 */
export function removeDuplicates(colors: string[]): string[] {
  return Array.from(new Set(colors.map(c => c.toUpperCase())));
}

/**
 * Filter colors by hue range
 * @param colors - Array of hex colors
 * @param minHue - Minimum hue (0-360)
 * @param maxHue - Maximum hue (0-360)
 * @returns Filtered array
 */
export function filterByHueRange(colors: string[], minHue: number, maxHue: number): string[] {
  return colors.filter(color => {
    const { h } = hexToHsl(color);
    if (minHue <= maxHue) {
      return h >= minHue && h <= maxHue;
    } else {
      // Handle wrap-around (e.g., 330-30 for reds)
      return h >= minHue || h <= maxHue;
    }
  });
}

/**
 * Filter colors by saturation range
 * @param colors - Array of hex colors
 * @param minSat - Minimum saturation (0-100)
 * @param maxSat - Maximum saturation (0-100)
 * @returns Filtered array
 */
export function filterBySaturationRange(colors: string[], minSat: number, maxSat: number): string[] {
  return colors.filter(color => {
    const { s } = hexToHsl(color);
    return s >= minSat && s <= maxSat;
  });
}

/**
 * Filter colors by lightness range
 * @param colors - Array of hex colors
 * @param minLight - Minimum lightness (0-100)
 * @param maxLight - Maximum lightness (0-100)
 * @returns Filtered array
 */
export function filterByLightnessRange(colors: string[], minLight: number, maxLight: number): string[] {
  return colors.filter(color => {
    const { l } = hexToHsl(color);
    return l >= minLight && l <= maxLight;
  });
}

/**
 * Group colors by hue into families
 * @param colors - Array of hex colors
 * @returns Object with hue families
 */
export function groupByHueFamily(colors: string[]): Record<string, string[]> {
  const families: Record<string, string[]> = {
    Red: [],
    Orange: [],
    Yellow: [],
    Green: [],
    Cyan: [],
    Blue: [],
    Purple: [],
    Gray: [],
  };
  
  colors.forEach(color => {
    const { h, s } = hexToHsl(color);
    
    if (s < 10) {
      families.Gray.push(color);
    } else if (h < 15 || h >= 345) {
      families.Red.push(color);
    } else if (h < 45) {
      families.Orange.push(color);
    } else if (h < 70) {
      families.Yellow.push(color);
    } else if (h < 150) {
      families.Green.push(color);
    } else if (h < 200) {
      families.Cyan.push(color);
    } else if (h < 260) {
      families.Blue.push(color);
    } else {
      families.Purple.push(color);
    }
  });
  
  // Remove empty families
  Object.keys(families).forEach(key => {
    if (families[key].length === 0) {
      delete families[key];
    }
  });
  
  return families;
}

/**
 * Find most saturated color
 * @param colors - Array of hex colors
 * @returns Most saturated color
 */
export function findMostSaturated(colors: string[]): string | null {
  if (colors.length === 0) return null;
  
  return colors.reduce((most, color) => {
    const hslMost = hexToHsl(most);
    const hslColor = hexToHsl(color);
    return hslColor.s > hslMost.s ? color : most;
  });
}

/**
 * Find least saturated color
 * @param colors - Array of hex colors
 * @returns Least saturated color
 */
export function findLeastSaturated(colors: string[]): string | null {
  if (colors.length === 0) return null;
  
  return colors.reduce((least, color) => {
    const hslLeast = hexToHsl(least);
    const hslColor = hexToHsl(color);
    return hslColor.s < hslLeast.s ? color : least;
  });
}

/**
 * Find lightest color
 * @param colors - Array of hex colors
 * @returns Lightest color
 */
export function findLightest(colors: string[]): string | null {
  if (colors.length === 0) return null;
  
  return colors.reduce((lightest, color) => {
    const hslLightest = hexToHsl(lightest);
    const hslColor = hexToHsl(color);
    return hslColor.l > hslLightest.l ? color : lightest;
  });
}

/**
 * Find darkest color
 * @param colors - Array of hex colors
 * @returns Darkest color
 */
export function findDarkest(colors: string[]): string | null {
  if (colors.length === 0) return null;
  
  return colors.reduce((darkest, color) => {
    const hslDarkest = hexToHsl(darkest);
    const hslColor = hexToHsl(color);
    return hslColor.l < hslDarkest.l ? color : darkest;
  });
}

/**
 * Calculate average color from palette
 * @param colors - Array of hex colors
 * @returns Average color
 */
export function getAverageColor(colors: string[]): string {
  if (colors.length === 0) return '#808080';
  
  const sum = colors.reduce(
    (acc, color) => {
      const rgb = hexToRgb(color);
      return {
        r: acc.r + rgb.r,
        g: acc.g + rgb.g,
        b: acc.b + rgb.b,
      };
    },
    { r: 0, g: 0, b: 0 }
  );
  
  const avg = {
    r: Math.round(sum.r / colors.length),
    g: Math.round(sum.g / colors.length),
    b: Math.round(sum.b / colors.length),
  };
  
  return `#${[avg.r, avg.g, avg.b]
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

/**
 * Calculate color diversity score (0-100)
 * Higher score means more diverse palette
 * @param colors - Array of hex colors
 * @returns Diversity score
 */
export function calculateDiversity(colors: string[]): number {
  if (colors.length < 2) return 0;
  
  let totalDistance = 0;
  let pairs = 0;
  
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      totalDistance += colorDistance(colors[i], colors[j]);
      pairs++;
    }
  }
  
  const avgDistance = totalDistance / pairs;
  // Normalize to 0-100 (max distance is ~441 for RGB)
  return Math.min(100, Math.round((avgDistance / 441) * 100));
}

/**
 * Calculate distance between two colors
 */
function colorDistance(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

/**
 * Optimize palette for accessibility
 * Ensures minimum contrast between colors
 * @param colors - Array of hex colors
 * @param minContrast - Minimum contrast ratio
 * @returns Optimized array
 */
export function optimizeForContrast(colors: string[], minContrast: number = 3): string[] {
  // This is a simplified version - full implementation would adjust colors
  // For now, just sort by luminance to maximize natural contrast
  return sortByLuminance(colors);
}

/**
 * Get palette statistics
 * @param colors - Array of hex colors
 * @returns Statistics object
 */
export function getPaletteStats(colors: string[]): {
  count: number;
  diversity: number;
  avgSaturation: number;
  avgLightness: number;
  hueSpread: number;
} {
  if (colors.length === 0) {
    return {
      count: 0,
      diversity: 0,
      avgSaturation: 0,
      avgLightness: 0,
      hueSpread: 0,
    };
  }
  
  const hslValues = colors.map(c => hexToHsl(c));
  
  const avgSaturation = Math.round(
    hslValues.reduce((sum, hsl) => sum + hsl.s, 0) / colors.length
  );
  
  const avgLightness = Math.round(
    hslValues.reduce((sum, hsl) => sum + hsl.l, 0) / colors.length
  );
  
  // Calculate hue spread (how much of the color wheel is covered)
  const hues = hslValues.map(hsl => hsl.h).sort((a, b) => a - b);
  let maxGap = 0;
  for (let i = 0; i < hues.length - 1; i++) {
    maxGap = Math.max(maxGap, hues[i + 1] - hues[i]);
  }
  // Check wrap-around gap
  maxGap = Math.max(maxGap, 360 - hues[hues.length - 1] + hues[0]);
  const hueSpread = 360 - maxGap;
  
  return {
    count: colors.length,
    diversity: calculateDiversity(colors),
    avgSaturation,
    avgLightness,
    hueSpread: Math.round(hueSpread),
  };
}
