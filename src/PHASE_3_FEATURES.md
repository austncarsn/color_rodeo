# Phase 3 - New Features Guide

## 🎨 1. Color Format Conversion

### Input Multiple Formats
You can now add colors in three different formats:

```
Hex:  #3B82F6  or  3B82F6
RGB:  rgb(59, 130, 246)
HSL:  hsl(217, 91%, 60%)
```

All formats are automatically converted and stored as hex internally.

### Display Format Cycling
Each color swatch now has a format indicator at the bottom:
- Click on the format label (HEX/RGB/HSL) to cycle through formats
- The color is copied in whichever format is currently displayed
- Hover over a swatch to see the format toggle

**Example:**
```
#3B82F6          →  Click  →  rgb(59, 130, 246)  →  Click  →  hsl(217, 91%, 60%)
```

---

## 🎯 2. Palette Generation

### Available Color Schemes

#### **Complementary** (2 colors)
- Colors opposite on the color wheel (180° apart)
- High contrast, vibrant combinations
- Perfect for bold designs

#### **Analogous** (3 colors)
- Adjacent colors on the color wheel (30° apart)
- Harmonious, natural-looking palettes
- Great for serene, cohesive designs

#### **Triadic** (3 colors)
- Evenly spaced on color wheel (120° apart)
- Balanced, vibrant palettes
- Ideal for playful, energetic designs

#### **Tetradic** (4 colors)
- Square pattern on color wheel (90° apart)
- Rich, complex palettes with lots of variety
- Best for experienced designers

#### **Split Complementary** (3 colors)
- Base color + two colors adjacent to its complement
- Less tension than complementary
- Good balance of contrast and harmony

#### **Monochromatic** (5 colors)
- Same hue with varying lightness
- Sophisticated, elegant appearance
- Perfect for minimalist designs

#### **Shades** (5 colors)
- Progressively darker versions
- Great for depth and hierarchy
- Useful for shadows and depth

#### **Tints** (5 colors)
- Progressively lighter versions
- Excellent for subtle variations
- Perfect for backgrounds and highlights

### How to Use
1. Enter a base color in the generator (hex, RGB, or HSL)
2. Click any generation button
3. Generated palette automatically loads into your workspace
4. Modify, save, or export as needed

---

## 📦 3. Export & Import

### Export Formats

#### **JSON** (`.json`)
Perfect for:
- Sharing palettes with others
- Backing up your work
- Importing back into the app

```json
{
  "id": "1234567890",
  "name": "My Palette",
  "colors": ["#3B82F6", "#60A5FA"],
  "createdAt": 1234567890
}
```

#### **CSS Variables** (`.css`)
Perfect for:
- Web projects using CSS custom properties
- Design systems
- Easy theme switching

```css
:root {
  /* My Palette */
  --color-my-palette-1: #3B82F6;
  --color-my-palette-2: #60A5FA;
}
```

#### **SCSS Variables** (`.scss`)
Perfect for:
- Sass/SCSS projects
- Component libraries
- Maintaining color consistency

```scss
// My Palette
$color-my-palette-1: #3B82F6;
$color-my-palette-2: #60A5FA;
```

#### **Tailwind Config** (`.js`)
Perfect for:
- Tailwind CSS projects
- Utility-first frameworks
- Rapid prototyping

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'my-palette': {
          100: '#3B82F6',
          200: '#60A5FA',
        },
      },
    },
  },
}
```

### Import
- Click "Import JSON" button
- Select a `.json` palette file
- Palette is added to your saved palettes
- Supports importing single palettes or multiple palettes at once

---

## 🚀 Quick Start Workflow

### Creating a New Palette

1. **Manual Entry**
   - Type or paste colors: `#3B82F6, rgb(96, 165, 250), hsl(213, 94%, 68%)`
   - Click "Add" or press Enter
   - Colors appear in your palette

2. **Generated Palette**
   - Enter a base color in the generator
   - Click a color scheme (e.g., "Triadic")
   - Edit the generated palette as needed

3. **Import Existing**
   - Click "Import JSON"
   - Select a palette file
   - Palette appears in your saved list

### Saving and Using

1. **Save for Later**
   - Click "Save Palette"
   - Give it a descriptive name
   - Find it in your saved palettes

2. **Export for Projects**
   - Select export format (JSON, CSS, SCSS, Tailwind)
   - Click "Export"
   - File downloads automatically
   - Use in your project

3. **Copy Individual Colors**
   - Click any color swatch
   - Color copies to clipboard
   - Toggle format if needed (HEX/RGB/HSL)

---

## 💡 Pro Tips

1. **Batch Input**: Paste multiple hex codes at once separated by commas or spaces
2. **Format Freedom**: Input in any format, copy in any format
3. **Quick Export**: Keep your current palette in view while browsing exports
4. **Share Easily**: Export as JSON to share with team members
5. **Production Ready**: Export directly to your framework's format (CSS, SCSS, Tailwind)
6. **Color Theory**: Let the generator create harmonious palettes based on proven color theory
7. **Iterate Fast**: Generate → Adjust → Save → Export in seconds

---

## 🎯 Use Cases

### Web Development
- Generate palettes that work across your entire site
- Export directly to CSS variables or Tailwind
- Maintain consistency across components

### Design Systems
- Create and document color scales
- Export to multiple formats for different tools
- Share with developers in their preferred format

### Branding Projects
- Explore color harmonies for brand palettes
- Test different variations quickly
- Export for client presentations

### Learning Color Theory
- See how complementary colors interact
- Understand analogous harmonies
- Experiment with color relationships

---

## 📝 Notes

- All colors are internally stored as hex for consistency
- Exports use sanitized filenames (spaces become hyphens)
- Import validates palette structure before adding
- Toast notifications confirm all actions
- No data leaves your browser (localStorage only)
