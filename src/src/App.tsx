import { useState, useEffect } from 'react';
import { BaseColorInput } from './components/BaseColorInput';
import { PaletteManager } from './components/PaletteManager';
import { PaletteGenerator } from './components/PaletteGenerator';
import { SavedPalettes } from './components/SavedPalettes';
import { AccessibilityChecker } from './components/AccessibilityChecker';
import { ExportImport } from './components/ExportImport';
import { ColorHarmonyVisualizer } from './components/ColorHarmonyVisualizer';
import { GradientGenerator } from './components/GradientGenerator';
import { ColorScales } from './components/ColorScales';
import { ColorInspector } from './components/ColorInspector';
import { ContrastMatrix } from './components/ContrastMatrix';
import { ColorAdjustmentPanel } from './components/ColorAdjustmentPanel';
import { PaletteUtilities } from './components/PaletteUtilities';
import { AdvancedExport } from './components/AdvancedExport';
import { DarkModeToggle } from './components/DarkModeToggle';
import { PalettePresets } from './components/PalettePresets';
import { QuickActionsFAB } from './components/QuickActionsFAB';
import { ColorTrends } from './components/ColorTrends';
import { PaletteAnalytics } from './components/PaletteAnalytics';
import { OnboardingTour } from './components/OnboardingTour';
import type { ColorPalette } from './types/palette';
import { useLocalStorage, useUndoRedo, useKeyboardShortcuts, type KeyboardShortcut } from './hooks';
import { STORAGE_KEYS } from './constants';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { Undo, Redo, Keyboard, X, Sparkles, Info, ChevronDown, ChevronUp, Palette, Wand2, Eye, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';

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
  const [workflowStep, setWorkflowStep] = useState<'input' | 'generate' | 'evaluate' | 'export'>('input');
  const [advancedSectionsOpen, setAdvancedSectionsOpen] = useState({
    utilities: false,
    adjustments: false,
  });
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set(['input']));
  
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
    setWorkflowStep('generate');
    toast.success('Palette loaded');
  };

  const handleGenerate = (colors: string[]) => {
    setCurrentPalette(colors);
    setHasInteracted(true);
    if (colors.length > 0) {
      setWorkflowStep('generate');
      // Show a helpful toast suggesting next step
      setTimeout(() => {
        toast.info('Ready to refine! Try different generation modes or evaluate accessibility.');
      }, 500);
    }
  };

  const handleImport = (imported: ColorPalette | ColorPalette[]) => {
    if (Array.isArray(imported)) {
      setSavedPalettes([...imported, ...savedPalettes]);
      toast.success(`Imported ${imported.length} palettes`);
    } else {
      setSavedPalettes([imported, ...savedPalettes]);
      toast.success('Palette imported');
    }
  };

  // Handle workflow step navigation with validation
  const navigateToStep = (step: 'input' | 'generate' | 'evaluate' | 'export') => {
    if (step === 'input') {
      setWorkflowStep(step);
      return;
    }
    
    // Require palette for other steps
    if (currentPalette.length === 0) {
      toast.error('Please create or load a palette first');
      setWorkflowStep('input');
      return;
    }
    
    setWorkflowStep(step);
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
      key: '1',
      callback: () => {
        navigateToStep('input');
        toast.success('Switched to Input');
      },
      description: 'Go to Input step',
    },
    {
      key: '2',
      callback: () => {
        navigateToStep('generate');
      },
      description: 'Go to Generate step',
    },
    {
      key: '3',
      callback: () => {
        navigateToStep('evaluate');
      },
      description: 'Go to Evaluate step',
    },
    {
      key: '4',
      callback: () => {
        navigateToStep('export');
      },
      description: 'Go to Export step',
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

  // Handle random color generation for FAB
  const handleGenerateRandom = () => {
    const randomColors = Array.from({ length: 5 }, () => 
      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    );
    handleGenerate(randomColors);
    toast.success('Generated random palette');
  };

  // Update document title
  useEffect(() => {
    document.title = 'Color Rodeo - Professional Color Palette Manager';
  }, []);

  // Auto-update workflow step based on palette state
  useEffect(() => {
    if (currentPalette.length === 0 && workflowStep !== 'input') {
      setWorkflowStep('input');
    }
  }, [currentPalette.length, workflowStep]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#151518] bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-[#151518] dark:via-[#1A1B1F] dark:to-[#151518]">
      <Toaster position="top-center" richColors />
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 max-w-[1600px]">
        {/* Main elevated container with refined border */}
        <div className="bg-white dark:bg-[#18191D] border border-neutral-200 dark:border-[#292B33] rounded-2xl sm:rounded-3xl shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* ============================================ */}
          {/* HERO / ENTRY ZONE                          */}
          {/* ============================================ */}
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
            <div className="relative px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-8 sm:py-10 md:py-12">
              <div className="max-w-4xl mx-auto text-center">
                
                {/* Status pill with saffron accent */}
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 mb-4 sm:mb-6 rounded-full bg-white dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] animate-in fade-in slide-in-from-top-2 duration-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4A855] dark:bg-[#F2C46B] shadow-[0_0_6px_rgba(212,168,85,0.6)] dark:shadow-[0_0_6px_rgba(242,196,107,0.4)]" />
                  <span className="text-[10px] sm:text-xs tracking-wider text-neutral-600 dark:text-[#C1C4CF] uppercase">Professional Color Tools</span>
                </div>
                
                {/* Logo with refined gradient */}
                <div className="mb-3 sm:mb-4 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
                  <h1 
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-transparent bg-clip-text mb-2 sm:mb-3 leading-[0.9]" 
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
                  <div className="h-px w-16 sm:w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4A855]/40 dark:via-[#F2C46B]/30 to-transparent rounded-full mb-3 sm:mb-4" />
                </div>
                
                {/* Refined tagline */}
                <p className="text-neutral-600 dark:text-[#C1C4CF] max-w-xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 tracking-wide animate-in fade-in slide-in-from-top-6 duration-700 delay-200 px-4" style={{ fontWeight: 400 }}>
                  Professional color tools for designers and developers
                </p>
                
                {/* Compact Utility Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-8 duration-700 delay-300 px-3">
                  {/* Main action group - subtle container */}
                  <div className="w-full sm:w-auto inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl bg-white dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.3)]">
                    {/* Undo */}
                    <Button
                      onClick={undo}
                      disabled={!canUndo}
                      variant="ghost"
                      size="sm"
                      className="flex-1 sm:flex-none min-h-[40px] px-3 sm:px-4 bg-transparent hover:bg-neutral-100 dark:hover:bg-[#23252B] border-0 text-neutral-500 dark:text-[#8C909A] hover:text-neutral-700 dark:hover:text-[#C1C4CF] transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-500 dark:disabled:hover:text-[#8C909A]"
                    >
                      <Undo className="w-4 h-4 sm:mr-1.5" />
                      <span className="text-xs tracking-wide hidden sm:inline">Undo</span>
                    </Button>
                    
                    {/* Redo */}
                    <Button
                      onClick={redo}
                      disabled={!canRedo}
                      variant="ghost"
                      size="sm"
                      className="flex-1 sm:flex-none min-h-[40px] px-3 sm:px-4 bg-transparent hover:bg-neutral-100 dark:hover:bg-[#23252B] border-0 text-neutral-500 dark:text-[#8C909A] hover:text-neutral-700 dark:hover:text-[#C1C4CF] transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-500 dark:disabled:hover:text-[#8C909A]"
                    >
                      <Redo className="w-4 h-4 sm:mr-1.5" />
                      <span className="text-xs tracking-wide hidden sm:inline">Redo</span>
                    </Button>
                    
                    {/* Divider */}
                    <div className="w-px h-6 bg-neutral-200 dark:bg-[#292B33]" />
                    
                    {/* Shortcuts - PRIMARY saffron button with tactile feel */}
                    <Button
                      onClick={() => setShowShortcuts(!showShortcuts)}
                      size="sm"
                      className="flex-1 sm:flex-none min-h-[40px] px-3 sm:px-5 bg-[#F2C46B] hover:bg-[#D4A855] text-[#121212] border-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Keyboard className="w-4 h-4 sm:mr-1.5" />
                      <span className="text-xs tracking-wide" style={{ fontWeight: 500 }}>Shortcuts</span>
                    </Button>
                  </div>
                  
                  {/* Theme toggle - refined pill */}
                  <div className="inline-flex p-1.5 rounded-xl bg-white dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.3)]">
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
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* PRIMARY ACTION ZONE                        */}
          {/* ============================================ */}
          <div className="bg-white dark:bg-[#18191D] border-b border-neutral-200 dark:border-[#292B33] px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-neutral-900 dark:text-[#F5F5F7] mb-2" style={{ fontWeight: 500 }}>
                  Start Your Color Journey
                </h2>
                <p className="text-sm text-neutral-600 dark:text-[#8C909A]">
                  Enter a base color or paste multiple hex codes to begin
                </p>
              </div>
              
              {/* Base Color Input - Visually Dominant */}
              <BaseColorInput onGenerate={handleGenerate} />
              
              {/* Palette Presets - Quick Inspiration */}
              <div className="mt-8">
                <div className="mb-4 text-center">
                  <h3 className="text-sm text-neutral-700 dark:text-[#C1C4CF] mb-1" style={{ fontWeight: 500 }}>
                    or start with a preset
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
                    Click any palette to load it instantly
                  </p>
                </div>
                <PalettePresets onLoadPreset={handleLoadPalette} />
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* WORKFLOW TABS - Step Navigation            */}
          {/* ============================================ */}
          <div className="sticky top-0 z-30 bg-white dark:bg-[#18191D] border-b border-neutral-200 dark:border-[#292B33] shadow-sm">
            <div className="px-2 sm:px-4 md:px-8 lg:px-12 py-3 sm:py-4">
              {/* Mobile: Stacked compact view */}
              <div className="flex sm:hidden items-center justify-between gap-1 max-w-full mx-auto overflow-x-auto">
                <button
                  onClick={() => navigateToStep('input')}
                  className={`flex-1 min-w-[70px] flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 ${
                    workflowStep === 'input'
                      ? 'bg-[#F2C46B] text-[#121212] shadow-sm'
                      : 'bg-neutral-100 dark:bg-[#1E1F23] text-neutral-600 dark:text-[#8C909A]'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span className="text-[10px]" style={{ fontWeight: 500 }}>Input</span>
                </button>
                
                <button
                  onClick={() => navigateToStep('generate')}
                  className={`flex-1 min-w-[70px] flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 ${
                    workflowStep === 'generate'
                      ? 'bg-[#F2C46B] text-[#121212] shadow-sm'
                      : 'bg-neutral-100 dark:bg-[#1E1F23] text-neutral-600 dark:text-[#8C909A]'
                  }`}
                >
                  <Wand2 className="w-4 h-4" />
                  <span className="text-[10px]" style={{ fontWeight: 500 }}>Generate</span>
                </button>
                
                <button
                  onClick={() => navigateToStep('evaluate')}
                  className={`flex-1 min-w-[70px] flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 ${
                    workflowStep === 'evaluate'
                      ? 'bg-[#F2C46B] text-[#121212] shadow-sm'
                      : 'bg-neutral-100 dark:bg-[#1E1F23] text-neutral-600 dark:text-[#8C909A]'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-[10px]" style={{ fontWeight: 500 }}>Evaluate</span>
                </button>
                
                <button
                  onClick={() => navigateToStep('export')}
                  className={`flex-1 min-w-[70px] flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 ${
                    workflowStep === 'export'
                      ? 'bg-[#F2C46B] text-[#121212] shadow-sm'
                      : 'bg-neutral-100 dark:bg-[#1E1F23] text-neutral-600 dark:text-[#8C909A]'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-[10px]" style={{ fontWeight: 500 }}>Export</span>
                </button>
              </div>

              {/* Desktop: Horizontal with separators */}
              <div className="hidden sm:flex items-center justify-center gap-2 sm:gap-4 max-w-3xl mx-auto">
                <button
                  onClick={() => navigateToStep('input')}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-300 ${
                    workflowStep === 'input'
                      ? 'bg-[#F2C46B] text-[#121212] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(0,0,0,0.3)]'
                      : 'bg-neutral-100 dark:bg-[#1E1F23] text-neutral-600 dark:text-[#8C909A] hover:bg-neutral-200 dark:hover:bg-[#23252B]'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span className="text-xs sm:text-sm" style={{ fontWeight: 500 }}>Input</span>
                </button>
                
                <div className="h-px w-4 sm:w-8 bg-neutral-200 dark:bg-[#292B33]" />
                
                <button
                  onClick={() => navigateToStep('generate')}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-300 ${
                    workflowStep === 'generate'
                      ? 'bg-[#F2C46B] text-[#121212] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(0,0,0,0.3)]'
                      : 'bg-neutral-100 dark:bg-[#1E1F23] text-neutral-600 dark:text-[#8C909A] hover:bg-neutral-200 dark:hover:bg-[#23252B] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 dark:disabled:hover:bg-[#1E1F23]'
                  }`}
                >
                  <Wand2 className="w-4 h-4" />
                  <span className="text-xs sm:text-sm" style={{ fontWeight: 500 }}>Generate</span>
                </button>
                
                <div className="h-px w-4 sm:w-8 bg-neutral-200 dark:bg-[#292B33]" />
                
                <button
                  onClick={() => navigateToStep('evaluate')}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-300 ${
                    workflowStep === 'evaluate'
                      ? 'bg-[#F2C46B] text-[#121212] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(0,0,0,0.3)]'
                      : 'bg-neutral-100 dark:bg-[#1E1F23] text-neutral-600 dark:text-[#8C909A] hover:bg-neutral-200 dark:hover:bg-[#23252B] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 dark:disabled:hover:bg-[#1E1F23]'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-xs sm:text-sm" style={{ fontWeight: 500 }}>Evaluate</span>
                </button>
                
                <div className="h-px w-4 sm:w-8 bg-neutral-200 dark:bg-[#292B33]" />
                
                <button
                  onClick={() => navigateToStep('export')}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-300 ${
                    workflowStep === 'export'
                      ? 'bg-[#F2C46B] text-[#121212] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(0,0,0,0.3)]'
                      : 'bg-neutral-100 dark:bg-[#1E1F23] text-neutral-600 dark:text-[#8C909A] hover:bg-neutral-200 dark:hover:bg-[#23252B] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 dark:disabled:hover:bg-[#1E1F23]'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-xs sm:text-sm" style={{ fontWeight: 500 }}>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* MAIN WORKSPACE                             */}
          {/* ============================================ */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            
            {/* Empty state guidance */}
            {currentPalette.length === 0 && hasInteracted === false && workflowStep === 'input' && (
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
            
            {/* Step-specific content guidance */}
            {workflowStep === 'input' && currentPalette.length === 0 && (
              <div className="mb-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-center">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  <strong>Step 1: Input</strong> - Start by entering a base color or choosing a preset above
                </p>
              </div>
            )}
            
            {workflowStep === 'generate' && currentPalette.length > 0 && (
              <div className="mb-8 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl text-center">
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  <strong>Step 2: Generate</strong> - Refine your palette using harmony rules, gradients, or scales below
                </p>
              </div>
            )}
            
            {workflowStep === 'evaluate' && currentPalette.length > 0 && (
              <div className="mb-8 p-4 bg-green-500/5 border border-green-500/20 rounded-xl text-center">
                <p className="text-sm text-green-600 dark:text-green-400">
                  <strong>Step 3: Evaluate</strong> - Review accessibility scores and contrast ratios on the right
                </p>
              </div>
            )}
            
            {workflowStep === 'export' && currentPalette.length > 0 && (
              <div className="mb-8 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  <strong>Step 4: Export</strong> - Scroll down to export your palette in various formats
                </p>
              </div>
            )}
            
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${
              workflowStep === 'export' ? 'opacity-50 pointer-events-none' : ''
            }`}>
              
              {/* ============================================ */}
              {/* LEFT COLUMN - Primary Actions              */}
              {/* ============================================ */}
              <div className="space-y-8">
                
                {/* Section: Palette Creation */}
                <div className={workflowStep === 'input' ? 'ring-2 ring-[#F2C46B]/30 rounded-2xl p-4 -m-4' : ''}>
                  <div className="mb-4">
                    <h3 className="text-neutral-900 dark:text-[#F5F5F7] mb-1" style={{ fontWeight: 500 }}>
                      Your Palette
                      {workflowStep === 'input' && (
                        <span className="ml-2 text-xs text-[#D4A855] dark:text-[#F2C46B]">← Start here</span>
                      )}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
                      Manage and organize your colors
                    </p>
                  </div>
                  <PaletteManager
                    onSavePalette={handleSavePalette}
                    loadedColors={currentPalette}
                    onColorsChange={setCurrentPalette}
                    selectedColorIndex={selectedColorIndex}
                    onSelectColor={handleColorSelect}
                  />
                </div>
                
                {/* Section: Generation Modes */}
                <div className={workflowStep === 'generate' ? 'ring-2 ring-[#F2C46B]/30 rounded-2xl p-4 -m-4' : ''}>
                  <div className="mb-4">
                    <h3 className="text-neutral-900 dark:text-[#F5F5F7] mb-1" style={{ fontWeight: 500 }}>
                      Generation Modes
                      {workflowStep === 'generate' && (
                        <span className="ml-2 text-xs text-[#D4A855] dark:text-[#F2C46B]">← Refine here</span>
                      )}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
                      Create palettes using different color theories
                    </p>
                  </div>
                  <Tabs defaultValue="generate" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-neutral-100 dark:bg-[#1E1F23] h-auto p-1 rounded-xl">
                      <TabsTrigger value="generate" className="min-h-[40px] text-xs rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#23252B] data-[state=active]:shadow-sm">Generate</TabsTrigger>
                      <TabsTrigger value="harmony" className="min-h-[40px] text-xs rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#23252B] data-[state=active]:shadow-sm">Harmony</TabsTrigger>
                      <TabsTrigger value="gradient" className="min-h-[40px] text-xs rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#23252B] data-[state=active]:shadow-sm">Gradient</TabsTrigger>
                      <TabsTrigger value="scales" className="min-h-[40px] text-xs rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#23252B] data-[state=active]:shadow-sm">Scales</TabsTrigger>
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
                </div>
              </div>
              
              {/* ============================================ */}
              {/* RIGHT COLUMN - Support Tools               */}
              {/* ============================================ */}
              <div className="space-y-8">
                
                {/* Section: Palette Analytics */}
                {currentPalette.length > 0 && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-neutral-900 dark:text-[#F5F5F7] mb-1" style={{ fontWeight: 500 }}>
                        Palette Insights
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
                        Analytics and harmony scoring
                      </p>
                    </div>
                    <div className="bg-white dark:bg-[#18191D] border border-neutral-200 dark:border-[#292B33] rounded-xl p-4 shadow-lg">
                      <PaletteAnalytics colors={currentPalette} />
                    </div>
                  </div>
                )}
                
                {/* Section: Accessibility Analysis */}
                <div className={workflowStep === 'evaluate' ? 'ring-2 ring-[#F2C46B]/30 rounded-2xl p-4 -m-4' : ''}>
                  <div className="mb-4">
                    <h3 className="text-neutral-900 dark:text-[#F5F5F7] mb-1" style={{ fontWeight: 500 }}>
                      Accessibility
                      {workflowStep === 'evaluate' && (
                        <span className="ml-2 text-xs text-[#D4A855] dark:text-[#F2C46B]">← Check here</span>
                      )}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
                      WCAG compliance and contrast analysis
                    </p>
                  </div>
                  <AccessibilityChecker colors={currentPalette} />
                </div>
                
                {/* Section: Saved Palettes */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-neutral-900 dark:text-[#F5F5F7] mb-1" style={{ fontWeight: 500 }}>
                      Saved Palettes
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
                      Your collection of saved color palettes
                    </p>
                  </div>
                  <SavedPalettes
                    palettes={savedPalettes}
                    onDeletePalette={handleDeletePalette}
                    onLoadPalette={handleLoadPalette}
                  />
                </div>
                
                {/* Section: Contrast Matrix (Collapsible) */}
                <div className={workflowStep === 'evaluate' ? 'ring-2 ring-[#F2C46B]/30 rounded-2xl p-4 -m-4' : ''}>
                  <Collapsible defaultOpen={workflowStep === 'evaluate'}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 bg-neutral-100 dark:bg-[#1E1F23] rounded-xl text-sm text-neutral-700 dark:text-[#C1C4CF] hover:bg-neutral-200 dark:hover:bg-[#23252B] transition-all duration-300 group" style={{ fontWeight: 500 }}>
                      <div className="flex items-center gap-2">
                        <span>Contrast Matrix</span>
                        <span className="text-xs text-neutral-500 dark:text-[#8C909A]" style={{ fontWeight: 400 }}>Advanced color relationships</span>
                      </div>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <ContrastMatrix colors={currentPalette} />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                
                {/* Section: Advanced Adjustments (Collapsible) */}
                <div>
                  <Collapsible open={advancedSectionsOpen.adjustments} onOpenChange={(open) => setAdvancedSectionsOpen({ ...advancedSectionsOpen, adjustments: open })}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 bg-neutral-100 dark:bg-[#1E1F23] rounded-xl text-sm text-neutral-700 dark:text-[#C1C4CF] hover:bg-neutral-200 dark:hover:bg-[#23252B] transition-all duration-300 group" style={{ fontWeight: 500 }}>
                      <div className="flex items-center gap-2">
                        <span>Color Adjustments</span>
                        <span className="text-xs text-neutral-500 dark:text-[#8C909A]" style={{ fontWeight: 400 }}>Fine-tune individual colors</span>
                      </div>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-4">
                      <ColorAdjustmentPanel
                        colors={currentPalette}
                        selectedColorIndex={selectedColorIndex}
                        onColorChange={handleColorChange}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                
                {/* Section: Palette Utilities (Collapsible) */}
                <div>
                  <Collapsible open={advancedSectionsOpen.utilities} onOpenChange={(open) => setAdvancedSectionsOpen({ ...advancedSectionsOpen, utilities: open })}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 bg-neutral-100 dark:bg-[#1E1F23] rounded-xl text-sm text-neutral-700 dark:text-[#C1C4CF] hover:bg-neutral-200 dark:hover:bg-[#23252B] transition-all duration-300 group" style={{ fontWeight: 500 }}>
                      <div className="flex items-center gap-2">
                        <span>Palette Utilities</span>
                        <span className="text-xs text-neutral-500 dark:text-[#8C909A]" style={{ fontWeight: 400 }}>Sort, shuffle & transform</span>
                      </div>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <PaletteUtilities 
                        colors={currentPalette}
                        onColorsChange={setCurrentPalette}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>
            
            {/* ============================================ */}
            {/* COLOR TRENDS/INSPIRATION SECTION           */}
            {/* ============================================ */}
            <div className="mt-12 pt-12 border-t border-neutral-200 dark:border-[#292B33]">
              <div className="text-center mb-8">
                <h2 className="text-neutral-900 dark:text-[#F5F5F7] mb-2" style={{ fontWeight: 500 }}>
                  Color Inspiration
                </h2>
                <p className="text-sm text-neutral-600 dark:text-[#8C909A]">
                  Explore trending, seasonal, and professional color palettes
                </p>
              </div>
              <ColorTrends onLoadPalette={handleLoadPalette} />
            </div>
            
            {/* ============================================ */}
            {/* EXPORT ZONE - Final Section                */}
            {/* ============================================ */}
            <div className={`mt-12 pt-12 border-t border-neutral-200 dark:border-[#292B33] ${
              workflowStep === 'export' ? 'ring-2 ring-[#F2C46B]/30 rounded-2xl p-6 -m-6' : ''
            }`}>
              <div className="text-center mb-8">
                <h2 className="text-neutral-900 dark:text-[#F5F5F7] mb-2" style={{ fontWeight: 500 }}>
                  Export & Share
                  {workflowStep === 'export' && (
                    <span className="ml-2 text-xs text-[#D4A855] dark:text-[#F2C46B]">← Export here</span>
                  )}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-[#8C909A]">
                  Export your palette in multiple formats or import existing palettes
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-neutral-100 dark:bg-[#1E1F23] h-auto p-1 rounded-xl max-w-md mx-auto mb-6">
                    <TabsTrigger value="basic" className="min-h-[44px] text-sm rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#23252B] data-[state=active]:shadow-sm">Basic Export</TabsTrigger>
                    <TabsTrigger value="advanced" className="min-h-[44px] text-sm rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#23252B] data-[state=active]:shadow-sm">Advanced Export</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="mt-0">
                    <ExportImport 
                      palette={currentPaletteForExport} 
                      onImport={handleImport}
                    />
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="mt-0">
                    <AdvancedExport colors={currentPalette} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
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
      
      {/* Quick Actions FAB */}
      <QuickActionsFAB
        colors={currentPalette}
        onSavePalette={handleSavePalette}
        onGenerateRandom={handleGenerateRandom}
        paletteName={currentPaletteName}
      />
    </div>
  );
}