/**
 * Palette optimization utilities for generating intelligent color recommendations
 */

import {
  hexToHsl,
  hslToHex,
  isLightColor,
  hexToRgb,
  rgbToHex,
} from './colorUtils';
import {
  getContrastRatio,
  scorePaletteAccessibility,
  checkContrast,
} from './accessibilityUtils';

export interface ColorRecommendation {
  color: string;
  reason: string;
  category: 'accessibility' | 'harmony' | 'balance' | 'contrast';
  impact: {
    harmonyImprovement: number;
    accessibilityImprovement: number;
    contrastPairsAdded: number;
  };
  priority: 'high' | 'medium' | 'low';
}

export interface OptimizationAnalysis {
  currentScore: {
    harmony: number;
    accessibility: number;
  };
  recommendations: ColorRecommendation[];
  insights: string[];
}

/**
 * Generate optimal color to meet WCAG contrast requirements with existing palette
 */
function generateAccessibleColor(
  existingColors: string[],
  targetContrast: number = 4.5,
  preferLight: boolean = true
): string | null {
  // Start with a base color
  const baseLightness = preferLight ? 95 : 10;
  const baseSaturation = 10; // Low saturation for neutral backgrounds/text
  
  // Try different hues to find one that works well
  for (let hue = 0; hue < 360; hue += 30) {
    const candidate = hslToHex(hue, baseSaturation, baseLightness);
    
    // Check if this candidate has good contrast with existing colors
    let goodContrastCount = 0;
    for (const existing of existingColors) {
      const ratio = getContrastRatio(candidate, existing);
      if (ratio >= targetContrast) {
        goodContrastCount++;
      }
    }
    
    // If this color has good contrast with at least half the palette, use it
    if (goodContrastCount >= Math.max(1, existingColors.length / 2)) {
      return candidate;
    }
  }
  
  // Fallback to pure white or black
  return preferLight ? '#FFFFFF' : '#000000';
}

/**
 * Adjust a color to meet minimum contrast ratio with a target color
 */
function adjustColorForContrast(
  color: string,
  targetColor: string,
  minRatio: number = 4.5
): string {
  const currentRatio = getContrastRatio(color, targetColor);
  if (currentRatio >= minRatio) {
    return color; // Already meets requirement
  }
  
  const hsl = hexToHsl(color);
  const targetLum = getLuminance(targetColor);
  
  // Determine if we need to go lighter or darker
  const shouldLighten = targetLum > 0.5;
  
  // Binary search for optimal lightness
  let minL = shouldLighten ? hsl.l : 0;
  let maxL = shouldLighten ? 100 : hsl.l;
  let bestColor = color;
  let bestRatio = currentRatio;
  
  for (let i = 0; i < 20; i++) {
    const testL = (minL + maxL) / 2;
    const testColor = hslToHex(hsl.h, hsl.s, testL);
    const testRatio = getContrastRatio(testColor, targetColor);
    
    if (testRatio >= minRatio) {
      bestColor = testColor;
      bestRatio = testRatio;
      
      // Try to get closer to original if possible
      if (shouldLighten) {
        maxL = testL;
      } else {
        minL = testL;
      }
    } else {
      if (shouldLighten) {
        minL = testL;
      } else {
        maxL = testL;
      }
    }
  }
  
  return bestColor;
}

/**
 * Calculate relative luminance (helper function)
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map(val => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Generate complementary color that maximizes contrast
 */
function generateComplementaryForContrast(baseColor: string): string {
  const hsl = hexToHsl(baseColor);
  const complementaryHue = (hsl.h + 180) % 360;
  
  // Flip lightness to maximize contrast
  const newLightness = hsl.l > 50 ? 20 : 80;
  
  return hslToHex(complementaryHue, Math.max(hsl.s, 60), newLightness);
}

/**
 * Find missing color roles in palette
 */
function findMissingRoles(colors: string[]): {
  needsLightBackground: boolean;
  needsDarkText: boolean;
  needsLightText: boolean;
  needsDarkBackground: boolean;
  needsAccent: boolean;
} {
  const lightColors = colors.filter(c => {
    const hsl = hexToHsl(c);
    return hsl.l > 70;
  });
  
  const darkColors = colors.filter(c => {
    const hsl = hexToHsl(c);
    return hsl.l < 30;
  });
  
  const saturatedColors = colors.filter(c => {
    const hsl = hexToHsl(c);
    return hsl.s > 60;
  });
  
  const neutrals = colors.filter(c => {
    const hsl = hexToHsl(c);
    return hsl.s < 20;
  });
  
  return {
    needsLightBackground: lightColors.filter(c => hexToHsl(c).s < 20).length === 0,
    needsDarkText: darkColors.filter(c => hexToHsl(c).s < 30).length === 0,
    needsLightText: lightColors.filter(c => hexToHsl(c).s < 20).length === 0,
    needsDarkBackground: darkColors.filter(c => hexToHsl(c).s < 20).length === 0,
    needsAccent: saturatedColors.length === 0,
  };
}

