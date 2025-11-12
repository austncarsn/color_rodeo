import { useState, useEffect } from 'react';
import { PaletteManager } from './components/PaletteManager';
import { SavedPalettes } from './components/SavedPalettes';
import { PaletteGenerator } from './components/PaletteGenerator';
import { ExportImport } from './components/ExportImport';
import { AccessibilityChecker } from './components/AccessibilityChecker';
import { GradientGenerator } from './components/GradientGenerator';
import { PaletteUtilities } from './components/PaletteUtilities';
import { ColorScales } from './components/ColorScales';
import { ColorHarmonyVisualizer } from './components/ColorHarmonyVisualizer';
import { AdvancedExport } from './components/AdvancedExport';
import { DarkModeToggle } from './components/DarkModeToggle';
import { ColorAdjustmentPanel } from './components/ColorAdjustmentPanel';
import { ContrastMatrix } from './components/ContrastMatrix';
import { Logo } from './components/Logo';
import type { ColorPalette } from './types/palette';
import { useLocalStorage, useUndoRedo, useKeyboardShortcuts, type KeyboardShortcut } from './hooks';
import { STORAGE_KEYS } from './constants';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { Undo, Redo, Keyboard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function App() {
  const [savedPalettes, setSavedPalettes] = useLocalStorage<ColorPalette[]>(
    STORAGE_KEYS.COLOR_PALETTES,
    []
  );
  
  const {
    state: currentPalette,
    set: setCurrentPalette,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<string[]>([]);

  const [currentPaletteName, setCurrentPaletteName] = useState<string>('Current Palette');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  
  // Handle color change from adjustment panel
  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...currentPalette];
    newColors[index] = newColor;
    setCurrentPalette(newColors);
  };

  const handleSavePalette = (name: string, colors: string[]) => {
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name,
      colors,
      createdAt: Date.now(),
    };
    setSavedPalettes([newPalette, ...savedPalettes]);
    setCurrentPaletteName(name);
    toast.success('Palette saved successfully');
  };

  const handleDeletePalette = (id: string) => {
    setSavedPalettes(savedPalettes.filter(p => p.id !== id));
    toast.success('Palette deleted');
  };

  const handleLoadPalette = (colors: string[]) => {
    setCurrentPalette(colors);
    toast.success('Palette loaded');
  };

  const handleGenerate = (colors: string[]) => {
    setCurrentPalette(colors);
  };

  const handleImport = (imported: ColorPalette | ColorPalette[]) => {
    if (Array.isArray(imported)) {
      setSavedPalettes([...imported, ...savedPalettes]);
    } else {
      setSavedPalettes([imported, ...savedPalettes]);
    }
  };

  // Get current palette for export
  const currentPaletteForExport: ColorPalette | null = currentPalette.length > 0
    ? {
        id: 'current',
        name: currentPaletteName,
        colors: currentPalette,
        createdAt: Date.now(),
      }
    : null;

  // Keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 's',
      ctrl: true,
      callback: () => {
        if (currentPalette.length > 0) {
          const name = prompt('Enter palette name:', currentPaletteName);
          if (name) {
            handleSavePalette(name, currentPalette);
          }
        }
      },
      description: 'Save current palette',
    },
    {
      key: 'z',
      ctrl: true,
      callback: () => {
        if (canUndo) {
          undo();
          toast.success('Undone');
        }
      },
      description: 'Undo last action',
    },
    {
      key: 'y',
      ctrl: true,
      callback: () => {
        if (canRedo) {
          redo();
          toast.success('Redone');
        }
      },
      description: 'Redo last action',
    },
    {
      key: '?',
      shift: true,
      callback: () => setShowShortcuts(!showShortcuts),
      description: 'Toggle keyboard shortcuts help',
    },
  ];

  useKeyboardShortcuts(shortcuts, true);

  // Update document title
  useEffect(() => {
    document.title = 'Color Rodeo - Professional Color Palette Manager';
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Elevated container with border */}
        <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Modern gradient header with glassmorphism effect */}
          <div className="relative bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 border-b-2 border-neutral-200 dark:border-neutral-800">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-100/50 dark:via-neutral-800/50 to-transparent" />
            
            <div className="relative px-8 md:px-12 py-8">
              {/* Logo centered with Dark Mode Toggle on right */}
              <div className="flex items-center justify-between mb-10">
                <div className="flex-1" /> {/* Spacer */}
                <div className="flex-shrink-0">
                  <Logo />
                </div>
                <div className="flex-1 flex justify-end">
                  <DarkModeToggle />
                </div>
              </div>
              
              {/* Tagline with refined typography */}
              <div className="text-center space-y-6">
                <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
                  Professional color tools for designers and developers
                </p>
                
                {/* Undo/Redo Controls with modern styling */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={undo}
                    disabled={!canUndo}
                    variant="outline"
                    size="sm"
                    className="border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-50 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
                  >
                    <Undo className="w-4 h-4 mr-1" />
                    Undo
                  </Button>
                  <Button
                    onClick={redo}
                    disabled={!canRedo}
                    variant="outline"
                    size="sm"
                    className="border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-50 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
                  >
                    <Redo className="w-4 h-4 mr-1" />
                    Redo
                  </Button>
                  <Button
                    onClick={() => setShowShortcuts(!showShortcuts)}
                    variant="outline"
                    size="sm"
                    className="border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-50 transition-all duration-300 hover:scale-105 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
                  >
                    <Keyboard className="w-4 h-4 mr-1" />
                    Shortcuts
                  </Button>
                </div>
                
                {/* Keyboard Shortcuts Help with refined design */}
                {showShortcuts && (
                  <div className="max-w-md mx-auto mt-4 p-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 text-left shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <h3 className="text-sm mb-4 text-neutral-900 dark:text-neutral-50 tracking-wide">Keyboard Shortcuts</h3>
                    <div className="space-y-3 text-sm">
                      {shortcuts.map((shortcut, idx) => (
                        <div key={idx} className="flex justify-between items-center group">
                          <span className="text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-50 transition-colors">
                            {shortcut.description}
                          </span>
                          <code className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs tracking-wider group-hover:border-neutral-900 dark:group-hover:border-neutral-50 transition-colors">
                            {shortcut.ctrl && 'Ctrl+'}{shortcut.shift && 'Shift+'}{shortcut.key.toUpperCase()}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <PaletteManager
                  onSavePalette={handleSavePalette}
                  loadedColors={currentPalette}
                  onColorsChange={setCurrentPalette}
                  selectedColorIndex={selectedColorIndex}
                  onSelectColor={setSelectedColorIndex}
                />
                
                <Tabs defaultValue="generate" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-neutral-100 dark:bg-neutral-800">
                    <TabsTrigger value="generate">Generate</TabsTrigger>
                    <TabsTrigger value="harmony">Harmony</TabsTrigger>
                    <TabsTrigger value="gradient">Gradient</TabsTrigger>
                    <TabsTrigger value="scales">Scales</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="generate" className="mt-4">
                    <PaletteGenerator onGenerate={handleGenerate} />
                  </TabsContent>
                  
                  <TabsContent value="harmony" className="mt-4">
                    <ColorHarmonyVisualizer
                      colors={currentPalette}
                      onGenerateColors={handleGenerate}
                    />
                  </TabsContent>
                  
                  <TabsContent value="gradient" className="mt-4">
                    <GradientGenerator 
                      colors={currentPalette} 
                      onGenerateColors={handleGenerate}
                    />
                  </TabsContent>
                  
                  <TabsContent value="scales" className="mt-4">
                    <ColorScales
                      colors={currentPalette}
                      onGenerateColors={handleGenerate}
                    />
                  </TabsContent>
                </Tabs>
                
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-neutral-100 dark:bg-neutral-800">
                    <TabsTrigger value="basic">Basic Export</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Export</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="mt-4">
                    <ExportImport 
                      palette={currentPaletteForExport} 
                      onImport={handleImport}
                    />
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="mt-4">
                    <AdvancedExport colors={currentPalette} />
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Right Column */}
              <div className="space-y-8">
                <AccessibilityChecker colors={currentPalette} />
                <PaletteUtilities 
                  colors={currentPalette}
                  onColorsChange={setCurrentPalette}
                />
                <SavedPalettes
                  palettes={savedPalettes}
                  onDeletePalette={handleDeletePalette}
                  onLoadPalette={handleLoadPalette}
                />
                <ColorAdjustmentPanel
                  colors={currentPalette}
                  selectedColorIndex={selectedColorIndex}
                  onColorChange={handleColorChange}
                />
                <ContrastMatrix colors={currentPalette} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}