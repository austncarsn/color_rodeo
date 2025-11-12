/**
 * Gradient generation and utilities
 */

import { hexToRgb, rgbToHex, hexToHsl, hslToHex } from './colorUtils';

export type GradientType = 'linear' | 'radial' | 'conic';
export type GradientDirection = 
  | 'to right'
  | 'to left'
  | 'to top'
  | 'to bottom'
  | 'to top right'
  | 'to top left'
  | 'to bottom right'
  | 'to bottom left';

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface Gradient {
  type: GradientType;
  direction?: GradientDirection;
  angle?: number;
  stops: GradientStop[];
}

/**
 * Generate gradient stops between two colors
 * @param color1 - Start color (hex)
 * @param color2 - End color (hex)
 * @param steps - Number of intermediate steps
 * @param method - Interpolation method
 * @returns Array of hex colors
 */
export function generateGradient(
  color1: string,
  color2: string,
  steps: number = 5,
  method: 'rgb' | 'hsl' = 'rgb'
): string[] {
  if (steps < 2) return [color1, color2];
  
  const colors: string[] = [];
  
  if (method === 'rgb') {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
      const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
      const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
      colors.push(rgbToHex(r, g, b));
    }
  } else {
    const hsl1 = hexToHsl(color1);
    const hsl2 = hexToHsl(color2);
    
    // Handle hue interpolation (shortest path around color wheel)
    let hueDiff = hsl2.h - hsl1.h;
    if (Math.abs(hueDiff) > 180) {
      if (hueDiff > 0) {
        hueDiff -= 360;
      } else {
        hueDiff += 360;
      }
    }
    
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      let h = hsl1.h + hueDiff * t;
      if (h < 0) h += 360;
      if (h >= 360) h -= 360;
      
      const s = Math.round(hsl1.s + (hsl2.s - hsl1.s) * t);
      const l = Math.round(hsl1.l + (hsl2.l - hsl1.l) * t);
      colors.push(hslToHex(h, s, l));
    }
  }
  
  return colors;
}

/**
 * Generate multi-stop gradient
 * @param colors - Array of colors
 * @param steps - Total number of colors to generate
 * @returns Array of hex colors
 */
export function generateMultiStopGradient(colors: string[], steps: number = 10): string[] {
  if (colors.length < 2) return colors;
  if (steps < colors.length) return colors;
  
  const result: string[] = [];
  const stepsPerSegment = Math.floor(steps / (colors.length - 1));
  
  for (let i = 0; i < colors.length - 1; i++) {
    const segmentColors = generateGradient(
      colors[i],
      colors[i + 1],
      i === colors.length - 2 ? steps - result.length + 1 : stepsPerSegment
    );
    
    // Avoid duplicates at segment boundaries
    result.push(...(i === 0 ? segmentColors : segmentColors.slice(1)));
  }
  
  return result;
}

/**
 * Generate CSS linear gradient string
 * @param gradient - Gradient configuration
 * @returns CSS gradient string
 */
export function generateLinearGradientCSS(gradient: Gradient): string {
  const direction = gradient.direction || 'to right';
  const stops = gradient.stops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');
  
  return `linear-gradient(${direction}, ${stops})`;
}

/**
 * Generate CSS radial gradient string
 * @param gradient - Gradient configuration
 * @returns CSS gradient string
 */
export function generateRadialGradientCSS(gradient: Gradient): string {
  const stops = gradient.stops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');
  
  return `radial-gradient(circle, ${stops})`;
}

/**
 * Generate CSS conic gradient string
 * @param gradient - Gradient configuration
 * @returns CSS gradient string
 */
export function generateConicGradientCSS(gradient: Gradient): string {
  const angle = gradient.angle || 0;
  const stops = gradient.stops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');
  
  return `conic-gradient(from ${angle}deg, ${stops})`;
}

/**
 * Generate CSS gradient string
 * @param gradient - Gradient configuration
 * @returns CSS gradient string
 */
export function generateGradientCSS(gradient: Gradient): string {
  switch (gradient.type) {
    case 'linear':
      return generateLinearGradientCSS(gradient);
    case 'radial':
      return generateRadialGradientCSS(gradient);
    case 'conic':
      return generateConicGradientCSS(gradient);
  }
}

/**
 * Create gradient object from colors
 * @param colors - Array of colors
 * @param type - Gradient type
 * @param direction - Gradient direction
 * @returns Gradient object
 */
export function createGradient(
  colors: string[],
  type: GradientType = 'linear',
  direction: GradientDirection = 'to right'
): Gradient {
  const stops: GradientStop[] = colors.map((color, index) => ({
    color,
    position: (index / (colors.length - 1)) * 100,
  }));
  
  return {
    type,
    direction: type === 'linear' ? direction : undefined,
    stops,
  };
}

/**
 * Generate SVG linear gradient definition
 * @param id - Gradient ID
 * @param gradient - Gradient configuration
 * @returns SVG gradient element string
 */
