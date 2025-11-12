# Color Rodeo

A professional color palette generator and manager with advanced tools for designers and developers. Features smart input parsing, automatic duplicate filtering, color harmony generation, accessibility checking, and comprehensive export options.

## Features

### 🎨 Smart Color Input
- Paste multiple hex codes at once (separated by commas, spaces, or other characters)
- Automatic duplicate filtering and validation
- Normalizes different hex formats (#RGB, #RRGGBB, with or without #)
- Real-time palette generation and preview
- Drag-and-drop color reordering

### 📋 Copy to Clipboard
- Click any color swatch to copy its hex code
- Copy entire palettes with one click
- Export palettes in multiple formats (JSON, CSS, SCSS, Tailwind)
- Visual feedback for all clipboard operations

### 🎨 Advanced Color Tools
- **Color Harmony**: Generate complementary, analogous, triadic, and tetradic color schemes
- **Gradient Generator**: Create smooth color gradients from your palette
- **Color Scales**: Generate tint and shade variations for each color
- **Color Adjustment**: Fine-tune hue, saturation, lightness, and brightness
- **Palette Utilities**: Sort, shuffle, reverse, and extract colors from palettes

### ♿ Accessibility Features
- **WCAG Compliance Checking**: Verify text/background color contrast ratios
- **Contrast Matrix**: View contrast ratios between all palette colors
- **AA/AAA Level Indicators**: Clear visual indicators for accessibility standards
- **Smart Suggestions**: Get recommendations for accessible color combinations

### 💾 Storage & Management
- Save unlimited palettes to localStorage
- Name and organize your color schemes
- Quick load and delete operations
- Import/export palettes as JSON files
- Undo/redo support for all palette operations

### ⌨️ Keyboard Shortcuts
- `Ctrl+S` - Save current palette
- `Ctrl+Z` - Undo last action
- `Ctrl+Y` - Redo last action
- `Shift+?` - Show keyboard shortcuts

### 🎯 Design & UX
- Minimalist, sophisticated aesthetic
- Monochromatic color scheme (#0a0a0a and #fafafa)
- Satoshi font throughout
- Fully responsive design
- Dark mode support
- Smooth animations and transitions

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technologies

- **React 18** - Modern UI framework
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon library
- **Sonner** - Elegant toast notifications

## Usage

### Basic Workflow

1. **Add Colors**: Paste hex codes into the input field
   ```
   #ff0000, #00ff00, #0000ff
   ```

2. **Generate Palettes**: Use the palette generator to create random color schemes or explore color harmonies

3. **Copy Colors**: Click any swatch to copy its hex code to clipboard

4. **Adjust Colors**: Select a color and use the adjustment panel to fine-tune it

5. **Check Accessibility**: View contrast ratios and WCAG compliance

6. **Save & Export**: Save palettes locally or export in various formats

### Advanced Features

#### Color Harmony
Generate color schemes based on color theory:
- **Complementary**: Colors opposite on the color wheel
- **Analogous**: Adjacent colors on the color wheel
- **Triadic**: Three evenly-spaced colors
- **Tetradic**: Four colors forming a rectangle
- **Split-Complementary**: Base color plus two adjacent to its complement

#### Export Formats
- **JSON**: Complete palette data
- **CSS Variables**: Custom properties for CSS
- **SCSS Variables**: Sass/SCSS format
- **Tailwind Config**: Ready for tailwind.config.js
- **CSS Color Array**: JavaScript array of color values

#### Palette Utilities
- **Sort**: By hue, saturation, or lightness
- **Shuffle**: Randomize color order
- **Reverse**: Flip palette order
- **Extract**: Get dominant colors from images

## Color Format Support

The app supports various hex color formats:
- **3-digit hex**: `#f00` or `f00`
- **6-digit hex**: `#ff0000` or `ff0000`
- **With or without #**: Both formats work seamlessly

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Modern mobile browsers

## License

MIT
