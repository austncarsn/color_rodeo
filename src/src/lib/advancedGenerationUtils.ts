/**
 * Advanced palette generation utilities
 */

import { hslToHex, hexToHsl, rgbToHex, type HSL } from './colorUtils';

// ========================================
// RANDOM PALETTE GENERATION
// ========================================

export type PaletteStyle = 
  | 'vibrant'
  | 'pastel'
  | 'dark'
  | 'light'
  | 'neon'
  | 'earth'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'monochrome';

/**
 * Generate a random palette based on a style
 * @param style - Style of the palette
 * @param count - Number of colors to generate
 * @returns Array of hex colors
 */
export function generateRandomPalette(style: PaletteStyle, count: number = 5): string[] {
  const colors: string[] = [];
  
  switch (style) {
    case 'vibrant':
      colors.push(...generateVibrantPalette(count));
      break;
    case 'pastel':
      colors.push(...generatePastelPalette(count));
      break;
    case 'dark':
      colors.push(...generateDarkPalette(count));
      break;
    case 'light':
      colors.push(...generateLightPalette(count));
      break;
    case 'neon':
      colors.push(...generateNeonPalette(count));
      break;
    case 'earth':
      colors.push(...generateEarthPalette(count));
      break;
    case 'ocean':
      colors.push(...generateOceanPalette(count));
      break;
    case 'sunset':
      colors.push(...generateSunsetPalette(count));
      break;
    case 'forest':
      colors.push(...generateForestPalette(count));
      break;
    case 'monochrome':
      colors.push(...generateMonochromePalette(count));
      break;
  }
  
  return colors;
}

function generateVibrantPalette(count: number): string[] {
  return Array.from({ length: count }, () => {
    const h = Math.floor(Math.random() * 360);
    const s = 70 + Math.floor(Math.random() * 30); // 70-100%
    const l = 45 + Math.floor(Math.random() * 20); // 45-65%
    return hslToHex(h, s, l);
  });
}

function generatePastelPalette(count: number): string[] {
  return Array.from({ length: count }, () => {
    const h = Math.floor(Math.random() * 360);
    const s = 25 + Math.floor(Math.random() * 35); // 25-60%
    const l = 75 + Math.floor(Math.random() * 15); // 75-90%
    return hslToHex(h, s, l);
  });
}

function generateDarkPalette(count: number): string[] {
  return Array.from({ length: count }, () => {
    const h = Math.floor(Math.random() * 360);
    const s = 20 + Math.floor(Math.random() * 50); // 20-70%
    const l = 10 + Math.floor(Math.random() * 25); // 10-35%
    return hslToHex(h, s, l);
  });
}

function generateLightPalette(count: number): string[] {
  return Array.from({ length: count }, () => {
    const h = Math.floor(Math.random() * 360);
    const s = 15 + Math.floor(Math.random() * 30); // 15-45%
    const l = 85 + Math.floor(Math.random() * 10); // 85-95%
    return hslToHex(h, s, l);
  });
}

function generateNeonPalette(count: number): string[] {
  return Array.from({ length: count }, () => {
    const h = Math.floor(Math.random() * 360);
    const s = 90 + Math.floor(Math.random() * 10); // 90-100%
    const l = 50 + Math.floor(Math.random() * 15); // 50-65%
    return hslToHex(h, s, l);
  });
}

function generateEarthPalette(count: number): string[] {
  const earthHues = [20, 30, 40, 50, 60, 100, 120]; // Browns, oranges, greens
  return Array.from({ length: count }, () => {
    const h = earthHues[Math.floor(Math.random() * earthHues.length)];
    const s = 25 + Math.floor(Math.random() * 40); // 25-65%
    const l = 35 + Math.floor(Math.random() * 35); // 35-70%
    return hslToHex(h, s, l);
  });
}

function generateOceanPalette(count: number): string[] {
  const oceanHues = [180, 190, 200, 210, 220]; // Blues and cyans
  return Array.from({ length: count }, () => {
    const h = oceanHues[Math.floor(Math.random() * oceanHues.length)];
    const s = 40 + Math.floor(Math.random() * 50); // 40-90%
    const l = 40 + Math.floor(Math.random() * 40); // 40-80%
    return hslToHex(h, s, l);
  });
}

function generateSunsetPalette(count: number): string[] {
  const sunsetHues = [0, 10, 20, 30, 300, 320]; // Reds, oranges, purples
  return Array.from({ length: count }, () => {
    const h = sunsetHues[Math.floor(Math.random() * sunsetHues.length)];
    const s = 60 + Math.floor(Math.random() * 35); // 60-95%
    const l = 45 + Math.floor(Math.random() * 30); // 45-75%
    return hslToHex(h, s, l);
  });
}

function generateForestPalette(count: number): string[] {
  const forestHues = [80, 90, 100, 110, 120, 130, 140]; // Greens
  return Array.from({ length: count }, () => {
    const h = forestHues[Math.floor(Math.random() * forestHues.length)];
    const s = 30 + Math.floor(Math.random() * 50); // 30-80%
    const l = 25 + Math.floor(Math.random() * 45); // 25-70%
    return hslToHex(h, s, l);
  });
}

