import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      const isDarkMode = stored === 'true';
      setIsDark(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Button
      onClick={toggleDarkMode}
      variant="ghost"
      size="sm"
      className="min-h-[44px] px-3 sm:px-4 md:px-5 bg-transparent hover:bg-neutral-100 dark:hover:bg-[#23252B] border-0 text-neutral-500 dark:text-[#8C909A] hover:text-neutral-700 dark:hover:text-[#C1C4CF] transition-all duration-300"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline text-xs sm:text-sm tracking-wide">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline text-xs sm:text-sm tracking-wide">Dark</span>
        </>
      )}
    </Button>
  );
}