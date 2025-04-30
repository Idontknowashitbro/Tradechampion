import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ctraderService from '@/lib/ctraderService';

const CTraderCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connectAccount = async () => {
      try {
        // Get the code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setStatus('error');
          setError('No authorization code found in the URL');
          return;
        }
        
        // Get the account ID and challenge entry ID from session storage
        const accountId = sessionStorage.getItem('ctrader_account_id');
        const challengeEntryId = sessionStorage.getItem('ctrader_challenge_entry_id');
        
        if (!accountId || !challengeEntryId) {
          setStatus('error');
          setError('Missing account information. Please try connecting again.');
          return;
        }
        
        // Connect the account
        await ctraderService.connectAccount(challengeEntryId, code);
        
        // Clear the session storage
        sessionStorage.removeItem('ctrader_account_id');
        sessionStorage.removeItem('ctrader_challenge_entry_id');
        
        setStatus('success');
        
        // Show success toast
        toast({
          title: 'cTrader Connected',
          description: 'Your cTrader account has been successfully connected.',
          variant: 'default',
        });
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (err) {
        console.error('Error connecting cTrader account:', err);
        setStatus('error');
        setError(typeof err === 'string' ? err : 'Failed to connect cTrader account. Please try again.');
        
        // Show error toast
        toast({
          title: 'Connection Failed',
          description: 'Failed to connect your cTrader account. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    connectAccount();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-forex-dark">
      <Card className="w-full max-w-md bg-forex-card border-forex-border">
        <CardContent className="pt-6">
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forex-primary mx-auto mb-4"></div>
              <h3 className="text-xl font-medium text-white mb-2">Connecting cTrader</h3>
              <p className="text-white/60">Please wait while we connect your cTrader account...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center py-8">
              <div className="h-12 w-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                ✓
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Connection Successful</h3>
              <p className="text-white/60 mb-4">Your cTrader account has been successfully connected.</p>
              <Button 
                className="bg-forex-primary hover:bg-forex-primary/90 text-white"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center py-8">
              <div className="h-12 w-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                ✗
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Connection Failed</h3>
              <p className="text-white/60 mb-4">{error || 'Failed to connect your cTrader account. Please try again.'}</p>
              <Button 
                className="bg-forex-primary hover:bg-forex-primary/90 text-white"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CTraderCallback;
