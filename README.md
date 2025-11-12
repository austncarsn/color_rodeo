# Color Rodeo

A minimalist color palette generator and manager with smart input parsing, duplicate filtering, and local storage capabilities.

## Features

### 🎨 Smart Color Input
- Paste multiple hex codes at once (separated by commas, spaces, or other characters)
- Automatic duplicate filtering
- Normalizes different hex formats (#RGB, #RRGGBB, with or without #)
- Real-time palette generation

### 📋 Copy to Clipboard
- Click any color swatch to copy its hex code
- Copy entire palettes with one click
- Visual feedback for successful copies

### 💾 Local Storage
- Save your favorite palettes
- Persistent storage using localStorage
- Load saved palettes anytime

### 🎯 Clean Design
- Minimalist, sophisticated aesthetic
- Monochromatic color scheme (#0a0a0a and #fafafa)
- Satoshi font throughout
- Fully responsive

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

## Technologies

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## Usage

1. **Add Colors**: Paste hex codes into the input field (e.g., `#ff0000, #00ff00, #0000ff`)
2. **View Palette**: Colors automatically appear as swatches
3. **Copy Colors**: Click any swatch to copy its hex code
4. **Save Palettes**: Store your favorite combinations for later use
5. **Manage Palettes**: Load, edit, or delete saved palettes

## Color Format Support

The app supports various hex color formats:
- `#RGB` (e.g., `#f00`)
- `#RRGGBB` (e.g., `#ff0000`)
- With or without `#` prefix

## License

MIT
