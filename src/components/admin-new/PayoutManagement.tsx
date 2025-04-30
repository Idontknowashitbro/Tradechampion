import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Eye,
  ExternalLink,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

// Types for API integration
interface Payout {
  id: string;
  challengeId: string;
  challengeName: string;
  userId: string;
  username: string;
  rank: number;
  prizeAmount: number;
  walletCredits: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  cryptoAddress: string;
  createdAt: string;
  updatedAt: string;
}

interface Challenge {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  status: string;
}

// Sample data for demonstration - will be replaced with API calls
const samplePayouts: Payout[] = [
  { 
    id: "p1", 
    challengeId: "c1", 
    challengeName: "Daily Forex Sprint", 
    userId: "u1", 
    username: "TradeMaster92", 
    rank: 1, 
    prizeAmount: 720, 
    walletCredits: 100, 
    status: 'pending', 
    cryptoAddress: "0x1234...5678", 
    createdAt: "2025-04-28T10:30:00Z", 
    updatedAt: "2025-04-28T10:30:00Z" 
  },
  { 
    id: "p2", 
    challengeId: "c1", 
    challengeName: "Daily Forex Sprint", 
    userId: "u2", 
    username: "ForexKing", 
    rank: 2, 
    prizeAmount: 360, 
    walletCredits: 50, 
    status: 'approved', 
    cryptoAddress: "0x8765...4321", 
    createdAt: "2025-04-28T10:30:00Z", 
    updatedAt: "2025-04-28T11:15:00Z" 
  },
  { 
    id: "p3", 
    challengeId: "c1", 
    challengeName: "Daily Forex Sprint", 
    userId: "u3", 
    username: "PipHunter", 
    rank: 3, 
    prizeAmount: 120, 
    walletCredits: 20, 
    status: 'paid', 
    cryptoAddress: "0xabcd...efgh", 
    createdAt: "2025-04-28T10:30:00Z", 
    updatedAt: "2025-04-28T14:20:00Z" 
  },
  { 
    id: "p4", 
    challengeId: "c2", 
    challengeName: "April Forex Marathon", 
    userId: "u4", 
    username: "TrendFollower", 
    rank: 1, 
    prizeAmount: 7200, 
    walletCredits: 1000, 
    status: 'pending', 
    cryptoAddress: "0x2468...1357", 
    createdAt: "2025-04-30T09:00:00Z", 
    updatedAt: "2025-04-30T09:00:00Z" 
  },
  { 
    id: "p5", 
    challengeId: "c2", 
    challengeName: "April Forex Marathon", 
    userId: "u5", 
    username: "PatternTrader", 
    rank: 2, 
    prizeAmount: 3600, 
    walletCredits: 500, 
    status: 'rejected', 
    cryptoAddress: "0x1357...2468", 
    createdAt: "2025-04-30T09:00:00Z", 
    updatedAt: "2025-04-30T10:30:00Z" 
  },
];

const sampleChallenges: Challenge[] = [
  { 
    id: "c1", 
    name: "Daily Forex Sprint", 
    type: "daily", 
    startDate: "2025-04-26", 
    endDate: "2025-04-27", 
    prizePool: 1200, 
    status: "completed" 
  },
  { 
    id: "c2", 
    name: "April Forex Marathon", 
    type: "monthly", 
    startDate: "2025-04-01", 
    endDate: "2025-04-30", 
    prizePool: 12000, 
    status: "completed" 
  },
  { 
    id: "c3", 
    name: "Weekend Forex Sprint", 
    type: "daily", 
    startDate: "2025-04-27", 
    endDate: "2025-04-28", 
    prizePool: 2500, 
    status: "active" 
  },
];

