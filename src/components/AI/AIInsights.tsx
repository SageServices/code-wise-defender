
import React from 'react';
import AIInsightsCard from './AIInsightsCard';

const AIInsights: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">AI Insights</h1>
        <p className="text-muted-foreground">AI-powered analysis and recommendations</p>
      </div>
      
      <AIInsightsCard expanded />
    </div>
  );
};

export default AIInsights;
