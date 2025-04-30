import React, { useState } from 'react';
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
  Award,
  Star,
  Shield,
  BadgeCheck,
  ChevronRight,
  Clock,
  AlertTriangle,
  Info,
} from "lucide-react";
import NotificationsPanel from "@/components/NotificationsPanel";
import ChallengeDetailsModal from "@/components/ChallengeDetailsModal";
import TradePerformanceChart from "@/components/TradePerformanceChart";
import ChallengeMetrics from "@/components/ChallengeMetrics";
import TradeHistory from "@/components/TradeHistory";
import CtraderConnect from "@/components/CtraderConnect";
import WalletManagement from "@/components/WalletManagement";
import { Progress } from "@/components/ui/progress";

// Badge Showcase Component
const BadgeShowcase = () => {
  // Mock badge data - would come from API in real implementation
  const badges = [
    {
      id: 'badge1',
      name: 'Top Trader',
      description: 'Reached #1 on a Challenge Leaderboard',
      icon: Trophy,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/30',
      earned: true,
      date: '2025-04-20'
    },
    {
      id: 'badge2',
      name: 'Consistency King',
      description: 'Traded profitably 7 days in a row',
      icon: Award,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      earned: true,
      date: '2025-04-15'
    },
    {
      id: 'badge3',
      name: 'Comeback Kid',
      description: 'Recovered from 3% drawdown to profit',
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      earned: false,
      progress: 75
    },
    {
      id: 'badge4',
      name: 'Volume Monster',
      description: 'Completed 50+ trades in one challenge',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      earned: false,
      progress: 30
    }
  ];

  return (
    <Card className="bg-forex-card/30 border-forex-border/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-lg">Achievement Badges</CardTitle>
          <Button variant="link" className="text-forex-primary p-0 h-auto">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-forex-light/60">
          Showcase your trading skills and accomplishments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`relative border rounded-lg p-4 text-center ${
                badge.earned 
                  ? badge.borderColor
                  : 'border-forex-border/20 opacity-60'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                badge.earned ? badge.bgColor : 'bg-forex-dark/60'
              }`}>
                <badge.icon className={`h-6 w-6 ${badge.earned ? badge.color : 'text-forex-light/40'}`} />
              </div>
              <h4 className={`text-sm font-semibold mb-1 ${badge.earned ? 'text-white' : 'text-forex-light/60'}`}>
                {badge.name}
              </h4>
              {badge.earned ? (
                <div className="flex items-center justify-center text-xs text-forex-light/60 mt-1">
                  <BadgeCheck className="h-3 w-3 text-forex-primary mr-1" />
                  <span>Earned</span>
                </div>
              ) : (
                <div className="mt-2">
                  <Progress value={badge.progress} className="h-1.5 bg-forex-dark/40" />
                  <span className="text-xs text-forex-light/60 mt-1 inline-block">{badge.progress}% complete</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Wallet Credits Component with Top 30% explanation
const WalletCreditsOverview = ({ credits = 270, expiry = "May 20, 2025" }) => {
  return (
    <Card className="bg-forex-card/30 border-forex-border/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-lg">Wallet Credits</CardTitle>
          <Button variant="outline" size="sm" className="h-8 text-xs border-forex-primary/30 text-forex-primary">
            <Wallet className="h-3 w-3 mr-1" /> Manage Credits
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-gradient-to-br from-forex-primary/10 to-forex-primary/5 rounded-lg p-4 border border-forex-primary/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-medium">Available Credits</h3>
              <Badge className="bg-forex-primary/20 text-forex-primary text-xs h-5">Active</Badge>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-white">{credits}</span>
              <span className="text-forex-light/60 ml-2 text-sm">credits</span>
            </div>
            <div className="mt-2 text-xs text-forex-light/60 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Expires on {expiry}</span>
            </div>
            <div className="mt-4">
              <Button size="sm" className="w-full text-xs bg-forex-primary">
                Use Credits for Next Challenge
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-forex-dark/40 rounded-lg p-4 border border-forex-border/10">
            <h3 className="text-white text-sm font-medium mb-3">How to Earn More Credits</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <Trophy className="h-4 w-4 text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-medium">Top 30% Finishers</p>
                  <p className="text-forex-light/60 text-xs">Finish in the top 30% of any challenge to receive wallet credits</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Star className="h-4 w-4 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-medium">Badge Achievements</p>
                  <p className="text-forex-light/60 text-xs">Unlock special badges to earn bonus credits</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <BadgeCheck className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-medium">Streak Bonuses</p>
                  <p className="text-forex-light/60 text-xs">Participate in challenges on consecutive weeks for bonus credits</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-2 bg-forex-primary/10 rounded border border-forex-primary/20 text-xs text-forex-light/80">
              <Info className="h-3 w-3 text-forex-primary inline mr-1" />
              Credits can only be used for challenge entries and expire after 30 days of inactivity
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Challenge Status Component with Timer
const ActiveChallengeStatus = ({ challenge }) => {
  return (
    <Card className="bg-forex-card/30 border-forex-border/20 overflow-hidden">
      <div className="bg-gradient-to-r from-forex-primary/20 to-transparent px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Trophy className="text-amber-400 h-5 w-5 mr-2" />
          <h3 className="text-white font-medium">{challenge.name}</h3>
        </div>
        <Badge className="bg-green-500/20 text-green-400 font-medium">Active</Badge>
      </div>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-forex-dark/40 p-3 rounded-lg">
            <p className="text-white/60 text-xs">Current Rank</p>
            <div className="flex items-center">
              <h3 className="text-xl font-bold text-white">{challenge.rank}</h3>
              <span className="text-forex-light/60 text-xs ml-1">/ {challenge.totalParticipants}</span>
              {challenge.rank <= 3 && (
                <Badge className="ml-2 bg-amber-500/20 text-amber-400 text-xs">Top 3</Badge>
              )}
            </div>
          </div>
          
          <div className="bg-forex-dark/40 p-3 rounded-lg">
            <p className="text-white/60 text-xs">Time Remaining</p>
            <h3 className="text-xl font-bold text-white">{challenge.timeLeft}</h3>
          </div>
          
          <div className="bg-forex-dark/40 p-3 rounded-lg">
            <p className="text-white/60 text-xs">Current P&L</p>
            <h3 className="text-xl font-bold text-forex-primary">
              +{((challenge.balance - challenge.initialBalance) / challenge.initialBalance * 100).toFixed(2)}%
            </h3>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-white/60 text-xs">Challenge Progress</span>
            <span className="text-white/80 text-xs">{challenge.progress}%</span>
          </div>
          <Progress value={challenge.progress} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center space-x-3">
          <Button 
            variant="ghost" 
            className="text-forex-primary border border-forex-primary/20 flex-1 bg-forex-primary/5"
          >
            Open cTrader
          </Button>
          <Button onClick={() => openChallengeDetails(challenge)} className="bg-forex-primary flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ... existing Dashboard component code ...

// Add these new components to the Dashboard's TabsContent for "overview"
<TabsContent value="overview" className="space-y-6">
  {mockActiveChallenges.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <ActiveChallengeStatus challenge={mockActiveChallenges[0]} />
        <BadgeShowcase />
      </div>
      <div className="space-y-6">
        <TradePerformanceChart />
        <WalletCreditsOverview credits={270} expiry="May 20, 2025" />
      </div>
    </div>
  ) : (
    // ... existing "no active challenges" code ...
  )}
</TabsContent>

// ... rest of the existing code ... 