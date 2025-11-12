/**
 * Color naming utilities - Generate human-readable color names
 */

import { hexToHsl } from './colorUtils';

interface ColorName {
  name: string;
  description: string;
}

// Base hue names (0-360 degrees)
const hueNames: { max: number; name: string }[] = [
  { max: 15, name: 'Red' },
  { max: 45, name: 'Orange' },
  { max: 70, name: 'Yellow' },
  { max: 150, name: 'Green' },
  { max: 200, name: 'Cyan' },
  { max: 260, name: 'Blue' },
  { max: 330, name: 'Purple' },
  { max: 360, name: 'Red' },
];

// Saturation modifiers
const saturationModifiers: { min: number; prefix: string }[] = [
  { min: 0, prefix: 'Gray' },
  { min: 10, prefix: 'Muted' },
  { min: 30, prefix: 'Soft' },
  { min: 50, prefix: '' },
  { min: 70, prefix: 'Vibrant' },
  { min: 90, prefix: 'Vivid' },
];

// Lightness modifiers
const lightnessModifiers: { min: number; prefix: string; suffix: string }[] = [
  { min: 0, prefix: 'Very Dark', suffix: '' },
  { min: 15, prefix: 'Dark', suffix: '' },
  { min: 30, prefix: 'Deep', suffix: '' },
  { min: 45, prefix: '', suffix: '' },
  { min: 60, prefix: '', suffix: 'Light' },
  { min: 75, prefix: '', suffix: 'Pale' },
  { min: 90, prefix: '', suffix: 'Very Pale' },
];

// Descriptive color names database
const descriptiveNames: Record<string, string[]> = {
  Red: ['Crimson', 'Ruby', 'Cherry', 'Rose', 'Scarlet', 'Wine', 'Burgundy', 'Coral'],
  Orange: ['Tangerine', 'Apricot', 'Peach', 'Amber', 'Rust', 'Copper', 'Terracotta'],
  Yellow: ['Gold', 'Lemon', 'Honey', 'Butter', 'Cream', 'Sunshine', 'Mustard'],
  Green: ['Emerald', 'Jade', 'Mint', 'Lime', 'Olive', 'Forest', 'Sage', 'Moss'],
  Cyan: ['Turquoise', 'Teal', 'Aqua', 'Sky', 'Ocean', 'Seafoam'],
  Blue: ['Navy', 'Sapphire', 'Cobalt', 'Azure', 'Cerulean', 'Indigo', 'Denim'],
  Purple: ['Lavender', 'Violet', 'Plum', 'Mauve', 'Orchid', 'Magenta', 'Lilac'],
};

/**
 * Get the base hue name for a hue value
 */
function getHueName(hue: number): string {
  for (const { max, name } of hueNames) {
    if (hue <= max) {
      return name;
    }
  }
  return 'Red';
}

/**
 * Get saturation modifier
 */
function getSaturationModifier(saturation: number): string {
  for (let i = saturationModifiers.length - 1; i >= 0; i--) {
    if (saturation >= saturationModifiers[i].min) {
      return saturationModifiers[i].prefix;
    }
  }
  return '';
}

/**
 * Get lightness modifiers
 */
function getLightnessModifiers(lightness: number): { prefix: string; suffix: string } {
  for (let i = lightnessModifiers.length - 1; i >= 0; i--) {
    if (lightness >= lightnessModifiers[i].min) {
      return {
        prefix: lightnessModifiers[i].prefix,
        suffix: lightnessModifiers[i].suffix,
      };
    }
  }
  return { prefix: '', suffix: '' };
}

/**
 * Get a descriptive color name
 */
function getDescriptiveName(hue: number, saturation: number, lightness: number): string {
  const hueName = getHueName(hue);
  const names = descriptiveNames[hueName] || [];
  
  if (names.length === 0) return hueName;
  
  // Pick name based on lightness and saturation
  if (lightness < 30) {
    return names[names.length - 1] || hueName; // Darker names
  } else if (lightness > 70) {
    return names[0] || hueName; // Lighter names
  } else {
    const index = Math.floor((names.length / 2));
    return names[index] || hueName; // Middle names
  }
}

