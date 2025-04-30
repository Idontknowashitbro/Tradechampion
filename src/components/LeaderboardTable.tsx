import { useState, useEffect, useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Award, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import socketClient from "@/lib/socketClient";
import { useAuth } from "@/hooks/useAuth";

// Interface for leaderboard entry
interface LeaderboardEntry {
  id: number;
  rank: number;
  userName: string;
  discordUsername?: string;
  entryId: number;
  metrics: {
    pnlPercentage: number;
    drawdownPercentage: number;
    tradeCount: number;
    avgRiskPerTrade: number;
    winRate?: number; // Optional if calculated on the client
  };
  type: string; // Daily, weekly, monthly
  status: string; // Active, completed, etc.
}

// Interface for the challenge data
interface Challenge {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

const LeaderboardTable = () => {
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  
  // State
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("active");
  const [search, setSearch] = useState<string>("");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Fetch active challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/challenges?status=active`);
        setChallenges(response.data.challenges || []);
        
        // Set first challenge as default if available
        if (response.data.challenges && response.data.challenges.length > 0) {
          setSelectedChallengeId(response.data.challenges[0].id.toString());
        }
      } catch (error) {
        console.error("Error fetching challenges:", error);
        toast({
          title: "Error",
          description: "Failed to load challenges. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    fetchChallenges();
  }, [toast]);
  
  // Fetch leaderboard data
  const fetchLeaderboardData = useCallback(async () => {
    if (selectedChallengeId === "all") return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/leaderboards/${selectedChallengeId}`);
      
      // Transform data to match our interface
      const entries = response.data.entries.map((entry: any) => ({
        id: entry.entryId,
        rank: entry.rank,
        userName: entry.userName,
        discordUsername: entry.discordUsername,
        entryId: entry.entryId,
        metrics: {
          pnlPercentage: entry.metrics.pnlPercentage,
          drawdownPercentage: entry.metrics.drawdownPercentage,
          tradeCount: entry.metrics.tradeCount,
          avgRiskPerTrade: entry.metrics.avgRiskPerTrade,
          winRate: entry.metrics.winRate || 0,
        },
        type: challenges.find(c => c.id.toString() === selectedChallengeId)?.type || "unknown",
        status: "active",
      }));
      
      setLeaderboardData(entries);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedChallengeId, challenges, toast]);
  
  // Fetch initial data
  useEffect(() => {
    if (selectedChallengeId !== "all") {
      fetchLeaderboardData();
    }
  }, [selectedChallengeId, fetchLeaderboardData]);
  
  // Connect to WebSocket for real-time updates
  useEffect(() => {
    if (!isAuthenticated || !token || selectedChallengeId === "all") return;
    
    // Initialize socket connection
    if (!socketClient.isConnected()) {
      socketClient.init(token);
    }
    
    // Join challenge room
    if (socketClient.isConnected()) {
      socketClient.socket?.emit('join_challenge', selectedChallengeId);
    }
    
    // Set up listener for leaderboard updates
    const unsubscribe = socketClient.on('leaderboard_update', (data: any) => {
      if (data.challengeId.toString() === selectedChallengeId) {
        // Transform data similar to initial fetch
        const entries = data.entries.map((entry: any) => ({
          id: entry.entryId,
          rank: entry.rank,
          userName: entry.userName,
          discordUsername: entry.discordUsername,
          entryId: entry.entryId,
          metrics: {
            pnlPercentage: entry.metrics.pnlPercentage,
            drawdownPercentage: entry.metrics.drawdownPercentage,
            tradeCount: entry.metrics.tradeCount,
            avgRiskPerTrade: entry.metrics.avgRiskPerTrade,
            winRate: entry.metrics.winRate || 0,
          },
          type: challenges.find(c => c.id.toString() === selectedChallengeId)?.type || "unknown",
          status: "active",
        }));
        
        setLeaderboardData(entries);
        setLastUpdated(new Date().toLocaleTimeString());
        
        // Show notification about update
        toast({
          title: "Leaderboard Updated",
          description: "The leaderboard has been updated with new trading data.",
          duration: 3000,
        });
      }
    });
    
    // Clean up on unmount or when selected challenge changes
    return () => {
      if (socketClient.isConnected()) {
        socketClient.socket?.emit('leave_challenge', selectedChallengeId);
      }
      unsubscribe();
    };
  }, [isAuthenticated, token, selectedChallengeId, challenges, toast]);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...leaderboardData];
    
    // Apply status filter if not "all"
    if (status !== "all") {
      filtered = filtered.filter(item => item.status === status);
    }
    
    // Apply type filter if not "all" (only relevant for "all challenges" mode)
    if (type !== "all" && selectedChallengeId === "all") {
      filtered = filtered.filter(item => item.type === type);
    }
    
    // Apply search filter
    if (search !== "") {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.userName.toLowerCase().includes(searchLower) ||
        (item.discordUsername && item.discordUsername.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by rank
    filtered = [...filtered].sort((a, b) => a.rank - b.rank);
    
    setFilteredData(filtered);
  }, [leaderboardData, type, status, search, selectedChallengeId]);
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <Badge className="bg-yellow-500/90 hover:bg-yellow-500 text-white">
          <Award className="h-3 w-3 mr-1" />
          1st
        </Badge>
      );
    } else if (rank === 2) {
      return (
        <Badge className="bg-gray-400/90 hover:bg-gray-400 text-white">
          2nd
        </Badge>
      );
    } else if (rank === 3) {
      return (
        <Badge className="bg-amber-700/90 hover:bg-amber-700 text-white">
          3rd
        </Badge>
      );
    } else {
      return <span>{rank}th</span>;
    }
  };
  
  // Calculate profit in dollars based on challenge type
  const calculateProfitInDollars = (entry: LeaderboardEntry) => {
    let initialBalance = 10000; // Default for daily
    
    if (entry.type === "weekly") {
      initialBalance = 50000;
    } else if (entry.type === "monthly") {
      initialBalance = 100000;
    }
    
    return (initialBalance * entry.metrics.pnlPercentage) / 100;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-52">
            <Select 
              value={selectedChallengeId} 
              onValueChange={setSelectedChallengeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Challenge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Active Challenges</SelectItem>
                {challenges.map(challenge => (
                  <SelectItem key={challenge.id} value={challenge.id.toString()}>
                    {challenge.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedChallengeId === "all" && (
            <div className="w-full sm:w-48">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Challenge Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="daily">Daily Challenge</SelectItem>
                  <SelectItem value="weekly">Weekly Challenge</SelectItem>
                  <SelectItem value="monthly">Monthly Championship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="w-full sm:w-48">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="disqualified">Disqualified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search traders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-forex-primary"></div>
          <span className="ml-3 text-forex-neutral">Loading leaderboard...</span>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableCaption className="mt-2">
              {lastUpdated ? (
                <span>Live leaderboard • Last updated: {lastUpdated}</span>
              ) : (
                <span>Live leaderboard data</span>
              )}
            </TableCaption>
            <TableHeader className="bg-forex-light/50">
              <TableRow>
                <TableHead className="w-16 font-semibold text-forex-dark">Rank</TableHead>
                <TableHead className="font-semibold text-forex-dark">Trader</TableHead>
                <TableHead className="text-right font-semibold text-forex-dark">P&L ($)</TableHead>
                <TableHead className="text-right font-semibold text-forex-dark">P&L (%)</TableHead>
                <TableHead className="text-center font-semibold text-forex-dark">Trades</TableHead>
                <TableHead className="text-center font-semibold text-forex-dark">Max DD</TableHead>
                {selectedChallengeId === "all" && (
                  <TableHead className="text-center font-semibold text-forex-dark">Challenge</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((trader) => (
                <TableRow key={trader.id} className="hover:bg-forex-light/20">
                  <TableCell className="font-medium">{getRankBadge(trader.rank)}</TableCell>
                  <TableCell className="font-semibold">
                    {trader.userName}
                    {trader.discordUsername && (
                      <span className="ml-1 text-sm text-gray-500">({trader.discordUsername})</span>
                    )}
                  </TableCell>
                  <TableCell className={`text-right font-mono font-medium ${trader.metrics.pnlPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${calculateProfitInDollars(trader).toFixed(2)}
                  </TableCell>
                  <TableCell className={`text-right font-mono font-medium ${trader.metrics.pnlPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trader.metrics.pnlPercentage.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-center">{trader.metrics.tradeCount}</TableCell>
                  <TableCell className="text-center">{trader.metrics.drawdownPercentage.toFixed(2)}%</TableCell>
                  {selectedChallengeId === "all" && (
                    <TableCell className="text-center">
                      <Badge variant="outline" className="capitalize border-forex-primary text-forex-dark">
                        {trader.type}
                      </Badge>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-forex-neutral" />
          <p className="text-forex-neutral">No traders found matching your filters.</p>
          <p className="mt-2 text-forex-neutral">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
