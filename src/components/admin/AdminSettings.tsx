import { useState } from "react";
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
  Server
} from "lucide-react";

const AdminSettings = () => {
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
  
  // Save WebSocket settings
  const handleSaveWebSocketSettings = () => {
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
    
    // In a real app, you would make an API call here
    toast({
      title: "WebSocket Settings Saved",
      description: "The WebSocket connection settings have been updated."
    });
  };
  
  // Save Payment settings
  const handleSavePaymentSettings = () => {
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
    
    // In a real app, you would make an API call here
    toast({
      title: "Payment Settings Saved",
      description: "The payment gateway settings have been updated."
    });
  };
  
  // Save Notification settings
  const handleSaveNotificationSettings = () => {
    // Validate settings
    if (!notificationSettings.discordWebhook) {
      toast({
        title: "Error",
        description: "Please fill in the Discord webhook URL",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would make an API call here
    toast({
      title: "Notification Settings Saved",
      description: "The notification settings have been updated."
    });
  };
  
  // Run system checks and maintenance
  const handleSystemCheck = () => {
    toast({
      title: "System Check Started",
      description: "Running comprehensive system check..."
    });
    
    // Simulate a system check
    setTimeout(() => {
      toast({
        title: "System Check Complete",
        description: "All systems operational.",
      });
    }, 2000);
  };
  
  const handleDatabaseMaintenance = () => {
    toast({
      title: "Database Maintenance Started",
      description: "This may take a few minutes..."
    });
    
    // Simulate maintenance
    setTimeout(() => {
      toast({
        title: "Database Maintenance Complete",
        description: "Database optimized successfully.",
      });
    }, 3000);
  };
  
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
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-white">API Server</span>
                </div>
                <span className="text-green-500">Online</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-white">WebSocket Server</span>
                </div>
                <span className="text-green-500">Online</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-white">Database</span>
                </div>
                <span className="text-green-500">Online</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-white">Payment Gateway</span>
                </div>
                <span className="text-green-500">Online</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-white">Discord Bot</span>
                </div>
                <span className="text-green-500">Online</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-white">cTrader API</span>
                </div>
                <span className="text-green-500">Online</span>
              </div>
            </div>
            
            <div className="mt-6 text-center text-white/60 text-sm">
              Last system check: Today at 14:35
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings; 