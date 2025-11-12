/**
 * Application-wide constants
 */

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  COLOR_PALETTES: 'colorPalettes',
} as const;

/**
 * UI text and messages
 */
export const UI_TEXT = {
  COPY_FEEDBACK_DURATION: 2000, // milliseconds
  PLACEHOLDER_INPUT: '#FF5733 or rgb(255,87,51) or hsl(10,100%,60%)',
  EMPTY_PALETTE_MESSAGE: 'No colors added yet',
  EMPTY_PALETTE_HINT: 'Start by adding colors in hex, RGB, or HSL format',
  EMPTY_SAVED_MESSAGE: 'No saved palettes yet',
  EMPTY_SAVED_HINT: 'Create and save your first palette!',
} as const;

/**
 * Regex patterns for color validation
 */
export const PATTERNS = {
  HEX_COLOR: /#?[0-9A-F]{6}/gi,
} as const;