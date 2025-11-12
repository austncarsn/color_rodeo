# Color Palette Manager - Quick Reference

## 🎨 Input Formats

| Format | Example | Notes |
|--------|---------|-------|
| Hex | `#3B82F6` or `3B82F6` | 6-digit hexadecimal |
| RGB | `rgb(59, 130, 246)` | Values 0-255 |
| HSL | `hsl(217, 91%, 60%)` | H: 0-360, S/L: 0-100% |
| Multiple | `#FF5733, #33FF57, #5733FF` | Separated by commas/spaces |

## 🎯 Color Schemes

| Scheme | Colors | Best For |
|--------|--------|----------|
| Complementary | 2 | High contrast, bold designs |
| Analogous | 3 | Harmonious, natural palettes |
| Triadic | 3 | Balanced, vibrant designs |
| Tetradic | 4 | Rich, complex palettes |
| Split Complementary | 3 | Softer contrast |
| Monochromatic | 5 | Elegant, sophisticated |
| Shades | 5 | Depth and hierarchy |
| Tints | 5 | Subtle variations |

## 📦 Export Formats

| Format | Extension | Use Case |
|--------|-----------|----------|
| JSON | `.json` | Sharing, backup, re-import |
| CSS | `.css` | CSS custom properties |
| SCSS | `.scss` | Sass/SCSS projects |
| Tailwind | `.js` | Tailwind CSS config |

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Add color | `Enter` (in input field) |
| Save palette | `Enter` (in save dialog) |

## 🔄 Workflow Examples

### Quick Palette Creation
1. Enter base color → Generate scheme → Save
2. Time: ~10 seconds

### Production Export
1. Create palette → Name it → Export format → Download
2. Ready for production use

### Sharing with Team
1. Create palette → Export JSON → Share file
2. Team imports → Everyone has same palette

## 💡 Tips & Tricks

- **Batch paste**: Paste multiple hex codes at once
- **Format toggle**: Click HEX/RGB/HSL on swatches
- **Quick copy**: Click any swatch to copy
- **Auto-deduplication**: Duplicates removed automatically
- **Instant preview**: Color changes show immediately
- **Safe storage**: Everything saved in browser (localStorage)

## 🎯 Common Tasks

### "I want to create a complementary palette"
1. Enter your main brand color in Generator
2. Click "Complementary"
3. Adjust if needed, then Save

### "I need CSS variables for my project"
1. Load or create your palette
2. Select "CSS" in Export dropdown
3. Click Export
4. Paste into your stylesheet

### "I want to share palettes with my team"
1. Export palette as JSON
2. Share the `.json` file
3. Team members click Import
4. Everyone has the same palette

### "I'm not sure what colors work together"
1. Pick your favorite color
2. Try different generators (start with Analogous or Triadic)
3. Save the ones you like
4. Compare and choose

## 📱 Browser Support

- ✅ Modern Chrome, Firefox, Safari, Edge
- ✅ localStorage required
- ✅ Clipboard API supported
- ✅ No server/internet required

## 🔒 Privacy

- ✅ All data stored locally (localStorage)
- ✅ No data sent to servers
- ✅ No tracking or analytics
- ✅ Works offline after initial load

## 🆘 Troubleshooting

**Colors not being added?**
- Check format: Must be valid hex, RGB, or HSL
- Try pasting one at a time

**Can't copy colors?**
- Browser clipboard permissions required
- Click the swatch again to retry

**Import not working?**
- Ensure file is valid JSON
- Check file contains `colors` array

**Export button disabled?**
- Must have colors in current palette
- Add or load a palette first

## 📚 Color Theory Primer

**Complementary**: Maximum contrast, use sparingly  
**Analogous**: Harmonious, low contrast  
**Triadic**: Balanced tension and harmony  
**Monochromatic**: Single hue, always works together  
**Tints**: Add white, lighter  
**Shades**: Add black, darker  

## 🎨 Best Practices

1. **Start with a base color** - Usually your brand color
2. **Use generators** - Let color theory guide you
3. **Test in context** - Colors look different on different backgrounds
4. **Save variations** - Keep multiple options
5. **Export early** - Backup your work as JSON
6. **Document names** - Use descriptive palette names

## 🚀 Advanced Usage

### Creating a Design System
1. Generate monochromatic palette for primary color
2. Generate analogous for secondary colors
3. Add complementary for accents
4. Export all as CSS variables
5. Document in style guide

### Brand Palette Development
1. Start with brand primary color
2. Generate multiple schemes
3. Save promising combinations
4. Test with client
5. Export final palette in all formats

### Rapid Prototyping
1. Quickly generate triadic palette
2. Use Tailwind export
3. Paste into tailwind.config.js
4. Start building immediately
