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
import { Undo, Redo, Keyboard, X } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0a0a0a] dark:bg-[#0a0a0a]">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 max-w-[1600px]">
        {/* Elevated container with border */}
        <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          {/* Premium cinematic hero with enhanced depth */}
          <div className="relative bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#050505] dark:from-[#1a1a1a] dark:via-[#0f0f0f] dark:to-[#050505] border-b border-neutral-800/50 dark:border-neutral-800/50 overflow-hidden">
            {/* Radial gradient overlay for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.06),transparent_50%)]" />
            
            {/* Subtle noise texture */}
            <div 
              className="absolute inset-0 opacity-[0.015]" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            />
            
            {/* Faint grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.02]" 
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '48px 48px'
              }} 
            />
            
            {/* Vignette effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            
            {/* Content with glassy backdrop */}
            <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
              {/* Center-aligned premium layout */}
              <div className="max-w-4xl mx-auto text-center">
                
                {/* New badge pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/20 backdrop-blur-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs tracking-wider text-neutral-300 uppercase">Professional Color Tools</span>
                </div>
                
                {/* Enhanced logo with better hierarchy */}
                <div className="mb-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-400 mb-4 leading-[1.1]" style={{ fontWeight: 500 }}>
                    Color Rodeo
                  </h1>
                  <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-500/50 to-transparent rounded-full mb-6" />
                </div>
                
                {/* Refined tagline */}
                <p className="text-neutral-400 dark:text-neutral-400 max-w-xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed mb-10 tracking-wide" style={{ fontWeight: 400 }}>
                  Professional color tools for designers and developers
                </p>
                
                {/* Premium control group with glassy card */}
                <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                  {/* Main action group - glassy container */}
                  <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl">
                    {/* Undo - subtle ghost */}
                    <Button
                      onClick={undo}
                      disabled={!canUndo}
                      variant="ghost"
                      size="sm"
                      className="min-h-[44px] px-4 sm:px-5 bg-transparent hover:bg-white/[0.08] border-0 text-neutral-400 hover:text-neutral-200 transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
                    >
                      <Undo className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline tracking-wide">Undo</span>
                    </Button>
                    
                    {/* Redo - subtle ghost */}
                    <Button
                      onClick={redo}
                      disabled={!canRedo}
                      variant="ghost"
                      size="sm"
                      className="min-h-[44px] px-4 sm:px-5 bg-transparent hover:bg-white/[0.08] border-0 text-neutral-400 hover:text-neutral-200 transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
                    >
                      <Redo className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline tracking-wide">Redo</span>
                    </Button>
                    
                    {/* Divider */}
                    <div className="w-px h-6 bg-white/[0.08]" />
                    
                    {/* Shortcuts - PRIMARY accent button */}
                    <Button
                      onClick={() => setShowShortcuts(!showShortcuts)}
                      size="sm"
                      className="min-h-[44px] px-4 sm:px-6 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-900 border-0 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/30"
                    >
                      <Keyboard className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline tracking-wide" style={{ fontWeight: 500 }}>Shortcuts</span>
                    </Button>
                  </div>
                  
                  {/* Theme toggle - refined pill */}
                  <div className="inline-flex p-1.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl">
                    <DarkModeToggle />
                  </div>
                </div>
                
                {/* Decorative color chips */}
                <div className="flex items-center justify-center gap-2 opacity-40">
                  <div className="w-8 h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-lg" />
                  <div className="w-8 h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg" />
                  <div className="w-8 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg" />
                  <div className="w-8 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg" />
                  <div className="w-8 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" />
                </div>
                
                {/* Keyboard Shortcuts Help - elevated modal */}
                {showShortcuts && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md p-6 sm:p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl text-left animate-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg text-neutral-50 tracking-wide" style={{ fontWeight: 500 }}>Keyboard Shortcuts</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowShortcuts(false)}
                          className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.08]"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3 text-sm">
                        {shortcuts.map((shortcut, idx) => (
                          <div key={idx} className="flex justify-between items-center gap-4 group py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                            <span className="text-neutral-400 group-hover:text-neutral-200 transition-colors text-xs sm:text-sm">
                              {shortcut.description}
                            </span>
                            <code className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-xs tracking-wider text-neutral-300 group-hover:border-amber-500/30 group-hover:bg-white/[0.08] transition-colors whitespace-nowrap">
                              {shortcut.ctrl && 'Ctrl+'}{shortcut.shift && 'Shift+'}{shortcut.key.toUpperCase()}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="space-y-6 sm:space-y-8">
                <PaletteManager
                  onSavePalette={handleSavePalette}
                  loadedColors={currentPalette}
                  onColorsChange={setCurrentPalette}
                  selectedColorIndex={selectedColorIndex}
                  onSelectColor={setSelectedColorIndex}
                />
                
                <Tabs defaultValue="generate" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-neutral-100 dark:bg-neutral-800 h-auto">
                    <TabsTrigger value="generate" className="min-h-[44px] text-xs sm:text-sm">Generate</TabsTrigger>
                    <TabsTrigger value="harmony" className="min-h-[44px] text-xs sm:text-sm">Harmony</TabsTrigger>
                    <TabsTrigger value="gradient" className="min-h-[44px] text-xs sm:text-sm">Gradient</TabsTrigger>
                    <TabsTrigger value="scales" className="min-h-[44px] text-xs sm:text-sm">Scales</TabsTrigger>
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
                  <TabsList className="grid w-full grid-cols-2 bg-neutral-100 dark:bg-neutral-800 h-auto">
                    <TabsTrigger value="basic" className="min-h-[44px] text-xs sm:text-sm">Basic Export</TabsTrigger>
                    <TabsTrigger value="advanced" className="min-h-[44px] text-xs sm:text-sm">Advanced Export</TabsTrigger>
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
              <div className="space-y-6 sm:space-y-8">
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