import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Trophy, Star, BadgeCheck, Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WalletCreditsOverviewProps {
  credits?: number;
  expiry?: string;
  className?: string;
}

const WalletCreditsOverview: React.FC<WalletCreditsOverviewProps> = ({ 
  credits = 270, 
  expiry = "May 20, 2025",
  className 
}) => {
  return (
    <Card className={`bg-forex-card/30 border-forex-border/20 ${className}`}>
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

export default WalletCreditsOverview; 