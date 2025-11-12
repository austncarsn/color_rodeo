import { useState, useRef } from 'react';
import { Download, Upload, FileJson, FileCode } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import type { ColorPalette } from '../types/palette';
import {
  exportPalette,
  downloadFile,
  getFileExtension,
  importFromJSON,
  type ExportFormat,
} from '../lib/exportUtils';
import { toast } from 'sonner@2.0.3';

interface ExportImportProps {
  palette: ColorPalette | null;
  onImport: (palettes: ColorPalette | ColorPalette[]) => void;
}

export function ExportImport({ palette, onImport }: ExportImportProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!palette || palette.colors.length === 0) {
      toast.error('No palette to export');
      return;
    }

    const content = exportPalette(palette, exportFormat);
    const extension = getFileExtension(exportFormat);
    const filename = `${palette.name.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
    
    downloadFile(content, filename);
    toast.success(`Palette exported as ${exportFormat.toUpperCase()}`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = importFromJSON(text);

      if (imported) {
        onImport(imported);
        toast.success('Palette imported successfully');
      } else {
        toast.error('Invalid palette file');
      }
    } catch (error) {
      toast.error('Failed to import palette');
      console.error('Import error:', error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
          <h3 className="text-neutral-900 dark:text-neutral-50">Export / Import</h3>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="export-format" className="text-neutral-700 dark:text-neutral-300">
              Export Format
            </Label>
            <Select
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
            >
              <SelectTrigger
                id="export-format"
                className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4" />
                    <span>JSON</span>
                  </div>
                </SelectItem>
                <SelectItem value="css">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    <span>CSS Variables</span>
                  </div>
                </SelectItem>
                <SelectItem value="scss">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    <span>SCSS Variables</span>
                  </div>
                </SelectItem>
                <SelectItem value="tailwind">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    <span>Tailwind Config</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleExport}
              disabled={!palette || palette.colors.length === 0}
              variant="outline"
              className="border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button
              onClick={handleImportClick}
              variant="outline"
              className="border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Import accepts JSON palette files. Export formats include JSON, CSS, SCSS, and Tailwind.
          </p>
        </div>
      </div>
    </Card>
  );
}