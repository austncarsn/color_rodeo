# Color Rodeo 🎨

A professional-grade color palette application that allows designers and developers to input hex codes, generate beautiful palettes, and export to multiple platforms. Built with a clean monochromatic design and powerful color tools.

![Version](https://img.shields.io/badge/version-6.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/react-18+-blue)
![TypeScript](https://img.shields.io/badge/typescript-5+-blue)

## ✨ Features

### 🎨 Core Palette Management
- **Flexible Input**: Add colors via hex, RGB, or HSL formats
- **Bulk Import**: Paste multiple hex codes at once (separated by commas, spaces, or other characters)
- **Smart Duplicate Detection**: Automatically filters out repeated colors
- **Hex Format Normalization**: Handles 3-digit and 6-digit hex codes (#RGB and #RRGGBB)
- **Drag & Drop Reordering**: Organize colors with smooth animations powered by react-dnd
- **Format Conversion**: Toggle between HEX, RGB, and HSL display
- **Undo/Redo History**: Full state management with keyboard shortcuts (Ctrl+Z/Ctrl+Y)
- **LocalStorage Persistence**: Automatically saves palettes locally - never lose your work
- **Copy to Clipboard**: Copy individual colors or entire palettes with one click

### 🌈 Color Generation Tools
- **Random Palettes**: Generate beautiful random color schemes instantly
- **Complementary Colors**: Find perfect color pairs using color theory
- **Analogous Palettes**: Create harmonious adjacent colors
- **Triadic & Tetradic**: Advanced harmony generation
- **Image Color Extraction**: Upload images and extract color palettes
- **Trending Presets**: Popular color combinations ready to use

### 🎯 Color Harmony Visualizer
- **Interactive Color Wheel**: Visual representation of color relationships
- **7 Harmony Types**:
  - Monochromatic (single hue variations)
  - Analogous (adjacent colors)
  - Complementary (opposite on wheel)
  - Split Complementary (base + two adjacent to complement)
  - Triadic (three equally spaced)
  - Tetradic/Double Complementary (four colors, two pairs)
  - Square (four equally spaced)
- **Real-time Preview**: See harmonies before applying to palette
- **Mathematical Precision**: Based on HSL color theory calculations

### 🌅 Gradient Generator
- **3 Gradient Types**: Linear, Radial, and Conic
- **8 Directions**: Full directional control (to top, to bottom, to right, etc.)
- **2 Interpolation Methods**: RGB and HSL color mixing
- **Adjustable Steps**: Generate 2-20 color stops
- **Export Options**: 
  - CSS code (copy to clipboard)
  - SVG download
  - PNG preview
- **Live Preview**: Real-time gradient visualization with your palette colors

### 📊 Color Scales Generator
- **3 Scale Styles**:
  - Material Design (Google's design system)
  - Tailwind (Tailwind CSS compatible)
  - Custom (balanced lightness approach)
- **11 Shades**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **Multiple Export Formats**: 
  - Tailwind config
  - CSS variables
  - SCSS variables
  - JSON
- **Perfect for Design Systems**: Generate complete color scales from a single base color

### 🎭 Accessibility Checker
- **WCAG Compliance**: Checks against AA and AAA standards
- **Precise Contrast Ratios**: Calculated for all color pairs
- **8 Colorblind Simulations**:
  - Protanopia (red-blind)
  - Deuteranopia (green-blind)
  - Tritanopia (blue-blind)
  - Protanomaly (red-weak)
  - Deuteranomaly (green-weak)
  - Tritanomaly (blue-weak)
  - Achromatopsia (total color blindness)
  - Achromatomaly (partial color blindness)
- **Text Contrast Testing**: Large text and normal text evaluation
- **Actionable Recommendations**: Clear suggestions for improvement

### 🔧 Palette Utilities
- **8 Sort Methods**:
  - Hue (rainbow order)
  - Saturation (least to most vivid)
  - Lightness (dark to light)
  - Luminance (perceived brightness)
  - Red/Green/Blue values
  - Reverse order
- **Color Families**: Auto-group colors by hue category
- **Statistics Dashboard**:
  - Color diversity score
  - Hue coverage
  - Average saturation
  - Average lightness
  - Luminance distribution
- **Transform Tools**: Shuffle, reverse, filter similar colors

### 🎯 Color Adjustment Panel
- **Fine-tune Individual Colors**:
  - Hue rotation (0-360°)
  - Saturation adjustment (-100% to +100%)
  - Lightness adjustment (-100% to +100%)
- **Real-time Preview**: See changes instantly
- **Select & Adjust**: Click any color swatch to modify
- **Undo Support**: All adjustments are tracked in history

### 📊 Contrast Matrix
- **Comprehensive Testing**: Every color pair in your palette
- **Visual Grid**: Color-coded compliance indicators
- **WCAG Levels**: AA and AAA for both normal and large text
- **Quick Reference**: Identify problematic combinations at a glance

### 💾 Export Formats

**Web Development**
- JSON (structured data)
- CSS Variables (--color-name format)
- SCSS Variables ($color-name format)
- CSV (spreadsheet compatible)

**Mobile Development**
- Swift (iOS/UIKit - UIColor)
- SwiftUI (Color extensions)
- Kotlin (Jetpack Compose)
- Android XML (colors.xml)
- Flutter/Dart (Color constants)
- React Native (StyleSheet colors)

**Design Tools**
- Figma JSON (direct import)
- Sketch JSON (palette import)
- Procreate (.swatches)
- Adobe ASE (.ase)
- GIMP Palette (.gpl)
- Paint.NET (.txt)
- macOS Color Picker (.clr)

**Other Platforms**
- VS Code Theme (JSON)
- Unity C# (Color32 constants)

### 🎯 Color Naming System
- **Human-Readable Names**: Converts "#1E40AF" to "Deep Sapphire"
- **140+ CSS Named Colors**: Matches against standard web colors
- **2 Naming Styles**:
  - Simple (basic color names)
  - Descriptive (detailed color descriptions)
- **Toggle Display**: Show/hide names on color swatches
- **Export with Names**: Include color names in exports

### ⌨️ Keyboard Shortcuts
- `Ctrl+S` - Save current palette
- `Ctrl+Z` - Undo last action
- `Ctrl+Y` - Redo last action  
- `Shift+?` - Show keyboard shortcuts help

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ or higher
- npm, yarn, or pnpm package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

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

The application will open at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 📖 Usage Guide

### Creating a Palette

**Single Color Entry**
```
Enter in the input field:
#3B82F6
rgb(59, 130, 246)
hsl(217, 91%, 60%)
```

**Multiple Colors at Once**
```
Paste multiple hex codes:
#3B82F6, #8B5CF6, #EC4899
#3B82F6 #8B5CF6 #EC4899
#3B82F6|#8B5CF6|#EC4899
```

The app will:
- Automatically detect and parse all valid hex codes
- Filter out duplicates
- Normalize different hex formats (3-digit → 6-digit)
- Add all unique colors to your palette

**Drag to Reorder**
1. Click and hold any color swatch
2. Drag to desired position
3. Drop to reorder
4. Changes are tracked in undo history

### Generating Color Harmonies

1. Select a base color from your current palette
2. Navigate to the "Harmony" tab
3. Choose a harmony type (Triadic, Complementary, etc.)
4. View the interactive color wheel visualization
5. Click "Apply Harmony to Palette" to use the colors

### Creating Gradients

1. Add at least 2 colors to your palette
2. Go to the "Gradient" tab
3. Select gradient type (Linear/Radial/Conic)
4. Choose direction (8 options for linear)
5. Select interpolation method (RGB or HSL)
6. Adjust number of steps (2-20)
7. Copy CSS code or download as SVG

### Generating Color Scales

1. Select a color from your palette (click to highlight)
2. Navigate to the "Scales" tab  
3. Choose scale method:
   - **Tailwind**: Matches Tailwind CSS scale distribution
   - **Material**: Google Material Design style
   - **Custom**: Balanced lightness approach
4. Enter a name for your scale (e.g., "primary", "blue")
5. Preview the 11 generated shades (50-950)
6. Export in your desired format (Tailwind config, CSS, SCSS, JSON)

### Checking Accessibility

1. Add multiple colors to your palette
2. View the "Accessibility Checker" panel
3. Review contrast ratios between all color pairs
4. Check WCAG compliance (AA and AAA levels)
5. Test colorblind simulations (8 vision types)
6. Read recommendations for improving accessibility
7. Use the Contrast Matrix for a complete overview

### Adjusting Colors

1. Click any color swatch to select it
2. Open the "Color Adjustment Panel"
3. Adjust:
   - **Hue**: Rotate color around the wheel (0-360°)
   - **Saturation**: Make more or less vivid (-100% to +100%)
   - **Lightness**: Make darker or lighter (-100% to +100%)
4. See real-time preview
5. Use Undo (Ctrl+Z) to revert changes

### Saving & Loading Palettes

**Save Palette**
- Click "Save Palette" button
- Enter a name (or use Ctrl+S shortcut)
- Palette appears in "Saved Palettes" section
- Automatically persisted to localStorage

**Load Palette**
- View your saved palettes in the right column
- Click "Load" to apply colors to current palette
- Click "Delete" to remove from saved palettes

### Exporting

**Basic Export**
1. Go to "Basic Export" tab
2. Choose format (JSON, CSS, SCSS, CSV)
3. Click "Copy" or "Download"
4. Paste into your project

**Advanced Export**
1. Go to "Advanced Export" tab
2. Select your platform:
   - Web: CSS, SCSS
   - iOS: Swift, SwiftUI
   - Android: Kotlin, XML
   - Cross-platform: Flutter, React Native
   - Design: Figma, Sketch, Adobe, etc.
3. Enter palette name
4. Preview generated code
5. Copy to clipboard or download file

## 🏗️ Project Structure

```
color-rodeo/
├── src/
│   ├── components/
│   │   ├── AccessibilityChecker.tsx      # WCAG compliance & colorblind sim
│   │   ├── AdvancedExport.tsx            # Multi-platform export
│   │   ├── ColorAdjustmentPanel.tsx      # HSL adjustment controls
│   │   ├── ColorHarmonyVisualizer.tsx    # Interactive color wheel
│   │   ├── ColorScales.tsx               # Scale generation
│   │   ├── ColorSwatch/                  # Reusable swatch component
│   │   │   ├── ColorSwatch.tsx
│   │   │   └── index.ts
│   │   ├── ContrastMatrix.tsx            # All-pairs contrast grid
│   │   ├── DarkModeToggle.tsx            # Theme switcher
│   │   ├── DraggableColorSwatch.tsx      # DnD wrapper for swatches
│   │   ├── ExportImport.tsx              # Basic export/import
│   │   ├── GradientGenerator.tsx         # Gradient creation
│   │   ├── Logo.tsx                      # Animated logo component
│   │   ├── PaletteGenerator.tsx          # Random & harmony generation
│   │   ├── PaletteManager.tsx            # Main palette input/management
│   │   ├── PaletteUtilities.tsx          # Sort, stats, transform
│   │   ├── SavedPalettes.tsx             # LocalStorage palette list
│   │   └── ui/                           # shadcn/ui components
│   ├── hooks/
│   │   ├── index.ts                      # Barrel export
│   │   ├── useCopyToClipboard.ts         # Clipboard utility
│   │   ├── useKeyboardShortcuts.ts       # Keyboard handler
│   │   ├── useLocalStorage.ts            # Persistent storage
│   │   ├── usePaletteInput.ts            # Input parsing & validation
│   │   └── useUndoRedo.ts                # History management
│   ├── lib/
│   │   ├── accessibilityUtils.ts         # WCAG & contrast calculations
│   │   ├── advancedExportUtils.ts        # Platform-specific exports
│   │   ├── advancedGenerationUtils.ts    # Complex generation algorithms
│   │   ├── clipboard.ts                  # Clipboard operations
│   │   ├── colorHarmony.ts               # Harmony calculations
│   │   ├── colorNaming.ts                # Name generation
│   │   ├── colorScales.ts                # Scale algorithms
│   │   ├── colorUtils.ts                 # Color conversion & manipulation
│   │   ├── exportUtils.ts                # Basic export formatting
│   │   ├── gradientUtils.ts              # Gradient generation
│   │   ├── paletteUtils.ts               # Palette operations
│   │   └── utils/
│   │       └── cn.ts                     # Tailwind class merging
│   ├── types/
│   │   └── palette.ts                    # TypeScript interfaces
│   ├── constants/
│   │   └── index.ts                      # App constants
│   ├── styles/
│   │   └── globals.css                   # Global styles & Tailwind
│   └── App.tsx                           # Main application component
├── components/ui/                        # shadcn/ui library
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── tabs.tsx
│   └── ... (30+ components)
├── public/                               # Static assets
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript config
├── tailwind.config.js                    # Tailwind config (if needed)
└── vite.config.ts                        # Vite build config
```

## 🛠️ Technology Stack

**Core**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast dev server & optimized builds)
- **Styling**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui (headless, accessible components)

**Libraries**
- **Drag & Drop**: react-dnd + react-dnd-html5-backend
- **Icons**: lucide-react (beautiful, consistent icons)
- **Notifications**: sonner (modern toast notifications)
- **State Management**: React hooks + custom undo/redo
- **Storage**: localStorage with TypeScript wrappers

**Code Quality**
- **Type Safety**: Full TypeScript coverage
- **Component Architecture**: Modular, reusable components
- **Custom Hooks**: Encapsulated logic for common operations
- **Utility Functions**: Pure functions in `/lib` directory

## 🎨 Design System

**Typography**
- **Font Family**: Satoshi (throughout the app)
- **No Tailwind Font Classes**: Uses custom typography in `globals.css`
- **Responsive Sizing**: Scales appropriately on all devices

**Color Scheme**
- **Light Mode**: 
  - Background: #fafafa (off-white)
  - Text: #0a0a0a (near-black)
  - Borders: Neutral grays
- **Dark Mode**: 
  - Background: #0a0a0a (near-black)
  - Text: #fafafa (off-white)
  - Borders: Neutral grays
- **Monochromatic Design**: Clean, sophisticated, distraction-free

**Layout**
- **Responsive Grid**: Two-column layout on desktop, single column on mobile
- **Elevated Container**: Central card with border and shadow
- **Modern Header**: Gradient background with glassmorphism effects
- **Rounded Corners**: Consistent border-radius throughout

**Animations**
- **Smooth Transitions**: 300-700ms duration for interactions
- **Hover Effects**: Scale, rotate, and color transitions
- **Drag & Drop**: Visual feedback during reordering
- **Gradient Overlays**: Subtle movement on hover

## 📊 Key Metrics

- **Total Lines of Code**: 9,000+
- **React Components**: 30+
- **Utility Functions**: 120+
- **Export Formats**: 17
- **Harmony Types**: 7
- **Color Names Database**: 140+
- **Supported Platforms**: 12+
- **Accessibility Simulations**: 8

## 🧪 Testing Recommendations

While not included in this build, here are recommended testing strategies:

**Unit Tests**
- Color conversion functions (hex ↔ RGB ↔ HSL)
- Contrast ratio calculations
- Hex code validation and normalization
- Duplicate detection logic
- Color harmony algorithms

**Integration Tests**
- Palette save/load flow
- Export format generation
- Undo/redo functionality
- Drag-and-drop reordering

**E2E Tests**
- Complete user workflows
- Keyboard shortcuts
- Cross-browser compatibility

## 🗺️ Development Journey

### Phase 1: Foundation ✅
- Basic palette management
- Hex code input and validation
- Copy/paste functionality
- LocalStorage persistence

### Phase 2: Enhancement ✅
- Multiple color format support (RGB, HSL)
- Bulk import (paste multiple colors)
- Duplicate detection
- Format normalization

### Phase 3: Generation ✅
- Random palette generation
- Complementary and analogous colors
- Image color extraction
- Preset palettes

### Phase 4: Accessibility ✅
- WCAG compliance checking
- Contrast ratio calculator
- Colorblind simulations
- Accessibility recommendations

### Phase 5: Professional Tools ✅
- Color naming system
- Gradient generator
- Palette utilities (sort, stats)
- Color scales (Material, Tailwind)

### Phase 6: Advanced Features ✅
- Color harmony visualizer
- Interactive color wheel
- Drag-and-drop reordering
- 17+ platform exports
- Color adjustment panel
- Contrast matrix

### Phase 7: Polish & UX ✅
- Modern header design
- Animated logo
- Glassmorphism effects
- Dark mode refinements
- Keyboard shortcuts
- Undo/redo system

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

**Bug Reports**
1. Check existing issues first
2. Provide detailed reproduction steps
3. Include browser/OS information
4. Add screenshots if applicable

**Feature Requests**
1. Describe the feature and its benefits
2. Explain use cases
3. Consider implementation complexity

**Pull Requests**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write clean, typed code
4. Follow existing code style
5. Test thoroughly
6. Commit with clear messages (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request with detailed description

**Code Style Guidelines**
- Use TypeScript for all new code
- Follow React best practices
- Keep components focused and single-purpose
- Extract reusable logic into hooks
- Put pure functions in `/lib` directory
- Use meaningful variable names
- Comment complex algorithms

## 📝 License

This project is licensed under the MIT License. You are free to:
- Use commercially
- Modify
- Distribute
- Use privately

See the `LICENSE` file for full details.

## 🙏 Acknowledgments

**Libraries & Tools**
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React DnD](https://react-dnd.github.io/react-dnd/) - Flexible drag-and-drop
- [Lucide](https://lucide.dev/) - Gorgeous icon library
- [Sonner](https://sonner.emilkowal.ski/) - Elegant toast notifications
- [Vite](https://vitejs.dev/) - Lightning-fast build tool

**Inspiration**
- [Coolors.co](https://coolors.co/) - Color palette inspiration
- [Adobe Color](https://color.adobe.com/) - Color wheel concepts
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors) - Scale methodology
- [Material Design](https://m3.material.io/styles/color) - Color system principles

**Community**
- Open-source contributors
- React community
- Design systems community

## 📞 Support & Contact

**Issues & Bugs**
- [GitHub Issues](https://github.com/yourusername/color-rodeo/issues)

**Discussions & Questions**
- [GitHub Discussions](https://github.com/yourusername/color-rodeo/discussions)

**Feature Requests**
- [Feature Request Template](https://github.com/yourusername/color-rodeo/issues/new?template=feature_request.md)

## 🔮 Roadmap

### Planned Features
- [ ] **Cloud Sync**: Optional account for syncing across devices
- [ ] **Collaboration**: Share palettes with team members
- [ ] **Figma Plugin**: Direct integration with Figma
- [ ] **Browser Extension**: System-wide color picker
- [ ] **Color Picker**: Eyedropper tool for screen colors
- [ ] **Palette Comparison**: Side-by-side palette analysis
- [ ] **AI Suggestions**: ML-powered color recommendations
- [ ] **Animation Presets**: Export color transitions
- [ ] **API Access**: Programmatic palette generation
- [ ] **Mobile Apps**: Native iOS and Android apps
- [ ] **Semantic Variables**: Automatically generate design tokens
- [ ] **Palette Templates**: Industry-specific starting points
- [ ] **Version History**: Track palette changes over time
- [ ] **Comments & Notes**: Annotate colors with context

### Under Consideration
- [ ] Real-time collaborative editing
- [ ] Public palette gallery
- [ ] Color trend analysis
- [ ] Print color support (CMYK)
- [ ] Pantone matching
- [ ] Brand guideline generator
- [ ] Accessibility audit reports

## 💡 Use Cases

### For Designers
✅ Create comprehensive brand color systems  
✅ Generate harmonious color palettes  
✅ Export directly to Figma, Sketch, Adobe tools  
✅ Ensure WCAG accessibility compliance  
✅ Build design system foundations  
✅ Test colorblind accessibility  
✅ Create consistent gradients  

### For Developers
✅ Export to Swift, Kotlin, Flutter, React Native  
✅ Generate Tailwind config files  
✅ Create CSS variable systems  
✅ Calculate precise contrast ratios  
✅ Integrate with existing codebases  
✅ Generate color scales programmatically  
✅ Export semantic color tokens  

### For Product Teams
✅ Standardize brand colors across platforms  
✅ Ensure consistent accessibility  
✅ Share palettes with stakeholders  
✅ Document color design decisions  
✅ Maintain design consistency  
✅ Generate platform-specific code  
✅ Audit existing color usage  

### For Students & Educators
✅ Learn color theory interactively  
✅ Understand accessibility requirements  
✅ Practice palette creation  
✅ Export for projects  
✅ Study color harmonies visually  

## 🎯 Why Color Rodeo?

✅ **100% Free & Open Source**: No subscriptions, no paywalls, no data collection  
✅ **Privacy First**: Everything runs client-side in your browser  
✅ **Professional Grade**: Tools used by designers and developers worldwide  
✅ **Comprehensive**: All color tools in one seamless application  
✅ **Cross-Platform**: Export to any framework or design tool  
✅ **Accessibility Built-In**: WCAG compliance checking from the start  
✅ **Modern Tech Stack**: Built with latest React, TypeScript, Tailwind  
✅ **Lightning Fast**: Instant updates, zero loading times  
✅ **Offline Capable**: Works without internet connection  
✅ **No Dependencies**: Self-contained, no external API calls  

## 🌟 Features Comparison

| Feature | Color Rodeo | Others |
|---------|-------------|--------|
| Bulk hex import | ✅ | ⚠️ Limited |
| Drag & drop | ✅ | ❌ |
| 17+ export formats | ✅ | ⚠️ Some |
| Colorblind simulation | ✅ | ⚠️ Basic |
| Color harmonies | ✅ 7 types | ⚠️ 2-3 types |
| Gradient generator | ✅ | ⚠️ Basic |
| Color scales | ✅ | ❌ |
| Undo/Redo | ✅ | ❌ |
| Dark mode | ✅ | ⚠️ Some |
| Open source | ✅ | ❌ |
| No account required | ✅ | ❌ |
| Offline support | ✅ | ❌ |

---

## 🚀 Quick Start Guide

**30 Seconds to Your First Palette:**

1. **Open the app** (no login required)
2. **Paste hex codes**: `#3B82F6, #8B5CF6, #EC4899, #F59E0B`
3. **Click Generate** or use the harmony visualizer
4. **Check accessibility** in the right panel
5. **Export** to your platform of choice
6. **Done!** 🎨

---

**Built with ❤️ for the design and development community**

Made possible by React, TypeScript, Tailwind CSS, shadcn/ui, and the open-source ecosystem.

🎨 **Wrangle your colors. Build something beautiful.** ✨

---

*Color Rodeo - Professional color palette management for the modern web*
