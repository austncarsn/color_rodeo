import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { ReactNode } from 'react';

interface TooltipWrapperProps {
  children: ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

export function TooltipWrapper({ 
  children, 
  content, 
  side = 'top',
  delayDuration = 300 
}: TooltipWrapperProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-white/[0.08] text-neutral-200 px-3 py-1.5 text-xs"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