/**
 * Generate a human-readable name for a color
 * @param hex - Hex color code
 * @param style - Naming style ('simple' or 'descriptive')
 * @returns Color name object
 */
export function getColorName(hex: string, style: 'simple' | 'descriptive' = 'simple'): ColorName {
  const { h, s, l } = hexToHsl(hex);
  
  // Handle grayscale
  if (s < 10) {
    if (l < 10) return { name: 'Black', description: 'Pure black' };
    if (l > 95) return { name: 'White', description: 'Pure white' };
    if (l < 25) return { name: 'Charcoal', description: 'Very dark gray' };
    if (l < 40) return { name: 'Dark Gray', description: 'Dark gray' };
    if (l < 60) return { name: 'Gray', description: 'Medium gray' };
    if (l < 80) return { name: 'Light Gray', description: 'Light gray' };
    return { name: 'Silver', description: 'Very light gray' };
  }
  
  if (style === 'descriptive') {
    const descriptive = getDescriptiveName(h, s, l);
    const lightnessMods = getLightnessModifiers(l);
    
    const parts = [
      lightnessMods.prefix,
      descriptive,
      lightnessMods.suffix,
    ].filter(Boolean);
    
    const name = parts.join(' ');
    return {
      name,
      description: `${s}% saturated, ${l}% lightness`,
    };
  } else {
    // Simple naming
    const hueName = getHueName(h);
    const satMod = getSaturationModifier(s);
    const lightnessMods = getLightnessModifiers(l);
    
    const parts = [
      lightnessMods.prefix,
      satMod,
      hueName,
      lightnessMods.suffix,
    ].filter(Boolean);
    
    const name = parts.join(' ');
    return {
      name,
      description: `Hue: ${Math.round(h)}°, Sat: ${s}%, Light: ${l}%`,
    };
  }
}

/**
 * Get a short color name (1-2 words)
 */
export function getShortColorName(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  
  if (s < 10) {
    if (l < 15) return 'Black';
    if (l > 90) return 'White';
    if (l < 50) return 'Dark Gray';
    return 'Light Gray';
  }
  
  const hueName = getHueName(h);
  
  if (l < 30) return `Dark ${hueName}`;
  if (l > 70) return `Light ${hueName}`;
  
  return hueName;
}

/**
 * Find nearest named CSS color
 */
