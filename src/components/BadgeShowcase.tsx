import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Star, Shield, BadgeCheck, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  earned: boolean;
  date?: string;
  progress?: number;
}

interface BadgeShowcaseProps {
  className?: string;
}

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ className }) => {
  // Mock badge data - would come from API in real implementation
  const badges: BadgeItem[] = [
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
    <Card className={`bg-forex-card/30 border-forex-border/20 ${className}`}>
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

export default BadgeShowcase; 