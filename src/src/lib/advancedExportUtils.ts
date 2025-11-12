/**
 * Advanced export utilities for various platforms and frameworks
 */

import { hexToRgb } from './colorUtils';

/**
 * Export palette as Swift (iOS)
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns Swift code string
 */
export function exportSwift(colors: string[], name: string = 'Palette'): string {
  const colorDefs = colors
    .map((color, idx) => {
      const rgb = hexToRgb(color);
      return `    static let color${idx + 1} = UIColor(red: ${(rgb.r / 255).toFixed(3)}, green: ${(rgb.g / 255).toFixed(3)}, blue: ${(rgb.b / 255).toFixed(3)}, alpha: 1.0)`;
    })
    .join('\n');

  return `// ${name} Color Palette - Swift
import UIKit

extension UIColor {
${colorDefs}
}

// Usage: UIColor.color1, UIColor.color2, etc.`;
}

/**
 * Export palette as SwiftUI
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns SwiftUI code string
 */
export function exportSwiftUI(colors: string[], name: string = 'Palette'): string {
  const colorDefs = colors
    .map((color, idx) => {
      const rgb = hexToRgb(color);
      return `    static let color${idx + 1} = Color(red: ${(rgb.r / 255).toFixed(3)}, green: ${(rgb.g / 255).toFixed(3)}, blue: ${(rgb.b / 255).toFixed(3)})`;
    })
    .join('\n');

  return `// ${name} Color Palette - SwiftUI
import SwiftUI

extension Color {
${colorDefs}
}

// Usage: Color.color1, Color.color2, etc.`;
}

/**
 * Export palette as Kotlin (Android)
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns Kotlin code string
 */
export function exportKotlin(colors: string[], name: string = 'Palette'): string {
  const colorDefs = colors
    .map((color, idx) => {
      return `    val color${idx + 1} = Color(0xFF${color.replace('#', '').toUpperCase()})`;
    })
    .join('\n');

  return `// ${name} Color Palette - Kotlin (Jetpack Compose)
package com.example.theme

import androidx.compose.ui.graphics.Color

object ${name}Colors {
${colorDefs}
}

// Usage: ${name}Colors.color1, ${name}Colors.color2, etc.`;
}

/**
 * Export palette as Android XML
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns XML string
 */
