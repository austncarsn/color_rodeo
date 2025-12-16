import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface OnboardingStep {
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TOUR_STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to Color Rodeo! 🎨',
    description: 'A professional color palette tool for designers and developers. Let\'s take a quick tour of the key features.',
    position: 'center',
  },
  {
    title: 'Start with a Base Color',
    description: 'Enter a hex color, use the color picker, or generate a random color to begin creating your palette.',
    position: 'center',
  },
  {
    title: 'Quick Presets',
    description: 'Click any preset palette below to load it instantly and start customizing.',
    position: 'center',
  },
  {
    title: 'Workflow Steps',
    description: 'Use keyboard shortcuts 1-4 to quickly navigate between Input, Generate, Evaluate, and Export steps.',
    position: 'center',
  },
  {
    title: 'Generation Modes',
    description: 'Explore different color harmony rules, gradients, and scales to refine your palette.',
    position: 'center',
  },
  {
    title: 'Accessibility Check',
    description: 'Review WCAG compliance and contrast ratios to ensure your colors are accessible.',
    position: 'center',
  },
  {
    title: 'Quick Actions',
    description: 'Use the floating action button (bottom-right) for quick access to save, copy, share, and random palette generation.',
    position: 'center',
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Press ? (Shift + /) to view all keyboard shortcuts. Pro tip: Ctrl+S to save, Ctrl+Z to undo!',
    position: 'center',
  },
];

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent body scroll when tour is active
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  const step = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Tour Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#18191D] rounded-2xl border border-neutral-200 dark:border-[#292B33] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-[#1E1F23] hover:bg-neutral-200 dark:hover:bg-[#23252B] flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <X className="w-4 h-4 text-neutral-600 dark:text-[#8C909A]" />
        </button>

        {/* Progress bar */}
        <div className="h-1.5 bg-neutral-200 dark:bg-[#292B33] rounded-t-2xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D4A855] to-[#F2C46B] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-[#F2C46B]/10 border border-[#F2C46B]/20 rounded-full">
              <span className="text-xs text-[#D4A855] dark:text-[#F2C46B]" style={{ fontWeight: 500 }}>
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </span>
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            <h3 className="text-2xl text-neutral-900 dark:text-[#F5F5F7] mb-3" style={{ fontWeight: 600 }}>
              {step.title}
            </h3>
            <p className="text-neutral-600 dark:text-[#C1C4CF] leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-8 bg-[#F2C46B]' 
                      : index < currentStep
                      ? 'w-1.5 bg-[#D4A855]'
                      : 'w-1.5 bg-neutral-300 dark:bg-[#292B33]'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  className="h-11 px-4 border-neutral-200 dark:border-[#292B33] text-neutral-700 dark:text-[#C1C4CF] hover:bg-neutral-50 dark:hover:bg-[#23252B]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="h-11 px-6 bg-[#F2C46B] hover:bg-[#D4A855] text-[#121212] shadow-md"
              >
                {currentStep < TOUR_STEPS.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Get Started
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Skip button */}
          <div className="text-center mt-4">
            <button
              onClick={handleSkip}
              className="text-xs text-neutral-500 dark:text-[#8C909A] hover:text-neutral-700 dark:hover:text-[#C1C4CF] transition-colors"
            >
              Skip tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
