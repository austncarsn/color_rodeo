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
import { WorkflowBar } from './components/WorkflowBar';
import { PalettePresets } from './components/PalettePresets';
import { ColorInspector } from './components/ColorInspector';
import { BaseColorInput } from './components/BaseColorInput';
import { QuickTips } from './components/QuickTips';
import { SuccessAnimation } from './components/SuccessAnimation';
import type { ColorPalette } from './types/palette';
import { useLocalStorage, useUndoRedo, useKeyboardShortcuts, type KeyboardShortcut } from './hooks';
import { STORAGE_KEYS } from './constants';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { Undo, Redo, Keyboard, X, Sparkles, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

/**
 * Main application component for Color Rodeo
 * 
 * A professional color palette management tool featuring:
 * - Multi-format color input (HEX, RGB, HSL)
 * - Color harmony generation
 * - WCAG accessibility checking
 * - Advanced export options
 * - Dark/light mode support
 * - Keyboard shortcuts
 * - LocalStorage persistence
 * 
 * @returns The main application UI
 */
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
  const [inspectorColor, setInspectorColor] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Handle color selection for inspector
  const handleColorSelect = (index: number | null) => {
    setSelectedColorIndex(index);
    if (index !== null && currentPalette[index]) {
      setInspectorColor(currentPalette[index]);
    } else {
      setInspectorColor(null);
    }
  };
  
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
    setHasInteracted(true);
    toast.success('Palette loaded');
  };

  const handleGenerate = (colors: string[]) => {
    setCurrentPalette(colors);
    setHasInteracted(true);
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
      key: 'Escape',
      callback: () => {
        if (inspectorColor) {
          setInspectorColor(null);
          setSelectedColorIndex(null);
        } else if (showShortcuts) {
          setShowShortcuts(false);
        }
      },
      description: 'Close panels',
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
    <div className="min-h-screen bg-white dark:bg-[#151518] bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-[#151518] dark:via-[#1A1B1F] dark:to-[#151518]">
      <Toaster position="top-center" richColors />
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 max-w-[1600px]">
        {/* Main elevated container with refined border */}
        <div className="bg-white dark:bg-[#18191D] border border-neutral-200 dark:border-[#292B33] rounded-2xl sm:rounded-3xl shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Premium neutral hero with soft accents */}
          <div className="relative bg-neutral-50 dark:bg-[#18191D] border-b border-neutral-200 dark:border-[#292B33] overflow-hidden">
            {/* Subtle center glow - very gentle */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,85,0.06),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(242,196,107,0.03),transparent_60%)]" />
            
            {/* Fine noise texture */}
            <div 
              className="absolute inset-0 opacity-[0.02]" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            />
            
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
            
            {/* Content */}
            <div className="relative px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-8 sm:py-10 md:py-12 lg:py-16">
              <div className="max-w-4xl mx-auto text-center">
                
                {/* Status pill with saffron accent */}
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 rounded-full bg-white dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] animate-in fade-in slide-in-from-top-2 duration-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4A855] dark:bg-[#F2C46B] shadow-[0_0_6px_rgba(212,168,85,0.6)] dark:shadow-[0_0_6px_rgba(242,196,107,0.4)]" />
                  <span className="text-[10px] sm:text-xs tracking-wider text-neutral-600 dark:text-[#C1C4CF] uppercase">Professional Color Tools</span>
                </div>
                
                {/* Logo with refined gradient */}
                <div className="mb-4 sm:mb-6 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
                  <h1 
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-transparent bg-clip-text mb-3 sm:mb-4 leading-[0.9]" 
                    style={{ 
                      fontFamily: 'Bebas Neue, sans-serif', 
                      fontWeight: 400,
                      backgroundImage: 'linear-gradient(90deg, #EF4444, #F97316, #F59E0B, #84CC16, #10B981, #06B6D4, #3B82F6, #6366F1, #8B5CF6, #EC4899, #EF4444)',
                      backgroundSize: '200% auto',
                      animation: 'gradient-shift 8s linear infinite',
                    }}
                  >
                    Color Rodeo
                  </h1>
                  <div className="h-px w-16 sm:w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4A855]/40 dark:via-[#F2C46B]/30 to-transparent rounded-full mb-4 sm:mb-6" />
                </div>
                
                {/* Refined tagline */}
                <p className="text-neutral-600 dark:text-[#C1C4CF] max-w-xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 md:mb-10 tracking-wide animate-in fade-in slide-in-from-top-6 duration-700 delay-200 px-4" style={{ fontWeight: 400 }}>
                  Professional color tools for designers and developers
                </p>
                
                {/* Premium control group - reduced glow */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-8 duration-700 delay-300 px-3">
                  {/* Main action group - subtle container */}
                  <div className="w-full sm:w-auto inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.3)]">
                    {/* Undo */}
                    <Button
                      onClick={undo}
                      disabled={!canUndo}
                      variant="ghost"
                      size="sm"
                      className="flex-1 sm:flex-none min-h-[44px] px-3 sm:px-4 md:px-5 bg-transparent hover:bg-neutral-100 dark:hover:bg-[#23252B] border-0 text-neutral-500 dark:text-[#8C909A] hover:text-neutral-700 dark:hover:text-[#C1C4CF] transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-500 dark:disabled:hover:text-[#8C909A]"
                    >
                      <Undo className="w-4 h-4 sm:mr-2" />
                      <span className="text-xs sm:text-sm tracking-wide">Undo</span>
                    </Button>
                    
                    {/* Redo */}
                    <Button
                      onClick={redo}
                      disabled={!canRedo}
                      variant="ghost"
                      size="sm"
                      className="flex-1 sm:flex-none min-h-[44px] px-3 sm:px-4 md:px-5 bg-transparent hover:bg-neutral-100 dark:hover:bg-[#23252B] border-0 text-neutral-500 dark:text-[#8C909A] hover:text-neutral-700 dark:hover:text-[#C1C4CF] transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-500 dark:disabled:hover:text-[#8C909A]"
                    >
                      <Redo className="w-4 h-4 sm:mr-2" />
                      <span className="text-xs sm:text-sm tracking-wide">Redo</span>
                    </Button>
                    
                    {/* Divider */}
                    <div className="w-px h-6 bg-neutral-200 dark:bg-[#292B33]" />
                    
                    {/* Shortcuts - PRIMARY saffron button with tactile feel */}
                    <Button
                      onClick={() => setShowShortcuts(!showShortcuts)}
                      size="sm"
                      className="flex-1 sm:flex-none min-h-[44px] px-3 sm:px-4 md:px-6 bg-[#F2C46B] hover:bg-[#D4A855] text-[#121212] border-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Keyboard className="w-4 h-4 sm:mr-2" />
                      <span className="text-xs sm:text-sm tracking-wide" style={{ fontWeight: 500 }}>Shortcuts</span>
                    </Button>
                  </div>
                  
                  {/* Theme toggle - refined pill */}
                  <div className="inline-flex p-1.5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.3)]">
                    <DarkModeToggle />
                  </div>
                </div>
                
                {/* Decorative color chips - subtle */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 opacity-30 animate-in fade-in zoom-in duration-700 delay-500">
                  <div className="w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-sm" />
                  <div className="w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 shadow-sm" />
                  <div className="w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm" />
                  <div className="w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-sm" />
                  <div className="w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm" />
                </div>
                
                {/* Divider */}
                <div className="my-8 sm:my-10 md:my-12 h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-neutral-200 dark:via-[#292B33] to-transparent" />
                
                {/* Step 1: Base Color Input */}
                <BaseColorInput onGenerate={handleGenerate} />
                
                {/* Palette Presets */}
                <div className="mt-6 sm:mt-8">
                  <PalettePresets onLoadPreset={handleLoadPalette} />
                </div>
                
                {/* Keyboard Shortcuts Help - refined modal */}
                {showShortcuts && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowShortcuts(false)}>
                    <div className="w-full max-w-md p-6 sm:p-8 bg-white dark:bg-[#18191D] rounded-2xl border border-neutral-200 dark:border-[#292B33] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.5)] text-left animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-[#F2C46B]/10 border border-[#F2C46B]/20 flex items-center justify-center">
                            <Keyboard className="w-5 h-5 text-[#D4A855] dark:text-[#F2C46B]" />
                          </div>
                          <h3 className="text-lg text-neutral-900 dark:text-[#F5F5F7] tracking-wide" style={{ fontWeight: 500 }}>Keyboard Shortcuts</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowShortcuts(false)}
                          className="h-8 w-8 p-0 text-neutral-500 dark:text-[#8C909A] hover:text-neutral-900 dark:hover:text-[#F5F5F7] hover:bg-neutral-100 dark:hover:bg-[#23252B]"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        {shortcuts.filter(s => s.description !== 'Close panels').map((shortcut, idx) => (
                          <div key={idx} className="flex justify-between items-center gap-4 group py-2.5 px-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#23252B] transition-all duration-200">
                            <span className="text-neutral-600 dark:text-[#8C909A] group-hover:text-neutral-800 dark:group-hover:text-[#C1C4CF] transition-colors text-xs sm:text-sm">
                              {shortcut.description}
                            </span>
                            <code className="px-3 py-1.5 bg-neutral-100 dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-lg text-xs tracking-wider text-neutral-700 dark:text-[#C1C4CF] group-hover:border-[#F2C46B]/30 group-hover:bg-neutral-50 dark:group-hover:bg-[#23252B] group-hover:scale-105 transition-all duration-200 whitespace-nowrap">
                              {shortcut.ctrl && 'Ctrl+'}{shortcut.shift && 'Shift+'}{shortcut.key.toUpperCase()}
                            </code>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-3 bg-[#F2C46B]/5 border border-[#F2C46B]/15 rounded-lg flex items-start gap-3">
                        <Info className="w-4 h-4 text-[#D4A855] dark:text-[#F2C46B] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-neutral-600 dark:text-[#8C909A] leading-relaxed">
                          Press <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-[#23252B] rounded text-[#D4A855] dark:text-[#F2C46B]">Esc</code> to close open panels and dialogs
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Workflow progress bar */}
            <WorkflowBar 
              currentPhase={currentPalette.length === 0 ? 'input' : 'generate'}
              hasColors={currentPalette.length > 0}
            />
            
            {/* Empty state guidance */}
            {currentPalette.length === 0 && hasInteracted === false && (
              <div className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-amber-500/5 to-cyan-500/5 border border-amber-500/20 rounded-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 mb-4">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg text-neutral-700 dark:text-neutral-300 mb-2" style={{ fontWeight: 500 }}>
                  Let's Create Something Beautiful
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Enter a base color above, choose a preset palette, or paste multiple hex codes to get started with your color journey.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="space-y-6 sm:space-y-8">
                <PaletteManager
                  onSavePalette={handleSavePalette}
                  loadedColors={currentPalette}
                  onColorsChange={setCurrentPalette}
                  selectedColorIndex={selectedColorIndex}
                  onSelectColor={handleColorSelect}
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
      
      {/* Floating Color Inspector */}
      {inspectorColor && (
        <ColorInspector 
          color={inspectorColor} 
          onClose={() => {
            setInspectorColor(null);
            setSelectedColorIndex(null);
          }}
        />
      )}
    </div>
  );
}