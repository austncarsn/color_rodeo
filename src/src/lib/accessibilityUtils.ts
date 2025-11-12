/**
 * Accessibility utilities for color contrast and colorblind simulation
 */

import { hexToRgb, type RGB } from './colorUtils';

// ========================================
// WCAG CONTRAST CALCULATIONS
// ========================================

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.0 formula
 * @param rgb - RGB color values
 * @returns Relative luminance (0-1)
 */
export function getRelativeLuminance(rgb: RGB): number {
  const { r, g, b } = rgb;
  
  const [rs, gs, bs] = [r, g, b].map(val => {
    const sRGB = val / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First hex color
 * @param color2 - Second hex color
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(hexToRgb(color1));
  const lum2 = getRelativeLuminance(hexToRgb(color2));
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG compliance levels for contrast ratios
 */
export interface WCAGLevel {
  aa: boolean;
  aaa: boolean;
}

export interface ContrastResult {
  ratio: number;
  normalText: WCAGLevel;
  largeText: WCAGLevel;
  rating: 'poor' | 'fair' | 'good' | 'excellent';
}

/**
 * Check WCAG compliance for a contrast ratio
 * @param color1 - First hex color
 * @param color2 - Second hex color
 * @returns Contrast result with WCAG levels
 */
export function checkContrast(color1: string, color2: string): ContrastResult {
  const ratio = getContrastRatio(color1, color2);
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    normalText: {
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
    },
    largeText: {
      aa: ratio >= 3,
      aaa: ratio >= 4.5,
    },
    rating: getRating(ratio),
  };
}

function getRating(ratio: number): 'poor' | 'fair' | 'good' | 'excellent' {
  if (ratio < 3) return 'poor';
  if (ratio < 4.5) return 'fair';
  if (ratio < 7) return 'good';
  return 'excellent';
}

// ========================================
// COLORBLIND SIMULATION
// ========================================

export type ColorblindType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'none';

/**
 * Simulate how a color appears to someone with colorblindness
 * Based on Brettel, Viénot and Mollon JPEG algorithm
 * @param hex - Hex color code
 * @param type - Type of colorblindness
 * @returns Simulated hex color
 */
export function simulateColorblindness(hex: string, type: ColorblindType): string {
  if (type === 'none') return hex;
  
  const { r, g, b } = hexToRgb(hex);
  let newR = r, newG = g, newB = b;
  
  switch (type) {
    case 'protanopia': // Red-blind
      newR = 0.567 * r + 0.433 * g;
      newG = 0.558 * r + 0.442 * g;
      newB = 0.242 * g + 0.758 * b;
      break;
      
    case 'deuteranopia': // Green-blind
      newR = 0.625 * r + 0.375 * g;
      newG = 0.7 * r + 0.3 * g;
      newB = 0.3 * g + 0.7 * b;
      break;
      
    case 'tritanopia': // Blue-blind
      newR = 0.95 * r + 0.05 * g;
      newG = 0.433 * g + 0.567 * b;
      newB = 0.475 * g + 0.525 * b;
      break;
      
    case 'achromatopsia': // Complete color blindness
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      newR = newG = newB = gray;
      break;
  }
  
  // Convert back to hex
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`.toUpperCase();
}

/**
 * Get human-readable name for colorblind type
 */
export function getColorblindnessName(type: ColorblindType): string {
  const names: Record<ColorblindType, string> = {
    none: 'Normal Vision',
    protanopia: 'Protanopia (Red-Blind)',
    deuteranopia: 'Deuteranopia (Green-Blind)',
    tritanopia: 'Tritanopia (Blue-Blind)',
    achromatopsia: 'Achromatopsia (Monochrome)',
  };
  return names[type];
}

// ========================================
// PALETTE ACCESSIBILITY SCORING
// ========================================

export interface PaletteAccessibilityScore {
  overallScore: number; // 0-100
  contrastIssues: number;
  colorblindSafe: boolean;
  recommendations: string[];
}

/**
 * Score a palette for accessibility
 * @param colors - Array of hex colors
 * @returns Accessibility score and recommendations
 */
export function scorePaletteAccessibility(colors: string[]): PaletteAccessibilityScore {
  if (colors.length === 0) {
    return {
      overallScore: 0,
      contrastIssues: 0,
      colorblindSafe: true,
      recommendations: ['Add colors to analyze accessibility'],
    };
  }
  
  const recommendations: string[] = [];
  let contrastIssues = 0;
  let totalPairs = 0;
  
  // Check contrast between all pairs
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      totalPairs++;
      const contrast = checkContrast(colors[i], colors[j]);
      
      if (!contrast.normalText.aa) {
        contrastIssues++;
      }
    }
  }
  
  // Check colorblind distinguishability
  const colorblindSafe = checkColorblindDistinguishability(colors);
  
  // Generate recommendations
  if (contrastIssues > 0) {
    recommendations.push(`${contrastIssues} color pair(s) have insufficient contrast for normal text`);
  }
  
  if (!colorblindSafe) {
    recommendations.push('Some colors may be difficult to distinguish for colorblind users');
  }
  
  if (colors.length < 3) {
    recommendations.push('Consider adding more colors for variety');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Great! This palette is accessible');
  }
  
  // Calculate overall score
  const contrastScore = totalPairs > 0 ? ((totalPairs - contrastIssues) / totalPairs) * 70 : 70;
  const colorblindScore = colorblindSafe ? 30 : 15;
  const overallScore = Math.round(contrastScore + colorblindScore);
  
  return {
    overallScore,
    contrastIssues,
    colorblindSafe,
    recommendations,
  };
}

/**
 * Check if colors are distinguishable for colorblind users
 */
function checkColorblindDistinguishability(colors: string[]): boolean {
  if (colors.length < 2) return true;
  
  const types: ColorblindType[] = ['protanopia', 'deuteranopia', 'tritanopia'];
  
  for (const type of types) {
    const simulated = colors.map(c => simulateColorblindness(c, type));
    
    // Check if simulated colors are too similar
    for (let i = 0; i < simulated.length; i++) {
      for (let j = i + 1; j < simulated.length; j++) {
        const diff = colorDifference(simulated[i], simulated[j]);
        if (diff < 30) {
          return false; // Colors too similar for this type of colorblindness
        }
      }
    }
  }
  
  return true;
}

/**
 * Calculate perceptual difference between two colors
 * @returns Difference value (0-255+)
 */
function colorDifference(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Find best text color (black or white) for a background
 * with WCAG AA compliance
 */
export function getBestTextColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}

/**
 * Suggest alternative colors to improve contrast
 */
export function suggestContrastImprovement(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): string | null {
  const currentRatio = getContrastRatio(foreground, background);
  
  if (currentRatio >= targetRatio) {
    return null; // Already meets target
  }
  
  const fgRgb = hexToRgb(foreground);
  const fgLum = getRelativeLuminance(fgRgb);
  const bgLum = getRelativeLuminance(hexToRgb(background));
  
  // Determine if we need to lighten or darken
  const shouldLighten = fgLum < bgLum;
  
  // Binary search for the right adjustment
  let adjustedColor = foreground;
  for (let i = 0; i < 100; i++) {
    const factor = shouldLighten ? 1 + (i * 0.01) : 1 - (i * 0.01);
    
    const newR = Math.max(0, Math.min(255, Math.round(fgRgb.r * factor)));
    const newG = Math.max(0, Math.min(255, Math.round(fgRgb.g * factor)));
    const newB = Math.max(0, Math.min(255, Math.round(fgRgb.b * factor)));
    
    const testColor = `#${[newR, newG, newB]
      .map(v => v.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()}`;
    
    const testRatio = getContrastRatio(testColor, background);
    
    if (testRatio >= targetRatio) {
      adjustedColor = testColor;
      break;
    }
  }
  
  return adjustedColor;
}