/**
 * Generate recommendations for palette optimization
 */
export function generateOptimizationRecommendations(
  colors: string[]
): OptimizationAnalysis {
  if (colors.length === 0) {
    return {
      currentScore: { harmony: 0, accessibility: 0 },
      recommendations: [],
      insights: ['Add colors to your palette to receive optimization suggestions'],
    };
  }
  
  const recommendations: ColorRecommendation[] = [];
  const insights: string[] = [];
  
  // Calculate current scores
  const accessibilityScore = scorePaletteAccessibility(colors);
  const harmonyScore = calculateHarmonyScore(colors);
  
  const missingRoles = findMissingRoles(colors);
  
  // 1. Accessibility recommendations
  if (accessibilityScore.contrastIssues > 0) {
    insights.push(`${accessibilityScore.contrastIssues} color pairs need better contrast`);
    
    // Recommend high-contrast colors
    const lightColors = colors.filter(c => hexToHsl(c).l > 50);
    const darkColors = colors.filter(c => hexToHsl(c).l <= 50);
    
    if (lightColors.length > 0 && darkColors.length === 0) {
      // Need dark colors
      const darkColor = '#1A1A1A';
      recommendations.push({
        color: darkColor,
        reason: 'Add dark color for text contrast with light colors',
        category: 'accessibility',
        impact: {
          harmonyImprovement: 10,
          accessibilityImprovement: 25,
          contrastPairsAdded: lightColors.length,
        },
        priority: 'high',
      });
    }
    
    if (darkColors.length > 0 && lightColors.length === 0) {
      // Need light colors
      const lightColor = '#F5F5F5';
      recommendations.push({
        color: lightColor,
        reason: 'Add light color for background contrast with dark colors',
        category: 'accessibility',
        impact: {
          harmonyImprovement: 10,
          accessibilityImprovement: 25,
          contrastPairsAdded: darkColors.length,
        },
        priority: 'high',
      });
    }
  }
  
  // 2. Missing role recommendations
  if (missingRoles.needsLightBackground) {
    const lightBg = '#FAFAFA';
    recommendations.push({
      color: lightBg,
      reason: 'Add neutral light background color for better versatility',
      category: 'balance',
      impact: {
        harmonyImprovement: 15,
        accessibilityImprovement: 20,
        contrastPairsAdded: colors.filter(c => !isLightColor(c)).length,
      },
      priority: 'high',
    });
  }
  
  if (missingRoles.needsDarkText) {
    const darkText = '#0A0A0A';
    recommendations.push({
      color: darkText,
      reason: 'Add dark text color for optimal readability on light backgrounds',
      category: 'accessibility',
      impact: {
        harmonyImprovement: 10,
        accessibilityImprovement: 30,
        contrastPairsAdded: colors.filter(isLightColor).length,
      },
      priority: 'high',
    });
  }
  
  if (missingRoles.needsAccent) {
    // Generate an accent color that complements the palette
    const avgHue = colors.reduce((sum, c) => sum + hexToHsl(c).h, 0) / colors.length;
    const accentHue = (avgHue + 180) % 360;
    const accentColor = hslToHex(accentHue, 75, 50);
    
    recommendations.push({
      color: accentColor,
      reason: 'Add vibrant accent color to create visual hierarchy and interest',
      category: 'harmony',
      impact: {
        harmonyImprovement: 20,
        accessibilityImprovement: 5,
        contrastPairsAdded: 0,
      },
      priority: 'medium',
    });
  }
  
  // 3. Harmony improvements
  const hues = colors.map(c => hexToHsl(c).h);
  const uniqueHueRanges = new Set(hues.map(h => Math.floor(h / 30))).size;
  
  if (uniqueHueRanges < 3 && colors.length >= 3) {
    insights.push('Limited hue diversity - consider adding complementary colors');
    
    // Suggest a color from an underrepresented hue range
    const existingRanges = new Set(hues.map(h => Math.floor(h / 30)));
    const missingRanges = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(
      r => !existingRanges.has(r)
    );
    
    if (missingRanges.length > 0) {
      const targetRange = missingRanges[0];
      const targetHue = targetRange * 30 + 15;
      const diversityColor = hslToHex(targetHue, 65, 55);
      
      recommendations.push({
        color: diversityColor,
        reason: 'Add color from different hue family to increase diversity',
        category: 'harmony',
        impact: {
          harmonyImprovement: 25,
          accessibilityImprovement: 0,
          contrastPairsAdded: 0,
        },
        priority: 'medium',
      });
    }
  }
  
  // 4. Balance improvements
  const saturations = colors.map(c => hexToHsl(c).s);
  const avgSaturation = saturations.reduce((sum, s) => sum + s, 0) / saturations.length;
  
  if (avgSaturation < 30) {
    insights.push('Low color saturation - palette may appear dull');
    
    // Suggest a more saturated version of an existing color
    const mostSaturatedIdx = saturations.indexOf(Math.max(...saturations));
    const baseColor = colors[mostSaturatedIdx];
    const hsl = hexToHsl(baseColor);
    const saturatedColor = hslToHex(hsl.h, Math.min(85, hsl.s + 40), hsl.l);
    
    recommendations.push({
      color: saturatedColor,
      reason: 'Add vibrant color to energize the palette',
      category: 'harmony',
      impact: {
        harmonyImprovement: 20,
        accessibilityImprovement: 0,
        contrastPairsAdded: 0,
      },
      priority: 'low',
    });
  }
  
  // 5. Suggest accessible color pairs
  if (colors.length >= 2) {
    let hasGoodPair = false;
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const ratio = getContrastRatio(colors[i], colors[j]);
        if (ratio >= 7) {
          hasGoodPair = true;
          break;
        }
      }
      if (hasGoodPair) break;
    }
    
    if (!hasGoodPair) {
      // Create an accessible complement to the darkest color
      const darkestColor = colors.reduce((darkest, color) => {
        return hexToHsl(color).l < hexToHsl(darkest).l ? color : darkest;
      });
      
      const accessiblePair = adjustColorForContrast(
        hslToHex(hexToHsl(darkestColor).h, 10, 95),
        darkestColor,
        7
      );
      
      recommendations.push({
        color: accessiblePair,
        reason: 'Add AAA-compliant color pair for maximum accessibility',
        category: 'accessibility',
        impact: {
          harmonyImprovement: 5,
          accessibilityImprovement: 35,
          contrastPairsAdded: colors.length,
        },
        priority: 'high',
      });
    }
  }
  
  // Sort recommendations by priority and impact
  recommendations.sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const aScore =
      priorityWeight[a.priority] * 100 +
      a.impact.accessibilityImprovement +
      a.impact.harmonyImprovement;
    const bScore =
      priorityWeight[b.priority] * 100 +
      b.impact.accessibilityImprovement +
      b.impact.harmonyImprovement;
    return bScore - aScore;
  });
  
  // Limit to top 6 recommendations
  const topRecommendations = recommendations.slice(0, 6);
  
  return {
    currentScore: {
      harmony: harmonyScore,
      accessibility: accessibilityScore.overallScore,
    },
    recommendations: topRecommendations,
    insights: insights.slice(0, 3),
  };
}

