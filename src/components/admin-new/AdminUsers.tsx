import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { BanIcon, CheckCircle, Edit, Eye, MessagesSquare, Wallet, Search, Activity, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/api";

// Define User type
interface User {
  id: number;
  name: string;
  email: string;
  discordUsername?: string;
  walletBalance: number;
  activeChallenges?: Array<{
    id: number;
    name: string;
    type: string;
    status: string;
  }>;
  completedChallenges?: number;
  registeredDate?: string;
  createdAt?: string;
  status: string;
  role: string;
  badges?: string[];
  metrics?: {
    totalPnl: number;
    avgDrawdown: number;
    totalTrades: number;
    winRate: number;
  };
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [walletAdjustment, setWalletAdjustment] = useState<{amount: string, reason: string}>({
    amount: "",
    reason: ""
  });

  // State for users data
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trading activity monitoring
  const [isMonitoringDialogOpen, setIsMonitoringDialogOpen] = useState(false);
  const [monitoringUser, setMonitoringUser] = useState<User | null>(null);
  const [monitoringData, setMonitoringData] = useState({
    tradeHistory: [
      { time: "2025-05-01T10:15:23", symbol: "EUR/USD", type: "buy", volume: 0.5, openPrice: 1.2345, closePrice: 1.2385, profit: 200.00, status: "closed" },
      { time: "2025-05-01T11:30:45", symbol: "GBP/JPY", type: "sell", volume: 0.25, openPrice: 156.78, closePrice: 156.34, profit: 110.00, status: "closed" },
      { time: "2025-05-01T14:22:10", symbol: "USD/CAD", type: "buy", volume: 0.75, openPrice: 1.3456, closePrice: null, profit: null, status: "open" },
      { time: "2025-04-30T09:45:32", symbol: "AUD/USD", type: "sell", volume: 0.3, openPrice: 0.7654, closePrice: 0.7612, profit: 126.00, status: "closed" },
      { time: "2025-04-30T15:33:20", symbol: "EUR/GBP", type: "buy", volume: 0.4, openPrice: 0.8765, closePrice: 0.8733, profit: -128.00, status: "closed" }
    ],
    loginActivity: [
      { time: "2025-05-01T08:22:15", type: "login", status: "success", ip: "192.168.1.24", device: "Mobile - iOS" },
      { time: "2025-04-30T19:45:33", type: "login", status: "success", ip: "192.168.1.24", device: "Desktop - Windows" },
      { time: "2025-04-29T22:12:45", type: "login", status: "failed", ip: "45.67.89.123", device: "Unknown" },
      { time: "2025-04-29T22:10:33", type: "login", status: "failed", ip: "45.67.89.123", device: "Unknown" },
      { time: "2025-04-29T14:30:12", type: "login", status: "success", ip: "192.168.1.24", device: "Desktop - Windows" }
    ],
    suspiciousActivity: false
  });

  // Verify user identity
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    kycStatus: "pending", // "pending", "approved", "rejected"
    identityVerified: false,
    residenceVerified: false,
    notes: ""
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/admin/users');
        const fetchedUsers = response.data;

        // Process users data
        const processedUsers = fetchedUsers.map((user: any) => ({
          ...user,
          // Add default values for missing properties
          activeChallenges: user.activeChallenges || [],
          completedChallenges: user.completedChallenges || 0,
          registeredDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
          badges: user.badges || [],
          metrics: user.metrics || {
            totalPnl: 0,
            avgDrawdown: 0,
            totalTrades: 0,
            winRate: 0
          }
        }));

        setUsers(processedUsers);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to fetch users');

        // Use mock data if API fails
        const mockUsers = [
          {
            id: 1,
            name: "John Trader",
            email: "john@example.com",
            discordUsername: "ForexKing#1234",
            walletBalance: 120,
            role: "user",
            activeChallenges: [
              { id: 1, name: "Daily Forex Sprint", type: "daily", status: "active" }
            ],
            completedChallenges: 3,
            registeredDate: "2025-04-01",
            status: "active",
            badges: ["Top Trader", "Consistency King"],
            metrics: {
              totalPnl: 1850.23,
              avgDrawdown: 3.2,
              totalTrades: 58,
              winRate: 68.2
            }
          },
          {
            id: 2,
            name: "Emma Wilson",
            email: "emma@example.com",
            discordUsername: "EmmaTrader#5678",
            walletBalance: 300,
            role: "user",
            activeChallenges: [
              { id: 1, name: "Daily Forex Sprint", type: "daily", status: "active" },
              { id: 3, name: "May Monthly Championship", type: "monthly", status: "active" }
            ],
            completedChallenges: 5,
            registeredDate: "2025-03-15",
            status: "active",
            badges: ["Top Trader", "Volume Monster"],
            metrics: {
              totalPnl: 2450.10,
              avgDrawdown: 4.1,
              totalTrades: 92,
              winRate: 71.5
            }
          }
        ];
        setUsers(mockUsers);
        toast({
          title: "Using Demo Data",
          description: "Could not connect to the server. Using demo data instead.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users by search term and status
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.discordUsername && user.discordUsername.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // View user details
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  // Ban user dialog
  const handleOpenBanDialog = (user: User) => {
    setSelectedUser(user);
    setBanReason("");
    setIsBanDialogOpen(true);
  };

  // Submit ban user
  const handleBanUser = async () => {
    if (!selectedUser) return;

    if (!banReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for banning this user.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Make API call to ban user
      await api.put(`/admin/users/${selectedUser.id}`, {
        status: "banned",
        banReason: banReason
      });

      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, status: "banned" };
        }
        return user;
      });

      setUsers(updatedUsers);

      toast({
        title: "User Banned",
        description: `${selectedUser.name} has been banned from the platform.`
      });

      setIsBanDialogOpen(false);
    } catch (err) {
      console.error('Error banning user:', err);
      toast({
        title: "Ban Failed",
        description: "There was an error banning the user. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Wallet adjustment dialog
  const handleOpenWalletDialog = (user: User) => {
    setSelectedUser(user);
    setWalletAdjustment({ amount: "", reason: "" });
    setIsWalletDialogOpen(true);
  };

  // Submit wallet adjustment
  const handleWalletAdjustment = async () => {
    if (!selectedUser) return;

    if (!walletAdjustment.amount || !walletAdjustment.reason) {
      toast({
        title: "Error",
        description: "Please provide both amount and reason for the adjustment.",
        variant: "destructive"
      });
      return;
    }

    // Check if amount is a valid number
    if (isNaN(Number(walletAdjustment.amount))) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    const amount = Number(walletAdjustment.amount);
    const action = amount >= 0 ? "added to" : "deducted from";

    try {
      // Make API call to adjust wallet
      await api.post(`/admin/users/${selectedUser.id}/wallet`, {
        amount: amount,
        reason: walletAdjustment.reason
      });

      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            walletBalance: user.walletBalance + amount
          };
        }
        return user;
      });

      setUsers(updatedUsers);

      toast({
        title: "Wallet Updated",
        description: `${Math.abs(amount)} credits ${action} ${selectedUser.name}'s wallet.`
      });

      setIsWalletDialogOpen(false);
    } catch (err) {
      console.error('Error adjusting wallet:', err);
      toast({
        title: "Adjustment Failed",
        description: "There was an error adjusting the wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Trading activity monitoring
  const handleOpenMonitoringDialog = (user: User) => {
    setMonitoringUser(user);
    setIsMonitoringDialogOpen(true);

    // In a real implementation, we would fetch actual monitoring data here
    // For now, we're using mock data
    // Example API call:
    // const fetchMonitoringData = async () => {
    //   try {
    //     const response = await api.get(`/admin/users/${user.id}/activity`);
    //     setMonitoringData(response.data);
    //   } catch (err) {
    //     console.error('Error fetching monitoring data:', err);
    //   }
    // };
    // fetchMonitoringData();
  };

  // Verify user identity
  const handleOpenVerifyDialog = (user: User) => {
    setSelectedUser(user);
    setIsVerifyDialogOpen(true);

    // In a real implementation, we would fetch actual verification status here
    // For now, we're using mock data
    // Example API call:
    // const fetchVerificationStatus = async () => {
    //   try {
    //     const response = await api.get(`/admin/users/${user.id}/verification`);
    //     setVerificationStatus(response.data);
    //   } catch (err) {
    //     console.error('Error fetching verification status:', err);
    //   }
    // };
    // fetchVerificationStatus();
  };

  const handleUpdateVerification = async () => {
    if (!selectedUser) return;

    try {
      // Make API call to update verification status
      await api.put(`/admin/users/${selectedUser.id}/verification`, verificationStatus);

      toast({
        title: "Verification Updated",
        description: `${selectedUser.name}'s verification status has been updated.`
      });

      setIsVerifyDialogOpen(false);
    } catch (err) {
      console.error('Error updating verification:', err);
      toast({
        title: "Update Failed",
        description: "There was an error updating the verification status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Users</h2>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-9 bg-forex-card/50 border-forex-border/20 text-white w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-forex-card/50 text-white border-forex-border/20">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-forex-primary animate-spin" />
          <span className="ml-2 text-white">Loading users...</span>
        </div>
      ) : error ? (
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
      ) : (
        <Table>
          <TableHeader className="bg-forex-card/50">
            <TableRow>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Discord ID</TableHead>
              <TableHead className="text-white">Wallet Balance</TableHead>
              <TableHead className="text-white">Active Challenges</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-white/60">
                  {searchTerm || statusFilter !== "all" ?
                    "No users match your search criteria." :
                    "No users found in the system."}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-forex-border/10 bg-forex-dark/30">
                  <TableCell className="font-medium text-white">{user.name}</TableCell>
                  <TableCell className="text-white/70">{user.email}</TableCell>
                  <TableCell className="text-white/70">{user.discordUsername || "-"}</TableCell>
                  <TableCell className="text-white/70">{user.walletBalance} USDT</TableCell>
                  <TableCell>
                    {user.activeChallenges && user.activeChallenges.length > 0 ? (
                      <Badge className="bg-forex-primary/20 text-forex-primary">
                        {user.activeChallenges.length} Active
                      </Badge>
                    ) : (
                      <span className="text-white/50">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`
                        ${user.status === "active" ? "bg-green-400/20 text-green-400" : ""}
                        ${user.status === "inactive" ? "bg-gray-400/20 text-gray-400" : ""}
                        ${user.status === "banned" ? "bg-red-400/20 text-red-400" : ""}
                        ${user.status === "pending" ? "bg-yellow-400/20 text-yellow-400" : ""}
                      `}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => handleOpenMonitoringDialog(user)}
                      >
                        <Activity className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => handleOpenVerifyDialog(user)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => handleOpenWalletDialog(user)}
                      >
                        <Wallet className="h-4 w-4" />
                      </Button>

                      {user.status !== "banned" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                          onClick={() => handleOpenBanDialog(user)}
                        >
                          <BanIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* View User Dialog */}
      {selectedUser && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-[700px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedUser.name}</DialogTitle>
              <DialogDescription className="text-white/60">
                User details and trading metrics
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 p-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-white/60 mb-1">Email</h4>
                    <p className="text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-white/60 mb-1">Discord Username</h4>
                    <p className="text-white">{selectedUser.discordUsername || "—"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-white/60 mb-1">Registered</h4>
                    <p className="text-white">{selectedUser.registeredDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-white/60 mb-1">Status</h4>
                    <Badge
                      variant={
                        selectedUser.status === "active" ? "default" :
                        selectedUser.status === "inactive" ? "secondary" :
                        "destructive"
                      }
                      className="capitalize"
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm text-white/60 mb-1">Wallet Balance</h4>
                    <p className="text-white">{selectedUser.walletBalance} Credits</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-white/60 mb-1">Completed Challenges</h4>
                    <p className="text-white">{selectedUser.completedChallenges}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-white/60 mb-2">Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.badges.map((badge: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-forex-primary/30 text-forex-primary">
                        {badge}
                      </Badge>
                    ))}
                    {selectedUser.badges.length === 0 && (
                      <span className="text-white/40">No badges earned yet</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Trading Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-forex-card/50 rounded-md border border-forex-border/10">
                      <p className="text-xs text-white/60 mb-1">Total P&L (USD)</p>
                      <p className={`text-lg font-medium ${selectedUser.metrics.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${selectedUser.metrics.totalPnl.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-forex-card/50 rounded-md border border-forex-border/10">
                      <p className="text-xs text-white/60 mb-1">Avg Drawdown</p>
                      <p className="text-lg font-medium text-white">
                        {selectedUser.metrics.avgDrawdown}%
                      </p>
                    </div>
                    <div className="p-3 bg-forex-card/50 rounded-md border border-forex-border/10">
                      <p className="text-xs text-white/60 mb-1">Total Trades</p>
                      <p className="text-lg font-medium text-white">
                        {selectedUser.metrics.totalTrades}
                      </p>
                    </div>
                    <div className="p-3 bg-forex-card/50 rounded-md border border-forex-border/10">
                      <p className="text-xs text-white/60 mb-1">Win Rate</p>
                      <p className="text-lg font-medium text-white">
                        {selectedUser.metrics.winRate}%
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Active Challenges</h4>
                  {selectedUser.activeChallenges.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUser.activeChallenges.map((challenge: any) => (
                        <div key={challenge.id} className="p-3 bg-forex-card/50 rounded-md border border-forex-border/10 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-white">{challenge.name}</p>
                            <p className="text-xs text-white/60">Type: {challenge.type}</p>
                          </div>
                          <Badge className="capitalize">{challenge.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/60">No active challenges</p>
                  )}
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-forex-border/20 text-white"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>

              <div className="space-x-2">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleOpenWalletDialog(selectedUser);
                  }}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Adjust Wallet
                </Button>

                {selectedUser.status !== "banned" && (
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleOpenBanDialog(selectedUser);
                    }}
                  >
                    <BanIcon className="h-4 w-4 mr-2" />
                    Ban User
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Ban User Dialog */}
      {selectedUser && (
        <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white">Ban User</DialogTitle>
              <DialogDescription className="text-white/60">
                This will prevent {selectedUser.name} from accessing the platform.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-white">Reason for Ban</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a detailed reason for this ban..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="min-h-[100px] bg-forex-dark/60 border-forex-border/20 text-white"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="border-forex-border/20 text-white"
                onClick={() => setIsBanDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleBanUser}
              >
                <BanIcon className="h-4 w-4 mr-2" />
                Ban User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Wallet Adjustment Dialog */}
      {selectedUser && (
        <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white">Adjust Wallet Balance</DialogTitle>
              <DialogDescription className="text-white/60">
                Current balance: {selectedUser.walletBalance} Credits
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Amount (positive to add, negative to deduct)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="+100 or -50"
                  value={walletAdjustment.amount}
                  onChange={(e) => setWalletAdjustment({...walletAdjustment, amount: e.target.value})}
                  className="bg-forex-dark/60 border-forex-border/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-white">Reason for Adjustment</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for this adjustment..."
                  value={walletAdjustment.reason}
                  onChange={(e) => setWalletAdjustment({...walletAdjustment, reason: e.target.value})}
                  className="min-h-[100px] bg-forex-dark/60 border-forex-border/20 text-white"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="border-forex-border/20 text-white"
                onClick={() => setIsWalletDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleWalletAdjustment}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Update Balance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Monitoring Dialog */}
      {monitoringUser && (
        <Dialog open={isMonitoringDialogOpen} onOpenChange={setIsMonitoringDialogOpen}>
          <DialogContent className="sm:max-w-[700px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-forex-primary" />
                Trading Activity Monitoring - {monitoringUser.name}
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Monitor user's trading activity, logins, and detect suspicious patterns
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="trades" className="pt-2">
              <TabsList className="bg-forex-dark/50 border border-forex-border/20">
                <TabsTrigger value="trades" className="data-[state=active]:bg-forex-primary/20">
                  Trade History
                </TabsTrigger>
                <TabsTrigger value="login" className="data-[state=active]:bg-forex-primary/20">
                  Login Activity
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-forex-primary/20">
                  Risk Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trades" className="mt-4">
                <div className="rounded-md border border-forex-border/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-forex-dark/50">
                      <tr>
                        <th className="py-2 px-3 text-left font-medium text-white">Time</th>
                        <th className="py-2 px-3 text-left font-medium text-white">Symbol</th>
                        <th className="py-2 px-3 text-left font-medium text-white">Type</th>
                        <th className="py-2 px-3 text-left font-medium text-white">Volume</th>
                        <th className="py-2 px-3 text-left font-medium text-white">Open Price</th>
                        <th className="py-2 px-3 text-left font-medium text-white">Close Price</th>
                        <th className="py-2 px-3 text-left font-medium text-white">P/L</th>
                        <th className="py-2 px-3 text-left font-medium text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forex-border/10">
                      {monitoringData.tradeHistory.map((trade, index) => (
                        <tr key={index} className="bg-forex-dark/30">
                          <td className="py-2 px-3 text-white/70">
                            {new Date(trade.time).toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-white/70">{trade.symbol}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              trade.type === "buy" ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"
                            }`}>
                              {trade.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-white/70">{trade.volume}</td>
                          <td className="py-2 px-3 text-white/70">{trade.openPrice}</td>
                          <td className="py-2 px-3 text-white/70">{trade.closePrice || "-"}</td>
                          <td className="py-2 px-3">
                            {trade.profit !== null ? (
                              <span className={trade.profit >= 0 ? "text-green-400" : "text-red-400"}>
                                {trade.profit >= 0 ? "+" : ""}{trade.profit}
                              </span>
                            ) : "-"}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              trade.status === "open" ? "bg-blue-400/20 text-blue-400" : "bg-gray-400/20 text-gray-400"
                            }`}>
                              {trade.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    className="border-forex-border/20 text-white hover:bg-forex-card"
                  >
                    Download Full History
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="login" className="mt-4">
                <div className="rounded-md border border-forex-border/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-forex-dark/50">
                      <tr>
                        <th className="py-2 px-3 text-left font-medium text-white">Time</th>
                        <th className="py-2 px-3 text-left font-medium text-white">Type</th>
                        <th className="py-2 px-3 text-left font-medium text-white">Status</th>
                        <th className="py-2 px-3 text-left font-medium text-white">IP Address</th>
                        <th className="py-2 px-3 text-left font-medium text-white">Device</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forex-border/10">
                      {monitoringData.loginActivity.map((login, index) => (
                        <tr key={index} className="bg-forex-dark/30">
                          <td className="py-2 px-3 text-white/70">
                            {new Date(login.time).toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-white/70 capitalize">{login.type}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              login.status === "success" ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"
                            }`}>
                              {login.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-white/70">{login.ip}</td>
                          <td className="py-2 px-3 text-white/70">{login.device}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between mt-4">
                  <Badge className={monitoringData.loginActivity.some(l => l.status === "failed")
                    ? "bg-yellow-400/20 text-yellow-400"
                    : "bg-green-400/20 text-green-400"}>
                    {monitoringData.loginActivity.some(l => l.status === "failed")
                      ? "Failed login attempts detected"
                      : "No suspicious login activity"}
                  </Badge>

                  <Button
                    variant="outline"
                    className="border-forex-border/20 text-white hover:bg-forex-card"
                  >
                    Download Login Logs
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-4">
                <div className="space-y-4">
                  <Card className="bg-forex-dark/30 border-forex-border/10">
                    <CardContent className="pt-6">
                      <h4 className="text-white font-medium mb-3">Trading Pattern Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-forex-card/50 rounded-md border border-forex-border/10">
                          <p className="text-xs text-white/60 mb-1">Average Trade Size</p>
                          <p className="text-lg font-medium text-white">0.44 lots</p>
                          <p className="text-xs text-white/60 mt-1">Compared to 0.65 lot avg</p>
                        </div>

                        <div className="p-3 bg-forex-card/50 rounded-md border border-forex-border/10">
                          <p className="text-xs text-white/60 mb-1">Win Rate</p>
                          <p className="text-lg font-medium text-white">68.2%</p>
                          <p className="text-xs text-white/60 mt-1">Based on 58 trades</p>
                        </div>

                        <div className="p-3 bg-forex-card/50 rounded-md border border-forex-border/10">
                          <p className="text-xs text-white/60 mb-1">Risk Score</p>
                          <p className="text-lg font-medium text-green-400">Low</p>
                          <p className="text-xs text-white/60 mt-1">No irregularities detected</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-forex-dark/30 border-forex-border/10">
                    <CardContent className="pt-6">
                      <h4 className="text-white font-medium mb-3">Account Risk Assessment</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-white/70">Identity Verification</p>
                          <Badge className="bg-green-400/20 text-green-400">Verified</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-white/70">Trading Behavior</p>
                          <Badge className="bg-green-400/20 text-green-400">Normal</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-white/70">Account Security</p>
                          <Badge className="bg-green-400/20 text-green-400">2FA Enabled</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-white/70">Payment Methods</p>
                          <Badge className="bg-green-400/20 text-green-400">Verified</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="pt-4 border-t border-forex-border/20 flex items-center justify-between">
              <div>
                <Badge
                  className={monitoringData.suspiciousActivity
                    ? "bg-red-400/20 text-red-400"
                    : "bg-green-400/20 text-green-400"}
                >
                  {monitoringData.suspiciousActivity
                    ? "Suspicious Activity Detected"
                    : "No Suspicious Activity"}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-forex-border/20 text-white hover:bg-forex-card"
                  onClick={() => setIsMonitoringDialogOpen(false)}
                >
                  Close
                </Button>

                <Button
                  className="bg-forex-primary hover:bg-forex-primary/90 text-white"
                  onClick={() => {
                    toast({
                      title: "Action Taken",
                      description: "A notification has been sent to the user for verification."
                    });
                    setIsMonitoringDialogOpen(false);
                  }}
                >
                  Take Action
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Verify Identity Dialog */}
      {selectedUser && (
        <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
          <DialogContent className="sm:max-w-[550px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-forex-primary" />
                User Verification - {selectedUser.name}
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Review and update user verification and KYC status
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="kyc_status" className="text-white">KYC Status</Label>
                  <Select
                    value={verificationStatus.kycStatus}
                    onValueChange={(val) => setVerificationStatus({...verificationStatus, kycStatus: val})}
                  >
                    <SelectTrigger id="kyc_status" className="w-[180px] bg-forex-dark/60 border-forex-border/20 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="identity_verified" className="text-white">
                    Identity Document Verified
                  </Label>
                  <Switch
                    id="identity_verified"
                    checked={verificationStatus.identityVerified}
                    onCheckedChange={(checked) =>
                      setVerificationStatus({...verificationStatus, identityVerified: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="residence_verified" className="text-white">
                    Proof of Residence Verified
                  </Label>
                  <Switch
                    id="residence_verified"
                    checked={verificationStatus.residenceVerified}
                    onCheckedChange={(checked) =>
                      setVerificationStatus({...verificationStatus, residenceVerified: checked})
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification_notes" className="text-white">Notes</Label>
                <Textarea
                  id="verification_notes"
                  placeholder="Add verification notes here..."
                  className="min-h-[100px] bg-forex-dark/60 border-forex-border/20 text-white"
                  value={verificationStatus.notes}
                  onChange={(e) => setVerificationStatus({...verificationStatus, notes: e.target.value})}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                className="bg-forex-primary hover:bg-forex-primary/90 text-white"
                onClick={handleUpdateVerification}
              >
                Update Verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminUsers;