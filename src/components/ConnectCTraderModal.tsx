import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import socketClient from '@/lib/socketClient';
import ctraderService from '@/lib/ctraderService';

interface ConnectCTraderModalProps {
  open: boolean;
  onClose: () => void;
  challengeEntryId: number;
  onSuccess?: () => void;
}

const ConnectCTraderModal: React.FC<ConnectCTraderModalProps> = ({
  open,
  onClose,
  challengeEntryId,
  onSuccess
}) => {
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for socket notifications
  useEffect(() => {
    if (!open) return;

    const unsubscribe = socketClient.on('notification', (notification) => {
      if (notification.type === 'connection') {
        if (notification.title.includes('Connected')) {
          setLoading(false);
          if (onSuccess) onSuccess();
          onClose();
        } else if (notification.title.includes('Failed')) {
          setLoading(false);
          setError(notification.message || 'Failed to connect cTrader. Please try again.');
        }
      }
    });

    return () => unsubscribe();
  }, [open, onSuccess, onClose]);

  const handleConnect = async () => {
    if (!accountId) {
      setError('Please enter your cTrader account ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the authorization URL from the server
      const authUrl = await ctraderService.getAuthUrl();

      if (authUrl) {
        // Store the account ID and challenge entry ID in session storage
        // so we can retrieve them after the OAuth redirect
        sessionStorage.setItem('ctrader_account_id', accountId);
        sessionStorage.setItem('ctrader_challenge_entry_id', challengeEntryId.toString());

        // Redirect to cTrader OAuth page
        window.location.href = authUrl;
      } else {
        setError('Failed to get authorization URL from server');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error connecting cTrader:', err);
      setError(typeof err === 'string' ? err : 'Failed to connect cTrader. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-forex-card border-forex-border text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            <Link2 className="h-5 w-5 mr-2 text-forex-primary" />
            Connect cTrader Account
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Connect your cTrader account to track your trades for this challenge.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 mt-2 rounded-lg bg-forex-dark/30 border border-forex-border/50">
          <h3 className="text-sm font-medium mb-2 text-forex-primary">How it works:</h3>
          <ol className="list-decimal list-inside text-sm text-white/80 space-y-1">
            <li>Enter your cTrader account ID</li>
            <li>Log in to your cTrader account when prompted</li>
            <li>Grant TradeChampionX permission to access your trade data</li>
            <li>Your trades will be automatically tracked for the challenge</li>
          </ol>
        </div>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="account-id" className="text-white">
              cTrader Account ID
            </Label>
            <Input
              id="account-id"
              placeholder="Enter your account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="bg-forex-dark border-forex-border text-white"
              disabled={loading}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-md bg-red-900/20 border border-red-700 text-red-200 flex items-start"
            >
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-forex-border text-white hover:bg-forex-border/20"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={loading}
            className="bg-forex-primary hover:bg-forex-primary/90 text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              'Connect Account'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectCTraderModal;