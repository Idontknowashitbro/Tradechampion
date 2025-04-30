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
import { Switch } from "@/components/ui/switch";
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
  
  // Batch processing
  const [selectedPayouts, setSelectedPayouts] = useState<number[]>([]);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [batchAction, setBatchAction] = useState<string>("approve");
  const [batchReason, setBatchReason] = useState("");
  const [batchTxHash, setBatchTxHash] = useState("");
  
  const handleSelectPayout = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedPayouts([...selectedPayouts, id]);
    } else {
      setSelectedPayouts(selectedPayouts.filter(payoutId => payoutId !== id));
    }
  };
  
  const handleOpenBatchDialog = (action: string) => {
    if (selectedPayouts.length === 0) {
      toast({
        title: "No Payouts Selected",
        description: "Please select at least one payout to process.",
        variant: "destructive"
      });
      return;
    }
    
    setBatchAction(action);
    setBatchReason("");
    setBatchTxHash("");
    setIsBatchDialogOpen(true);
  };
  
  const handleBatchProcess = () => {
    if (batchAction === "approve" && !batchTxHash) {
      toast({
        title: "Error",
        description: "Please provide the transaction hash for approval.",
        variant: "destructive"
      });
      return;
    }
    
    if (batchAction === "reject" && !batchReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would make an API call here
    toast({
      title: `Payouts ${batchAction === "approve" ? "Approved" : "Rejected"}`,
      description: `${selectedPayouts.length} payouts have been ${batchAction === "approve" ? "approved" : "rejected"}.`
    });
    
    setIsBatchDialogOpen(false);
    setSelectedPayouts([]);
  };
  
  // Enhanced verification
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState({
    manualChecks: {
      userIdentityVerified: false,
      tradingRulesComplied: false,
      challengeRulesComplied: false,
      payoutEligibilityConfirmed: false
    },
    comments: ""
  });
  
  const handleOpenVerifyDialog = (payout: any) => {
    setSelectedPayout(payout);
    setIsVerifyDialogOpen(true);
    
    // Reset verification details
    setVerificationDetails({
      manualChecks: {
        userIdentityVerified: false,
        tradingRulesComplied: false,
        challengeRulesComplied: false,
        payoutEligibilityConfirmed: false
      },
      comments: ""
    });
  };
  
  const handleCompleteVerification = () => {
    // Check if all verification items are checked
    const allChecked = Object.values(verificationDetails.manualChecks).every(Boolean);
    
    if (!allChecked) {
      toast({
        title: "Verification Incomplete",
        description: "Please complete all verification checks before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would make an API call here
    toast({
      title: "Verification Completed",
      description: "The payout has been verified and is ready for processing."
    });
    
    setIsVerifyDialogOpen(false);
  };
  
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
            <Clock className="h-4 w-4 mr-2" />
            Pending ({pendingPayouts.length})
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="data-[state=active]:bg-forex-primary/20"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed ({completedPayouts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="m-0">
          {selectedPayouts.length > 0 && (
            <div className="bg-forex-card/30 border border-forex-border/20 rounded-md p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center text-white">
                <span className="mr-2">{selectedPayouts.length} payouts selected</span>
                <Badge className="bg-forex-primary/20 text-forex-primary">
                  ${pendingPayouts
                    .filter(p => selectedPayouts.includes(p.id))
                    .reduce((total, p) => total + p.amount, 0)
                    .toFixed(2)}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-forex-border/20 text-white hover:bg-forex-card"
                  onClick={() => handleOpenBatchDialog("approve")}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  Approve Selected
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-forex-border/20 text-white hover:bg-forex-card"
                  onClick={() => handleOpenBatchDialog("reject")}
                >
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Reject Selected
                </Button>
              </div>
            </div>
          )}
          
          <Table>
            <TableHeader className="bg-forex-card/50">
              <TableRow>
                <TableHead className="w-12 text-white">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded bg-forex-dark/60 border-forex-border/20"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPayouts(filteredPendingPayouts.map(p => p.id));
                        } else {
                          setSelectedPayouts([]);
                        }
                      }}
                      checked={selectedPayouts.length === filteredPendingPayouts.length && filteredPendingPayouts.length > 0}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-white">User</TableHead>
                <TableHead className="text-white">Challenge</TableHead>
                <TableHead className="text-white">Amount</TableHead>
                <TableHead className="text-white">Wallet Address</TableHead>
                <TableHead className="text-white">Request Date</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPendingPayouts.map((payout) => (
                <TableRow key={payout.id} className="border-forex-border/10 bg-forex-dark/30">
                  <TableCell className="text-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded bg-forex-dark/60 border-forex-border/20"
                      checked={selectedPayouts.includes(payout.id)}
                      onChange={(e) => handleSelectPayout(payout.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-white">{payout.userName}</TableCell>
                  <TableCell className="text-white/70">{payout.challengeName}</TableCell>
                  <TableCell className="text-white/70">${payout.amount}</TableCell>
                  <TableCell className="text-white/70">
                    <div className="flex items-center space-x-2">
                      <span className="truncate max-w-[100px]">{payout.walletAddress}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-white/50 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => copyToClipboard(payout.walletAddress)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/70">
                    {new Date(payout.requestDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-400/20 text-yellow-400">
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => handleViewPayout(payout)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => handleOpenVerifyDialog(payout)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => handleOpenApproveDialog(payout)}
                      >
                        <DollarSign className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
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
        </TabsContent>
        
        <TabsContent value="completed" className="m-0">
          <Table>
            <TableHeader className="bg-forex-card/50">
              <TableRow>
                <TableHead className="text-white">User</TableHead>
                <TableHead className="text-white">Challenge</TableHead>
                <TableHead className="text-white">Amount</TableHead>
                <TableHead className="text-white">Wallet Address</TableHead>
                <TableHead className="text-white">Request Date</TableHead>
                <TableHead className="text-white">Processed Date</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompletedPayouts.map((payout) => (
                <TableRow key={payout.id} className="border-forex-border/10 bg-forex-dark/30">
                  <TableCell className="font-medium text-white">{payout.userName}</TableCell>
                  <TableCell className="text-white/70">{payout.challengeName}</TableCell>
                  <TableCell className="text-white/70">${payout.amount}</TableCell>
                  <TableCell className="text-white/70">
                    <div className="flex items-center space-x-2">
                      <span className="truncate max-w-[100px]">{payout.walletAddress}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-white/50 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => copyToClipboard(payout.walletAddress)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/70">
                    {new Date(payout.requestDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-white/70">
                    {new Date(payout.processedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`
                        ${payout.status === "completed" ? "bg-green-400/20 text-green-400" : ""}
                        ${payout.status === "rejected" ? "bg-red-400/20 text-red-400" : ""}
                      `}
                    >
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                      onClick={() => handleViewPayout(payout)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
      
      {/* Batch Processing Dialog */}
      <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-forex-card text-white border-forex-border/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {batchAction === "approve" ? "Batch Approve Payouts" : "Batch Reject Payouts"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {batchAction === "approve" 
                ? "Approve multiple payouts at once with a single transaction" 
                : "Reject multiple payouts at once with the same reason"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-3 bg-forex-dark/30 rounded-md border border-forex-border/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium">Summary</p>
                <Badge className="bg-forex-primary/20 text-forex-primary">
                  {selectedPayouts.length} Payouts
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <p className="text-white/70">Total Amount:</p>
                <p className="text-white font-medium">
                  ${pendingPayouts
                    .filter(p => selectedPayouts.includes(p.id))
                    .reduce((total, p) => total + p.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
            
            {batchAction === "approve" ? (
              <div className="space-y-2">
                <Label htmlFor="batch_tx_hash" className="text-white">Transaction Hash</Label>
                <Input
                  id="batch_tx_hash"
                  placeholder="Enter transaction hash..."
                  className="bg-forex-dark/60 border-forex-border/20 text-white"
                  value={batchTxHash}
                  onChange={(e) => setBatchTxHash(e.target.value)}
                />
                <p className="text-xs text-white/60">
                  Enter the blockchain transaction hash for this batch payment
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="batch_rejection_reason" className="text-white">Rejection Reason</Label>
                <Textarea
                  id="batch_rejection_reason"
                  placeholder="Enter rejection reason..."
                  className="min-h-[100px] bg-forex-dark/60 border-forex-border/20 text-white"
                  value={batchReason}
                  onChange={(e) => setBatchReason(e.target.value)}
                />
                <p className="text-xs text-white/60">
                  This reason will be provided to all users whose payouts are being rejected
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-forex-border/20 text-white hover:bg-forex-card"
              onClick={() => setIsBatchDialogOpen(false)}
            >
              Cancel
            </Button>
            
            <Button 
              className="bg-forex-primary hover:bg-forex-primary/90 text-white"
              onClick={handleBatchProcess}
            >
              {batchAction === "approve" ? "Approve All" : "Reject All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Verify Payout Dialog */}
      {selectedPayout && (
        <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-forex-primary" />
                Verify Payout Eligibility
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Complete verification checks before processing payout
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="p-4 bg-forex-dark/30 rounded-md border border-forex-border/10">
                <h4 className="text-white font-medium mb-2">Payout Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-white/70">User:</p>
                    <p className="text-white">{selectedPayout.userName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-white/70">Challenge:</p>
                    <p className="text-white">{selectedPayout.challengeName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-white/70">Amount:</p>
                    <p className="text-white font-medium">${selectedPayout.amount}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-medium">Verification Checklist</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="identity_check" className="text-white flex items-center">
                    <div className="ml-2">
                      User identity verified
                      <span className="block text-xs text-white/60">
                        KYC/identity documents are valid
                      </span>
                    </div>
                  </Label>
                  <Switch
                    id="identity_check"
                    checked={verificationDetails.manualChecks.userIdentityVerified}
                    onCheckedChange={(checked) => 
                      setVerificationDetails({
                        ...verificationDetails, 
                        manualChecks: {
                          ...verificationDetails.manualChecks,
                          userIdentityVerified: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="trading_rules_check" className="text-white flex items-center">
                    <div className="ml-2">
                      Trading rules complied
                      <span className="block text-xs text-white/60">
                        No suspicious trading patterns detected
                      </span>
                    </div>
                  </Label>
                  <Switch
                    id="trading_rules_check"
                    checked={verificationDetails.manualChecks.tradingRulesComplied}
                    onCheckedChange={(checked) => 
                      setVerificationDetails({
                        ...verificationDetails, 
                        manualChecks: {
                          ...verificationDetails.manualChecks,
                          tradingRulesComplied: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="challenge_rules_check" className="text-white flex items-center">
                    <div className="ml-2">
                      Challenge rules complied
                      <span className="block text-xs text-white/60">
                        All challenge requirements were met
                      </span>
                    </div>
                  </Label>
                  <Switch
                    id="challenge_rules_check"
                    checked={verificationDetails.manualChecks.challengeRulesComplied}
                    onCheckedChange={(checked) => 
                      setVerificationDetails({
                        ...verificationDetails, 
                        manualChecks: {
                          ...verificationDetails.manualChecks,
                          challengeRulesComplied: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="eligibility_check" className="text-white flex items-center">
                    <div className="ml-2">
                      Payout eligibility confirmed
                      <span className="block text-xs text-white/60">
                        User is eligible to receive this payout
                      </span>
                    </div>
                  </Label>
                  <Switch
                    id="eligibility_check"
                    checked={verificationDetails.manualChecks.payoutEligibilityConfirmed}
                    onCheckedChange={(checked) => 
                      setVerificationDetails({
                        ...verificationDetails, 
                        manualChecks: {
                          ...verificationDetails.manualChecks,
                          payoutEligibilityConfirmed: checked
                        }
                      })
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="verification_comments" className="text-white">Comments</Label>
                <Textarea
                  id="verification_comments"
                  placeholder="Add any verification notes or comments..."
                  className="min-h-[80px] bg-forex-dark/60 border-forex-border/20 text-white"
                  value={verificationDetails.comments}
                  onChange={(e) => setVerificationDetails({...verificationDetails, comments: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-forex-border/20 text-white hover:bg-forex-card"
                onClick={() => setIsVerifyDialogOpen(false)}
              >
                Cancel
              </Button>
              
              <Button 
                className="bg-forex-primary hover:bg-forex-primary/90 text-white"
                onClick={handleCompleteVerification}
              >
                Complete Verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPayouts; 