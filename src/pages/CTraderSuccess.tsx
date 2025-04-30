import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTraderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const entryId = searchParams.get('entryId');

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      if (entryId) {
        navigate(`/challenges/entry/${entryId}`);
      } else {
        navigate('/dashboard');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [entryId, navigate]);

  const handleContinue = () => {
    if (entryId) {
      navigate(`/challenges/entry/${entryId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forex-dark p-4">
      <Card className="w-full max-w-md bg-forex-card border-forex-border text-white">
        <CardHeader className="pb-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Connection Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-white/70">
            <p>
              Your cTrader account has been successfully connected to the challenge. We'll now track your trades automatically.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-forex-dark/30 border border-forex-border/50">
            <h3 className="text-sm font-medium mb-2 text-forex-primary">What happens next:</h3>
            <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
              <li>Your trades will be automatically tracked</li>
              <li>Metrics will be updated in real-time</li>
              <li>You'll appear on the challenge leaderboard</li>
              <li>You'll receive notifications about your performance</li>
            </ul>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={handleContinue}
              className="w-full bg-forex-primary hover:bg-forex-primary/90 text-white"
            >
              Continue to Challenge
            </Button>
            <p className="text-xs text-center mt-3 text-white/50">
              You'll be automatically redirected in 5 seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CTraderSuccessPage; 