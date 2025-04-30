import React, { useState } from 'react';
import { Bell, X, CheckCheck, DollarSign, AlertTriangle, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Challenge Completed',
      message: 'Congratulations! You finished in the top 10% in Daily Crypto Challenge.',
      timestamp: '10 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'Payment Processed',
      message: 'Your payment of 50 Credits for Weekly Forex Challenge has been processed.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Approaching Drawdown Limit',
      message: 'Your current drawdown is at 8.2%, close to the maximum allowed 10%.',
      timestamp: '4 hours ago',
      read: true,
    },
    {
      id: '4',
      type: 'error',
      title: 'Connection Issue',
      message: 'We\'re having trouble connecting to your cTrader account. Please reconnect.',
      timestamp: '1 day ago',
      read: true,
    },
    {
      id: '5',
      type: 'success',
      title: 'Credits Added',
      message: '50 Credits have been added to your wallet balance.',
      timestamp: '2 days ago',
      read: true,
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return <Trophy className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <DollarSign className="h-5 w-5 text-forex-primary" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-forex-dark z-50 shadow-xl"
        >
          <Card className="h-full border-none rounded-none bg-forex-card/90 backdrop-blur-md">
            <div className="flex items-center justify-between p-4 border-b border-forex-border/30">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-forex-primary mr-2" />
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-forex-primary text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-white/70 hover:text-white hover:bg-forex-primary/20"
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  <span className="text-xs">Mark all read</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="text-white/70 hover:text-white hover:bg-forex-primary/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {notifications.length > 0 ? (
                <div className="py-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 cursor-pointer transition-colors duration-200 ${
                        notification.read 
                          ? 'bg-forex-card/40 hover:bg-forex-card/60' 
                          : 'bg-forex-primary/10 hover:bg-forex-primary/20'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                          notification.read ? 'bg-forex-card' : 'bg-forex-primary/20'
                        }`}>
                          {getIconForType(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className={`font-medium ${notification.read ? 'text-white/90' : 'text-white'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-forex-primary"></span>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${notification.read ? 'text-white/60' : 'text-white/80'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-white/50">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.timestamp}
                          </div>
                        </div>
                      </div>
                      <Separator className="mt-4 bg-forex-border/10" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Bell className="h-12 w-12 text-forex-card/40 mb-3" />
                  <h3 className="text-white font-medium">No notifications</h3>
                  <p className="text-white/60 text-sm mt-1">You're all caught up!</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel; 