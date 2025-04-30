import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  BarChart3
} from "lucide-react";

interface ChallengeMetricsProps {
  metrics: {
    pnl: number;
    drawdown: number;
    tradesClosed: number;
    riskPerTrade: number;
    timeLeft: string;
    balance: number;
    initialBalance: number;
    maxDrawdown: number;
    maxRiskPerTrade: number;
  };
}

const ChallengeMetrics: React.FC<ChallengeMetricsProps> = ({ metrics }) => {
  const {
    pnl,
    drawdown,
    tradesClosed,
    riskPerTrade,
    timeLeft,
    balance,
    initialBalance,
    maxDrawdown,
    maxRiskPerTrade
  } = metrics;

  const pnlPercentage = ((balance - initialBalance) / initialBalance) * 100;
  const drawdownPercentage = (drawdown / maxDrawdown) * 100;
  const riskPercentage = (riskPerTrade / maxRiskPerTrade) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* PnL Card */}
      <Card className="bg-forex-card/50 border-forex-border/20 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/70 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-forex-primary" />
            Profit/Loss
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {pnlPercentage.toFixed(2)}%
            </span>
            <span className="text-white/60 text-sm">
              ${balance.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={Math.abs(pnlPercentage)} 
            className="mt-2 h-2"
            indicatorClassName={pnlPercentage >= 0 ? 'bg-green-400' : 'bg-red-400'}
          />
        </CardContent>
      </Card>

      {/* Drawdown Card */}
      <Card className="bg-forex-card/50 border-forex-border/20 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/70 flex items-center">
            <TrendingDown className="h-4 w-4 mr-2 text-red-400" />
            Drawdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">
              {drawdown.toFixed(2)}%
            </span>
            <span className="text-white/60 text-sm">
              Max: {maxDrawdown}%
            </span>
          </div>
          <Progress 
            value={drawdownPercentage} 
            className="mt-2 h-2"
            indicatorClassName={drawdownPercentage > 80 ? 'bg-red-400' : 'bg-yellow-400'}
          />
        </CardContent>
      </Card>

      {/* Risk Per Trade Card */}
      <Card className="bg-forex-card/50 border-forex-border/20 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/70 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
            Risk Per Trade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">
              {riskPerTrade.toFixed(2)}%
            </span>
            <span className="text-white/60 text-sm">
              Max: {maxRiskPerTrade}%
            </span>
          </div>
          <Progress 
            value={riskPercentage} 
            className="mt-2 h-2"
            indicatorClassName={riskPercentage > 80 ? 'bg-red-400' : 'bg-yellow-400'}
          />
        </CardContent>
      </Card>

      {/* Trade Stats Card */}
      <Card className="bg-forex-card/50 border-forex-border/20 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/70 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
            Trade Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Trades Closed</span>
              <span className="text-white font-medium">{tradesClosed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Time Remaining</span>
              <span className="text-white font-medium">{timeLeft}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeMetrics; 