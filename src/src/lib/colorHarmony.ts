/**
 * Color harmony and color wheel utilities
 */

import { hexToHsl, hslToHex } from './colorUtils';

export type HarmonyType =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic'
  | 'square';

export interface ColorHarmony {
  type: HarmonyType;
  colors: string[];
  angles: number[];
}

/**
 * Generate monochromatic harmony (same hue, different saturation/lightness)
 * @param baseColor - Base hex color
 * @param variations - Number of variations
 * @returns Array of harmonious colors
 */
export function generateMonochromatic(baseColor: string, variations: number = 5): string[] {
  const { h, s, l } = hexToHsl(baseColor);
  const colors: string[] = [];

  // Create variations by adjusting lightness and saturation
  for (let i = 0; i < variations; i++) {
    const factor = i / (variations - 1);
    const newL = 20 + factor * 70; // Range from 20 to 90
    const newS = Math.max(20, s - (Math.abs(factor - 0.5) * 30)); // Peak saturation in middle
    colors.push(hslToHex(h, newS, newL));
  }

  return colors;
}

/**
 * Generate analogous harmony (adjacent hues on color wheel)
 * @param baseColor - Base hex color
 * @param count - Number of colors (default 5)
 * @param spread - Angle spread (default 30°)
 * @returns Array of harmonious colors
 */
export function generateAnalogous(
  baseColor: string,
  count: number = 5,
  spread: number = 30
): string[] {
  const { h, s, l } = hexToHsl(baseColor);
  const colors: string[] = [];
  const startHue = h - ((count - 1) * spread) / 2;

  for (let i = 0; i < count; i++) {
    let newHue = startHue + i * spread;
    if (newHue < 0) newHue += 360;
    if (newHue >= 360) newHue -= 360;
    colors.push(hslToHex(newHue, s, l));
  }

  return colors;
}

/**
 * Generate complementary harmony (opposite on color wheel)
 * @param baseColor - Base hex color
 * @returns Array with base and complement
 */
export function generateComplementary(baseColor: string): string[] {
  const { h, s, l } = hexToHsl(baseColor);
  const complementHue = (h + 180) % 360;

  return [baseColor, hslToHex(complementHue, s, l)];
}

/**
 * Generate split complementary harmony
 * @param baseColor - Base hex color
 * @param angle - Split angle (default 150°)
 * @returns Array of 3 colors
 */
export function generateSplitComplementary(baseColor: string, angle: number = 150): string[] {
  const { h, s, l } = hexToHsl(baseColor);
  const comp1 = (h + angle) % 360;
  const comp2 = (h - angle + 360) % 360;

  return [baseColor, hslToHex(comp1, s, l), hslToHex(comp2, s, l)];
}

/**
 * Generate triadic harmony (3 colors evenly spaced)
 * @param baseColor - Base hex color
 * @returns Array of 3 colors
 */
export function generateTriadic(baseColor: string): string[] {
  const { h, s, l } = hexToHsl(baseColor);

  return [
    baseColor,
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
  ];
}

/**
 * Generate tetradic/double complementary harmony (4 colors, 2 complementary pairs)
 * @param baseColor - Base hex color
 * @param offset - Offset angle (default 30°)
 * @returns Array of 4 colors
 */
export function generateTetradic(baseColor: string, offset: number = 30): string[] {
  const { h, s, l } = hexToHsl(baseColor);

  return [
    baseColor,
    hslToHex((h + offset) % 360, s, l),
    hslToHex((h + 180) % 360, s, l),
    hslToHex((h + 180 + offset) % 360, s, l),
  ];
}

/**
 * Generate square harmony (4 colors evenly spaced)
 * @param baseColor - Base hex color
 * @returns Array of 4 colors
 */
export function generateSquare(baseColor: string): string[] {
  const { h, s, l } = hexToHsl(baseColor);

  return [
    baseColor,
    hslToHex((h + 90) % 360, s, l),
    hslToHex((h + 180) % 360, s, l),
    hslToHex((h + 270) % 360, s, l),
  ];
}

/**
 * Generate harmony by type
 * @param baseColor - Base hex color
 * @param type - Harmony type
 * @returns ColorHarmony object
 */
