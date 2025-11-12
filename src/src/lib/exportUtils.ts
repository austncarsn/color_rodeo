/**
 * Export utilities for color palettes
 */

import type { ColorPalette } from '../types/palette';
import { formatColor } from './colorUtils';

export type ExportFormat = 'json' | 'css' | 'scss' | 'tailwind';

/**
 * Exports a palette as JSON
 * @param palette - Color palette to export
 * @returns JSON string
 */
export function exportAsJSON(palette: ColorPalette): string {
  return JSON.stringify(palette, null, 2);
}

/**
 * Exports multiple palettes as JSON
 * @param palettes - Array of color palettes
 * @returns JSON string
 */
export function exportPalettesAsJSON(palettes: ColorPalette[]): string {
  return JSON.stringify(palettes, null, 2);
}

/**
 * Exports a palette as CSS custom properties
 * @param palette - Color palette to export
 * @returns CSS string with custom properties
 */
export function exportAsCSS(palette: ColorPalette): string {
  const paletteName = palette.name.toLowerCase().replace(/\s+/g, '-');
  let css = `:root {\n`;
  css += `  /* ${palette.name} */\n`;
  
  palette.colors.forEach((color, index) => {
    const varName = `--color-${paletteName}-${index + 1}`;
    css += `  ${varName}: ${color};\n`;
  });
  
  css += `}\n`;
  return css;
}

/**
 * Exports a palette as SCSS variables
 * @param palette - Color palette to export
 * @returns SCSS string with variables
 */
export function exportAsSCSS(palette: ColorPalette): string {
  const paletteName = palette.name.toLowerCase().replace(/\s+/g, '-');
  let scss = `// ${palette.name}\n`;
  
  palette.colors.forEach((color, index) => {
    const varName = `$color-${paletteName}-${index + 1}`;
    scss += `${varName}: ${color};\n`;
  });
  
  return scss;
}

/**
 * Exports a palette as Tailwind CSS configuration
 * @param palette - Color palette to export
 * @returns JavaScript object string for Tailwind config
 */
export function exportAsTailwind(palette: ColorPalette): string {
  const paletteName = palette.name.toLowerCase().replace(/\s+/g, '-');
  let config = `// Add to your tailwind.config.js\n`;
  config += `module.exports = {\n`;
  config += `  theme: {\n`;
  config += `    extend: {\n`;
  config += `      colors: {\n`;
  config += `        '${paletteName}': {\n`;
  
  palette.colors.forEach((color, index) => {
    config += `          ${(index + 1) * 100}: '${color}',\n`;
  });
  
  config += `        },\n`;
  config += `      },\n`;
  config += `    },\n`;
  config += `  },\n`;
  config += `}\n`;
  
  return config;
}

/**
 * Exports palette in the specified format
 * @param palette - Color palette to export
 * @param format - Export format
 * @returns Formatted string
 */
export function exportPalette(palette: ColorPalette, format: ExportFormat): string {
  switch (format) {
    case 'json':
      return exportAsJSON(palette);
    case 'css':
      return exportAsCSS(palette);
    case 'scss':
      return exportAsSCSS(palette);
    case 'tailwind':
      return exportAsTailwind(palette);
    default:
      return exportAsJSON(palette);
  }
}

/**
 * Downloads a file with the given content
 * @param content - File content
 * @param filename - Name of the file to download
 * @param mimeType - MIME type of the file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gets the appropriate file extension for a format
 * @param format - Export format
 * @returns File extension
 */
export function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case 'json':
      return 'json';
    case 'css':
      return 'css';
    case 'scss':
      return 'scss';
    case 'tailwind':
      return 'js';
    default:
      return 'txt';
  }
}

/**
 * Parses imported JSON palette data
 * @param jsonString - JSON string to parse
 * @returns Parsed palette or array of palettes, or null if invalid
 */
export function importFromJSON(jsonString: string): ColorPalette | ColorPalette[] | null {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate single palette
    if (data && typeof data === 'object' && 'colors' in data && Array.isArray(data.colors)) {
      return {
        id: data.id || Date.now().toString(),
        name: data.name || 'Imported Palette',
        colors: data.colors,
        createdAt: data.createdAt || Date.now(),
      };
    }
    
    // Validate array of palettes
    if (Array.isArray(data)) {
      return data.map((palette, index) => ({
        id: palette.id || `${Date.now()}-${index}`,
        name: palette.name || `Imported Palette ${index + 1}`,
        colors: palette.colors || [],
        createdAt: palette.createdAt || Date.now(),
      }));
    }
    
    return null;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}