export function generateSVGLinearGradient(id: string, gradient: Gradient): string {
  const coords = getSVGGradientCoordinates(gradient.direction || 'to right');
  const stops = gradient.stops
    .map(
      stop =>
        `<stop offset="${stop.position}%" stop-color="${stop.color}" />`
    )
    .join('\n    ');
  
  return `<linearGradient id="${id}" x1="${coords.x1}" y1="${coords.y1}" x2="${coords.x2}" y2="${coords.y2}">
    ${stops}
  </linearGradient>`;
}

/**
 * Generate SVG radial gradient definition
 * @param id - Gradient ID
 * @param gradient - Gradient configuration
 * @returns SVG gradient element string
 */
export function generateSVGRadialGradient(id: string, gradient: Gradient): string {
  const stops = gradient.stops
    .map(
      stop =>
        `<stop offset="${stop.position}%" stop-color="${stop.color}" />`
    )
    .join('\n    ');
  
  return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">
    ${stops}
  </radialGradient>`;
}

/**
 * Get SVG gradient coordinates from direction
 */
function getSVGGradientCoordinates(direction: GradientDirection): {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
} {
  const coords: Record<GradientDirection, { x1: string; y1: string; x2: string; y2: string }> = {
    'to right': { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
    'to left': { x1: '100%', y1: '0%', x2: '0%', y2: '0%' },
    'to bottom': { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
    'to top': { x1: '0%', y1: '100%', x2: '0%', y2: '0%' },
    'to bottom right': { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
    'to bottom left': { x1: '100%', y1: '0%', x2: '0%', y2: '100%' },
    'to top right': { x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
    'to top left': { x1: '100%', y1: '100%', x2: '0%', y2: '0%' },
  };
  
  return coords[direction];
}

/**
 * Generate gradient preview data URL
 * @param gradient - Gradient configuration
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Data URL
 */
export function generateGradientPreview(
  gradient: Gradient,
  width: number = 300,
  height: number = 100
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  let gradientObj: CanvasGradient;
  
  if (gradient.type === 'linear') {
    const coords = getCanvasGradientCoordinates(gradient.direction || 'to right', width, height);
    gradientObj = ctx.createLinearGradient(coords.x1, coords.y1, coords.x2, coords.y2);
  } else if (gradient.type === 'radial') {
    gradientObj = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    );
  } else {
    // Conic gradients not supported in canvas, use linear as fallback
    gradientObj = ctx.createLinearGradient(0, 0, width, 0);
  }
  
  gradient.stops.forEach(stop => {
    gradientObj.addColorStop(stop.position / 100, stop.color);
  });
  
  ctx.fillStyle = gradientObj;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

/**
 * Get canvas gradient coordinates from direction
 */
function getCanvasGradientCoordinates(
  direction: GradientDirection,
  width: number,
  height: number
): { x1: number; y1: number; x2: number; y2: number } {
  const coords: Record<
    GradientDirection,
    { x1: number; y1: number; x2: number; y2: number }
  > = {
    'to right': { x1: 0, y1: 0, x2: width, y2: 0 },
    'to left': { x1: width, y1: 0, x2: 0, y2: 0 },
    'to bottom': { x1: 0, y1: 0, x2: 0, y2: height },
    'to top': { x1: 0, y1: height, x2: 0, y2: 0 },
    'to bottom right': { x1: 0, y1: 0, x2: width, y2: height },
    'to bottom left': { x1: width, y1: 0, x2: 0, y2: height },
    'to top right': { x1: 0, y1: height, x2: width, y2: 0 },
    'to top left': { x1: width, y1: height, x2: 0, y2: 0 },
  };
  
  return coords[direction];
}

/**
 * Export gradient as Tailwind CSS classes
 * @param gradient - Gradient configuration
 * @param className - Custom class name
 * @returns Tailwind CSS class configuration
 */
export function exportGradientTailwind(gradient: Gradient, className: string = 'gradient'): string {
  const direction = gradient.direction || 'to right';
  const directionMap: Record<string, string> = {
    'to right': 'bg-gradient-to-r',
    'to left': 'bg-gradient-to-l',
    'to bottom': 'bg-gradient-to-b',
    'to top': 'bg-gradient-to-t',
    'to bottom right': 'bg-gradient-to-br',
    'to bottom left': 'bg-gradient-to-bl',
    'to top right': 'bg-gradient-to-tr',
    'to top left': 'bg-gradient-to-tl',
  };
  
  const tailwindDirection = gradient.type === 'linear' 
    ? directionMap[direction] || 'bg-gradient-to-r'
    : 'bg-radial'; // Note: radial not standard in Tailwind
  
  return `/* Add to your Tailwind config */
.${className} {
  @apply ${tailwindDirection};
  background-image: ${generateGradientCSS(gradient)};
}`;
}