function generateMonochromePalette(count: number): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  return Array.from({ length: count }, (_, i) => {
    const l = 15 + (70 / (count - 1)) * i; // Evenly distribute lightness
    const s = 10 + Math.floor(Math.random() * 20); // 10-30%
    return hslToHex(baseHue, s, l);
  });
}

// ========================================
// TRENDING/PRESET PALETTES
// ========================================

export interface PresetPalette {
  name: string;
  colors: string[];
  description: string;
}

export const TRENDING_PALETTES: PresetPalette[] = [
  {
    name: 'Modern Blue',
    colors: ['#0F172A', '#1E40AF', '#3B82F6', '#60A5FA', '#DBEAFE'],
    description: 'Professional and trustworthy',
  },
  {
    name: 'Sunset Vibes',
    colors: ['#7C2D12', '#EA580C', '#FB923C', '#FCD34D', '#FEF3C7'],
    description: 'Warm and energetic',
  },
  {
    name: 'Nature',
    colors: ['#14532D', '#15803D', '#22C55E', '#86EFAC', '#DCFCE7'],
    description: 'Fresh and natural',
  },
  {
    name: 'Purple Dream',
    colors: ['#3B0764', '#6B21A8', '#9333EA', '#C084FC', '#F3E8FF'],
    description: 'Creative and luxurious',
  },
  {
    name: 'Monochrome',
    colors: ['#0A0A0A', '#404040', '#737373', '#A3A3A3', '#E5E5E5'],
    description: 'Timeless and elegant',
  },
  {
    name: 'Candy Pop',
    colors: ['#EC4899', '#F472B6', '#FBCFE8', '#8B5CF6', '#DDD6FE'],
    description: 'Playful and fun',
  },
  {
    name: 'Ocean Deep',
    colors: ['#164E63', '#0E7490', '#06B6D4', '#22D3EE', '#CFFAFE'],
    description: 'Calm and serene',
  },
  {
    name: 'Autumn',
    colors: ['#78350F', '#92400E', '#B45309', '#D97706', '#FDE68A'],
    description: 'Cozy and warm',
  },
];

// ========================================
// IMAGE COLOR EXTRACTION
// ========================================

/**
 * Extract dominant colors from an image
 * Uses k-means clustering algorithm
 * @param imageData - ImageData from canvas
 * @param colorCount - Number of colors to extract
 * @returns Array of hex colors
 */
export function extractColorsFromImage(
  imageData: ImageData,
  colorCount: number = 5
): string[] {
  const pixels: RGB[] = [];
  
  // Sample pixels (every 10th pixel for performance)
  for (let i = 0; i < imageData.data.length; i += 40) {
    pixels.push({
      r: imageData.data[i],
      g: imageData.data[i + 1],
      b: imageData.data[i + 2],
    });
  }
  
  // K-means clustering
  const clusters = kMeansClustering(pixels, colorCount);
  
  // Convert to hex
  return clusters.map(rgb => rgbToHex(rgb.r, rgb.g, rgb.b));
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * K-means clustering to find dominant colors
 */
function kMeansClustering(pixels: RGB[], k: number, maxIterations: number = 10): RGB[] {
  // Initialize random centroids
  let centroids: RGB[] = [];
  for (let i = 0; i < k; i++) {
    const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
    centroids.push({ ...randomPixel });
  }
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Assign pixels to nearest centroid
    const clusters: RGB[][] = Array.from({ length: k }, () => []);
    
    for (const pixel of pixels) {
      let minDist = Infinity;
      let closestCluster = 0;
      
      for (let i = 0; i < k; i++) {
        const dist = colorDistance(pixel, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = i;
        }
      }
      
      clusters[closestCluster].push(pixel);
    }
    
    // Update centroids
    const newCentroids: RGB[] = [];
    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0) {
        newCentroids.push(centroids[i]);
        continue;
      }
      
      const sum = clusters[i].reduce(
        (acc, pixel) => ({
          r: acc.r + pixel.r,
          g: acc.g + pixel.g,
          b: acc.b + pixel.b,
        }),
        { r: 0, g: 0, b: 0 }
      );
      
      newCentroids.push({
        r: Math.round(sum.r / clusters[i].length),
        g: Math.round(sum.g / clusters[i].length),
        b: Math.round(sum.b / clusters[i].length),
      });
    }
    
    centroids = newCentroids;
  }
  
  return centroids;
}

function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Load image from file and extract colors
 * @param file - Image file
 * @param colorCount - Number of colors to extract
 * @returns Promise of hex colors array
 */
export async function extractColorsFromImageFile(
  file: File,
  colorCount: number = 5
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Scale down large images for performance
        const maxSize = 200;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractColorsFromImage(imageData, colorCount);
        
        resolve(colors);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get palette style name
 */
export function getPaletteStyleName(style: PaletteStyle): string {
  const names: Record<PaletteStyle, string> = {
    vibrant: 'Vibrant',
    pastel: 'Pastel',
    dark: 'Dark',
    light: 'Light',
    neon: 'Neon',
    earth: 'Earth Tones',
    ocean: 'Ocean',
    sunset: 'Sunset',
    forest: 'Forest',
    monochrome: 'Monochrome',
  };
  return names[style];
}