export function getNearestCSSColorName(hex: string): string {
  const cssColors: Record<string, string> = {
    '#F0F8FF': 'Alice Blue',
    '#FAEBD7': 'Antique White',
    '#00FFFF': 'Aqua',
    '#7FFFD4': 'Aquamarine',
    '#F0FFFF': 'Azure',
    '#F5F5DC': 'Beige',
    '#FFE4C4': 'Bisque',
    '#000000': 'Black',
    '#0000FF': 'Blue',
    '#8A2BE2': 'Blue Violet',
    '#A52A2A': 'Brown',
    '#DEB887': 'Burlywood',
    '#5F9EA0': 'Cadet Blue',
    '#7FFF00': 'Chartreuse',
    '#D2691E': 'Chocolate',
    '#FF7F50': 'Coral',
    '#DC143C': 'Crimson',
    '#00FFFF': 'Cyan',
    '#00008B': 'Dark Blue',
    '#008B8B': 'Dark Cyan',
    '#B8860B': 'Dark Goldenrod',
    '#A9A9A9': 'Dark Gray',
    '#006400': 'Dark Green',
    '#8B008B': 'Dark Magenta',
    '#FF8C00': 'Dark Orange',
    '#9932CC': 'Dark Orchid',
    '#8B0000': 'Dark Red',
    '#E9967A': 'Dark Salmon',
    '#8FBC8F': 'Dark Sea Green',
    '#483D8B': 'Dark Slate Blue',
    '#2F4F4F': 'Dark Slate Gray',
    '#00CED1': 'Dark Turquoise',
    '#9400D3': 'Dark Violet',
    '#FF1493': 'Deep Pink',
    '#00BFFF': 'Deep Sky Blue',
    '#696969': 'Dim Gray',
    '#1E90FF': 'Dodger Blue',
    '#FFD700': 'Gold',
    '#DAA520': 'Goldenrod',
    '#808080': 'Gray',
    '#008000': 'Green',
    '#ADFF2F': 'Green Yellow',
    '#FF69B4': 'Hot Pink',
    '#CD5C5C': 'Indian Red',
    '#4B0082': 'Indigo',
    '#F0E68C': 'Khaki',
    '#E6E6FA': 'Lavender',
    '#7CFC00': 'Lawn Green',
    '#FFFACD': 'Lemon Chiffon',
    '#ADD8E6': 'Light Blue',
    '#F08080': 'Light Coral',
    '#90EE90': 'Light Green',
    '#FFB6C1': 'Light Pink',
    '#FFA07A': 'Light Salmon',
    '#20B2AA': 'Light Sea Green',
    '#87CEFA': 'Light Sky Blue',
    '#B0C4DE': 'Light Steel Blue',
    '#00FF00': 'Lime',
    '#32CD32': 'Lime Green',
    '#FF00FF': 'Magenta',
    '#800000': 'Maroon',
    '#66CDAA': 'Medium Aquamarine',
    '#0000CD': 'Medium Blue',
    '#BA55D3': 'Medium Orchid',
    '#9370DB': 'Medium Purple',
    '#3CB371': 'Medium Sea Green',
    '#48D1CC': 'Medium Turquoise',
    '#C71585': 'Medium Violet Red',
    '#191970': 'Midnight Blue',
    '#FFE4E1': 'Misty Rose',
    '#FFE4B5': 'Moccasin',
    '#000080': 'Navy',
    '#808000': 'Olive',
    '#6B8E23': 'Olive Drab',
    '#FFA500': 'Orange',
    '#FF4500': 'Orange Red',
    '#DA70D6': 'Orchid',
    '#DB7093': 'Pale Violet Red',
    '#FFEFD5': 'Papaya Whip',
    '#FFDAB9': 'Peach Puff',
    '#CD853F': 'Peru',
    '#FFC0CB': 'Pink',
    '#DDA0DD': 'Plum',
    '#B0E0E6': 'Powder Blue',
    '#800080': 'Purple',
    '#FF0000': 'Red',
    '#BC8F8F': 'Rosy Brown',
    '#4169E1': 'Royal Blue',
    '#8B4513': 'Saddle Brown',
    '#FA8072': 'Salmon',
    '#F4A460': 'Sandy Brown',
    '#2E8B57': 'Sea Green',
    '#FFF5EE': 'Seashell',
    '#A0522D': 'Sienna',
    '#C0C0C0': 'Silver',
    '#87CEEB': 'Sky Blue',
    '#6A5ACD': 'Slate Blue',
    '#708090': 'Slate Gray',
    '#00FF7F': 'Spring Green',
    '#4682B4': 'Steel Blue',
    '#D2B48C': 'Tan',
    '#008080': 'Teal',
    '#D8BFD8': 'Thistle',
    '#FF6347': 'Tomato',
    '#40E0D0': 'Turquoise',
    '#EE82EE': 'Violet',
    '#F5DEB3': 'Wheat',
    '#FFFFFF': 'White',
    '#F5F5F5': 'White Smoke',
    '#FFFF00': 'Yellow',
    '#9ACD32': 'Yellow Green',
  };
  
  // Find closest color by calculating color distance
  let minDistance = Infinity;
  let closestName = 'Unknown';
  
  const hexNormalized = hex.toUpperCase();
  
  for (const [cssHex, name] of Object.entries(cssColors)) {
    const distance = colorDistance(hexNormalized, cssHex);
    if (distance < minDistance) {
      minDistance = distance;
      closestName = name;
    }
  }
  
  return closestName;
}

/**
 * Calculate distance between two hex colors
 */
function colorDistance(hex1: string, hex2: string): number {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  
  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}
