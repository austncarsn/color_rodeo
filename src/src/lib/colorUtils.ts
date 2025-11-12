/**
 * Color utility functions for hex color manipulation and validation
 */

// ========================================
// VALIDATION & NORMALIZATION
// ========================================

/**
 * Validates if a string is a valid 6-character hex color code
 * @param hex - String to validate (with or without # prefix)
 * @returns true if valid hex color, false otherwise
 */
export function isValidHex(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  return /^[0-9A-F]{6}$/i.test(cleanHex);
}

/**
 * Normalizes a hex color code to uppercase with # prefix
 * @param hex - Hex color code (with or without # prefix)
 * @returns Normalized hex color (e.g., "#FF5733")
 */
export function normalizeHex(hex: string): string {
  const cleanHex = hex.replace('#', '').toUpperCase();
  return `#${cleanHex}`;
}

/**
 * Extracts all valid hex color codes from a string
 * Supports multiple formats separated by commas, spaces, etc.
 * @param input - String containing one or more hex codes
 * @returns Array of normalized hex color codes
 */
export function extractHexCodes(input: string): string[] {
  const hexPattern = /#?[0-9A-F]{6}/gi;
  const matches = input.match(hexPattern);
  
  if (!matches || matches.length === 0) {
    return [];
  }
  
  return matches.map(hex => normalizeHex(hex));
}

/**
 * Removes duplicate colors from an array
 * @param colors - Array of hex color codes
 * @returns Array with duplicates removed
 */
export function removeDuplicateColors(colors: string[]): string[] {
  return Array.from(new Set(colors));
}

// ========================================
// COLOR FORMAT CONVERSION
// ========================================

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Converts hex color to RGB
 * @param hex - Hex color code
 * @returns RGB object with r, g, b values (0-255)
 */
export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

/**
 * Converts RGB to hex color
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color code
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Converts hex color to HSL
 * @param hex - Hex color code
 * @returns HSL object with h (0-360), s (0-100), l (0-100)
 */
export function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex);
  
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / delta + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / delta + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HSL to hex color
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color code
 */
export function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  
  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  );
}

/**
 * Parse color input in various formats (hex, rgb, hsl)
 * @param input - Color string in hex, rgb(), or hsl() format
 * @returns Normalized hex color or null if invalid
 */
export function parseColorInput(input: string): string | null {
  const trimmed = input.trim();
  
  // Check for hex format
  if (trimmed.match(/^#?[0-9A-F]{6}$/i)) {
    return normalizeHex(trimmed);
  }
  
  // Check for rgb format: rgb(255, 255, 255) or rgb(255,255,255)
  const rgbMatch = trimmed.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    if (r <= 255 && g <= 255 && b <= 255) {
      return rgbToHex(r, g, b);
    }
  }
  
  // Check for hsl format: hsl(360, 100%, 50%) or hsl(360,100%,50%)
  const hslMatch = trimmed.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const s = parseInt(hslMatch[2]);
    const l = parseInt(hslMatch[3]);
    if (h <= 360 && s <= 100 && l <= 100) {
      return hslToHex(h, s, l);
    }
  }
  
  return null;
}

/**
 * Format color in different output formats
 * @param hex - Hex color code
 * @param format - Output format ('hex' | 'rgb' | 'hsl')
 * @returns Formatted color string
 */
