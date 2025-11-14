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
    <Card className="p-4 sm:p-6 bg-white dark:bg-[#18191D] border-neutral-200 dark:border-[#292B33]">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 sm:w-5 sm:h-5 text-[#F2C46B]" />
          <h3 className="text-sm sm:text-base text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 500 }}>Export / Import</h3>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="export-format" className="text-xs sm:text-sm text-neutral-700 dark:text-[#C1C4CF]">
              Export Format
            </Label>
            <Select
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
            >
              <SelectTrigger
                id="export-format"
                className="min-h-[44px] bg-neutral-50 dark:bg-[#1E1F23] border-neutral-200 dark:border-[#292B33] text-neutral-900 dark:text-[#F5F5F7]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#18191D] border-neutral-200 dark:border-[#292B33]">
                <SelectItem value="json" className="text-neutral-900 dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-[#23252B]">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4" />
                    <span>JSON</span>
                  </div>
                </SelectItem>
                <SelectItem value="css" className="text-neutral-900 dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-[#23252B]">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    <span>CSS Variables</span>
                  </div>
                </SelectItem>
                <SelectItem value="scss" className="text-neutral-900 dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-[#23252B]">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    <span>SCSS Variables</span>
                  </div>
                </SelectItem>
                <SelectItem value="tailwind" className="text-neutral-900 dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-[#23252B]">
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
              className="min-h-[44px] border-neutral-200 dark:border-[#292B33] hover:bg-neutral-100 dark:hover:bg-[#23252B] text-neutral-900 dark:text-[#F5F5F7] disabled:opacity-40"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="text-xs sm:text-sm">Export</span>
            </Button>

            <Button
              onClick={handleImportClick}
              variant="outline"
              className="min-h-[44px] border-neutral-200 dark:border-[#292B33] hover:bg-neutral-100 dark:hover:bg-[#23252B] text-neutral-900 dark:text-[#F5F5F7]"
            >
              <Upload className="w-4 h-4 mr-2" />
              <span className="text-xs sm:text-sm">Import JSON</span>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-[#8C909A]">
            Import accepts JSON palette files. Export formats include JSON, CSS, SCSS, and Tailwind.
          </p>
        </div>
      </div>
    </Card>
  );
}