
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Download, Upload, RotateCcw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeCustomizer: React.FC = () => {
  const { currentTheme, customColors, setTheme, updateCustomColors } = useTheme();
  const [selectedColor, setSelectedColor] = useState<string>('primary');

  const presetThemes = [
    { id: 'default', name: 'Default', preview: '#3b82f6' },
    { id: 'cyberpunk', name: 'Cyberpunk', preview: '#a855f7' },
    { id: 'ocean', name: 'Ocean', preview: '#0ea5e9' },
    { id: 'forest', name: 'Forest', preview: '#10b981' }
  ];

  const colorOptions = [
    { key: 'primary', label: 'Primary', description: 'Main brand color' },
    { key: 'secondary', label: 'Secondary', description: 'Secondary elements' },
    { key: 'accent', label: 'Accent', description: 'Highlights and accents' },
    { key: 'background', label: 'Background', description: 'Main background' },
    { key: 'foreground', label: 'Foreground', description: 'Text color' }
  ];

  const handleColorChange = (colorKey: string, value: string) => {
    // Convert hex to HSL
    const hsl = hexToHsl(value);
    updateCustomColors({ [colorKey]: hsl });
  };

  const hexToHsl = (hex: string): string => {
    // Simplified conversion - in production, use a proper color conversion library
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const exportTheme = () => {
    const themeData = {
      name: 'Custom Theme',
      colors: customColors
    };
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string);
          updateCustomColors(themeData.colors);
        } catch (error) {
          console.error('Invalid theme file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Theme Customizer</h1>
          <p className="text-muted-foreground">Customize the appearance of your dashboard</p>
        </div>
        <Badge className="bg-primary/20 text-primary">
          Current: {currentTheme}
        </Badge>
      </div>

      <Tabs defaultValue="presets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="presets">Preset Themes</TabsTrigger>
          <TabsTrigger value="custom">Custom Colors</TabsTrigger>
          <TabsTrigger value="export">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="presets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {presetThemes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`panel cursor-pointer transition-all hover:scale-105 ${
                  currentTheme === theme.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setTheme(theme.id)}
              >
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4"
                    style={{ backgroundColor: theme.preview }}
                  />
                  <h3 className="text-lg font-semibold text-foreground">{theme.name}</h3>
                  {currentTheme === theme.id && (
                    <Badge className="mt-2 bg-primary/20 text-primary">Active</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="panel">
              <CardHeader>
                <CardTitle>Color Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {colorOptions.map((option) => (
                  <div key={option.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          {option.label}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                      <input
                        type="color"
                        className="w-12 h-8 rounded border border-border cursor-pointer"
                        onChange={(e) => handleColorChange(option.key, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="panel">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background border border-border rounded">
                  <h4 className="text-foreground font-semibold mb-2">Sample Content</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    This is how your theme will look with the current settings.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Primary Button</Button>
                    <Button variant="outline" size="sm">Secondary</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export">
          <Card className="panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={exportTheme} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Theme
                </Button>
                
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    className="hidden"
                    id="theme-import"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => document.getElementById('theme-import')?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Import Theme
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => setTheme('default')}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Default
                </Button>
              </div>

              <div className="p-4 bg-muted/20 rounded border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Theme File Format</h4>
                <pre className="text-xs text-muted-foreground overflow-auto">
{`{
  "name": "Custom Theme",
  "colors": {
    "background": "0 0% 10%",
    "foreground": "0 0% 98%",
    "primary": "200 70% 50%",
    ...
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeCustomizer;