// API service functions - these will be replaced with actual API calls
const apiService = {
  // Fetch all payouts
  getPayouts: async (): Promise<Payout[]> => {
    // In a real implementation, this would be an API call
    // return await fetch('/api/payouts').then(res => res.json());
    return new Promise((resolve) => {
      setTimeout(() => resolve(samplePayouts), 500);
    });
  },
  
  // Fetch payouts for a specific challenge
  getPayoutsByChallenge: async (challengeId: string): Promise<Payout[]> => {
    // In a real implementation, this would be an API call
    // return await fetch(`/api/challenges/${challengeId}/payouts`).then(res => res.json());
    return new Promise((resolve) => {
      setTimeout(() => resolve(samplePayouts.filter(p => p.challengeId === challengeId)), 500);
    });
  },
  
  // Approve a payout
  approvePayout: async (payoutId: string): Promise<boolean> => {
    // In a real implementation, this would be an API call
    // return await fetch(`/api/payouts/${payoutId}/approve`, { method: 'POST' }).then(res => res.ok);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  },
  
  // Reject a payout
  rejectPayout: async (payoutId: string, reason: string): Promise<boolean> => {
    // In a real implementation, this would be an API call
    // return await fetch(`/api/payouts/${payoutId}/reject`, { 
    //   method: 'POST',
    //   body: JSON.stringify({ reason })
    // }).then(res => res.ok);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  },
  
  // Process a payout (send crypto)
  processPayout: async (payoutId: string): Promise<boolean> => {
    // In a real implementation, this would be an API call
    // return await fetch(`/api/payouts/${payoutId}/process`, { method: 'POST' }).then(res => res.ok);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  },
  
  // Get all challenges
  getChallenges: async (): Promise<Challenge[]> => {
    // In a real implementation, this would be an API call
    // return await fetch('/api/challenges').then(res => res.json());
    return new Promise((resolve) => {
      setTimeout(() => resolve(sampleChallenges), 500);
    });
  },
};

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [challengeFilter, setChallengeFilter] = useState("all");
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [isPayoutDetailsOpen, setIsPayoutDetailsOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processingPayout, setProcessingPayout] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [payoutsData, challengesData] = await Promise.all([
          apiService.getPayouts(),
          apiService.getChallenges()
        ]);
        setPayouts(payoutsData);
        setChallenges(challengesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // In a real app, we would show an error message to the user
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter payouts based on search term and filters
  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = 
      payout.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.challengeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter;
    const matchesChallenge = challengeFilter === "all" || payout.challengeId === challengeFilter;
    
    return matchesSearch && matchesStatus && matchesChallenge;
  });

  // Group payouts by challenge
  const payoutsByChallenge = challenges.reduce((acc, challenge) => {
    acc[challenge.id] = payouts.filter(p => p.challengeId === challenge.id);
    return acc;
  }, {} as Record<string, Payout[]>);

  const handleViewPayoutDetails = (payout: Payout) => {
    setSelectedPayout(payout);
    setIsPayoutDetailsOpen(true);
  };

  const handleApprovePayout = async (payoutId: string) => {
    try {
      const success = await apiService.approvePayout(payoutId);
      if (success) {
        // Update local state
        setPayouts(payouts.map(p => 
          p.id === payoutId ? { ...p, status: 'approved' as const, updatedAt: new Date().toISOString() } : p
        ));
      }
    } catch (error) {
      console.error("Error approving payout:", error);
      // In a real app, we would show an error message to the user
    }
  };

  const handleRejectPayout = async (payoutId: string) => {
    if (!rejectReason.trim()) return;
    
    try {
      const success = await apiService.rejectPayout(payoutId, rejectReason);
      if (success) {
        // Update local state
        setPayouts(payouts.map(p => 
          p.id === payoutId ? { ...p, status: 'rejected' as const, updatedAt: new Date().toISOString() } : p
        ));
        setIsRejectDialogOpen(false);
        setRejectReason("");
      }
    } catch (error) {
      console.error("Error rejecting payout:", error);
      // In a real app, we would show an error message to the user
    }
  };

  const handleProcessPayout = async (payoutId: string) => {
    setProcessingPayout(payoutId);
    try {
      const success = await apiService.processPayout(payoutId);
      if (success) {
        // Update local state
        setPayouts(payouts.map(p => 
          p.id === payoutId ? { ...p, status: 'paid' as const, updatedAt: new Date().toISOString() } : p
        ));
      }
    } catch (error) {
      console.error("Error processing payout:", error);
      // In a real app, we would show an error message to the user
    } finally {
      setProcessingPayout(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payout Management</CardTitle>
            <CardDescription>Manage and process challenge payouts</CardDescription>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forex-neutral" />
              <Input
                type="search"
                placeholder="Search payouts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={challengeFilter} onValueChange={setChallengeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Challenge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Challenges</SelectItem>
                  {challenges.map(challenge => (
                    <SelectItem key={challenge.id} value={challenge.id}>
                      {challenge.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forex-primary"></div>
            </div>
          ) : (
            <>
              {activeTab === "all" ? (
                // Show all payouts grouped by challenge
                <div className="space-y-8">
                  {challenges.map(challenge => {
                    const challengePayouts = payoutsByChallenge[challenge.id] || [];
                    if (challengePayouts.length === 0) return null;
                    
                    return (
                      <Card key={challenge.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{challenge.name}</CardTitle>
                          <CardDescription>
                            {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)} Challenge • 
                            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)} • 
                            Prize Pool: {formatCurrency(challenge.prizePool)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Prize Amount</TableHead>
                                <TableHead>Wallet Credits</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {challengePayouts.map((payout) => (
                                <TableRow key={payout.id}>
                                  <TableCell>{payout.rank}</TableCell>
                                  <TableCell className="font-medium">{payout.username}</TableCell>
                                  <TableCell>{formatCurrency(payout.prizeAmount)}</TableCell>
                                  <TableCell>{payout.walletCredits}</TableCell>
                                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                                  <TableCell>{formatDate(payout.createdAt)}</TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <span className="sr-only">Open menu</span>
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleViewPayoutDetails(payout)}>
                                          <Eye className="mr-2 h-4 w-4" />
                                          View Details
                                        </DropdownMenuItem>
                                        {payout.status === 'pending' && (
                                          <>
                                            <DropdownMenuItem onClick={() => handleApprovePayout(payout.id)}>
                                              <CheckCircle className="mr-2 h-4 w-4" />
                                              Approve
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                              setSelectedPayout(payout);
                                              setIsRejectDialogOpen(true);
                                            }}>
                                              <XCircle className="mr-2 h-4 w-4" />
                                              Reject
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                        {payout.status === 'approved' && (
                                          <DropdownMenuItem 
                                            onClick={() => handleProcessPayout(payout.id)}
                                            disabled={!!processingPayout}
                                          >
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            {processingPayout === payout.id ? 'Processing...' : 'Process Payout'}
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                // Show filtered payouts by status
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Prize Amount</TableHead>
                      <TableHead>Wallet Credits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayouts
                      .filter(p => activeTab === "all" || p.status === activeTab)
                      .map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell>{payout.challengeName}</TableCell>
                          <TableCell>{payout.rank}</TableCell>
                          <TableCell className="font-medium">{payout.username}</TableCell>
                          <TableCell>{formatCurrency(payout.prizeAmount)}</TableCell>
                          <TableCell>{payout.walletCredits}</TableCell>
                          <TableCell>{getStatusBadge(payout.status)}</TableCell>
                          <TableCell>{formatDate(payout.createdAt)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewPayoutDetails(payout)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {payout.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApprovePayout(payout.id)}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedPayout(payout);
                                      setIsRejectDialogOpen(true);
                                    }}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {payout.status === 'approved' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleProcessPayout(payout.id)}
                                    disabled={!!processingPayout}
                                  >
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    {processingPayout === payout.id ? 'Processing...' : 'Process Payout'}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Payout Details Dialog */}
      <Dialog open={isPayoutDetailsOpen} onOpenChange={setIsPayoutDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payout Details</DialogTitle>
            <DialogDescription>
              Detailed information about the payout
            </DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Challenge</h4>
                  <p className="text-lg">{selectedPayout.challengeName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Username</h4>
                  <p className="text-lg">{selectedPayout.username}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Rank</h4>
                  <p className="text-lg">{selectedPayout.rank}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Status</h4>
                  <div className="mt-1">{getStatusBadge(selectedPayout.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Prize Amount</h4>
                  <p className="text-lg">{formatCurrency(selectedPayout.prizeAmount)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Wallet Credits</h4>
                  <p className="text-lg">{selectedPayout.walletCredits}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Crypto Address</h4>
                  <div className="flex items-center">
                    <p className="text-lg">{selectedPayout.cryptoAddress}</p>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Created</h4>
                  <p className="text-lg">{formatDate(selectedPayout.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Last Updated</h4>
                  <p className="text-lg">{formatDate(selectedPayout.updatedAt)}</p>
                </div>
              </div>
              
              {selectedPayout.status === 'rejected' && (
                <div className="mt-4 p-4 bg-red-50 rounded-md">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Rejection Reason</h4>
                  <p className="text-red-700">Invalid crypto address provided. User needs to update their address.</p>
                </div>
              )}
              
              {selectedPayout.status === 'pending' && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setIsPayoutDetailsOpen(false);
                      setSelectedPayout(selectedPayout);
                      setIsRejectDialogOpen(true);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    className="bg-forex-primary hover:bg-forex-primary/90"
                    onClick={() => {
                      handleApprovePayout(selectedPayout.id);
                      setIsPayoutDetailsOpen(false);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
              
              {selectedPayout.status === 'approved' && (
                <div className="flex justify-end mt-4">
                  <Button 
                    className="bg-forex-primary hover:bg-forex-primary/90"
                    onClick={() => {
                      handleProcessPayout(selectedPayout.id);
                      setIsPayoutDetailsOpen(false);
                    }}
                    disabled={!!processingPayout}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    {processingPayout === selectedPayout.id ? 'Processing...' : 'Process Payout'}
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayoutDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Payout Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Payout</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this payout
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectReason">Reason</Label>
              <Textarea 
                id="rejectReason" 
                placeholder="Enter rejection reason..." 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => selectedPayout && handleRejectPayout(selectedPayout.id)}
              disabled={!rejectReason.trim()}
            >
              Reject Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayoutManagement; 