export function exportAndroidXML(colors: string[], name: string = 'palette'): string {
  const colorDefs = colors
    .map((color, idx) => {
      return `    <color name="${name}_color_${idx + 1}">${color.toUpperCase()}</color>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<!-- ${name} Color Palette -->
<resources>
${colorDefs}
</resources>`;
}

/**
 * Export palette as Flutter/Dart
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns Dart code string
 */
export function exportFlutter(colors: string[], name: string = 'Palette'): string {
  const colorDefs = colors
    .map((color, idx) => {
      const hex = color.replace('#', '');
      return `  static const Color color${idx + 1} = Color(0xFF${hex.toUpperCase()});`;
    })
    .join('\n');

  return `// ${name} Color Palette - Flutter
import 'package:flutter/material.dart';

class ${name}Colors {
${colorDefs}
}

// Usage: ${name}Colors.color1, ${name}Colors.color2, etc.`;
}

/**
 * Export palette as React Native
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns TypeScript code string
 */
export function exportReactNative(colors: string[], name: string = 'palette'): string {
  const colorDefs = colors
    .map((color, idx) => {
      return `  color${idx + 1}: '${color}',`;
    })
    .join('\n');

  return `// ${name} Color Palette - React Native
export const ${name}Colors = {
${colorDefs}
} as const;

export type ${name}Color = keyof typeof ${name}Colors;

// Usage: ${name}Colors.color1, ${name}Colors.color2, etc.`;
}

/**
 * Export palette as Figma JSON
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns JSON string
 */
export function exportFigma(colors: string[], name: string = 'Palette'): string {
  const colorObjects = colors.map((color, idx) => {
    const rgb = hexToRgb(color);
    return {
      name: `${name}/Color ${idx + 1}`,
      type: 'COLOR',
      color: {
        r: rgb.r / 255,
        g: rgb.g / 255,
        b: rgb.b / 255,
        a: 1,
      },
    };
  });

  return JSON.stringify(colorObjects, null, 2);
}

/**
 * Export palette as Sketch JSON
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns JSON string
 */
export function exportSketch(colors: string[], name: string = 'Palette'): string {
  const colorObjects = colors.map((color, idx) => {
    const rgb = hexToRgb(color);
    return {
      name: `${name}/Color ${idx + 1}`,
      red: rgb.r / 255,
      green: rgb.g / 255,
      blue: rgb.b / 255,
      alpha: 1,
    };
  });

  return JSON.stringify({ colors: colorObjects }, null, 2);
}

/**
 * Export palette as Adobe ASE (text representation)
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns ASE-like text format
 */
export function exportASE(colors: string[], name: string = 'Palette'): string {
  let output = `Adobe Swatch Exchange (Text Format)\n`;
  output += `Palette: ${name}\n\n`;

  colors.forEach((color, idx) => {
    const rgb = hexToRgb(color);
    output += `Color ${idx + 1}\n`;
    output += `  Name: Color ${idx + 1}\n`;
    output += `  Model: RGB\n`;
    output += `  R: ${(rgb.r / 255).toFixed(6)}\n`;
    output += `  G: ${(rgb.g / 255).toFixed(6)}\n`;
    output += `  B: ${(rgb.b / 255).toFixed(6)}\n\n`;
  });

  return output;
}

/**
 * Export palette as Procreate palette
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns JSON string
 */
export function exportProcreate(colors: string[], name: string = 'Palette'): string {
  const swatches = colors.map((color) => {
    const rgb = hexToRgb(color);
    return [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1];
  });

  return JSON.stringify(
    {
      name,
      swatches,
      version: '5.0',
    },
    null,
    2
  );
}

/**
 * Export palette as Paint.NET palette
 * @param colors - Array of hex colors
 * @returns TXT string
 */
export function exportPaintNET(colors: string[]): string {
  let output = '; Paint.NET Palette File\n';
  output += '; Generated by Color Palette App\n\n';

  colors.forEach((color) => {
    const hex = color.replace('#', '').toUpperCase();
    output += `FF${hex}\n`; // ARGB format
  });

  // Pad to 96 colors (Paint.NET requirement)
  const remaining = 96 - colors.length;
  for (let i = 0; i < remaining; i++) {
    output += 'FFFFFFFF\n'; // White
  }

  return output;
}

/**
 * Export palette as GIMP palette
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns GPL string
 */
export function exportGIMP(colors: string[], name: string = 'Palette'): string {
  let output = `GIMP Palette\n`;
  output += `Name: ${name}\n`;
  output += `Columns: 8\n`;
  output += `#\n`;

  colors.forEach((color, idx) => {
    const rgb = hexToRgb(color);
    output += `${String(rgb.r).padStart(3)} ${String(rgb.g).padStart(3)} ${String(rgb.b).padStart(3)}  Color ${idx + 1}\n`;
  });

  return output;
}

/**
 * Export palette as CLR (macOS Color Palette)
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns XML/plist string
 */
export function exportCLR(colors: string[], name: string = 'Palette'): string {
  const colorEntries = colors
    .map((color) => {
      const rgb = hexToRgb(color);
      return `    <string>${(rgb.r / 255).toFixed(6)} ${(rgb.g / 255).toFixed(6)} ${(rgb.b / 255).toFixed(6)}</string>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Name</key>
  <string>${name}</string>
  <key>Colors</key>
  <array>
${colorEntries}
  </array>
</dict>
</plist>`;
}

/**
 * Export palette as Material Theme (JSON)
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns JSON string
 */
export function exportMaterialTheme(colors: string[], name: string = 'theme'): string {
  const theme: Record<string, any> = {
    $schema: 'vscode://schemas/color-theme',
    name: `${name} Theme`,
    type: 'dark',
    colors: {},
  };

  // Map colors to common theme properties
  if (colors[0]) theme.colors['editor.background'] = colors[0];
  if (colors[1]) theme.colors['editor.foreground'] = colors[1];
  if (colors[2]) theme.colors['activityBar.background'] = colors[2];
  if (colors[3]) theme.colors['sideBar.background'] = colors[3];
  if (colors[4]) theme.colors['statusBar.background'] = colors[4];

  return JSON.stringify(theme, null, 2);
}

/**
 * Export palette as Unity C#
 * @param colors - Array of hex colors
 * @param name - Palette name
 * @returns C# code string
 */
export function exportUnity(colors: string[], name: string = 'Palette'): string {
  const colorDefs = colors
    .map((color, idx) => {
      const rgb = hexToRgb(color);
      return `    public static readonly Color Color${idx + 1} = new Color(${(rgb.r / 255).toFixed(3)}f, ${(rgb.g / 255).toFixed(3)}f, ${(rgb.b / 255).toFixed(3)}f, 1f);`;
    })
    .join('\n');

  return `// ${name} Color Palette - Unity C#
using UnityEngine;

public static class ${name}Colors
{
${colorDefs}
}

// Usage: ${name}Colors.Color1, ${name}Colors.Color2, etc.`;
}

/**
 * Get all available export formats
 */
export const EXPORT_FORMATS = [
  { value: 'swift', label: 'Swift (iOS)', extension: 'swift' },
  { value: 'swiftui', label: 'SwiftUI', extension: 'swift' },
  { value: 'kotlin', label: 'Kotlin (Android)', extension: 'kt' },
  { value: 'android-xml', label: 'Android XML', extension: 'xml' },
  { value: 'flutter', label: 'Flutter/Dart', extension: 'dart' },
  { value: 'react-native', label: 'React Native', extension: 'ts' },
  { value: 'figma', label: 'Figma JSON', extension: 'json' },
  { value: 'sketch', label: 'Sketch JSON', extension: 'json' },
  { value: 'procreate', label: 'Procreate', extension: 'json' },
  { value: 'gimp', label: 'GIMP Palette', extension: 'gpl' },
  { value: 'paint-net', label: 'Paint.NET', extension: 'txt' },
  { value: 'ase', label: 'Adobe ASE (Text)', extension: 'txt' },
  { value: 'clr', label: 'macOS Color Palette', extension: 'clr' },
  { value: 'vscode', label: 'VS Code Theme', extension: 'json' },
  { value: 'unity', label: 'Unity C#', extension: 'cs' },
] as const;

/**
 * Export palette in specified format
 * @param colors - Array of hex colors
 * @param format - Export format
 * @param name - Palette name
 * @returns Exported content
 */
export function exportInFormat(
  colors: string[],
  format: string,
  name: string = 'Palette'
): string {
  switch (format) {
    case 'swift':
      return exportSwift(colors, name);
    case 'swiftui':
      return exportSwiftUI(colors, name);
    case 'kotlin':
      return exportKotlin(colors, name);
    case 'android-xml':
      return exportAndroidXML(colors, name);
    case 'flutter':
      return exportFlutter(colors, name);
    case 'react-native':
      return exportReactNative(colors, name);
    case 'figma':
      return exportFigma(colors, name);
    case 'sketch':
      return exportSketch(colors, name);
    case 'procreate':
      return exportProcreate(colors, name);
    case 'gimp':
      return exportGIMP(colors, name);
    case 'paint-net':
      return exportPaintNET(colors);
    case 'ase':
      return exportASE(colors, name);
    case 'clr':
      return exportCLR(colors, name);
    case 'vscode':
      return exportMaterialTheme(colors, name);
    case 'unity':
      return exportUnity(colors, name);
    default:
      return JSON.stringify(colors, null, 2);
  }
}
