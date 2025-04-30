import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import socketClient from '@/lib/socketClient';
import { useAuth } from '@/lib/AuthContext';

/**
 * Component that listens for WebSocket notifications and displays them
 * as toast messages
 */
const NotificationListener = () => {
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // Initialize socket connection
    socketClient.init(token);

    // Add notification listener
    const unsubscribe = socketClient.on('notification', (data) => {
      if (!data) return;

      // Map notification type to toast variant
      const variant = data.type === 'error' ? 'destructive' : 'default';

      toast({
        title: data.title,
        description: data.message,
        variant: variant,
        duration: 5000,
      });
    });

    // Add trade closed listener
    const unsubscribeTrade = socketClient.on('tradeClosed', (data) => {
      if (!data) return;

      const isProfit = data.pnl > 0;
      const variant = isProfit ? 'default' : 'destructive';

      toast({
        title: `Trade ${isProfit ? 'Profit' : 'Loss'}`,
        description: `${data.symbol}: ${isProfit ? '+' : ''}${data.pnl.toFixed(2)} USD`,
        variant: variant,
        duration: 5000,
      });
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      unsubscribeTrade();
      socketClient.disconnect();
    };
  }, [isAuthenticated, token]);

  return null;
};

export default NotificationListener;