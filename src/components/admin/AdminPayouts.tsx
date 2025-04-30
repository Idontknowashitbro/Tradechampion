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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { 
  CheckCircle, 
  Clock, 
  Copy, 
  DollarSign, 
  Download, 
  Eye, 
  Link2, 
  Search, 
  XCircle
} from "lucide-react";

// Mock payouts data
const pendingPayouts = [
  {
    id: 1,
    userName: "John Trader",
    userId: 1,
    challengeName: "Daily Forex Sprint",
    challengeId: 1,
    amount: 250,
    walletAddress: "0x1a2b3c4d5e6f7g8h9i0j",
    requestDate: "2025-04-28",
    status: "pending"
  },
  {
    id: 2,
    userName: "Emma Wilson",
    userId: 2,
    challengeName: "April Monthly Championship",
    challengeId: 4,
    amount: 3600,
    walletAddress: "0xabcdef1234567890abcdef",
    requestDate: "2025-04-30",
    status: "pending"
  },
  {
    id: 3,
    userName: "Michael Chen",
    userId: 4,
    challengeName: "Weekly Forex Master",
    challengeId: 2,
    amount: 950,
    walletAddress: "0x9876543210abcdefghijklm",
    requestDate: "2025-04-29",
    status: "pending"
  }
];

const completedPayouts = [
  {
    id: 4,
    userName: "John Trader",
    userId: 1,
    challengeName: "Daily Forex Sprint",
    challengeId: 1,
    amount: 150,
    walletAddress: "0x1a2b3c4d5e6f7g8h9i0j",
    requestDate: "2025-04-20",
    processedDate: "2025-04-21",
    processedBy: "Admin",
    status: "completed",
    txHash: "0xf7d8c91e45b7643ea9cb3b1df858e271a1c8f98b653f1fcb3"
  },
  {
    id: 5,
    userName: "Emma Wilson",
    userId: 2,
    challengeName: "Daily Forex Sprint",
    challengeId: 1,
    amount: 320,
    walletAddress: "0xabcdef1234567890abcdef",
    requestDate: "2025-04-18",
    processedDate: "2025-04-19",
    processedBy: "Admin",
    status: "completed",
    txHash: "0x3a5c7d9e2f4b6a8c0d2e4f6a8c0e2d4f6a8c0e2d4f6a8"
  },
  {
    id: 6,
    userName: "Alex Johnson",
    userId: 3,
    challengeName: "Weekly Forex Master",
    challengeId: 2,
    amount: 420,
    walletAddress: "0x9876543210abcdefghijklm",
    requestDate: "2025-04-15",
    processedDate: "2025-04-16",
    processedBy: "Admin",
    status: "rejected",
    rejectionReason: "Suspicious trading pattern detected"
  }
];

