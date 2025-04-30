import React, { useState } from 'react';
import { X, Trophy, AlertTriangle, Clock, Users, DollarSign, Check, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConnectCTraderModal from './ConnectCTraderModal';

interface ChallengeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  challenge: {
    id: string;
    name: string;
    type: string;
    description: string;
    entryFee: number;
    initialBalance: number;
    prizePool: number;
    startDate: string;
    endDate: string;
    participantsCount: number;
    maxDrawdown: number;
    maxRiskPerTrade: number;
    rules: string[];
  };
}

const ChallengeDetailsModal: React.FC<ChallengeDetailsModalProps> = ({ 
  open, 
  onClose, 
  challenge 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [challengeEntryId, setChallengeEntryId] = useState<number | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handleJoin = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      // In a real app, this would redirect to payment or cTrader connection
    }, 1500);
  };

  const handleConnectCTrader = () => {
    // In a real implementation, we would already have created a challenge entry
    // and would use the real ID here
    setChallengeEntryId(123); // Mock ID for demonstration
    setShowConnectModal(true);
  };

  const handleConnectSuccess = () => {
    setShowConnectModal(false);
    setStep(3); // Move to completion step
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {
      if (step === 3) {
        // If completed, reset to step 1 when closing
        setTimeout(() => setStep(1), 500);
      }
      onClose();
    }}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[600px] p-0 bg-transparent border-none shadow-none">
        <Card className="bg-forex-card/90 backdrop-blur-md border-forex-border/20 overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-forex-primary via-forex-accent to-forex-secondary"></div>
          
          {step === 1 && (
            <>
              <CardHeader className="relative pb-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="absolute right-4 top-4 text-white/70 hover:text-white hover:bg-forex-primary/20"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-forex-primary/20 flex items-center justify-center mr-3">
                    <Trophy className="h-5 w-5 text-forex-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">{challenge.name}</CardTitle>
                    <p className="text-white/60 text-sm">{challenge.type} Challenge</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-white/80">{challenge.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-forex-dark/50 p-3 rounded-lg">
                    <div className="flex items-center text-white/60 text-sm mb-1">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Entry Fee
                    </div>
                    <p className="text-white font-medium">${challenge.entryFee} USDT</p>
                  </div>
                  
                  <div className="bg-forex-dark/50 p-3 rounded-lg">
                    <div className="flex items-center text-white/60 text-sm mb-1">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Initial Balance
                    </div>
                    <p className="text-white font-medium">${challenge.initialBalance.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-forex-dark/50 p-3 rounded-lg">
                    <div className="flex items-center text-white/60 text-sm mb-1">
                      <Trophy className="h-4 w-4 mr-1" />
                      Prize Pool
                    </div>
                    <p className="text-white font-medium">${challenge.prizePool.toLocaleString()} USDT</p>
                  </div>
                  
                  <div className="bg-forex-dark/50 p-3 rounded-lg">
                    <div className="flex items-center text-white/60 text-sm mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      Start Date
                    </div>
                    <p className="text-white font-medium">{formatDate(challenge.startDate)}</p>
                  </div>
                  
                  <div className="bg-forex-dark/50 p-3 rounded-lg">
                    <div className="flex items-center text-white/60 text-sm mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      End Date
                    </div>
                    <p className="text-white font-medium">{formatDate(challenge.endDate)}</p>
                  </div>
                  
                  <div className="bg-forex-dark/50 p-3 rounded-lg">
                    <div className="flex items-center text-white/60 text-sm mb-1">
                      <Users className="h-4 w-4 mr-1" />
                      Participants
                    </div>
                    <p className="text-white font-medium">{challenge.participantsCount}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-white/90 font-medium">Challenge Rules</h3>
                  <div className="bg-forex-dark/50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center text-white/70">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Maximum Drawdown: <span className="text-white font-medium">{challenge.maxDrawdown}%</span></span>
                    </div>
                    <div className="flex items-center text-white/70">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Maximum Risk Per Trade: <span className="text-white font-medium">{challenge.maxRiskPerTrade}%</span></span>
                    </div>
                    <Separator className="bg-forex-border/10 my-2" />
                    {challenge.rules.map((rule, index) => (
                      <div key={index} className="flex items-start text-white/70 text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4 pt-0 pb-6">
                <Separator className="bg-forex-border/10 mb-2" />
                
                <Tabs defaultValue="wallet" className="w-full" onValueChange={(value) => setPaymentMethod(value)}>
                  <TabsList className="grid grid-cols-2 bg-forex-dark/50 mb-4">
                    <TabsTrigger value="wallet" className="data-[state=active]:bg-forex-primary data-[state=active]:text-white text-white/70">
                      <Wallet className="h-4 w-4 mr-2" />
                      Wallet Credits
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="data-[state=active]:bg-forex-primary data-[state=active]:text-white text-white/70">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Crypto
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="wallet" className="mt-0">
                    <div className="bg-forex-dark/30 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Available Credits:</span>
                        <span className="text-white font-medium">200 Credits</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-white/70">Required Credits:</span>
                        <span className="text-white font-medium">{challenge.entryFee} Credits</span>
                      </div>
                      <Separator className="bg-forex-border/10 my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">Remaining Credits:</span>
                        <span className="text-green-500 font-medium">{200 - challenge.entryFee} Credits</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="crypto" className="mt-0">
                    <div className="bg-forex-dark/30 p-4 rounded-lg mb-4">
                      <p className="text-white/80 mb-3">Pay with cryptocurrency (USDT)</p>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Amount:</span>
                        <span className="text-white font-medium">${challenge.entryFee} USDT</span>
                      </div>
                      <p className="text-white/60 text-xs mt-3">You will proceed to payment gateway after clicking Join Challenge</p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  onClick={handleJoin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-forex-primary to-forex-accent hover:opacity-90 text-white py-6 font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>Join Challenge</>
                  )}
                </Button>
              </CardFooter>
            </>
          )}
          
          {step === 2 && (
            <>
              <CardHeader className="relative pb-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="absolute right-4 top-4 text-white/70 hover:text-white hover:bg-forex-primary/20"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-forex-primary/20 flex items-center justify-center mr-3">
                    <Trophy className="h-5 w-5 text-forex-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Connect Your cTrader Account</CardTitle>
                    <p className="text-white/60 text-sm">Step 2 of 2</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-forex-dark/50 p-4 rounded-lg mb-4">
                  <h3 className="text-white font-medium mb-2">Connect to cTrader</h3>
                  <p className="text-white/70 text-sm mb-4">
                    To participate in the challenge, you need to connect your cTrader account. 
                    Your trading activity will be monitored through this connection.
                  </p>
                  <div className="space-y-2 text-sm text-white/60">
                    <div className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>We only monitor your trading activity for the challenge</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>We never have access to withdraw funds</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Connection is secure and encrypted</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4 pt-0 pb-6">
                <Button 
                  onClick={handleConnectCTrader}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-forex-primary to-forex-accent hover:opacity-90 text-white py-6 font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white mr-2"></div>
                      Connecting...
                    </div>
                  ) : (
                    <>Connect cTrader</>
                  )}
                </Button>
              </CardFooter>

              {/* Connect cTrader Modal */}
              {showConnectModal && challengeEntryId && (
                <ConnectCTraderModal
                  open={showConnectModal}
                  onClose={() => setShowConnectModal(false)}
                  challengeEntryId={challengeEntryId}
                  onSuccess={handleConnectSuccess}
                />
              )}
            </>
          )}
          
          {step === 3 && (
            <>
              <CardHeader className="relative pb-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="absolute right-4 top-4 text-white/70 hover:text-white hover:bg-forex-primary/20"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3"
                  >
                    <Check className="h-8 w-8 text-green-500" />
                  </motion.div>
                  <CardTitle className="text-xl text-white">All Set!</CardTitle>
                  <p className="text-white/60 text-sm mt-1">You're successfully enrolled in {challenge.name}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-forex-primary/10 border border-forex-primary/20 p-4 rounded-lg mb-4">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-forex-primary" />
                    Challenge Start Time
                  </h3>
                  <p className="text-white/80">
                    {formatDate(challenge.startDate)}
                  </p>
                  <p className="text-white/60 text-sm mt-2">
                    You'll receive a notification when the challenge begins.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-white/90 font-medium">What's Next?</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-forex-primary/20 flex items-center justify-center text-forex-primary mr-3 shrink-0">
                        1
                      </div>
                      <span className="text-white/80">Wait for the challenge to begin at the scheduled time</span>
                    </div>
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-forex-primary/20 flex items-center justify-center text-forex-primary mr-3 shrink-0">
                        2
                      </div>
                      <span className="text-white/80">Start trading through your cTrader account when the challenge begins</span>
                    </div>
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-forex-primary/20 flex items-center justify-center text-forex-primary mr-3 shrink-0">
                        3
                      </div>
                      <span className="text-white/80">Monitor your performance on the dashboard and stay within the rules</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4 pt-0 pb-6">
                <Button 
                  onClick={onClose}
                  className="w-full bg-forex-dark hover:bg-forex-dark/80 text-white border border-forex-border/30 py-6 font-semibold"
                >
                  Return to Dashboard
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeDetailsModal; 