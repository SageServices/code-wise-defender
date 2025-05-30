
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAI } from '../../contexts/AIContext';

interface AIInsightsCardProps {
  expanded?: boolean;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ expanded = false }) => {
  const { insights, generateInsights, isAnalyzing } = useAI();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'security': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'performance': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'maintenance': return <Brain className="w-4 h-4 text-blue-500" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      default: return <Brain className="w-4 h-4 text-primary" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-500/20 text-green-500 border-green-500/30';
    if (confidence >= 0.7) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    return 'bg-red-500/20 text-red-500 border-red-500/30';
  };

  const displayedInsights = expanded ? insights : insights.slice(0, 3);

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Insights
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Generate'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedInsights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No insights available. Click "Generate" to analyze your system.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedInsights.map((insight) => (
              <div key={insight.id} className="p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h5 className="text-sm font-medium text-foreground">{insight.title}</h5>
                      <Badge className={getConfidenceColor(insight.confidence)}>
                        {Math.round(insight.confidence * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs text-green-500 border-green-500/30">
                          Actionable
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!expanded && insights.length > 3 && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              +{insights.length - 3} more insights available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;