const AdminPayouts = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [txDetails, setTxDetails] = useState({
    txHash: "",
    notes: ""
  });
  
  // Filter payouts by search term
  const filteredPendingPayouts = pendingPayouts.filter(payout => 
    payout.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payout.challengeName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCompletedPayouts = completedPayouts.filter(payout => 
    payout.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payout.challengeName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // View payout details
  const handleViewPayout = (payout: any) => {
    setSelectedPayout(payout);
    setIsViewDialogOpen(true);
  };
  
  // Open approve dialog
  const handleOpenApproveDialog = (payout: any) => {
    setSelectedPayout(payout);
    setTxDetails({ txHash: "", notes: "" });
    setIsApproveDialogOpen(true);
  };
  
  // Open reject dialog
  const handleOpenRejectDialog = (payout: any) => {
    setSelectedPayout(payout);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };
  
  // Submit payout approval
  const handleApprovePayout = () => {
    if (!txDetails.txHash) {
      toast({
        title: "Error",
        description: "Please provide the transaction hash.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would make an API call here
    toast({
      title: "Payout Approved",
      description: `Payout of $${selectedPayout.amount} to ${selectedPayout.userName} has been approved.`
    });
    
    setIsApproveDialogOpen(false);
  };
  
  // Submit payout rejection
  const handleRejectPayout = () => {
    if (!rejectionReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejecting this payout.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would make an API call here
    toast({
      title: "Payout Rejected",
      description: `Payout to ${selectedPayout.userName} has been rejected.`
    });
    
    setIsRejectDialogOpen(false);
  };
  
  // Copy wallet address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The wallet address has been copied to your clipboard."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Payouts</h2>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
            <Input
              type="search"
              placeholder="Search payouts..."
              className="pl-9 bg-forex-card/50 border-forex-border/20 text-white w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            className="border-forex-border/20 text-white hover:bg-forex-card"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="pending" onValueChange={setActiveTab}>
        <TabsList className="bg-forex-card/50 border border-forex-border/20 mb-6">
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:bg-forex-primary/20"
          >
            Pending Approvals
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="data-[state=active]:bg-forex-primary/20"
          >
            Payout History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="m-0">
          {filteredPendingPayouts.length > 0 ? (
            <Table>
              <TableHeader className="bg-forex-card/50">
                <TableRow>
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">User</TableHead>
                  <TableHead className="text-white">Challenge</TableHead>
                  <TableHead className="text-white text-right">Amount</TableHead>
                  <TableHead className="text-white">Request Date</TableHead>
                  <TableHead className="text-white">Wallet Address</TableHead>
                  <TableHead className="text-white text-center">Status</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPendingPayouts.map((payout) => (
                  <TableRow key={payout.id} className="hover:bg-forex-card/30 border-forex-border/10">
                    <TableCell className="text-white">{payout.id}</TableCell>
                    <TableCell className="text-white font-medium">{payout.userName}</TableCell>
                    <TableCell className="text-white">{payout.challengeName}</TableCell>
                    <TableCell className="text-white text-right font-medium">${payout.amount}</TableCell>
                    <TableCell className="text-white">{payout.requestDate}</TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center space-x-2">
                        <span className="truncate max-w-[120px]">{payout.walletAddress}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 text-white/70 hover:text-white"
                          onClick={() => copyToClipboard(payout.walletAddress)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="capitalize">
                        <Clock className="h-3 w-3 mr-1" />
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-white hover:bg-forex-primary/20"
                          onClick={() => handleViewPayout(payout)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-white hover:bg-green-500/20"
                          onClick={() => handleOpenApproveDialog(payout)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-white hover:bg-red-500/20"
                          onClick={() => handleOpenRejectDialog(payout)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 bg-forex-card/10 rounded-lg border border-forex-border/10">
              <DollarSign className="h-12 w-12 mx-auto text-forex-primary/50 mb-3" />
              <h3 className="text-xl font-medium text-white mb-1">No Pending Payouts</h3>
              <p className="text-white/60">All payouts have been processed.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="m-0">
          {filteredCompletedPayouts.length > 0 ? (
            <Table>
              <TableHeader className="bg-forex-card/50">
                <TableRow>
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">User</TableHead>
                  <TableHead className="text-white">Challenge</TableHead>
                  <TableHead className="text-white text-right">Amount</TableHead>
                  <TableHead className="text-white">Processed Date</TableHead>
                  <TableHead className="text-white">Processed By</TableHead>
                  <TableHead className="text-white text-center">Status</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompletedPayouts.map((payout) => (
                  <TableRow key={payout.id} className="hover:bg-forex-card/30 border-forex-border/10">
                    <TableCell className="text-white">{payout.id}</TableCell>
                    <TableCell className="text-white font-medium">{payout.userName}</TableCell>
                    <TableCell className="text-white">{payout.challengeName}</TableCell>
                    <TableCell className="text-white text-right font-medium">${payout.amount}</TableCell>
                    <TableCell className="text-white">{payout.processedDate}</TableCell>
                    <TableCell className="text-white">{payout.processedBy}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={payout.status === "completed" ? "default" : "destructive"} 
                        className="capitalize"
                      >
                        {payout.status === "completed" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-white hover:bg-forex-primary/20"
                        onClick={() => handleViewPayout(payout)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 bg-forex-card/10 rounded-lg border border-forex-border/10">
              <DollarSign className="h-12 w-12 mx-auto text-forex-primary/50 mb-3" />
              <h3 className="text-xl font-medium text-white mb-1">No Processed Payouts</h3>
              <p className="text-white/60">There are no processed payouts yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* View Payout Dialog */}
      {selectedPayout && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[550px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white">Payout Details</DialogTitle>
              <DialogDescription className="text-white/60">
                Details for payout #{selectedPayout.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h4 className="text-sm text-white/60 mb-1">User</h4>
                <p className="text-white">{selectedPayout.userName}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">User ID</h4>
                <p className="text-white">{selectedPayout.userId}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Challenge</h4>
                <p className="text-white">{selectedPayout.challengeName}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Challenge ID</h4>
                <p className="text-white">{selectedPayout.challengeId}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Amount</h4>
                <p className="text-white font-medium">${selectedPayout.amount}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Status</h4>
                <Badge 
                  variant={
                    selectedPayout.status === "completed" ? "default" : 
                    selectedPayout.status === "pending" ? "secondary" : 
                    "destructive"
                  } 
                  className="capitalize"
                >
                  {selectedPayout.status}
                </Badge>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm text-white/60 mb-1">Wallet Address</h4>
                <div className="flex items-center space-x-2">
                  <p className="text-white break-all font-mono text-sm">{selectedPayout.walletAddress}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 text-white/70 hover:text-white"
                    onClick={() => copyToClipboard(selectedPayout.walletAddress)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Request Date</h4>
                <p className="text-white">{selectedPayout.requestDate}</p>
              </div>
              
              {selectedPayout.status !== "pending" && (
                <div>
                  <h4 className="text-sm text-white/60 mb-1">Processed Date</h4>
                  <p className="text-white">{selectedPayout.processedDate}</p>
                </div>
              )}
              
              {selectedPayout.status === "completed" && (
                <div className="col-span-2">
                  <h4 className="text-sm text-white/60 mb-1">Transaction Hash</h4>
                  <div className="flex items-center space-x-2">
                    <p className="text-white break-all font-mono text-sm">{selectedPayout.txHash}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 text-white/70 hover:text-white"
                      onClick={() => copyToClipboard(selectedPayout.txHash)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 text-white/70 hover:text-white"
                      onClick={() => window.open(`https://etherscan.io/tx/${selectedPayout.txHash}`)}
                    >
                      <Link2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedPayout.status === "rejected" && (
                <div className="col-span-2">
                  <h4 className="text-sm text-white/60 mb-1">Rejection Reason</h4>
                  <p className="text-white">{selectedPayout.rejectionReason}</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                className="border-forex-border/20 text-white"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
              
              {selectedPayout.status === "pending" && (
                <div className="space-x-2">
                  <Button 
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleOpenRejectDialog(selectedPayout);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleOpenApproveDialog(selectedPayout);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Approve Payout Dialog */}
      {selectedPayout && (
        <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white">Approve Payout</DialogTitle>
              <DialogDescription className="text-white/60">
                Approve payout of ${selectedPayout.amount} to {selectedPayout.userName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="tx-hash" className="text-white">Transaction Hash</Label>
                <div className="mt-1 mb-3 text-white/60 text-xs">
                  Enter the transaction hash from your cryptocurrency payment
                </div>
                <Input 
                  id="tx-hash" 
                  placeholder="0x..." 
                  value={txDetails.txHash}
                  onChange={(e) => setTxDetails({ ...txDetails, txHash: e.target.value })}
                  className="bg-forex-dark/60 border-forex-border/20 text-white font-mono"
                />
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any additional notes about this transaction"
                  value={txDetails.notes}
                  onChange={(e) => setTxDetails({ ...txDetails, notes: e.target.value })}
                  className="bg-forex-dark/60 border-forex-border/20 text-white mt-1"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                className="border-forex-border/20 text-white"
                onClick={() => setIsApproveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleApprovePayout}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Reject Payout Dialog */}
      {selectedPayout && (
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white">Reject Payout</DialogTitle>
              <DialogDescription className="text-white/60">
                Reject payout of ${selectedPayout.amount} to {selectedPayout.userName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="reason" className="text-white">Reason for Rejection</Label>
                <Textarea 
                  id="reason" 
                  placeholder="Please provide a detailed reason for rejecting this payout request..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px] bg-forex-dark/60 border-forex-border/20 text-white mt-1"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                className="border-forex-border/20 text-white"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleRejectPayout}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPayouts; 