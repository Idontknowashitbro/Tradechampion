import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  AlertTriangle,
  CheckCircle,
  Database,
  RefreshCw,
  RotateCw,
  Save,
  Server,
  Loader2
} from "lucide-react";
import api from "@/lib/api";

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // System settings states
  const [webSocketSettings, setWebSocketSettings] = useState({
    reconnectInterval: "30",
    maxReconnectAttempts: "5",
    enabled: true
  });

  const [paymentSettings, setPaymentSettings] = useState({
    cryptoProvider: "NowPayments",
    apiKey: "sk_live_51A*******************",
    webhookEnabled: true,
    autoApprovePayouts: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    discordWebhook: "https://discord.com/api/webhooks/1234567890/abcdefg",
    emailNotifications: true,
    adminAlerts: true
  });

  // System status
  const [systemStatus, setSystemStatus] = useState({
    apiServer: "online",
    webSocketServer: "online",
    database: "online",
    paymentGateway: "online",
    discordBot: "online",
    cTraderApi: "online",
    lastCheck: new Date().toISOString()
  });

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch WebSocket settings
        const wsResponse = await api.get('/admin/settings/websocket');
        setWebSocketSettings(wsResponse.data);

        // Fetch payment settings
        const paymentResponse = await api.get('/admin/settings/payment');
        setPaymentSettings(paymentResponse.data);

        // Fetch notification settings
        const notificationResponse = await api.get('/admin/settings/notifications');
        setNotificationSettings(notificationResponse.data);

        // Fetch system status
        const statusResponse = await api.get('/admin/system/status');
        setSystemStatus(statusResponse.data);
      } catch (err: any) {
        console.error('Error fetching settings:', err);
        setError(err.message || 'Failed to fetch settings');
        toast({
          title: "Using Default Settings",
          description: "Could not load settings from server. Using default values.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save WebSocket settings
  const handleSaveWebSocketSettings = async () => {
    // Validate settings
    if (
      !webSocketSettings.reconnectInterval ||
      !webSocketSettings.maxReconnectAttempts
    ) {
      toast({
        title: "Error",
        description: "Please fill in all WebSocket settings",
        variant: "destructive"
      });
      return;
    }

    try {
      // Make API call to save settings
      await api.put('/admin/settings/websocket', webSocketSettings);

      toast({
        title: "WebSocket Settings Saved",
        description: "The WebSocket connection settings have been updated."
      });
    } catch (err) {
      console.error('Error saving WebSocket settings:', err);
      toast({
        title: "Save Failed",
        description: "There was an error saving the WebSocket settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Save Payment settings
  const handleSavePaymentSettings = async () => {
    // Validate settings
    if (
      !paymentSettings.cryptoProvider ||
      !paymentSettings.apiKey
    ) {
      toast({
        title: "Error",
        description: "Please fill in all payment settings",
        variant: "destructive"
      });
      return;
    }

    try {
      // Make API call to save settings
      await api.put('/admin/settings/payment', paymentSettings);

      toast({
        title: "Payment Settings Saved",
        description: "The payment gateway settings have been updated."
      });
    } catch (err) {
      console.error('Error saving payment settings:', err);
      toast({
        title: "Save Failed",
        description: "There was an error saving the payment settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Save Notification settings
  const handleSaveNotificationSettings = async () => {
    // Validate settings
    if (!notificationSettings.discordWebhook) {
      toast({
        title: "Error",
        description: "Please fill in the Discord webhook URL",
        variant: "destructive"
      });
      return;
    }

    try {
      // Make API call to save settings
      await api.put('/admin/settings/notifications', notificationSettings);

      toast({
        title: "Notification Settings Saved",
        description: "The notification settings have been updated."
      });
    } catch (err) {
      console.error('Error saving notification settings:', err);
      toast({
        title: "Save Failed",
        description: "There was an error saving the notification settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Run system checks and maintenance
  const handleSystemCheck = async () => {
    toast({
      title: "System Check Started",
      description: "Running comprehensive system check..."
    });

    try {
      // Make API call to run system check
      const response = await api.post('/admin/system/check');

      // Update system status with the response
      setSystemStatus(response.data);

      toast({
        title: "System Check Complete",
        description: "System check completed successfully.",
      });
    } catch (err) {
      console.error('Error running system check:', err);
      toast({
        title: "System Check Failed",
        description: "There was an error running the system check. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDatabaseMaintenance = async () => {
    toast({
      title: "Database Maintenance Started",
      description: "This may take a few minutes..."
    });

    try {
      // Make API call to run database maintenance
      await api.post('/admin/system/database/maintenance');

      toast({
        title: "Database Maintenance Complete",
        description: "Database optimized successfully.",
      });
    } catch (err) {
      console.error('Error running database maintenance:', err);
      toast({
        title: "Maintenance Failed",
        description: "There was an error running database maintenance. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-forex-primary animate-spin" />
        <span className="ml-2 text-white">Loading settings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 text-center">
        <p className="text-red-400">{error}</p>
        <Button
          variant="outline"
          className="mt-2 border-forex-border/20 text-white hover:bg-forex-card"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">System Settings</h2>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-forex-border/20 text-white hover:bg-forex-card"
            onClick={handleSystemCheck}
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Run System Check
          </Button>

          <Button
            variant="outline"
            className="border-forex-border/20 text-white hover:bg-forex-card"
            onClick={handleDatabaseMaintenance}
          >
            <Database className="h-4 w-4 mr-2" />
            Database Maintenance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WebSocket Settings */}
        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Server className="h-5 w-5 mr-2 text-forex-primary" />
              WebSocket Connection Settings
            </CardTitle>
            <CardDescription className="text-white/60">
              Configure real-time data connection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="websocket-enabled" className="text-white">
                WebSocket Enabled
              </Label>
              <Switch
                id="websocket-enabled"
                checked={webSocketSettings.enabled}
                onCheckedChange={(checked) =>
                  setWebSocketSettings({...webSocketSettings, enabled: checked})
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reconnect-interval" className="text-white">
                Reconnect Interval (seconds)
              </Label>
              <Input
                id="reconnect-interval"
                type="number"
                value={webSocketSettings.reconnectInterval}
                onChange={(e) =>
                  setWebSocketSettings({
                    ...webSocketSettings,
                    reconnectInterval: e.target.value
                  })
                }
                className="bg-forex-dark/60 border-forex-border/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-reconnect" className="text-white">
                Max Reconnect Attempts
              </Label>
              <Input
                id="max-reconnect"
                type="number"
                value={webSocketSettings.maxReconnectAttempts}
                onChange={(e) =>
                  setWebSocketSettings({
                    ...webSocketSettings,
                    maxReconnectAttempts: e.target.value
                  })
                }
                className="bg-forex-dark/60 border-forex-border/20 text-white"
              />
            </div>

            <div className="pt-2">
              <Button
                className="w-full bg-forex-primary hover:bg-forex-primary/90 text-white"
                onClick={handleSaveWebSocketSettings}
              >
                <Save className="h-4 w-4 mr-2" />
                Save WebSocket Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-forex-primary" />
              Payment Gateway Settings
            </CardTitle>
            <CardDescription className="text-white/60">
              Configure cryptocurrency payment settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crypto-provider" className="text-white">
                Crypto Payment Provider
              </Label>
              <Input
                id="crypto-provider"
                value={paymentSettings.cryptoProvider}
                onChange={(e) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    cryptoProvider: e.target.value
                  })
                }
                className="bg-forex-dark/60 border-forex-border/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-white">
                API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                value={paymentSettings.apiKey}
                onChange={(e) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    apiKey: e.target.value
                  })
                }
                className="bg-forex-dark/60 border-forex-border/20 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="webhook-enabled" className="text-white">
                Webhook Notifications
              </Label>
              <Switch
                id="webhook-enabled"
                checked={paymentSettings.webhookEnabled}
                onCheckedChange={(checked) =>
                  setPaymentSettings({...paymentSettings, webhookEnabled: checked})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-approve" className="text-white">
                Auto-Approve Payouts
              </Label>
              <Switch
                id="auto-approve"
                checked={paymentSettings.autoApprovePayouts}
                onCheckedChange={(checked) =>
                  setPaymentSettings({...paymentSettings, autoApprovePayouts: checked})
                }
              />
            </div>

            <div className="pt-2">
              <Button
                className="w-full bg-forex-primary hover:bg-forex-primary/90 text-white"
                onClick={handleSavePaymentSettings}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Payment Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-forex-primary" />
              Notification Settings
            </CardTitle>
            <CardDescription className="text-white/60">
              Configure system and user notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discord-webhook" className="text-white">
                Discord Webhook URL
              </Label>
              <Input
                id="discord-webhook"
                value={notificationSettings.discordWebhook}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    discordWebhook: e.target.value
                  })
                }
                className="bg-forex-dark/60 border-forex-border/20 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-white">
                Email Notifications
              </Label>
              <Switch
                id="email-notifications"
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  setNotificationSettings({...notificationSettings, emailNotifications: checked})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="admin-alerts" className="text-white">
                Admin System Alerts
              </Label>
              <Switch
                id="admin-alerts"
                checked={notificationSettings.adminAlerts}
                onCheckedChange={(checked) =>
                  setNotificationSettings({...notificationSettings, adminAlerts: checked})
                }
              />
            </div>

            <div className="pt-2">
              <Button
                className="w-full bg-forex-primary hover:bg-forex-primary/90 text-white"
                onClick={handleSaveNotificationSettings}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-forex-primary" />
              System Status
            </CardTitle>
            <CardDescription className="text-white/60">
              Current system health and component status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${systemStatus.apiServer === 'online' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-white">API Server</span>
                </div>
                <span className={systemStatus.apiServer === 'online' ? 'text-green-500' : 'text-red-500'}>
                  {systemStatus.apiServer === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${systemStatus.webSocketServer === 'online' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-white">WebSocket Server</span>
                </div>
                <span className={systemStatus.webSocketServer === 'online' ? 'text-green-500' : 'text-red-500'}>
                  {systemStatus.webSocketServer === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${systemStatus.database === 'online' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-white">Database</span>
                </div>
                <span className={systemStatus.database === 'online' ? 'text-green-500' : 'text-red-500'}>
                  {systemStatus.database === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${systemStatus.paymentGateway === 'online' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-white">Payment Gateway</span>
                </div>
                <span className={systemStatus.paymentGateway === 'online' ? 'text-green-500' : 'text-red-500'}>
                  {systemStatus.paymentGateway === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${systemStatus.discordBot === 'online' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-white">Discord Bot</span>
                </div>
                <span className={systemStatus.discordBot === 'online' ? 'text-green-500' : 'text-red-500'}>
                  {systemStatus.discordBot === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${systemStatus.cTraderApi === 'online' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-white">cTrader API</span>
                </div>
                <span className={systemStatus.cTraderApi === 'online' ? 'text-green-500' : 'text-red-500'}>
                  {systemStatus.cTraderApi === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center text-white/60 text-sm">
              Last system check: {new Date(systemStatus.lastCheck).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;