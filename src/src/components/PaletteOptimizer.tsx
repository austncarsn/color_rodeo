import { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Plus,
  ArrowRight,
  Eye,
  Palette,
  Check,
  Info,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import {
  generateOptimizationRecommendations,
  calculateProjectedScore,
  type ColorRecommendation,
} from '../lib/paletteOptimizationUtils';
import { toast } from 'sonner@2.0.3';

interface PaletteOptimizerProps {
  colors: string[];
  onAddColor: (color: string) => void;
}

export function PaletteOptimizer({ colors, onAddColor }: PaletteOptimizerProps) {
  const [analysis, setAnalysis] = useState<ReturnType<typeof generateOptimizationRecommendations> | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    const recommendations = generateOptimizationRecommendations(colors);
    setAnalysis(recommendations);
  }, [colors]);

  if (!analysis) {
    return null;
  }

  const handleAddRecommendation = (recommendation: ColorRecommendation) => {
    onAddColor(recommendation.color);
    toast.success('Color added to palette', {
      description: recommendation.reason,
    });
  };

  const getCategoryIcon = (category: ColorRecommendation['category']) => {
    switch (category) {
      case 'accessibility':
        return <Eye className="w-3.5 h-3.5" />;
      case 'harmony':
        return <Palette className="w-3.5 h-3.5" />;
      case 'contrast':
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 'balance':
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryColor = (category: ColorRecommendation['category']) => {
    switch (category) {
      case 'accessibility':
        return 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'harmony':
        return 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'contrast':
        return 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20';
      case 'balance':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  const getPriorityBadge = (priority: ColorRecommendation['priority']) => {
    const colors = {
      high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      low: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20',
    };

    return (
      <Badge variant="outline" className={`text-[10px] px-1.5 py-0.5 ${colors[priority]}`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  if (colors.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-[#18191D] dark:to-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#F2C46B]/10 border border-[#F2C46B]/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#D4A855] dark:text-[#F2C46B]" />
          </div>
          <h3 className="text-sm text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 500 }}>
            Palette Optimizer
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-[#23252B] dark:to-[#292B33] rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-neutral-400 dark:text-[#8C909A]" />
          </div>
          <p className="text-sm text-neutral-900 dark:text-[#C1C4CF] mb-2" style={{ fontWeight: 500 }}>
            Add Colors to Get Smart Recommendations
          </p>
          <p className="text-xs text-neutral-600 dark:text-[#8C909A] max-w-xs mx-auto leading-relaxed">
            Our AI-powered optimizer will analyze your palette and suggest colors to maximize accessibility and visual harmony
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Current Scores */}
      <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-[#18191D] dark:to-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#F2C46B]/10 border border-[#F2C46B]/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#D4A855] dark:text-[#F2C46B]" />
          </div>
          <div>
            <h3 className="text-sm text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 500 }}>
              Palette Optimizer
            </h3>
            <p className="text-xs text-neutral-500 dark:text-[#8C909A]">
              AI-powered recommendations to improve your palette
            </p>
          </div>
        </div>

        {/* Current Scores */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-white dark:bg-[#1E1F23] rounded-lg border border-neutral-200 dark:border-[#292B33]">
            <div className="flex items-center gap-1.5 mb-1">
              <Palette className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs text-neutral-600 dark:text-[#8C909A]">Harmony</span>
            </div>
            <div className="text-xl text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 600 }}>
              {analysis.currentScore.harmony}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-[#8C909A]">
              {analysis.currentScore.harmony >= 80 ? 'Excellent' :
               analysis.currentScore.harmony >= 60 ? 'Good' :
               analysis.currentScore.harmony >= 40 ? 'Fair' : 'Needs Work'}
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-[#1E1F23] rounded-lg border border-neutral-200 dark:border-[#292B33]">
            <div className="flex items-center gap-1.5 mb-1">
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs text-neutral-600 dark:text-[#8C909A]">Accessibility</span>
            </div>
            <div className="text-xl text-neutral-900 dark:text-[#F5F5F7]" style={{ fontWeight: 600 }}>
              {analysis.currentScore.accessibility}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-[#8C909A]">
              {analysis.currentScore.accessibility >= 70 ? 'Excellent' :
               analysis.currentScore.accessibility >= 50 ? 'Good' : 'Needs Work'}
            </div>
          </div>
        </div>

        {/* Insights */}
        {analysis.insights.length > 0 && (
          <div className="p-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                {analysis.insights.map((insight, idx) => (
                  <p key={idx} className="text-xs text-blue-600 dark:text-blue-400">
                    {insight}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm text-neutral-900 dark:text-[#C1C4CF]" style={{ fontWeight: 500 }}>
              Recommended Colors ({analysis.recommendations.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {analysis.recommendations.map((recommendation, idx) => {
              const isExpanded = expandedCard === idx;
              const projectedScores = calculateProjectedScore(colors, recommendation.color);

              return (
                <Card
                  key={idx}
                  className="p-4 bg-white dark:bg-[#1E1F23] border-neutral-200 dark:border-[#292B33] hover:border-[#F2C46B]/50 dark:hover:border-[#F2C46B]/50 transition-all cursor-pointer"
                  onClick={() => setExpandedCard(isExpanded ? null : idx)}
                >
                  <div className="flex items-start gap-3">
                    {/* Color Preview */}
                    <div className="flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-neutral-200 dark:border-[#292B33] shadow-sm"
                        style={{ backgroundColor: recommendation.color }}
                      />
                      <p className="text-[10px] text-neutral-500 dark:text-[#8C909A] text-center mt-1 font-mono">
                        {recommendation.color}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-2 py-0.5 ${getCategoryColor(recommendation.category)}`}
                          >
                            {getCategoryIcon(recommendation.category)}
                            <span className="ml-1 capitalize">{recommendation.category}</span>
                          </Badge>
                          {getPriorityBadge(recommendation.priority)}
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddRecommendation(recommendation);
                          }}
                          className="h-7 px-2 bg-[#F2C46B] hover:bg-[#D4A855] text-[#121212] text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>

                      <p className="text-sm text-neutral-900 dark:text-[#F5F5F7] mb-2" style={{ fontWeight: 500 }}>
                        {recommendation.reason}
                      </p>

                      {/* Impact Preview */}
                      {!isExpanded && (
                        <div className="flex items-center gap-3 text-xs">
                          {recommendation.impact.harmonyImprovement > 0 && (
                            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                              <TrendingUp className="w-3 h-3" />
                              <span>+{recommendation.impact.harmonyImprovement} harmony</span>
                            </div>
                          )}
                          {recommendation.impact.accessibilityImprovement > 0 && (
                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                              <Eye className="w-3 h-3" />
                              <span>+{recommendation.impact.accessibilityImprovement} a11y</span>
                            </div>
                          )}
                          {recommendation.impact.contrastPairsAdded > 0 && (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <Check className="w-3 h-3" />
                              <span>{recommendation.impact.contrastPairsAdded} pairs</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-[#292B33] space-y-3">
                          {/* Projected Scores */}
                          <div>
                            <p className="text-xs text-neutral-600 dark:text-[#8C909A] mb-2">
                              Projected Impact:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 bg-purple-500/5 dark:bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-purple-600 dark:text-purple-400">
                                    Harmony
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-neutral-500 dark:text-[#8C909A]">
                                      {analysis.currentScore.harmony}
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-neutral-400" />
                                    <span className="text-xs text-purple-600 dark:text-purple-400" style={{ fontWeight: 600 }}>
                                      {projectedScores.harmonyScore}
                                    </span>
                                  </div>
                                </div>
                                {projectedScores.harmonyChange > 0 && (
                                  <div className="text-[10px] text-purple-600 dark:text-purple-400">
                                    +{projectedScores.harmonyChange} improvement
                                  </div>
                                )}
                              </div>

                              <div className="p-2 bg-blue-500/5 dark:bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-blue-600 dark:text-blue-400">
                                    A11y
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-neutral-500 dark:text-[#8C909A]">
                                      {analysis.currentScore.accessibility}
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-neutral-400" />
                                    <span className="text-xs text-blue-600 dark:text-blue-400" style={{ fontWeight: 600 }}>
                                      {projectedScores.accessibilityScore}
                                    </span>
                                  </div>
                                </div>
                                {projectedScores.accessibilityChange > 0 && (
                                  <div className="text-[10px] text-blue-600 dark:text-blue-400">
                                    +{projectedScores.accessibilityChange} improvement
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Additional Benefits */}
                          {recommendation.impact.contrastPairsAdded > 0 && (
                            <div className="p-2 bg-green-500/5 dark:bg-green-500/10 rounded-lg border border-green-500/20">
                              <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                <span className="text-xs text-green-600 dark:text-green-400">
                                  Creates {recommendation.impact.contrastPairsAdded} new accessible color pair{recommendation.impact.contrastPairsAdded !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1E1F23] border border-neutral-200 dark:border-[#292B33] rounded-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-green-500/10 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-neutral-900 dark:text-[#F5F5F7] mb-1" style={{ fontWeight: 500 }}>
            Palette Looking Great!
          </p>
          <p className="text-xs text-neutral-600 dark:text-[#8C909A]">
            Your palette has excellent harmony and accessibility. No recommendations at this time.
          </p>
        </div>
      )}
    </div>
  );
}
