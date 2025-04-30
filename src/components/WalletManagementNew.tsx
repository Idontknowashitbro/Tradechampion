import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import walletService, { WalletTransaction } from "@/lib/walletService";
import { Wallet, Plus, RefreshCw, Copy, Star, Trash, ExternalLink } from "lucide-react";

// Interface for crypto wallet
interface CryptoWallet {
  id: string;
  walletType: string;
  address: string;
  label: string;
  isDefault: boolean;
}

// Interface for crypto payment
interface CryptoPayment {
  id: string;
  paymentId: string;
  amount: number;
  cryptoCurrency: string;
  status: string;
  description: string;
  createdAt: string;
  invoiceUrl?: string;
}

// Interface for crypto currency
interface CryptoCurrency {
  currency: string;
  name: string;
  image: string;
}

const WalletManagementNew: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("deposit");
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [payments, setPayments] = useState<CryptoPayment[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [currencies, setCurrencies] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showAddWalletDialog, setShowAddWalletDialog] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("btc");
  const [newWallet, setNewWallet] = useState({
    walletType: "btc",
    address: "",
    label: "",
  });

  // Fetch wallet transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await walletService.getTransactions();
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching wallet transactions:", err);
        setError("Failed to load wallet transactions. Please try again later.");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "credit":
        return "text-green-500";
      case "debit":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="bg-forex-card/30 border-forex-border/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Wallet Management</CardTitle>
            <CardDescription className="text-white/60">Manage your wallet and transactions</CardDescription>
          </div>
          <div className="text-white font-medium">
            Balance: ${user?.walletBalance || 0} USDT
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="bg-forex-card/50 border border-forex-border/20">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-forex-primary/20">Transactions</TabsTrigger>
            <TabsTrigger value="deposit" className="data-[state=active]:bg-forex-primary/20">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw" className="data-[state=active]:bg-forex-primary/20">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forex-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-500">
                {error}
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white/70">Date</TableHead>
                    <TableHead className="text-white/70">Type</TableHead>
                    <TableHead className="text-white/70">Amount</TableHead>
                    <TableHead className="text-white/70">Description</TableHead>
                    <TableHead className="text-white/70">Balance After</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-white">{formatDate(transaction.createdAt)}</TableCell>
                      <TableCell className={getStatusColor(transaction.type)}>
                        {transaction.type === "credit" ? "Credit" : "Debit"}
                      </TableCell>
                      <TableCell className="text-white">
                        {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-white">{transaction.description}</TableCell>
                      <TableCell className="text-white">${transaction.balanceAfter.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-white/60">
                No transactions found. Deposit funds or join challenges to see your transaction history.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="deposit">
            <div className="space-y-6">
              <div className="bg-forex-card/20 p-6 rounded-lg border border-forex-border/10">
                <h3 className="text-xl font-medium text-white mb-2">Deposit Funds</h3>
                <p className="text-white/60 mb-4">Add funds to your wallet to enter challenges and earn rewards.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount" className="text-white">Amount (USDT)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="Enter amount" 
                      className="bg-forex-card/30 border-forex-border/20 text-white"
                      min="10"
                    />
                    <p className="text-white/40 text-sm mt-1">Minimum deposit: 10 USDT</p>
                  </div>
                  
                  <div className="flex items-end">
                    <Button className="bg-forex-primary hover:bg-forex-primary-dark w-full">
                      Deposit Now
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-white mb-4">Deposit Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-forex-card/20 border-forex-border/10">
                    <CardHeader>
                      <CardTitle className="text-white">Cryptocurrency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/60">Deposit using Bitcoin, Ethereum, USDT, and more.</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Select</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-forex-card/20 border-forex-border/10">
                    <CardHeader>
                      <CardTitle className="text-white">Credit Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/60">Deposit using Visa, Mastercard, or other credit cards.</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Coming Soon</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-forex-card/20 border-forex-border/10">
                    <CardHeader>
                      <CardTitle className="text-white">Bank Transfer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/60">Deposit using bank transfer or wire transfer.</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Coming Soon</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="withdraw">
            <div className="bg-forex-card/20 p-6 rounded-lg border border-forex-border/10">
              <h3 className="text-xl font-medium text-white mb-2">Withdraw Funds</h3>
              <p className="text-white/60 mb-4">Withdraw your funds to your crypto wallet.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="withdraw-amount" className="text-white">Amount (USDT)</Label>
                  <Input 
                    id="withdraw-amount" 
                    type="number" 
                    placeholder="Enter amount" 
                    className="bg-forex-card/30 border-forex-border/20 text-white"
                    min="10"
                    max={user?.walletBalance || 0}
                  />
                  <p className="text-white/40 text-sm mt-1">Available balance: ${user?.walletBalance || 0} USDT</p>
                </div>
                
                <div>
                  <Label htmlFor="withdraw-address" className="text-white">Wallet Address</Label>
                  <Input 
                    id="withdraw-address" 
                    type="text" 
                    placeholder="Enter your crypto wallet address" 
                    className="bg-forex-card/30 border-forex-border/20 text-white"
                  />
                </div>
              </div>
              
              <Button className="bg-forex-primary hover:bg-forex-primary-dark mt-4">
                Request Withdrawal
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WalletManagementNew;
