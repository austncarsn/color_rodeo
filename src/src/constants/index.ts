/**
 * Application-wide constants and configuration
 * 
 * @module constants
 */

// ========================================
// STORAGE KEYS
// ========================================

/**
 * LocalStorage keys for data persistence
 */
export const STORAGE_KEYS = {
  /** Key for storing color palettes */
  COLOR_PALETTES: 'colorPalettes',
  
  /** Key for storing theme preference */
  THEME_PREFERENCE: 'themePreference',
  
  /** Key for storing user preferences */
  USER_PREFERENCES: 'userPreferences',
} as const;

// ========================================
// UI TEXT & MESSAGES
// ========================================

/**
 * UI text constants and configuration
 */
export const UI_TEXT = {
  /** Duration to show copy feedback (milliseconds) */
  COPY_FEEDBACK_DURATION: 2000,
  
  /** Placeholder text for color input */
  PLACEHOLDER_INPUT: '#FF5733 or rgb(255,87,51) or hsl(10,100%,60%)',
  
  /** Message when palette is empty */
  EMPTY_PALETTE_MESSAGE: 'No colors added yet',
  
  /** Hint for empty palette */
  EMPTY_PALETTE_HINT: 'Start by adding colors in hex, RGB, or HSL format',
  
  /** Message when no saved palettes exist */
  EMPTY_SAVED_MESSAGE: 'No saved palettes yet',
  
  /** Hint for saving first palette */
  EMPTY_SAVED_HINT: 'Create and save your first palette!',
  
  /** Success messages */
  SUCCESS_MESSAGES: {
    PALETTE_SAVED: 'Palette saved successfully',
    PALETTE_DELETED: 'Palette deleted',
    PALETTE_LOADED: 'Palette loaded',
    COLOR_COPIED: 'Color copied to clipboard',
    PALETTE_COPIED: 'Palette copied to clipboard',
    UNDO: 'Undone',
    REDO: 'Redone',
  },
  
  /** Error messages */
  ERROR_MESSAGES: {
    INVALID_COLOR: 'Invalid color format',
    SAVE_FAILED: 'Failed to save palette',
    LOAD_FAILED: 'Failed to load palette',
    COPY_FAILED: 'Failed to copy to clipboard',
  },
} as const;

// ========================================
// VALIDATION PATTERNS
// ========================================

/**
 * Regex patterns for color validation
 */
export const PATTERNS = {
  /** Matches hex colors (with or without #) */
  HEX_COLOR: /#?[0-9A-F]{6}/gi,
  
  /** Matches RGB format */
  RGB_COLOR: /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i,
  
  /** Matches HSL format */
  HSL_COLOR: /^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i,
} as const;

// ========================================
// COLOR LIMITS
// ========================================

/**
 * Limits for color palette operations
 */
export const LIMITS = {
  /** Maximum number of colors in a palette */
  MAX_PALETTE_COLORS: 20,
  
  /** Maximum number of saved palettes */
  MAX_SAVED_PALETTES: 100,
  
  /** Maximum undo history items */
  MAX_UNDO_HISTORY: 50,
} as const;

// ========================================
// DEFAULT VALUES
// ========================================

/**
 * Default configuration values
 */
export const DEFAULTS = {
  /** Default palette name */
  PALETTE_NAME: 'Untitled Palette',
  
  /** Default number of colors to generate */
  GENERATION_COUNT: 5,
  
  /** Default color harmony type */
  HARMONY_TYPE: 'complementary' as const,
  
  /** Default export format */
  EXPORT_FORMAT: 'css' as const,
} as const;

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

/**
 * Keyboard shortcut definitions
 */
export const SHORTCUTS = {
  SAVE: { key: 's', ctrl: true, description: 'Save current palette' },
  UNDO: { key: 'z', ctrl: true, description: 'Undo last action' },
  REDO: { key: 'y', ctrl: true, description: 'Redo last action' },
  HELP: { key: '?', shift: true, description: 'Show keyboard shortcuts' },
  CLOSE: { key: 'Escape', description: 'Close panels/dialogs' },
} as const;

// ========================================
// WCAG STANDARDS
// ========================================

/**
 * WCAG contrast ratio requirements
 */
export const WCAG = {
  /** Minimum contrast ratio for AA normal text */
  AA_NORMAL: 4.5,
  
  /** Minimum contrast ratio for AA large text */
  AA_LARGE: 3.0,
  
  /** Minimum contrast ratio for AAA normal text */
  AAA_NORMAL: 7.0,
  
  /** Minimum contrast ratio for AAA large text */
  AAA_LARGE: 4.5,
} as const;

// ========================================
// PRESET PALETTES
// ========================================

/**
 * Predefined color palettes for quick start
 */
export const PRESET_PALETTES = {
  MODERN_BLUES: ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
  SUNSET: ['#7C2D12', '#EA580C', '#FB923C', '#FCD34D', '#FEF3C7'],
  FOREST: ['#14532D', '#16A34A', '#4ADE80', '#86EFAC', '#D1FAE5'],
  MONOCHROME: ['#0A0A0A', '#404040', '#737373', '#A3A3A3', '#E5E5E5'],
  PASTEL: ['#FDE2E4', '#FAD2E1', '#E2ECE9', '#BEE1E6', '#DFE7FD'],
} as const;

// ========================================
// ANIMATION TIMINGS
// ========================================

/**
 * Animation duration constants (milliseconds)
 */
export const ANIMATIONS = {
  /** Quick transition */
  FAST: 150,
  
  /** Normal transition */
  NORMAL: 300,
  
  /** Slow transition */
  SLOW: 500,
  
  /** Toast notification duration */
  TOAST_DURATION: 3000,
} as const;
