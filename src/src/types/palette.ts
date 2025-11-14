/**
 * Core type definitions for the Color Rodeo application
 * 
 * @module types/palette
 */

/**
 * Represents a saved color palette
 */
export interface ColorPalette {
  /** Unique identifier for the palette */
  id: string;
  
  /** User-defined name for the palette */
  name: string;
  
  /** Array of hex color codes */
  colors: string[];
  
  /** Timestamp when the palette was created */
  createdAt: number;
  
  /** Optional description */
  description?: string;
  
  /** Optional tags for categorization */
  tags?: string[];
}

/**
 * Props for ColorSwatch component
 */
export interface ColorSwatchProps {
  /** Hex color code */
  color: string;
  
  /** Callback when remove button is clicked */
  onRemove?: () => void;
  
  /** Whether to show the remove button */
  showRemove?: boolean;
  
  /** Callback when swatch is clicked */
  onClick?: () => void;
  
  /** Whether the swatch is currently selected */
  isSelected?: boolean;
  
  /** Optional label for the color */
  label?: string;
  
  /** Optional size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Color format options for export
 */
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'cmyk';

/**
 * Export format options
 */
export type ExportFormat = 
  | 'css' 
  | 'scss' 
  | 'tailwind' 
  | 'json' 
  | 'js' 
  | 'ts';

/**
 * Color harmony types
 */
export type ColorHarmonyType = 
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'split-complementary'
  | 'monochromatic';

/**
 * WCAG compliance level
 */
export type WCAGLevel = 'AA' | 'AAA';

/**
 * Contrast check result
 */
export interface ContrastResult {
  /** Contrast ratio value */
  ratio: number;
  
  /** Passes WCAG AA for normal text */
  AA: boolean;
  
  /** Passes WCAG AAA for normal text */
  AAA: boolean;
  
  /** Passes WCAG AA for large text */
  AALarge: boolean;
  
  /** Passes WCAG AAA for large text */
  AAALarge: boolean;
}

/**
 * Color information details
 */
export interface ColorInfo {
  /** Hex format */
  hex: string;
  
  /** RGB format */
  rgb: { r: number; g: number; b: number };
  
  /** HSL format */
  hsl: { h: number; s: number; l: number };
  
  /** CMYK format (approximation) */
  cmyk?: { c: number; m: number; y: number; k: number };
  
  /** Color name (if available) */
  name?: string;
}
