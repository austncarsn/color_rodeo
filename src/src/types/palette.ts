/**
 * Core types for the Color Palette Manager application
 */

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
}

export interface ColorSwatchProps {
  color: string;
  onRemove?: () => void;
  showRemove?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}