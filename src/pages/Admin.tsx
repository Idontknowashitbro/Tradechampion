import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, Users, Award, DollarSign, Settings, Shield, CalendarRange, BanIcon, CheckCircle, AlertTriangle, BarChart, TrendingUp, Activity, PieChart, HardDrive, LayoutDashboard } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Navigate } from "react-router-dom";
import AdminChallenges from "@/components/admin-new/AdminChallenges";
import AdminUsers from "@/components/admin-new/AdminUsers";
import AdminPayouts from "@/components/admin-new/AdminPayouts";
import AdminSettings from "@/components/admin-new/AdminSettings";
import AdminAnalytics from "@/components/admin-new/AdminAnalytics";
import AdminDashboard from "@/components/admin-new/AdminDashboard";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [systemStatus, setSystemStatus] = useState({
    usersOnline: 42,
    activeChallenges: 3,
    pendingPayouts: 7,
    systemAlerts: 1
  });

  // Redirect if not admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  const handleSystemCheck = async () => {
    try {
      // Mock API call for now - would be replaced with actual API call
      // const response = await api.get('/admin/system-status');
      // setSystemStatus(response.data);
      toast({
        title: "System Check Complete",
        description: "All systems are operating normally.",
      });
    } catch (error) {
      toast({
        title: "System Check Failed",
        description: "Unable to complete system check.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-forex-dark">
      <Header />

      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        {/* Admin Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
              <Shield className="mr-2 h-7 w-7 text-forex-primary" />
              Admin Dashboard
            </h1>
            <p className="text-white/60 mt-1">Manage platform, users, and challenges</p>
          </div>

          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <div className="hidden md:flex space-x-2">
              <Badge variant="secondary" className="px-3 py-1 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{systemStatus.usersOnline} Online</span>
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 flex items-center">
                <CalendarRange className="h-4 w-4 mr-1" />
                <span>{systemStatus.activeChallenges} Active Challenges</span>
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>{systemStatus.pendingPayouts} Pending Payouts</span>
              </Badge>
              {systemStatus.systemAlerts > 0 && (
                <Badge variant="destructive" className="px-3 py-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{systemStatus.systemAlerts} Alert{systemStatus.systemAlerts !== 1 ? 's' : ''}</span>
                </Badge>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={handleSystemCheck}>
              System Check
            </Button>
          </div>
        </div>

        {/* Admin Dashboard */}
        <Tabs defaultValue="dashboard" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-forex-card/50 border border-forex-border/20">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-forex-primary/20">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-forex-primary/20">
              <CalendarRange className="h-4 w-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-forex-primary/20">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="payouts" className="data-[state=active]:bg-forex-primary/20">
              <DollarSign className="h-4 w-4 mr-2" />
              Payouts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-forex-primary/20">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-forex-primary/20">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {activeTab === "dashboard" && (
              <>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-white">185</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-forex-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-forex-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Active Challenges</p>
                        <p className="text-2xl font-bold text-white">8</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <CalendarRange className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-white">$3,200</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">System Status</p>
                        <p className="text-2xl font-bold text-green-400">Operational</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-400/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {activeTab === "challenges" && (
              <>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Active Challenges</p>
                        <p className="text-2xl font-bold text-white">3</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-forex-primary/20 flex items-center justify-center">
                        <CalendarRange className="h-5 w-5 text-forex-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Participants</p>
                        <p className="text-2xl font-bold text-white">67</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-forex-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-forex-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Disqualifications</p>
                        <p className="text-2xl font-bold text-white">5</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-red-400/20 flex items-center justify-center">
                        <BanIcon className="h-5 w-5 text-red-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Upcoming Challenges</p>
                        <p className="text-2xl font-bold text-white">2</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-forex-primary/20 flex items-center justify-center">
                        <CalendarRange className="h-5 w-5 text-forex-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "users" && (
              <>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-white">185</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-forex-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-forex-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">New Today</p>
                        <p className="text-2xl font-bold text-white">12</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-400/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Active Now</p>
                        <p className="text-2xl font-bold text-white">42</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-400/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Banned Users</p>
                        <p className="text-2xl font-bold text-white">3</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-red-400/20 flex items-center justify-center">
                        <BanIcon className="h-5 w-5 text-red-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "payouts" && (
              <>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Pending Payouts</p>
                        <p className="text-2xl font-bold text-white">7</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Paid (USD)</p>
                        <p className="text-2xl font-bold text-white">$12,450</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-400/20 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Approved Today</p>
                        <p className="text-2xl font-bold text-white">3</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-400/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Rejected Payouts</p>
                        <p className="text-2xl font-bold text-white">1</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-red-400/20 flex items-center justify-center">
                        <BanIcon className="h-5 w-5 text-red-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "analytics" && (
              <>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-white">$23,580</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-400/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Avg. Daily Users</p>
                        <p className="text-2xl font-bold text-white">87</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-400/20 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Conversion Rate</p>
                        <p className="text-2xl font-bold text-white">28.4%</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-forex-primary/20 flex items-center justify-center">
                        <PieChart className="h-5 w-5 text-forex-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">User Retention</p>
                        <p className="text-2xl font-bold text-white">73%</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-purple-400/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "settings" && (
              <>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">System Status</p>
                        <p className="text-2xl font-bold text-green-400">Operational</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-400/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">System Alerts</p>
                        <p className="text-2xl font-bold text-white">1</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Database Size</p>
                        <p className="text-2xl font-bold text-white">1.2 GB</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-400/20 flex items-center justify-center">
                        <HardDrive className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-forex-card/30 border-forex-border/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Last Backup</p>
                        <p className="text-2xl font-bold text-white">2h ago</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-forex-primary/20 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-forex-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] w-full">
                <div className="p-6">
                  <TabsContent value="dashboard" className="m-0">
                    <AdminDashboard />
                  </TabsContent>

                  <TabsContent value="challenges" className="m-0">
                    <AdminChallenges />
                  </TabsContent>

                  <TabsContent value="users" className="m-0">
                    <AdminUsers />
                  </TabsContent>

                  <TabsContent value="payouts" className="m-0">
                    <AdminPayouts />
                  </TabsContent>

                  <TabsContent value="analytics" className="m-0">
                    <AdminAnalytics />
                  </TabsContent>

                  <TabsContent value="settings" className="m-0">
                    <AdminSettings />
                  </TabsContent>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
