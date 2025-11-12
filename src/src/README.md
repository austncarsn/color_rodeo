# Color Palette Manager - Source Documentation

## Directory Structure

### `/components`
React components organized by feature:
- **ColorSwatch/** - Individual color display and interaction component
- **PaletteManager.tsx** - Main palette creation interface
- **SavedPalettes.tsx** - Display and manage saved palettes
- **ui/** - Reusable UI components (shadcn/ui)

### `/hooks`
Custom React hooks for reusable logic:
- **useLocalStorage** - Syncs state with browser localStorage
- **useCopyToClipboard** - Manages clipboard operations with feedback
- **usePaletteInput** - Handles palette color input and management

### `/lib`
Utility functions and helpers:
- **clipboard.ts** - Cross-browser clipboard operations with fallbacks
- **colorUtils.ts** - Color validation, normalization, and manipulation
- **utils/cn.ts** - Tailwind class name utility

### `/constants`
Application-wide constants:
- Storage keys for localStorage
- UI text and messages
- Regex patterns

### `/types`
TypeScript type definitions:
- **palette.ts** - Core data types for palettes and colors

### `/styles`
Global styles and CSS:
- **globals.css** - Tailwind configuration and custom styles

## Usage Examples

### Using Custom Hooks

```tsx
import { useLocalStorage, useCopyToClipboard, usePaletteInput } from './hooks';

function MyComponent() {
  // Persist state to localStorage
  const [data, setData] = useLocalStorage('myKey', initialValue);
  
  // Copy with feedback
  const { copyWithFeedback, isCopied } = useCopyToClipboard();
  await copyWithFeedback('text', 'id');
  
  // Manage palette colors
  const { colors, addColors, removeColor } = usePaletteInput();
}
```

### Using Color Utilities

```tsx
import { isValidHex, normalizeHex, extractHexCodes, getContrastTextColor } from './lib/colorUtils';

// Validate a hex code
if (isValidHex('#ff5733')) { /* ... */ }

// Normalize various formats
normalizeHex('ff5733'); // Returns '#FF5733'

// Extract from text
extractHexCodes('#ff5733, #33ff57'); // Returns ['#FF5733', '#33FF57']

// Get accessible text color
getContrastTextColor('#000000'); // Returns 'text-white'
```

### Using Constants

```tsx
import { STORAGE_KEYS, UI_TEXT, PATTERNS } from './constants';

localStorage.setItem(STORAGE_KEYS.COLOR_PALETTES, data);
placeholder={UI_TEXT.PLACEHOLDER_INPUT}
```

## Development Guidelines

### Adding New Features
1. Create utilities in `/lib` for business logic
2. Create hooks in `/hooks` for stateful logic
3. Keep components focused on UI rendering
4. Add types to `/types` for shared interfaces
5. Use constants from `/constants` for all text and keys

### Code Style
- Use TypeScript for type safety
- Export utilities as named exports
- Document functions with JSDoc comments
- Use meaningful variable and function names
- Follow React hooks rules and best practices

### State Management
- Use custom hooks for complex state logic
- Keep component state minimal
- Lift state up when needed by multiple components
- Use localStorage via `useLocalStorage` hook

## Testing Considerations

### Testable Units
- All functions in `/lib` are pure and easily testable
- Custom hooks can be tested with `@testing-library/react-hooks`
- Components should have minimal logic, making them easier to test

### Mock Data
```tsx
import type { ColorPalette } from './types/palette';

const mockPalette: ColorPalette = {
  id: '1',
  name: 'Test Palette',
  colors: ['#FF5733', '#33FF57'],
  createdAt: Date.now(),
};
```
