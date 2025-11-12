import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Download, Copy, FileCode } from 'lucide-react';
import { exportInFormat, EXPORT_FORMATS } from '../lib/advancedExportUtils';
import { useCopyToClipboard } from '../hooks';
import { toast } from 'sonner@2.0.3';

interface AdvancedExportProps {
  colors: string[];
}

export function AdvancedExport({ colors }: AdvancedExportProps) {
  const [format, setFormat] = useState(EXPORT_FORMATS[0].value);
  const [paletteName, setPaletteName] = useState('MyPalette');
  const { copyToClipboard } = useCopyToClipboard();

  const hasColors = colors.length > 0;

  const selectedFormat = EXPORT_FORMATS.find((f) => f.value === format);
  const exportedCode = hasColors ? exportInFormat(colors, format, paletteName) : '';

  const handleCopy = () => {
    copyToClipboard(exportedCode, 'Code copied to clipboard!');
  };

  const handleDownload = () => {
    if (!selectedFormat) return;

    const blob = new Blob([exportedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paletteName}.${selectedFormat.extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${selectedFormat.label} file`);
  };

  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h3 className="text-neutral-900 dark:text-neutral-50">Advanced Export</h3>
        </div>

        {!hasColors && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Add colors to enable export
          </p>
        )}

        {hasColors && (
          <>
            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-neutral-700 dark:text-neutral-300">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {EXPORT_FORMATS.map((fmt) => (
                      <SelectItem key={fmt.value} value={fmt.value}>
                        {fmt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-700 dark:text-neutral-300">Name</Label>
                <Input
                  value={paletteName}
                  onChange={(e) => setPaletteName(e.target.value)}
                  placeholder="MyPalette"
                  className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                />
              </div>
            </div>

            {/* Code Preview */}
            <div className="space-y-2">
              <Label className="text-neutral-700 dark:text-neutral-300">Preview</Label>
              <div className="relative">
                <pre className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-xs overflow-x-auto max-h-[300px] overflow-y-auto font-mono">
                  <code className="text-neutral-900 dark:text-neutral-50">{exportedCode}</code>
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-neutral-200 dark:border-neutral-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900"
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </div>

            {/* Format Info */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
              <h4 className="text-sm mb-2 text-neutral-900 dark:text-neutral-50">
                {selectedFormat?.label}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {getFormatDescription(format)}
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

function getFormatDescription(format: string): string {
  const descriptions: Record<string, string> = {
    swift: 'UIColor extensions for iOS apps using UIKit',
    swiftui: 'Color extensions for iOS apps using SwiftUI',
    kotlin: 'Color object for Android apps using Jetpack Compose',
    'android-xml': 'XML color resources for Android projects',
    flutter: 'Dart class with Color constants for Flutter apps',
    'react-native': 'TypeScript constants for React Native projects',
    figma: 'JSON format compatible with Figma color styles',
    sketch: 'JSON format for Sketch app color presets',
    procreate: 'Palette file for Procreate drawing app',
    gimp: 'GPL palette file for GIMP image editor',
    'paint-net': 'TXT palette file for Paint.NET',
    ase: 'Text representation of Adobe Swatch Exchange format',
    clr: 'macOS color picker palette file (plist format)',
    vscode: 'VS Code theme JSON with your colors',
    unity: 'C# static class for Unity game engine',
  };

  return descriptions[format] || 'Export your colors in this format';
}