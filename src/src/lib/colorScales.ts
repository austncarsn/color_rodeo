/**
 * Color scale generation (Material Design / Tailwind style)
 */

import { hexToHsl, hslToHex, hexToRgb, rgbToHex } from './colorUtils';

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

/**
 * Generate Material Design / Tailwind style color scale
 * @param baseColor - Base color (typically 500)
 * @param method - Generation method
 * @returns Color scale object
 */
export function generateColorScale(
  baseColor: string,
  method: 'material' | 'tailwind' | 'custom' = 'tailwind'
): ColorScale {
  if (method === 'material') {
    return generateMaterialScale(baseColor);
  } else if (method === 'tailwind') {
    return generateTailwindScale(baseColor);
  } else {
    return generateCustomScale(baseColor);
  }
}

/**
 * Generate Tailwind-style color scale
 * Uses lightness-based approach
 */
function generateTailwindScale(baseColor: string): ColorScale {
  const { h, s } = hexToHsl(baseColor);
  
  // Tailwind lightness values
  const lightnessMap: Record<keyof ColorScale, number> = {
    50: 97,
    100: 93,
    200: 86,
    300: 77,
    400: 65,
    500: 50,  // Base
    600: 45,
    700: 35,
    800: 25,
    900: 15,
    950: 10,
  };
  
  const scale = {} as ColorScale;
  
  Object.entries(lightnessMap).forEach(([shade, lightness]) => {
    // Adjust saturation slightly for very light/dark shades
    let adjustedS = s;
    if (lightness > 90) {
      adjustedS = Math.max(s * 0.5, s - 30); // Reduce saturation for very light
    } else if (lightness < 20) {
      adjustedS = Math.max(s * 0.7, s - 20); // Reduce saturation for very dark
    }
    
    scale[shade as keyof ColorScale] = hslToHex(h, adjustedS, lightness);
  });
  
  return scale;
}

/**
 * Generate Material Design-style color scale
 * More saturated mid-tones
 */
function generateMaterialScale(baseColor: string): ColorScale {
  const { h, s, l } = hexToHsl(baseColor);
  
  const scale = {} as ColorScale;
  
  // Material Design uses more complex saturation curves
  const shadeConfig: Record<keyof ColorScale, { l: number; sFactor: number }> = {
    50: { l: 95, sFactor: 0.3 },
    100: { l: 90, sFactor: 0.4 },
    200: { l: 80, sFactor: 0.6 },
    300: { l: 70, sFactor: 0.8 },
    400: { l: 60, sFactor: 0.9 },
    500: { l: 50, sFactor: 1.0 },   // Base
    600: { l: 45, sFactor: 1.0 },
    700: { l: 35, sFactor: 0.95 },
    800: { l: 25, sFactor: 0.85 },
    900: { l: 15, sFactor: 0.75 },
    950: { l: 10, sFactor: 0.6 },
  };
  
  Object.entries(shadeConfig).forEach(([shade, config]) => {
    const adjustedS = Math.min(100, s * config.sFactor);
    scale[shade as keyof ColorScale] = hslToHex(h, adjustedS, config.l);
  });
  
  return scale;
}

/**
 * Generate custom color scale
 * Balanced approach between Material and Tailwind
 */
function generateCustomScale(baseColor: string): ColorScale {
  const { h, s, l } = hexToHsl(baseColor);
  
  const scale = {} as ColorScale;
  
  const shadeConfig: Record<keyof ColorScale, { l: number; sFactor: number }> = {
    50: { l: 96, sFactor: 0.4 },
    100: { l: 92, sFactor: 0.5 },
    200: { l: 84, sFactor: 0.7 },
    300: { l: 74, sFactor: 0.85 },
    400: { l: 62, sFactor: 0.95 },
    500: { l: 50, sFactor: 1.0 },   // Base
    600: { l: 43, sFactor: 1.0 },
    700: { l: 33, sFactor: 0.95 },
    800: { l: 23, sFactor: 0.85 },
    900: { l: 13, sFactor: 0.7 },
    950: { l: 8, sFactor: 0.6 },
  };
  
  Object.entries(shadeConfig).forEach(([shade, config]) => {
    const adjustedS = Math.min(100, s * config.sFactor);
    scale[shade as keyof ColorScale] = hslToHex(h, adjustedS, config.l);
  });
  
  return scale;
}

