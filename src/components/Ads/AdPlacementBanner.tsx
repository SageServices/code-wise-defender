
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X, ExternalLink, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdPlacementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    website: '',
    adType: 'banner',
    budget: '',
    description: '',
    targetAudience: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!isVisible) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission - in real app, this would send to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store submission in localStorage for demo purposes
      const submissions = JSON.parse(localStorage.getItem('ad_submissions') || '[]');
      const newSubmission = {
        ...formData,
        id: Date.now(),
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      submissions.push(newSubmission);
      localStorage.setItem('ad_submissions', JSON.stringify(submissions));

      toast({
        title: "Application Submitted",
        description: "Thank you! We'll review your ad placement request within 24 hours.",
      });

      setIsFormOpen(false);
      setFormData({
        companyName: '',
        contactEmail: '',
        website: '',
        adType: 'banner',
        budget: '',
        description: '',
        targetAudience: ''
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="panel relative bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Place Your Ad Here
              </h3>
              <p className="text-sm text-muted-foreground">
                Reach developers and security professionals using our platform
              </p>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 hover:bg-primary/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ad Placement Application</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Your company name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="contact@company.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="adType">Ad Type</Label>
                    <select
                      id="adType"
                      value={formData.adType}
                      onChange={(e) => handleInputChange('adType', e.target.value)}
                      className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
                    >
                      <option value="banner">Banner Ad</option>
                      <option value="sponsored">Sponsored Content</option>
                      <option value="sidebar">Sidebar Ad</option>
                      <option value="newsletter">Newsletter Placement</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="budget">Monthly Budget (USD)</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="e.g., $500-1000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      value={formData.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      placeholder="e.g., Frontend developers, Security engineers"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Campaign Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your product/service and campaign goals..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !formData.companyName || !formData.contactEmail}
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsFormOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    * Required fields. We'll review your application within 24 hours.
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPlacementBanner;
