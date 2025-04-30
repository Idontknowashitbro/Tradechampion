import { useState } from "react";
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
import { BanIcon, CheckCircle, Edit, Eye, MessagesSquare, Wallet, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock users data
const users = [
  {
    id: 1,
    name: "John Trader",
    email: "john@example.com",
    discordUsername: "ForexKing#1234",
    walletBalance: 120,
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
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex@example.com",
    discordUsername: "AlexFX#9012",
    walletBalance: 0,
    activeChallenges: [],
    completedChallenges: 2,
    registeredDate: "2025-04-10",
    status: "inactive",
    badges: [],
    metrics: {
      totalPnl: 320.45,
      avgDrawdown: 5.8,
      totalTrades: 23,
      winRate: 52.4
    }
  },
  {
    id: 4,
    name: "Michael Chen",
    email: "michael@example.com",
    discordUsername: "MChenFX#3456",
    walletBalance: 75,
    activeChallenges: [
      { id: 3, name: "May Monthly Championship", type: "monthly", status: "active" }
    ],
    completedChallenges: 7,
    registeredDate: "2025-02-20",
    status: "active",
    badges: ["Consistency King", "Comeback Kid"],
    metrics: {
      totalPnl: 3210.80,
      avgDrawdown: 2.9,
      totalTrades: 112,
      winRate: 73.8
    }
  },
  {
    id: 5,
    name: "Sarah Thompson",
    email: "sarah@example.com",
    discordUsername: "SarahT#7890",
    walletBalance: 50,
    activeChallenges: [],
    completedChallenges: 1,
    registeredDate: "2025-04-18",
    status: "banned",
    badges: [],
    metrics: {
      totalPnl: -150.20,
      avgDrawdown: 8.5,
      totalTrades: 12,
      winRate: 33.3
    }
  }
];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [walletAdjustment, setWalletAdjustment] = useState<{amount: string, reason: string}>({
    amount: "",
    reason: ""
  });
  
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
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };
  
  // Ban user dialog
  const handleOpenBanDialog = (user: any) => {
    setSelectedUser(user);
    setBanReason("");
    setIsBanDialogOpen(true);
  };
  
  // Submit ban user
  const handleBanUser = () => {
    if (!banReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for banning this user.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would make an API call here
    toast({
      title: "User Banned",
      description: `${selectedUser.name} has been banned from the platform.`
    });
    
    setIsBanDialogOpen(false);
  };
  
  // Wallet adjustment dialog
  const handleOpenWalletDialog = (user: any) => {
    setSelectedUser(user);
    setWalletAdjustment({ amount: "", reason: "" });
    setIsWalletDialogOpen(true);
  };
  
  // Submit wallet adjustment
  const handleWalletAdjustment = () => {
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
    
    // In a real app, you would make an API call here
    const amount = Number(walletAdjustment.amount);
    const action = amount >= 0 ? "added to" : "deducted from";
    
    toast({
      title: "Wallet Updated",
      description: `${Math.abs(amount)} credits ${action} ${selectedUser.name}'s wallet.`
    });
    
    setIsWalletDialogOpen(false);
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
            <SelectTrigger className="w-[160px] bg-forex-card/50 text-white border-forex-border/20">
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
      
      <Table>
        <TableHeader className="bg-forex-card/50">
          <TableRow>
            <TableHead className="text-white">User</TableHead>
            <TableHead className="text-white">Discord</TableHead>
            <TableHead className="text-white text-center">Status</TableHead>
            <TableHead className="text-white text-center">Active Challenges</TableHead>
            <TableHead className="text-white text-right">Wallet Balance</TableHead>
            <TableHead className="text-white text-center">Badges</TableHead>
            <TableHead className="text-white text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id} className="hover:bg-forex-card/30 border-forex-border/10">
              <TableCell className="text-white">
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-white/60 text-sm">{user.email}</div>
                </div>
              </TableCell>
              <TableCell className="text-white">{user.discordUsername || "—"}</TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant={
                    user.status === "active" ? "default" : 
                    user.status === "inactive" ? "secondary" :
                    "destructive"
                  }
                  className="capitalize"
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-white text-center">
                {user.activeChallenges.length}
              </TableCell>
              <TableCell className="text-white text-right">
                {user.walletBalance} Credits
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-wrap justify-center gap-1">
                  {user.badges.map((badge, index) => (
                    <Badge key={index} variant="outline" className="border-forex-primary/30 text-forex-primary">
                      {badge}
                    </Badge>
                  ))}
                  {user.badges.length === 0 && (
                    <span className="text-white/40">None</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-forex-primary/20"
                    onClick={() => handleViewUser(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-blue-500/20"
                    onClick={() => handleOpenWalletDialog(user)}
                  >
                    <Wallet className="h-4 w-4" />
                  </Button>
                  
                  {user.status !== "banned" && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-red-500/20"
                      onClick={() => handleOpenBanDialog(user)}
                    >
                      <BanIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
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
    </div>
  );
};

export default AdminUsers; 