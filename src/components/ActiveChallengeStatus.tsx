import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Challenge {
  id: string;
  name: string;
  type: string;
  status: string;
  timeLeft: string;
  progress: number;
  rank: number;
  totalParticipants: number;
  balance: number;
  initialBalance: number;
  metrics?: any;
  trades?: any[];
}

interface ActiveChallengeStatusProps {
  challenge: Challenge;
  className?: string;
  onViewDetails: (challenge: Challenge) => void;
}

const ActiveChallengeStatus: React.FC<ActiveChallengeStatusProps> = ({ 
  challenge,
  className = '',
  onViewDetails
}) => {
  return (
    <Card className={`bg-forex-card/30 border-forex-border/20 overflow-hidden ${className}`}>
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
          <Button onClick={() => onViewDetails(challenge)} className="bg-forex-primary flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveChallengeStatus; 