/**
 * Generate color scale array (simpler version)
 * @param baseColor - Base color
 * @param steps - Number of steps (default 9)
 * @returns Array of colors from light to dark
 */
export function generateSimpleScale(baseColor: string, steps: number = 9): string[] {
  const { h, s } = hexToHsl(baseColor);
  const colors: string[] = [];
  
  for (let i = 0; i < steps; i++) {
    const lightness = 95 - (i * (85 / (steps - 1)));
    const satFactor = i < steps / 2 
      ? 0.5 + (i / (steps / 2)) * 0.5  // Increase sat from light to mid
      : 1.0 - ((i - steps / 2) / (steps / 2)) * 0.3; // Decrease sat from mid to dark
    
    const adjustedS = Math.min(100, s * satFactor);
    colors.push(hslToHex(h, adjustedS, lightness));
  }
  
  return colors;
}

/**
 * Export color scale as Tailwind config
 * @param name - Color name
 * @param scale - Color scale
 * @returns Tailwind config string
 */
export function exportScaleTailwind(name: string, scale: ColorScale): string {
  const entries = Object.entries(scale)
    .map(([shade, color]) => `      '${shade}': '${color}',`)
    .join('\n');
  
  return `// Add to tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ${name}: {
${entries}
        },
      },
    },
  },
}`;
}

/**
 * Export color scale as CSS variables
 * @param name - Color name
 * @param scale - Color scale
 * @returns CSS string
 */
export function exportScaleCSS(name: string, scale: ColorScale): string {
  const entries = Object.entries(scale)
    .map(([shade, color]) => `  --${name}-${shade}: ${color};`)
    .join('\n');
  
  return `:root {
${entries}
}`;
}

/**
 * Export color scale as SCSS variables
 * @param name - Color name
 * @param scale - Color scale
 * @returns SCSS string
 */
export function exportScaleSCSS(name: string, scale: ColorScale): string {
  const entries = Object.entries(scale)
    .map(([shade, color]) => `$${name}-${shade}: ${color};`)
    .join('\n');
  
  return `// ${name} color scale\n${entries}`;
}

/**
 * Export color scale as JSON
 * @param name - Color name
 * @param scale - Color scale
 * @returns JSON string
 */
export function exportScaleJSON(name: string, scale: ColorScale): string {
  return JSON.stringify({ [name]: scale }, null, 2);
}

/**
 * Generate multiple color scales from palette
 * @param colors - Array of colors
 * @param names - Optional array of names
 * @returns Object with named scales
 */
export function generatePaletteScales(
  colors: string[],
  names?: string[]
): Record<string, ColorScale> {
  const scales: Record<string, ColorScale> = {};
  
  colors.forEach((color, index) => {
    const name = names?.[index] || `color${index + 1}`;
    scales[name] = generateColorScale(color);
  });
  
  return scales;
}

/**
 * Find closest shade in a scale
 * @param color - Target color
 * @param scale - Color scale
 * @returns Closest shade number
 */
export function findClosestShade(color: string, scale: ColorScale): keyof ColorScale {
  const targetRgb = hexToRgb(color);
  let minDistance = Infinity;
  let closestShade: keyof ColorScale = 500;
  
  Object.entries(scale).forEach(([shade, scaleColor]) => {
    const scaleRgb = hexToRgb(scaleColor);
    const distance = Math.sqrt(
      Math.pow(targetRgb.r - scaleRgb.r, 2) +
      Math.pow(targetRgb.g - scaleRgb.g, 2) +
      Math.pow(targetRgb.b - scaleRgb.b, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestShade = shade as keyof ColorScale;
    }
  });
  
  return closestShade;
}

/**
 * Validate color scale (check if it's properly distributed)
 * @param scale - Color scale
 * @returns Validation result
 */
export function validateColorScale(scale: ColorScale): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const shades = Object.keys(scale) as Array<keyof ColorScale>;
  
  // Check lightness progression
  for (let i = 0; i < shades.length - 1; i++) {
    const currentL = hexToHsl(scale[shades[i]]).l;
    const nextL = hexToHsl(scale[shades[i + 1]]).l;
    
    if (currentL <= nextL) {
      issues.push(`Lightness should decrease from ${shades[i]} to ${shades[i + 1]}`);
    }
  }
  
  // Check if 500 is roughly middle lightness
  const l500 = hexToHsl(scale[500]).l;
  if (l500 < 40 || l500 > 60) {
    issues.push('Base color (500) should have medium lightness (40-60%)');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}