export function generateHarmony(baseColor: string, type: HarmonyType): ColorHarmony {
  const { h } = hexToHsl(baseColor);
  let colors: string[];
  let angles: number[];

  switch (type) {
    case 'monochromatic':
      colors = generateMonochromatic(baseColor);
      angles = [h, h, h, h, h];
      break;

    case 'analogous':
      colors = generateAnalogous(baseColor);
      angles = [h - 60, h - 30, h, h + 30, h + 60].map((a) => (a + 360) % 360);
      break;

    case 'complementary':
      colors = generateComplementary(baseColor);
      angles = [h, (h + 180) % 360];
      break;

    case 'split-complementary':
      colors = generateSplitComplementary(baseColor);
      angles = [h, (h + 150) % 360, (h - 150 + 360) % 360];
      break;

    case 'triadic':
      colors = generateTriadic(baseColor);
      angles = [h, (h + 120) % 360, (h + 240) % 360];
      break;

    case 'tetradic':
      colors = generateTetradic(baseColor);
      angles = [h, (h + 30) % 360, (h + 180) % 360, (h + 210) % 360];
      break;

    case 'square':
      colors = generateSquare(baseColor);
      angles = [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360];
      break;

    default:
      colors = [baseColor];
      angles = [h];
  }

  return { type, colors, angles };
}

/**
 * Get harmony description
 * @param type - Harmony type
 * @returns Description string
 */
export function getHarmonyDescription(type: HarmonyType): string {
  const descriptions: Record<HarmonyType, string> = {
    monochromatic: 'Variations of a single hue with different saturation and lightness',
    analogous: 'Adjacent colors on the color wheel, creating a harmonious feel',
    complementary: 'Opposite colors on the wheel, providing high contrast',
    'split-complementary':
      'Base color plus two colors adjacent to its complement, softer than complementary',
    triadic: 'Three colors evenly spaced on the wheel, vibrant and balanced',
    tetradic: 'Two complementary pairs, rich and varied palette',
    square: 'Four colors evenly spaced, balanced and colorful',
  };

  return descriptions[type];
}

/**
 * Calculate color wheel position (x, y coordinates)
 * @param hue - Hue angle (0-360)
 * @param saturation - Saturation (0-100)
 * @param radius - Wheel radius
 * @returns {x, y} coordinates
 */
export function getColorWheelPosition(
  hue: number,
  saturation: number,
  radius: number
): { x: number; y: number } {
  // Convert hue to radians (hue 0 = top, clockwise)
  const angle = ((hue - 90) * Math.PI) / 180;
  const distance = (saturation / 100) * radius;

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

/**
 * Get hue from color wheel position
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Hue angle (0-360)
 */
export function getHueFromPosition(x: number, y: number): number {
  let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
  if (angle < 0) angle += 360;
  return angle % 360;
}

/**
 * Get saturation from color wheel position
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param radius - Wheel radius
 * @returns Saturation (0-100)
 */
export function getSaturationFromPosition(x: number, y: number, radius: number): number {
  const distance = Math.sqrt(x * x + y * y);
  return Math.min(100, (distance / radius) * 100);
}

/**
 * Generate palette from harmony with variations
 * @param baseColor - Base hex color
 * @param type - Harmony type
 * @param includeShades - Include lighter/darker shades
 * @returns Extended palette
 */
export function generateExtendedHarmony(
  baseColor: string,
  type: HarmonyType,
  includeShades: boolean = true
): string[] {
  const harmony = generateHarmony(baseColor, type);
  
  if (!includeShades) {
    return harmony.colors;
  }

  const extended: string[] = [];

  harmony.colors.forEach((color) => {
    const { h, s, l } = hexToHsl(color);
    
    // Add darker shade
    extended.push(hslToHex(h, s, Math.max(10, l - 20)));
    // Add base color
    extended.push(color);
    // Add lighter shade
    extended.push(hslToHex(h, s, Math.min(90, l + 20)));
  });

  return extended;
}

/**
 * Find best harmony type for existing palette
 * @param colors - Array of hex colors
 * @returns Best matching harmony type
 */
export function detectHarmonyType(colors: string[]): HarmonyType {
  if (colors.length < 2) return 'monochromatic';

  const hues = colors.map((c) => hexToHsl(c).h);
  const hueDiffs = [];

  for (let i = 1; i < hues.length; i++) {
    let diff = Math.abs(hues[i] - hues[0]);
    if (diff > 180) diff = 360 - diff;
    hueDiffs.push(diff);
  }

  const avgDiff = hueDiffs.reduce((a, b) => a + b, 0) / hueDiffs.length;

  // Detect based on average hue difference
  if (avgDiff < 30) return 'analogous';
  if (avgDiff > 160 && avgDiff < 200) return 'complementary';
  if (avgDiff > 100 && avgDiff < 140) return 'triadic';
  if (avgDiff > 70 && avgDiff < 110) return 'square';

  return 'monochromatic';
}
