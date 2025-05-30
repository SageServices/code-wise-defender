import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Download, Upload, RotateCcw, ArrowLeft, Home } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const ThemeCustomizer: React.FC = () => {
  const { currentTheme, customColors, setTheme, updateCustomColors } = useTheme();
  const { toast } = useToast();

  const presetThemes = [
    { name: 'default', label: 'Dark Default', colors: { primary: '200 70% 50%', accent: '200 70% 30%' } },
    { name: 'cyberpunk', label: 'Cyberpunk', colors: { primary: '300 100% 60%', accent: '60 100% 50%' } },
    { name: 'ocean', label: 'Ocean Blue', colors: { primary: '200 80% 55%', accent: '190 70% 40%' } },
    { name: 'forest', label: 'Forest Green', colors: { primary: '140 60% 45%', accent: '110 50% 35%' } }
  ];

  const colorOptions = [
    { key: 'background', label: 'Background' },
    { key: 'foreground', label: 'Text' },
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'muted', label: 'Muted' },
    { key: 'border', label: 'Border' }
  ];

  const handleColorChange = (colorKey: string, value: string) => {
    updateCustomColors({ [colorKey]: value });
  };

  const exportTheme = () => {
    const themeData = {
      name: currentTheme,
      colors: customColors,
      exported: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${currentTheme}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Theme Exported",
      description: "Theme configuration has been downloaded.",
    });
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);
        if (themeData.colors) {
          updateCustomColors(themeData.colors);
          toast({
            title: "Theme Imported",
            description: "Theme configuration has been applied.",
          });
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid theme file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const resetToDefault = () => {
    setTheme('default');
    toast({
      title: "Theme Reset",
      description: "Theme has been reset to default.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            <Home className="w-4 h-4 inline mr-1" />
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span>Theme Customizer</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Theme Customizer</h1>
          <p className="text-muted-foreground">Customize the appearance of your dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportTheme} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={resetToDefault} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="presets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="presets">Preset Themes</TabsTrigger>
          <TabsTrigger value="custom">Custom Colors</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presetThemes.map((theme) => (
              <Card 
                key={theme.name} 
                className={`panel cursor-pointer transition-all hover:scale-105 ${
                  currentTheme === theme.name ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setTheme(theme.name)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {theme.label}
                    {currentTheme === theme.name && (
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                    ></div>
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card className="panel">
            <CardHeader>
              <CardTitle>Custom Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {colorOptions.map((option) => (
                  <div key={option.key} className="space-y-2">
                    <Label htmlFor={option.key}>{option.label}</Label>
                    <div className="flex gap-2">
                      <input
                        id={option.key}
                        type="text"
                        value={customColors[option.key as keyof typeof customColors]}
                        onChange={(e) => handleColorChange(option.key, e.target.value)}
                        placeholder="0 0% 50%"
                        className="flex-1 h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
                      />
                      <div 
                        className="w-10 h-10 rounded border border-input"
                        style={{ 
                          backgroundColor: `hsl(${customColors[option.key as keyof typeof customColors]})` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      HSL format: hue saturation% lightness%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card className="panel">
            <CardHeader>
              <CardTitle>Import/Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="importFile">Import Theme</Label>
                <input
                  id="importFile"
                  type="file"
                  accept=".json"
                  onChange={importTheme}
                  className="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-2">Current Theme Configuration</h4>
                <pre className="text-xs bg-background/50 p-3 rounded border overflow-auto max-h-40">
                  {JSON.stringify({ name: currentTheme, colors: customColors }, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="panel">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-background border border-border rounded">
                  <h5 className="font-medium text-foreground">Sample Content</h5>
                  <p className="text-muted-foreground text-sm">This is how your theme looks.</p>
                  <Button size="sm" className="mt-2">Primary Button</Button>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-sm">Secondary background example</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeCustomizer;