export function formatColor(hex: string, format: 'hex' | 'rgb' | 'hsl'): string {
  if (format === 'hex') {
    return hex;
  }
  
  if (format === 'rgb') {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  if (format === 'hsl') {
    const { h, s, l } = hexToHsl(hex);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  
  return hex;
}

// ========================================
// COLOR ACCESSIBILITY
// ========================================

/**
 * Determines if a color is light or dark based on its luminance
 * Uses the relative luminance formula from WCAG
 * @param hex - Hex color code
 * @returns true if the color is light, false if dark
 */
export function isLightColor(hex: string): boolean {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  
  // Calculate relative luminance
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  return luma > 128;
}

/**
 * Gets the appropriate text color (black or white) for a given background color
 * @param backgroundColor - Hex color code of the background
 * @returns Tailwind class for text color
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? 'text-slate-900' : 'text-white';
}

// ========================================
// PALETTE GENERATION
// ========================================

/**
 * Generates a complementary color (180° on color wheel)
 * @param hex - Base hex color
 * @returns Complementary hex color
 */
export function generateComplementary(hex: string): string {
  const hsl = hexToHsl(hex);
  const newHue = (hsl.h + 180) % 360;
  return hslToHex(newHue, hsl.s, hsl.l);
}

/**
 * Generates analogous colors (adjacent on color wheel)
 * @param hex - Base hex color
 * @param count - Number of analogous colors to generate (default: 2)
 * @param angle - Degrees between colors (default: 30)
 * @returns Array of analogous hex colors
 */
export function generateAnalogous(hex: string, count: number = 2, angle: number = 30): string[] {
  const hsl = hexToHsl(hex);
  const colors: string[] = [];
  
  for (let i = 1; i <= count; i++) {
    const newHue = (hsl.h + (angle * i)) % 360;
    colors.push(hslToHex(newHue, hsl.s, hsl.l));
  }
  
  return colors;
}

/**
 * Generates triadic colors (120° apart on color wheel)
 * @param hex - Base hex color
 * @returns Array of triadic hex colors (2 additional colors)
 */
export function generateTriadic(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
  ];
}

/**
 * Generates tetradic/square colors (90° apart on color wheel)
 * @param hex - Base hex color
 * @returns Array of tetradic hex colors (3 additional colors)
 */
export function generateTetradic(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l),
  ];
}

/**
 * Generates a monochromatic palette (same hue, varying lightness)
 * @param hex - Base hex color
 * @param count - Number of shades to generate (default: 5)
 * @returns Array of monochromatic hex colors
 */
export function generateMonochromatic(hex: string, count: number = 5): string[] {
  const hsl = hexToHsl(hex);
  const colors: string[] = [];
  
  // Generate lighter and darker variations
  const step = Math.floor(80 / (count + 1));
  
  for (let i = 0; i < count; i++) {
    const lightness = 10 + (step * (i + 1));
    colors.push(hslToHex(hsl.h, hsl.s, lightness));
  }
  
  return colors;
}

/**
 * Generates a split complementary palette
 * @param hex - Base hex color
 * @param angle - Angle offset from complementary (default: 30)
 * @returns Array of split complementary hex colors (2 colors)
 */
export function generateSplitComplementary(hex: string, angle: number = 30): string[] {
  const hsl = hexToHsl(hex);
  const complementaryHue = (hsl.h + 180) % 360;
  
  return [
    hslToHex((complementaryHue - angle + 360) % 360, hsl.s, hsl.l),
    hslToHex((complementaryHue + angle) % 360, hsl.s, hsl.l),
  ];
}

/**
 * Generates shades of a color (darker variations)
 * @param hex - Base hex color
 * @param count - Number of shades (default: 5)
 * @returns Array of hex colors from light to dark
 */
export function generateShades(hex: string, count: number = 5): string[] {
  const hsl = hexToHsl(hex);
  const colors: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const lightness = hsl.l - (hsl.l / count) * i;
    colors.push(hslToHex(hsl.h, hsl.s, Math.max(0, lightness)));
  }
  
  return colors;
}

/**
 * Generates tints of a color (lighter variations)
 * @param hex - Base hex color
 * @param count - Number of tints (default: 5)
 * @returns Array of hex colors from dark to light
 */
export function generateTints(hex: string, count: number = 5): string[] {
  const hsl = hexToHsl(hex);
  const colors: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const lightness = hsl.l + ((100 - hsl.l) / count) * i;
    colors.push(hslToHex(hsl.h, hsl.s, Math.min(100, lightness)));
  }
  
  return colors;
}