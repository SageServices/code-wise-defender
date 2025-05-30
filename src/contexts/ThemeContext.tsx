
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
}

interface ThemeContextType {
  currentTheme: string;
  customColors: ThemeColors;
  setTheme: (theme: string) => void;
  updateCustomColors: (colors: Partial<ThemeColors>) => void;
  mousePosition: { x: number; y: number };
}

const defaultColors: ThemeColors = {
  background: '0 0% 10%',
  foreground: '0 0% 98%',
  primary: '200 70% 50%',
  primaryForeground: '0 0% 10%',
  secondary: '0 0% 20%',
  accent: '200 70% 30%',
  muted: '0 0% 20%',
  border: '0 0% 20%'
};

const presetThemes = {
  cyberpunk: {
    background: '0 0% 5%',
    foreground: '120 100% 80%',
    primary: '300 100% 60%',
    primaryForeground: '0 0% 5%',
    secondary: '180 100% 20%',
    accent: '60 100% 50%',
    muted: '0 0% 15%',
    border: '300 50% 30%'
  },
  ocean: {
    background: '220 30% 8%',
    foreground: '210 20% 95%',
    primary: '200 80% 55%',
    primaryForeground: '220 30% 8%',
    secondary: '210 30% 15%',
    accent: '190 70% 40%',
    muted: '215 25% 12%',
    border: '210 20% 25%'
  },
  forest: {
    background: '120 15% 8%',
    foreground: '100 20% 92%',
    primary: '140 60% 45%',
    primaryForeground: '120 15% 8%',
    secondary: '130 20% 15%',
    accent: '110 50% 35%',
    muted: '125 15% 12%',
    border: '130 25% 20%'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [customColors, setCustomColors] = useState<ThemeColors>(defaultColors);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
      document.documentElement.style.setProperty('--mouse-x', x.toString());
      document.documentElement.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const colors = currentTheme === 'custom' ? customColors : presetThemes[currentTheme as keyof typeof presetThemes] || defaultColors;
    
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
  }, [currentTheme, customColors]);

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
  };

  const updateCustomColors = (colors: Partial<ThemeColors>) => {
    setCustomColors(prev => ({ ...prev, ...colors }));
    if (currentTheme !== 'custom') {
      setCurrentTheme('custom');
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      customColors,
      setTheme,
      updateCustomColors,
      mousePosition
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
