import { useState } from 'react';
import { Save, Copy, Sparkles, X, Share2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface QuickActionsFABProps {
  colors: string[];
  onSavePalette: (name: string, colors: string[]) => void;
  onGenerateRandom: () => void;
  paletteName: string;
}

export function QuickActionsFAB({ 
  colors, 
  onSavePalette, 
  onGenerateRandom,
  paletteName 
}: QuickActionsFABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyAll = async () => {
    if (colors.length === 0) {
      toast.error('No colors to copy');
      return;
    }

    const colorString = colors.join(', ');
    try {
      await navigator.clipboard.writeText(colorString);
      toast.success(`Copied ${colors.length} color${colors.length > 1 ? 's' : ''} to clipboard`);
      setIsOpen(false);
    } catch (err) {
      toast.error('Failed to copy colors');
    }
  };

  const handleSave = () => {
    if (colors.length === 0) {
      toast.error('No colors to save');
      return;
    }

    const name = prompt('Enter palette name:', paletteName);
    if (name && name.trim()) {
      onSavePalette(name.trim(), colors);
      setIsOpen(false);
    }
  };

  const handleGenerateRandom = () => {
    onGenerateRandom();
    setIsOpen(false);
  };

  const handleShare = async () => {
    if (colors.length === 0) {
      toast.error('No colors to share');
      return;
    }

    const colorString = colors.map(c => c.replace('#', '')).join('-');
    const url = `${window.location.origin}?colors=${colorString}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Color Palette',
          text: `Check out this color palette: ${colors.join(', ')}`,
          url: url,
        });
        setIsOpen(false);
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard');
        }
        setIsOpen(false);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Shareable link copied to clipboard');
      setIsOpen(false);
    }
  };

  const actions = [
    {
      icon: Save,
      label: 'Save',
      onClick: handleSave,
      color: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
      disabled: colors.length === 0,
    },
    {
      icon: Copy,
      label: 'Copy All',
      onClick: handleCopyAll,
      color: 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
      disabled: colors.length === 0,
    },
    {
      icon: Sparkles,
      label: 'Random',
      onClick: handleGenerateRandom,
      color: 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700',
      disabled: false,
    },
    {
      icon: Share2,
      label: 'Share',
      onClick: handleShare,
      color: 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700',
      disabled: colors.length === 0,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Action buttons - appear when open */}
      {isOpen && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-in fade-in slide-in-from-right-2 duration-300`}
              style={{ animationDelay: `${idx * 50}ms` }}
              title={action.label}
            >
              <span className="text-sm whitespace-nowrap" style={{ fontWeight: 500 }}>
                {action.label}
              </span>
              <action.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      )}

      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-[#F2C46B] hover:bg-[#D4A855] text-[#121212] shadow-[0_4px_16px_rgba(212,168,85,0.4)] hover:shadow-[0_6px_24px_rgba(212,168,85,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center relative ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
        title={isOpen ? 'Close quick actions' : 'Quick actions'}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <Sparkles className="w-6 h-6 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
}