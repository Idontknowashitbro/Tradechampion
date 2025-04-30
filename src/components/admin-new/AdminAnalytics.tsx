import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Calendar,
  Filter,
  Users,
  Wallet,
  TrendingUp,
  DollarSign,
  CircleDollarSign,
  CreditCard,
  Calculator,
  Activity,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const AdminAnalytics = () => {
  const [period, setPeriod] = useState("30days");
  const [activeMetricsTab, setActiveMetricsTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics & Reporting</h2>
        
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-forex-card/50 text-white border-forex-border/20">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="border-forex-border/20 text-white hover:bg-forex-card"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-white/60">Total Revenue</p>
              <span className="text-xs font-medium flex items-center text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </span>
            </div>
            <p className="text-2xl font-bold text-white">$23,580</p>
            <p className="text-xs text-white/60 mt-1">Compared to $20,960 last period</p>
          </CardContent>
        </Card>
        
        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-white/60">New Users</p>
              <span className="text-xs font-medium flex items-center text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.3%
              </span>
            </div>
            <p className="text-2xl font-bold text-white">136</p>
            <p className="text-xs text-white/60 mt-1">Compared to 125 last period</p>
          </CardContent>
        </Card>
        
        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-white/60">Active Challenges</p>
              <span className="text-xs font-medium flex items-center text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +20%
              </span>
            </div>
            <p className="text-2xl font-bold text-white">18</p>
            <p className="text-xs text-white/60 mt-1">Compared to 15 last period</p>
          </CardContent>
        </Card>
        
        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-white/60">Conversion Rate</p>
              <span className="text-xs font-medium flex items-center text-red-400">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -2.1%
              </span>
            </div>
            <p className="text-2xl font-bold text-white">28.4%</p>
            <p className="text-xs text-white/60 mt-1">Compared to 30.5% last period</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Metrics Tabs */}
      <Tabs 
        value={activeMetricsTab} 
        onValueChange={setActiveMetricsTab}
        className="space-y-4"
      >
        <TabsList className="bg-forex-card/50 border border-forex-border/20">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-forex-primary/20"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            className="data-[state=active]:bg-forex-primary/20"
          >
            <Users className="h-4 w-4 mr-2" />
            User Metrics
          </TabsTrigger>
          <TabsTrigger 
            value="finance" 
            className="data-[state=active]:bg-forex-primary/20"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Financial
          </TabsTrigger>
          <TabsTrigger 
            value="performance" 
            className="data-[state=active]:bg-forex-primary/20"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Revenue Overview</CardTitle>
                <CardDescription className="text-white/60">
                  Monthly revenue from platform fees and challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <BarChart className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>Revenue chart will be displayed here</p>
                    <p className="text-xs mt-1">Integration with Chart.js or similar required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">User Growth</CardTitle>
                <CardDescription className="text-white/60">
                  Monthly user registration and retention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <LineChart className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>User growth chart will be displayed here</p>
                    <p className="text-xs mt-1">Integration with Chart.js or similar required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Challenge Performance Breakdown</CardTitle>
              <CardDescription className="text-white/60">
                Participation and completion rates by challenge type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-[200px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <PieChart className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>Daily Challenges</p>
                    <p className="text-xs mt-1">Completion Rate: 64%</p>
                  </div>
                </div>
                
                <div className="h-[200px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <PieChart className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>Weekly Challenges</p>
                    <p className="text-xs mt-1">Completion Rate: 48%</p>
                  </div>
                </div>
                
                <div className="h-[200px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <PieChart className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>Monthly Challenges</p>
                    <p className="text-xs mt-1">Completion Rate: 37%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">User Demographics</CardTitle>
                <CardDescription className="text-white/60">
                  User distribution by region and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <PieChart className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>Demographics chart will be displayed here</p>
                    <p className="text-xs mt-1">Integration with Chart.js or similar required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">User Activity</CardTitle>
                <CardDescription className="text-white/60">
                  Daily active users and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <LineChart className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>User activity chart will be displayed here</p>
                    <p className="text-xs mt-1">Integration with Chart.js or similar required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">User Retention Cohorts</CardTitle>
              <CardDescription className="text-white/60">
                Retention analysis by registration cohort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                <div className="text-white/60 text-sm flex flex-col items-center">
                  <Users className="h-10 w-10 mb-2 text-forex-primary/60" />
                  <p>Retention cohort chart will be displayed here</p>
                  <p className="text-xs mt-1">Integration with Chart.js or similar required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardContent className="pt-4">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 mr-1 text-forex-primary" />
                    <p className="text-sm text-white/70">Total Revenue</p>
                  </div>
                  <p className="text-xl font-bold text-white">$23,580</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardContent className="pt-4">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <CircleDollarSign className="h-4 w-4 mr-1 text-forex-primary" />
                    <p className="text-sm text-white/70">Avg. Ticket Size</p>
                  </div>
                  <p className="text-xl font-bold text-white">$56.30</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardContent className="pt-4">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <CreditCard className="h-4 w-4 mr-1 text-forex-primary" />
                    <p className="text-sm text-white/70">Payout Volume</p>
                  </div>
                  <p className="text-xl font-bold text-white">$12,450</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardContent className="pt-4">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <Calculator className="h-4 w-4 mr-1 text-forex-primary" />
                    <p className="text-sm text-white/70">Profit Margin</p>
                  </div>
                  <p className="text-xl font-bold text-white">47.2%</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Revenue Breakdown</CardTitle>
                <CardDescription className="text-white/60">
                  Revenue sources and distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <PieChart className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>Revenue breakdown chart will be displayed here</p>
                    <p className="text-xs mt-1">Integration with Chart.js or similar required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Monthly Revenue Trend</CardTitle>
                <CardDescription className="text-white/60">
                  Revenue growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <BarChart className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>Revenue trend chart will be displayed here</p>
                    <p className="text-xs mt-1">Integration with Chart.js or similar required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Payout History</CardTitle>
              <CardDescription className="text-white/60">
                Monthly payout volume and transaction count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                <div className="text-white/60 text-sm flex flex-col items-center">
                  <Activity className="h-10 w-10 mb-2 text-forex-primary/60" />
                  <p>Payout history chart will be displayed here</p>
                  <p className="text-xs mt-1">Integration with Chart.js or similar required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardContent className="pt-4">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <Activity className="h-4 w-4 mr-1 text-forex-primary" />
                    <p className="text-sm text-white/70">Avg. Response Time</p>
                  </div>
                  <p className="text-xl font-bold text-white">127ms</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardContent className="pt-4">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1 text-forex-primary" />
                    <p className="text-sm text-white/70">Concurrent Users</p>
                  </div>
                  <p className="text-xl font-bold text-white">42</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardContent className="pt-4">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <CheckCircle className="h-4 w-4 mr-1 text-forex-primary" />
                    <p className="text-sm text-white/70">Uptime</p>
                  </div>
                  <p className="text-xl font-bold text-white">99.97%</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardContent className="pt-4">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <AlertCircle className="h-4 w-4 mr-1 text-forex-primary" />
                    <p className="text-sm text-white/70">Error Rate</p>
                  </div>
                  <p className="text-xl font-bold text-white">0.03%</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">System Performance</CardTitle>
                <CardDescription className="text-white/60">
                  Response time and server load metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <Activity className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>System performance chart will be displayed here</p>
                    <p className="text-xs mt-1">Integration with Chart.js or similar required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">API Usage</CardTitle>
                <CardDescription className="text-white/60">
                  API request volume and endpoint performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center bg-forex-dark/30 rounded-md border border-forex-border/10">
                  <div className="text-white/60 text-sm flex flex-col items-center">
                    <BarChart className="h-10 w-10 mb-2 text-forex-primary/60" />
                    <p>API usage chart will be displayed here</p>
                    <p className="text-xs mt-1">Integration with Chart.js or similar required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Error Logs & Incidents</CardTitle>
              <CardDescription className="text-white/60">
                System errors and performance incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-forex-border/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-forex-dark/50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-white">Timestamp</th>
                      <th className="py-3 px-4 text-left font-medium text-white">Type</th>
                      <th className="py-3 px-4 text-left font-medium text-white">Message</th>
                      <th className="py-3 px-4 text-left font-medium text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forex-border/10">
                    <tr className="bg-forex-dark/30">
                      <td className="py-2 px-4 text-white/70">2025-05-01 14:23:12</td>
                      <td className="py-2 px-4 text-white/70">Error</td>
                      <td className="py-2 px-4 text-white/70">WebSocket connection timeout</td>
                      <td className="py-2 px-4"><span className="px-2 py-1 text-xs rounded-full bg-green-400/20 text-green-400">Resolved</span></td>
                    </tr>
                    <tr className="bg-forex-dark/30">
                      <td className="py-2 px-4 text-white/70">2025-05-01 08:12:45</td>
                      <td className="py-2 px-4 text-white/70">Warning</td>
                      <td className="py-2 px-4 text-white/70">High database load detected</td>
                      <td className="py-2 px-4"><span className="px-2 py-1 text-xs rounded-full bg-green-400/20 text-green-400">Resolved</span></td>
                    </tr>
                    <tr className="bg-forex-dark/30">
                      <td className="py-2 px-4 text-white/70">2025-04-30 22:45:33</td>
                      <td className="py-2 px-4 text-white/70">Error</td>
                      <td className="py-2 px-4 text-white/70">Payment API timeout</td>
                      <td className="py-2 px-4"><span className="px-2 py-1 text-xs rounded-full bg-green-400/20 text-green-400">Resolved</span></td>
                    </tr>
                    <tr className="bg-forex-dark/30">
                      <td className="py-2 px-4 text-white/70">2025-04-30 16:18:27</td>
                      <td className="py-2 px-4 text-white/70">Critical</td>
                      <td className="py-2 px-4 text-white/70">Database connection failure</td>
                      <td className="py-2 px-4"><span className="px-2 py-1 text-xs rounded-full bg-green-400/20 text-green-400">Resolved</span></td>
                    </tr>
                    <tr className="bg-forex-dark/30">
                      <td className="py-2 px-4 text-white/70">2025-04-29 11:32:09</td>
                      <td className="py-2 px-4 text-white/70">Warning</td>
                      <td className="py-2 px-4 text-white/70">High CPU utilization</td>
                      <td className="py-2 px-4"><span className="px-2 py-1 text-xs rounded-full bg-green-400/20 text-green-400">Resolved</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics; 