import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  DollarSign
} from "lucide-react";

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lotSize: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercentage: number;
  openTime: string;
  closeTime: string;
  duration: string;
}

interface TradeHistoryProps {
  trades: Trade[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="bg-forex-card/50 border-forex-border/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-forex-border/20">
          <Table>
            <TableHeader>
              <TableRow className="border-forex-border/20 hover:bg-forex-card/30">
                <TableHead className="text-white/70">Time</TableHead>
                <TableHead className="text-white/70">Symbol</TableHead>
                <TableHead className="text-white/70">Type</TableHead>
                <TableHead className="text-white/70">Size</TableHead>
                <TableHead className="text-white/70">Entry</TableHead>
                <TableHead className="text-white/70">Exit</TableHead>
                <TableHead className="text-white/70">Duration</TableHead>
                <TableHead className="text-white/70 text-right">P/L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow 
                  key={trade.id}
                  className="border-forex-border/20 hover:bg-forex-card/30"
                >
                  <TableCell className="text-white/90">
                    <div className="flex flex-col">
                      <span className="text-sm">{formatDate(trade.openTime)}</span>
                      <span className="text-xs text-white/60">{formatTime(trade.openTime)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/90 font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={trade.type === 'BUY' ? 'default' : 'destructive'}
                      className="bg-forex-primary/20 text-forex-primary hover:bg-forex-primary/30"
                    >
                      {trade.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/90">{trade.lotSize}</TableCell>
                  <TableCell className="text-white/90">${trade.entryPrice.toFixed(5)}</TableCell>
                  <TableCell className="text-white/90">${trade.exitPrice.toFixed(5)}</TableCell>
                  <TableCell className="text-white/90">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-white/60" />
                      {trade.duration}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      {trade.pnl >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1 text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1 text-red-400" />
                      )}
                      <span className={trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                        ${Math.abs(trade.pnl).toFixed(2)} ({trade.pnlPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeHistory; 