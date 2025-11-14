import { Palette, Sparkles, CheckCircle2, Download } from 'lucide-react';

interface WorkflowBarProps {
  currentPhase?: 'input' | 'generate' | 'evaluate' | 'export';
  hasColors?: boolean;
}

export function WorkflowBar({ currentPhase = 'input', hasColors = false }: WorkflowBarProps) {
  const phases = [
    { id: 'input', label: 'Input', icon: Palette },
    { id: 'generate', label: 'Generate', icon: Sparkles },
    { id: 'evaluate', label: 'Evaluate', icon: CheckCircle2 },
    { id: 'export', label: 'Export', icon: Download },
  ] as const;

  return (
    <div className="mb-6 sm:mb-8 md:mb-12">
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-[#1E1F23] backdrop-blur-xl border border-neutral-200 dark:border-[#292B33]">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const isActive = phase.id === currentPhase;
          const isComplete = hasColors && (
            (phase.id === 'input') ||
            (phase.id === 'generate' && currentPhase !== 'input')
          );
          
          return (
            <div key={phase.id} className="flex items-center gap-2 sm:gap-4 md:gap-6">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Phase indicator */}
                <div className={`
                  flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-[#F2C46B]/20 border border-[#F2C46B]/40' 
                    : isComplete 
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-neutral-100 dark:bg-[#18191D] border border-neutral-200 dark:border-[#292B33]'
                  }
                `}>
                  <div className={`
                    relative flex items-center justify-center
                    ${isActive ? 'text-[#D4A855] dark:text-[#F2C46B]' : isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 dark:text-[#8C909A]'}
                  `}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {isActive && (
                      <div className="absolute inset-0 animate-ping">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-30" />
                      </div>
                    )}
                  </div>
                  <span className={`
                    text-[10px] sm:text-xs md:text-sm tracking-wide transition-colors
                    ${isActive 
                      ? 'text-[#D4A855] dark:text-[#F2C46B]' 
                      : isComplete 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-neutral-500 dark:text-[#8C909A]'
                    }
                  `}>
                    {phase.label}
                  </span>
                </div>
              </div>
              
              {/* Connector line */}
              {index < phases.length - 1 && (
                <div className={`
                  hidden sm:block w-6 md:w-12 lg:w-16 h-0.5 rounded-full transition-all duration-500
                  ${isComplete 
                    ? 'bg-gradient-to-r from-emerald-500/30 to-transparent' 
                    : 'bg-neutral-200 dark:bg-[#292B33]'
                  }
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}