/**
 * Calculate harmony score (simplified version from PaletteAnalytics)
 */
function calculateHarmonyScore(colors: string[]): number {
  if (colors.length === 0) return 0;
  
  const lightColors = colors.filter(c => isLightColor(c)).length;
  const lightDarkRatio = (lightColors / colors.length) * 100;
  
  const saturations = colors.map(c => hexToHsl(c).s);
  const avgSaturation = saturations.reduce((sum, s) => sum + s, 0) / saturations.length;
  const maxSaturation = Math.max(...saturations);
  const minSaturation = Math.min(...saturations);
  const saturationRange = maxSaturation - minSaturation;
  
  const avgBrightness = colors.reduce((sum, color) => {
    const hsl = hexToHsl(color);
    return sum + hsl.l;
  }, 0) / colors.length;
  
  const hues = colors.map(c => hexToHsl(c).h);
  const uniqueHueRanges = new Set(hues.map(h => Math.floor(h / 30))).size;
  const hueDiversity = (uniqueHueRanges / 12) * 100;
  
  let harmonyScore = 0;
  
  if (saturationRange >= 30 && saturationRange <= 70) harmonyScore += 25;
  else if (saturationRange < 30) harmonyScore += 15;
  
  if (avgBrightness >= 40 && avgBrightness <= 60) harmonyScore += 25;
  else if (avgBrightness >= 30 && avgBrightness <= 70) harmonyScore += 15;
  
  if (lightDarkRatio >= 40 && lightDarkRatio <= 60) harmonyScore += 25;
  else if (lightDarkRatio >= 30 && lightDarkRatio <= 70) harmonyScore += 15;
  
  if (hueDiversity >= 25) harmonyScore += 25;
  else if (hueDiversity >= 15) harmonyScore += 15;
  
  return harmonyScore;
}

/**
 * Calculate projected score after adding a color
 */
export function calculateProjectedScore(
  currentColors: string[],
  newColor: string
): {
  harmonyScore: number;
  accessibilityScore: number;
  harmonyChange: number;
  accessibilityChange: number;
} {
  const currentHarmony = calculateHarmonyScore(currentColors);
  const currentAccessibility = scorePaletteAccessibility(currentColors).overallScore;
  
  const newColors = [...currentColors, newColor];
  const newHarmony = calculateHarmonyScore(newColors);
  const newAccessibility = scorePaletteAccessibility(newColors).overallScore;
  
  return {
    harmonyScore: newHarmony,
    accessibilityScore: newAccessibility,
    harmonyChange: newHarmony - currentHarmony,
    accessibilityChange: newAccessibility - currentAccessibility,
  };
}
