import { Sparkles, TrendingUp, Calendar, Palette } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner@2.0.3';

interface ColorTrendsProps {
  onLoadPalette: (colors: string[]) => void;
}

// Curated trending and seasonal palettes
const trendingPalettes = {
  popular: [
    {
      name: 'Modern Minimalist',
      colors: ['#1A1A1A', '#F5F5F5', '#4A90E2', '#E8E8E8', '#2D2D2D'],
      description: 'Clean and professional',
    },
    {
      name: 'Warm Sunset',
      colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#FF8C42', '#C44569'],
      description: 'Vibrant and energetic',
    },
    {
      name: 'Ocean Breeze',
      colors: ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#023E8A'],
      description: 'Calm and refreshing',
    },
    {
      name: 'Forest Grove',
      colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2'],
      description: 'Natural and organic',
    },
  ],
  seasonal: [
    {
      name: 'Winter Frost',
      colors: ['#4A5568', '#718096', '#A0AEC0', '#CBD5E0', '#E2E8F0'],
      description: 'Cool and sophisticated',
      season: 'Winter',
    },
    {
      name: 'Spring Bloom',
      colors: ['#F687B3', '#FC8181', '#F6E05E', '#68D391', '#63B3ED'],
      description: 'Fresh and lively',
      season: 'Spring',
    },
    {
      name: 'Summer Vibes',
      colors: ['#FBD38D', '#F6AD55', '#ED8936', '#DD6B20', '#C05621'],
      description: 'Warm and playful',
      season: 'Summer',
    },
    {
      name: 'Autumn Harvest',
      colors: ['#9C4221', '#C05621', '#DD6B20', '#ED8936', '#F6AD55'],
      description: 'Rich and cozy',
      season: 'Fall',
    },
  ],
  professional: [
    {
      name: 'Corporate Blues',
      colors: ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
      description: 'Trustworthy and stable',
    },
    {
      name: 'Tech Noir',
      colors: ['#0F172A', '#1E293B', '#334155', '#64748B', '#94A3B8'],
      description: 'Sleek and modern',
    },
    {
      name: 'Startup Energy',
      colors: ['#7C3AED', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
      description: 'Innovative and bold',
    },
    {
      name: 'Finance Green',
      colors: ['#065F46', '#059669', '#10B981', '#34D399', '#6EE7B7'],
      description: 'Prosperous and growing',
    },
  ],
};

export function ColorTrends({ onLoadPalette }: ColorTrendsProps) {
  const handleLoadPalette = (colors: string[], name: string) => {
    onLoadPalette(colors);
    toast.success(`Loaded "${name}" palette`);
  };

  const PaletteCard = ({ 
    name, 
    colors, 
    description, 
    season 
  }: { 
    name: string; 
    colors: string[]; 
    description: string; 
    season?: string;
  }) => (
    <button
      onClick={() => handleLoadPalette(colors, name)}
      className="group relative bg-white dark:bg-[#1E1F23] rounded-xl border border-neutral-200 dark:border-[#292B33] p-4 hover:border-[#F2C46B] dark:hover:border-[#F2C46B] transition-all duration-300 hover:shadow-lg hover:scale-[1.02] text-left"
    >
      {/* Season badge if available */}
      {season && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-[#F2C46B]/10 border border-[#F2C46B]/20 rounded-full">
          <span className="text-[10px] text-[#D4A855] dark:text-[#F2C46B]" style={{ fontWeight: 500 }}>
            {season}
          </span>
        </div>
      )}

      {/* Color swatches */}
      <div className="flex gap-1 mb-3 h-16 rounded-lg overflow-hidden">
        {colors.map((color, idx) => (
          <div
            key={idx}
            className="flex-1 transition-all duration-300 group-hover:scale-105"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* Info */}
      <div>
        <h4 className="text-sm text-neutral-900 dark:text-[#F5F5F7] mb-1 group-hover:text-[#D4A855] dark:group-hover:text-[#F2C46B] transition-colors" style={{ fontWeight: 500 }}>
          {name}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
          {description}
        </p>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#F2C46B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Popular Palettes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#F2C46B]/10 border border-[#F2C46B]/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#D4A855] dark:text-[#F2C46B]" />
          </div>
          <div>
            <h3 className="text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 500 }}>
              Trending Now
            </h3>
            <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
              Most popular color combinations
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trendingPalettes.popular.map((palette, idx) => (
            <PaletteCard key={idx} {...palette} />
          ))}
        </div>
      </div>

      {/* Seasonal Palettes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#F2C46B]/10 border border-[#F2C46B]/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#D4A855] dark:text-[#F2C46B]" />
          </div>
          <div>
            <h3 className="text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 500 }}>
              Seasonal Favorites
            </h3>
            <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
              Colors for every season
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trendingPalettes.seasonal.map((palette, idx) => (
            <PaletteCard key={idx} {...palette} />
          ))}
        </div>
      </div>

      {/* Professional Palettes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#F2C46B]/10 border border-[#F2C46B]/20 flex items-center justify-center">
            <Palette className="w-4 h-4 text-[#D4A855] dark:text-[#F2C46B]" />
          </div>
          <div>
            <h3 className="text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 500 }}>
              Professional Palettes
            </h3>
            <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
              Industry-standard color schemes
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trendingPalettes.professional.map((palette, idx) => (
            <PaletteCard key={idx} {...palette} />
          ))}
        </div>
      </div>
    </div>
  );
}
