import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTraderErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forex-dark p-4">
      <Card className="w-full max-w-md bg-forex-card border-forex-border text-white">
        <CardHeader className="pb-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Connection Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-white/70">
            <p>
              We couldn't connect your cTrader account. This might happen for several reasons.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-forex-dark/30 border border-forex-border/50">
            <h3 className="text-sm font-medium mb-2 text-forex-primary">Possible reasons:</h3>
            <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
              <li>Incorrect account credentials</li>
              <li>Permission was denied for the application</li>
              <li>The cTrader server encountered an error</li>
              <li>Network connection issues</li>
            </ul>
          </div>
          
          <div className="pt-4 space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full bg-forex-primary hover:bg-forex-primary/90 text-white"
            >
              Return to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = 'mailto:support@tradechampionx.com'}
              className="w-full border-forex-border text-white hover:bg-forex-border/20"
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CTraderErrorPage; 