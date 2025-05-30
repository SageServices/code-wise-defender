
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';
import SecurityOverview from '../components/Security/SecurityOverview';
import MaintenancePanel from '../components/Maintenance/MaintenancePanel';
import AIInsights from '../components/AI/AIInsights';
import KnowledgeBase from '../components/KnowledgeBase/KnowledgeBase';
import ThemeCustomizer from '../components/Theme/ThemeCustomizer';
import BackgroundEffects from '../components/Effects/BackgroundEffects';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SecurityProvider } from '../contexts/SecurityContext';
import { AIProvider } from '../contexts/AIContext';

const Index = () => {
  return (
    <ThemeProvider>
      <SecurityProvider>
        <AIProvider>
          <div className="min-h-screen bg-gradient-to-b from-background via-secondary to-black relative overflow-hidden">
            <BackgroundEffects />
            <div className="absolute inset-0 grid-bg opacity-10"></div>
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 -right-20 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 pattern-bg opacity-5"></div>
            
            <div className="container mx-auto px-4 pt-6 pb-16 relative z-10">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/security" element={<SecurityOverview />} />
                <Route path="/maintenance" element={<MaintenancePanel />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/themes" element={<ThemeCustomizer />} />
              </Routes>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0">
              <div className="divider"></div>
              <div className="h-1"></div>
              <div className="divider"></div>
            </div>
          </div>
        </AIProvider>
      </SecurityProvider>
    </ThemeProvider>
  );
};

export default Index;
