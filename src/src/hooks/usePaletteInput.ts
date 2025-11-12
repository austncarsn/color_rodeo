import { useState, useCallback } from 'react';
import { extractHexCodes, removeDuplicateColors, parseColorInput } from '../lib/colorUtils';

/**
 * Custom hook for managing palette color input
 * Handles adding, removing, and validating colors
 * Supports hex, RGB, and HSL color formats
 */
export function usePaletteInput(initialColors: string[] = []) {
  const [colors, setColors] = useState<string[]>(initialColors);
  const [inputValue, setInputValue] = useState('');

  const addColors = useCallback(
    (input: string) => {
      if (!input.trim()) return;

      // First try to extract hex codes (supports multiple hex codes)
      const hexCodes = extractHexCodes(input);
      
      if (hexCodes.length > 0) {
        // Combine existing and new colors, then remove duplicates
        const allColors = [...colors, ...hexCodes];
        const uniqueColors = removeDuplicateColors(allColors);
        setColors(uniqueColors);
        setInputValue('');
        return;
      }

      // If no hex codes found, try parsing as single RGB or HSL value
      const parsedColor = parseColorInput(input);
      if (parsedColor) {
        const allColors = [...colors, parsedColor];
        const uniqueColors = removeDuplicateColors(allColors);
        setColors(uniqueColors);
        setInputValue('');
      }
    },
    [colors]
  );

  const removeColor = useCallback((index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearColors = useCallback(() => {
    setColors([]);
  }, []);

  const loadColors = useCallback((newColors: string[]) => {
    setColors(newColors);
  }, []);

  return {
    colors,
    inputValue,
    setInputValue,
    addColors,
    removeColor,
    clearColors,
    loadColors,
  };
}