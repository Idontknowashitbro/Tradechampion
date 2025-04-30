import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  BarChart3,
  DollarSign,
  Download,
  Loader2,
  RefreshCw,
  TrendingUp,
  Users
} from "lucide-react";
import api from "@/lib/api";

// Define dashboard data interface
interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  totalChallenges: number;
  activeChallenges: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayouts: number;
  completedPayouts: number;
  userGrowth: number;
  revenueGrowth: number;
  topChallenges: Array<{
    id: number;
    name: string;
    participants: number;
    revenue: number;
  }>;
  recentTransactions: Array<{
    id: number;
    userId: number;
    userName: string;
    type: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    activeUsers: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
    userGrowth: 0,
    revenueGrowth: 0,
    topChallenges: [],
    recentTransactions: []
  });

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/admin/dashboard');

        // Map the backend response to our frontend data structure
        const backendData = response.data;

        // Create entries for recent users from the API response
        const recentTransactions = backendData.recentUsers?.map((user: any, index: number) => ({
          id: index + 1,
          userId: user.id,
          userName: user.name,
          type: 'registration',
          amount: 0,
          status: user.status,
          date: user.createdAt
        })) || [];

        // Create entries for recent challenge entries
        const topChallenges = backendData.recentEntries?.map((entry: any) => ({
          id: entry.challengeId,
          name: entry.challenge?.name || 'Unknown Challenge',
          participants: 1,
          revenue: 0
        })) || [];

        // Remove duplicates from topChallenges based on id
        const uniqueChallenges = topChallenges.filter((challenge, index, self) =>
          index === self.findIndex((c) => c.id === challenge.id)
        );

        const mappedData: DashboardData = {
          totalUsers: backendData.stats?.userCount || 0,
          activeUsers: backendData.stats?.activeEntryCount || 0,
          totalChallenges: backendData.stats?.challengeCount || 0,
          activeChallenges: backendData.stats?.activeEntryCount || 0,
          totalRevenue: 0,
          monthlyRevenue: 0,
          pendingPayouts: 0,
          completedPayouts: backendData.stats?.completedEntryCount || 0,
          userGrowth: 0,
          revenueGrowth: 0,
          topChallenges: uniqueChallenges,
          recentTransactions: recentTransactions
        };

        setDashboardData(mappedData);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');

        // Initialize with empty data instead of mock data
        const emptyData: DashboardData = {
          totalUsers: 0,
          activeUsers: 0,
          totalChallenges: 0,
          activeChallenges: 0,
          totalRevenue: 0,
          monthlyRevenue: 0,
          pendingPayouts: 0,
          completedPayouts: 0,
          userGrowth: 0,
          revenueGrowth: 0,
          topChallenges: [],
          recentTransactions: []
        };
        setDashboardData(emptyData);
        toast({
          title: "Connection Error",
          description: "Could not connect to the server. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Refresh dashboard data
  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/dashboard');

      // Map the backend response to our frontend data structure
      const backendData = response.data;

      // Create entries for recent users from the API response
      const recentTransactions = backendData.recentUsers?.map((user: any, index: number) => ({
        id: index + 1,
        userId: user.id,
        userName: user.name,
        type: 'registration',
        amount: 0,
        status: user.status,
        date: user.createdAt
      })) || [];

      // Create entries for recent challenge entries
      const topChallenges = backendData.recentEntries?.map((entry: any) => ({
        id: entry.challengeId,
        name: entry.challenge?.name || 'Unknown Challenge',
        participants: 1,
        revenue: 0
      })) || [];

      // Remove duplicates from topChallenges based on id
      const uniqueChallenges = topChallenges.filter((challenge, index, self) =>
        index === self.findIndex((c) => c.id === challenge.id)
      );

      const mappedData: DashboardData = {
        totalUsers: backendData.stats?.userCount || 0,
        activeUsers: backendData.stats?.activeEntryCount || 0,
        totalChallenges: backendData.stats?.challengeCount || 0,
        activeChallenges: backendData.stats?.activeEntryCount || 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingPayouts: 0,
        completedPayouts: backendData.stats?.completedEntryCount || 0,
        userGrowth: 0,
        revenueGrowth: 0,
        topChallenges: uniqueChallenges,
        recentTransactions: recentTransactions
      };

      setDashboardData(mappedData);
      toast({
        title: "Dashboard Refreshed",
        description: "Dashboard data has been updated."
      });
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing the dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Export dashboard data
  const handleExportData = async () => {
    try {
      const response = await api.get('/admin/dashboard/export', { responseType: 'blob' });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();

      toast({
        title: "Export Successful",
        description: "Dashboard data has been exported successfully."
      });
    } catch (err) {
      console.error('Error exporting dashboard data:', err);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the dashboard data. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-forex-primary animate-spin" />
        <span className="ml-2 text-white">Loading dashboard...</span>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-forex-border/20 text-white hover:bg-forex-card"
            onClick={handleRefreshData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>

          <Button
            variant="outline"
            className="border-forex-border/20 text-white hover:bg-forex-card"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/60 text-sm">Total Users</p>
                <h3 className="text-2xl font-bold text-white mt-1">{dashboardData.totalUsers}</h3>
                <p className="text-xs text-green-400 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {dashboardData.userGrowth}% growth
                </p>
              </div>
              <div className="h-12 w-12 bg-forex-primary/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-forex-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/60 text-sm">Active Challenges</p>
                <h3 className="text-2xl font-bold text-white mt-1">{dashboardData.activeChallenges}</h3>
                <p className="text-xs text-white/60 mt-1">
                  of {dashboardData.totalChallenges} total
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/60 text-sm">Monthly Revenue</p>
                <h3 className="text-2xl font-bold text-white mt-1">${dashboardData.monthlyRevenue}</h3>
                <p className="text-xs text-green-400 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {dashboardData.revenueGrowth}% growth
                </p>
              </div>
              <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-forex-card/30 border-forex-border/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/60 text-sm">Pending Payouts</p>
                <h3 className="text-2xl font-bold text-white mt-1">${dashboardData.pendingPayouts}</h3>
                <p className="text-xs text-white/60 mt-1">
                  ${dashboardData.completedPayouts} completed
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data */}
      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList className="bg-forex-card/50 border border-forex-border/20">
          <TabsTrigger value="challenges" className="data-[state=active]:bg-forex-primary/20">
            Top Challenges
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-forex-primary/20">
            Recent Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardHeader>
              <CardTitle className="text-white">Top Performing Challenges</CardTitle>
              <CardDescription className="text-white/60">
                Challenges with the most participants and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.topChallenges && dashboardData.topChallenges.length > 0 ? (
                  dashboardData.topChallenges.map((challenge) => (
                    <div key={challenge.id} className="flex justify-between items-center border-b border-forex-border/10 pb-4">
                      <div>
                        <p className="text-white font-medium">{challenge.name}</p>
                        <p className="text-white/60 text-sm">{challenge.participants} participants</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${challenge.revenue}</p>
                        <p className="text-white/60 text-sm">revenue</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-white/60">
                    No challenge data available
                  </div>
                )}


              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
              <CardDescription className="text-white/60">
                Latest financial activities on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
                  dashboardData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center border-b border-forex-border/10 pb-4">
                      <div>
                        <p className="text-white font-medium">{transaction.userName}</p>
                        <p className="text-white/60 text-sm capitalize">{transaction.type}</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-medium ${
                          transaction.status === 'completed' ? 'text-green-400' :
                          transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </p>
                        <p className="text-white/60 text-xs">
                          {new Date(transaction.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-white/60">
                    No transaction data available
                  </div>
                )}


              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
