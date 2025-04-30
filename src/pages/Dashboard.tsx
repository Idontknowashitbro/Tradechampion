import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import {
  LineChart,
  Trophy,
  Wallet,
  DollarSign,
  BarChart3,
  Users,
  LogOut,
  Bell,
  Settings,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import NotificationsPanel from "@/components/NotificationsPanel";
import ChallengeDetailsModal from "@/components/ChallengeDetailsModal";
import TradePerformanceChart from "@/components/TradePerformanceChart";
import ChallengeMetrics from "@/components/ChallengeMetrics";
import TradeHistory from "@/components/TradeHistory";
import CtraderConnect from "@/components/CtraderConnect";
import WalletManagementNew from "@/components/WalletManagementNew";
import BadgeShowcase from "@/components/BadgeShowcase";
import WalletCreditsOverview from "@/components/WalletCreditsOverview";
import ActiveChallengeStatus from "@/components/ActiveChallengeStatus";
import challengeService, { Challenge, ChallengeEntry } from "@/lib/challengeService";
import tradeService, { Trade } from "@/lib/tradeService";
import walletService, { WalletTransaction } from "@/lib/walletService";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [challengeDetailsOpen, setChallengeDetailsOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  // State for real data
  const [activeChallenges, setActiveChallenges] = useState<ChallengeEntry[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<ChallengeEntry[]>([]);
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch active challenges
        const activeEntries = await challengeService.getUserActiveChallengeEntries();
        setActiveChallenges(activeEntries);

        // Fetch completed challenges
        const completedEntries = await challengeService.getUserCompletedChallengeEntries();
        setCompletedChallenges(completedEntries);

        // Fetch available challenges
        const challenges = await challengeService.getActiveChallenges();
        setAvailableChallenges(challenges);

        // Fetch wallet transactions
        const transactions = await walletService.getTransactions();
        setWalletTransactions(transactions);

        // Fetch wallet balance
        const balance = await walletService.getWalletBalance();
        setWalletBalance(balance);

        // If there's an active challenge, fetch its trades
        if (activeEntries.length > 0) {
          const challengeTrades = await tradeService.getTradesByEntry(activeEntries[0].id);
          setTrades(challengeTrades);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const openChallengeDetails = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setChallengeDetailsOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-forex-dark">
      <Header />

      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, <span className="bg-gradient-to-r from-forex-primary to-forex-accent bg-clip-text text-transparent">{user?.name}</span>
            </h1>
            <p className="text-white/60 mt-1">{user?.email}</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button
              variant="ghost"
              size="icon"
              className="bg-forex-card/50 text-white hover:bg-forex-card hover:text-forex-primary relative"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-forex-primary rounded-full"></div>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="bg-forex-card/50 text-white hover:bg-forex-card hover:text-forex-primary"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="bg-forex-card/50 text-white hover:bg-forex-card hover:text-red-500"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardContent className="pt-6 flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-400/20 flex items-center justify-center mr-4">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Wallet Balance</p>
                <h3 className="text-2xl font-bold text-white">${walletBalance} USDT</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardContent className="pt-6 flex items-center">
              <div className="h-12 w-12 rounded-full bg-purple-400/20 flex items-center justify-center mr-4">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Active Challenges</p>
                <h3 className="text-2xl font-bold text-white">{activeChallenges.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardContent className="pt-6 flex items-center">
              <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center mr-4">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Completed Challenges</p>
                <h3 className="text-2xl font-bold text-white">{completedChallenges.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-forex-card/30 border-forex-border/20">
            <CardContent className="pt-6 flex items-center">
              <div className="h-12 w-12 rounded-full bg-green-400/20 flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Total Profit</p>
                <h3 className="text-2xl font-bold text-green-400">
                  {activeChallenges.length > 0 && activeChallenges[0].pnlPercentage
                    ? `+$${(activeChallenges[0].pnlPercentage * (activeChallenges[0].initialBalance || 0) / 100).toFixed(2)}`
                    : '$0.00'}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-forex-card/50 border border-forex-border/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-forex-primary/20" onClick={() => setActiveTab("overview")}>Overview</TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-forex-primary/20" onClick={() => setActiveTab("challenges")}>Challenges</TabsTrigger>
            <TabsTrigger value="trades" className="data-[state=active]:bg-forex-primary/20">Trade History</TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-forex-primary/20">Wallet</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <Card className="bg-forex-card/30 border-forex-border/20">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forex-primary mb-4"></div>
                  <h3 className="text-xl font-medium text-white mb-2">Loading...</h3>
                  <p className="text-white/60 text-center">Fetching your challenge data</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="bg-forex-card/30 border-forex-border/20">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="h-12 w-12 text-red-500 mb-4">⚠️</div>
                  <h3 className="text-xl font-medium text-white mb-2">Error Loading Data</h3>
                  <p className="text-white/60 text-center mb-6">{error}</p>
                  <Button
                    className="bg-forex-primary hover:bg-forex-primary/90 text-white"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : activeChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ActiveChallengeStatus
                    challenge={activeChallenges[0]}
                    onViewDetails={openChallengeDetails}
                  />
                  <BadgeShowcase />
                </div>
                <div className="space-y-6">
                  <TradePerformanceChart />
                  <WalletCreditsOverview credits={walletBalance} expiry="30 days from now" />
                </div>
              </div>
            ) : (
              <Card className="bg-forex-card/30 border-forex-border/20">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Trophy className="h-12 w-12 text-forex-primary/50 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Active Challenges</h3>
                  <p className="text-white/60 text-center mb-6">You don't have any active trading challenges.</p>
                  <Button
                    className="bg-forex-primary hover:bg-forex-primary/90 text-white"
                    onClick={() => setActiveTab("challenges")}
                  >
                    Join a Challenge
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recent Completed Challenges */}
            <Card className="bg-forex-card/30 border-forex-border/20 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Recent Challenges</CardTitle>
                <CardDescription className="text-white/60">Your recent challenge results</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forex-primary mx-auto mb-2"></div>
                    <p className="text-white/60">Loading completed challenges...</p>
                  </div>
                ) : completedChallenges.length > 0 ? (
                  <div className="space-y-4">
                    {completedChallenges.map(entry => (
                      <div key={entry.id} className="p-4 bg-forex-card/30 rounded-lg border border-forex-border/10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                          <h4 className="font-medium text-white">{entry.challengeId}</h4>
                          <p className="text-white/60 text-sm">
                            {new Date(entry.createdAt).toLocaleDateString()} - {new Date(entry.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-6">
                            <p className="text-white/60 text-sm">Final Rank</p>
                            <p className="text-white font-medium">{entry.rank || 'N/A'}</p>
                          </div>
                          <div className="mr-6">
                            <p className="text-white/60 text-sm">Result</p>
                            <p className={`font-medium ${entry.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                              {entry.status === 'completed' ? 'Completed' : entry.status === 'disqualified' ? 'Disqualified' : entry.status}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">PnL %</p>
                            <p className="text-white font-medium">{entry.pnlPercentage ? `${entry.pnlPercentage.toFixed(2)}%` : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-white/60">
                    You haven't completed any challenges yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardHeader>
                <CardTitle className="text-white">Available Challenges</CardTitle>
                <CardDescription className="text-white/60">Join a new trading challenge</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forex-primary mx-auto mb-4"></div>
                    <p className="text-white/60">Loading available challenges...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
                    <p className="text-white/60 mb-4">{error}</p>
                    <Button
                      className="bg-forex-primary hover:bg-forex-primary/90 text-white"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : availableChallenges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {availableChallenges.map(challenge => (
                      <Card key={challenge.id} className="bg-forex-card border-forex-border/20 overflow-hidden h-full flex flex-col">
                        <div className={`h-2 ${challenge.type === 'daily' ? 'bg-forex-primary' : challenge.type === 'weekly' ? 'bg-forex-accent' : 'bg-forex-secondary'} w-full`}></div>
                        <CardHeader>
                          <CardTitle className="text-white">{challenge.name}</CardTitle>
                          <CardDescription className="text-white/60">{challenge.type} trading competition</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-white/60">Initial Balance</span>
                              <span className="text-white">${challenge.initialBalance?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Entry Fee</span>
                              <span className="text-white">${challenge.entryFee} USDT</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Prize Pool</span>
                              <span className="text-white">${challenge.prizePool?.toLocaleString() || 'N/A'} USDT</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Starting</span>
                              <span className="text-white">{new Date(challenge.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Participants</span>
                              <div className="text-white">
                                {challenge.participantsCount || 0}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className={`w-full ${challenge.type === 'daily' ? 'bg-forex-primary' : challenge.type === 'weekly' ? 'bg-forex-accent' : 'bg-forex-secondary'} hover:opacity-90 text-white`}
                            onClick={() => openChallengeDetails(challenge)}
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Trophy className="h-12 w-12 text-forex-primary/50 mx-auto mb-4" />
                    <p className="text-white/60">No challenges available at the moment. Please check back later.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trades Tab */}
          <TabsContent value="trades">
            <Card className="bg-forex-card/30 border-forex-border/20">
              <CardHeader>
                <CardTitle className="text-white">Trade History</CardTitle>
                <CardDescription className="text-white/60">Your trading history</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forex-primary mx-auto mb-2"></div>
                    <p className="text-white/60">Loading trade history...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-6">
                    <div className="h-8 w-8 text-red-500 mx-auto mb-2">⚠️</div>
                    <p className="text-white/60 mb-4">{error}</p>
                    <Button
                      className="bg-forex-primary hover:bg-forex-primary/90 text-white"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : trades.length > 0 ? (
                  <TradeHistory trades={trades} />
                ) : (
                  <div className="text-center py-6 text-white/60">
                    No trades found. Connect your cTrader account and start trading to see your history here.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-4">
            <WalletManagementNew />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Notifications Panel */}
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Challenge Details Modal */}
      {selectedChallenge && (
        <ChallengeDetailsModal
          open={challengeDetailsOpen}
          onClose={() => setChallengeDetailsOpen(false)}
          challenge={selectedChallenge}
        />
      )}
    </div>
  );
};

export default Dashboard;
