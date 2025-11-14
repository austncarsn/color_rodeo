# 🎨 Color Rodeo

**Professional color palette management tool for designers and developers**

A sophisticated web application for creating, managing, and analyzing color palettes with advanced features including accessibility checking, color harmonies, gradient generation, and comprehensive export options.

![Color Rodeo](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-6.0.0-purple)

---

## ✨ Features

### Core Functionality
- **Multi-format Color Input**: Supports HEX, RGB, HSL formats with auto-normalization
- **Paste Multiple Colors**: Batch paste hex codes with automatic duplicate filtering
- **Drag & Drop Reordering**: Intuitive palette organization
- **Live Color Preview**: Real-time color visualization with copy-to-clipboard
- **Undo/Redo System**: Full history management for all palette operations

### Generation Tools
- **Palette Generator**: Create harmonious color schemes from base colors
- **Color Harmonies**: Generate complementary, analogous, triadic, tetradic, and split-complementary schemes
- **Gradient Generator**: Create smooth color gradients with customizable stops
- **Color Scales**: Generate tint and shade variations (50-900 scales)

### Analysis & Accessibility
- **WCAG Compliance Checker**: Real-time contrast ratio analysis (AA/AAA)
- **Contrast Matrix**: Complete contrast comparison between all palette colors
- **Color Inspector**: Detailed color information (HEX, RGB, HSL, CMYK)
- **Accessibility Scores**: Visual indicators for text readability

### Export & Integration
- **Multiple Export Formats**: 
  - CSS Variables
  - SCSS Variables
  - Tailwind Config
  - JSON
  - JavaScript/TypeScript Objects
- **Code Generation**: Ready-to-use code snippets
- **Import/Export**: Save and share palettes as JSON
- **localStorage Persistence**: Automatic palette saving

### User Experience
- **Dark/Light Mode**: Full theme support with smooth transitions
- **Keyboard Shortcuts**: Efficient workflow navigation
- **Responsive Design**: Optimized for all screen sizes
- **Toast Notifications**: Rich feedback system
- **Preset Palettes**: Quick-start templates for common use cases

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/color-rodeo.git

# Navigate to project directory
cd color-rodeo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

---

## 🎯 Usage

### Creating a Palette

1. **Enter a Base Color**: Input a color in the hero section (HEX, RGB, or HSL)
2. **Generate Palette**: Click "Generate Palette" or use a preset
3. **Adjust Colors**: Click any color to open the color inspector
4. **Reorder**: Drag and drop colors to reorganize
5. **Save**: Name and save your palette for later use

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save current palette |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Y` | Redo last action |
| `Shift + ?` | Toggle shortcuts help |
| `Esc` | Close panels/dialogs |

### Color Formats

```javascript
// HEX (with or without #)
#FF5733
FF5733

// RGB
rgb(255, 87, 51)

// HSL
hsl(10, 100%, 60%)
```

---

## 🏗️ Project Structure

```
color-rodeo/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── ColorSwatch/    # Color display components
│   │   └── ...             # Feature components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   │   ├── colorUtils.ts   # Color manipulation
│   │   ├── colorHarmony.ts # Harmony algorithms
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # App constants
│   ├── styles/             # Global styles
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── public/                 # Static assets
├── components/             # Root-level shared components
├── docs/                   # Documentation
└── package.json
```

---

## 🛠️ Technology Stack

### Core
- **React 18.3** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite 6.0** - Build tool & dev server

### UI/Styling
- **Tailwind CSS 4.0** - Utility-first CSS
- **Shadcn/ui** - Component library
- **Lucide React** - Icon system
- **Sonner** - Toast notifications

### Libraries
- **chroma-js** - Color manipulation
- **Motion (Framer Motion)** - Animations
- **react-dnd** - Drag and drop

---

## 🎨 Design System

### Color Palette
```css
/* Light Mode */
--background: #fafafa;
--foreground: #0a0a0a;
--accent: #F2C46B; /* Saffron */

/* Dark Mode */
--background: #151518; /* Graphite */
--foreground: #F5F5F7;
--accent: #F2C46B; /* Saffron */
```

### Typography
- **Headings**: Bebas Neue (Display font)
- **Body**: Satoshi (Professional sans-serif)

### Principles
- **Minimalist Design**: Clean, uncluttered interface
- **Professional Aesthetics**: Tool-focused, not playful
- **Accessibility First**: WCAG AAA compliance targets
- **Responsive**: Mobile-first approach

---

## 🔧 Configuration

### Vite Config
The project uses Vite with React plugin and TypeScript paths resolution.

### TypeScript
Strict mode enabled with comprehensive type checking.

### Tailwind
Custom design tokens in `styles/globals.css`

---

## 📚 API Reference

### Core Components

#### `PaletteManager`
Manages the main color palette display and interactions.

```tsx
<PaletteManager
  onSavePalette={(name, colors) => void}
  loadedColors={string[]}
  onColorsChange={(colors) => void}
  selectedColorIndex={number | null}
  onSelectColor={(index) => void}
/>
```

#### `ColorInspector`
Detailed color information drawer.

```tsx
<ColorInspector
  color={string}
  onClose={() => void}
/>
```

### Utility Functions

#### `generateColorHarmony`
```typescript
generateColorHarmony(
  baseColor: string,
  type: 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary'
): string[]
```

#### `checkContrast`
```typescript
checkContrast(
  foreground: string,
  background: string
): {
  ratio: number;
  AA: boolean;
  AAA: boolean;
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow existing code style and conventions
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed
5. Ensure TypeScript types are properly defined

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- **Shadcn/ui** - Beautiful, accessible components
- **Tailwind CSS** - Utility-first CSS framework
- **Chroma.js** - Color manipulation library
- **Vercel** - Hosting platform

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Built with ❤️ for designers and developers**

*Color Rodeo - Where colors come to play professionally*
