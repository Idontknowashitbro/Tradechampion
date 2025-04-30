import { Server } from 'socket.io';

declare module 'socket.io' {
  interface Server {
    // Add additional methods for socketService
    to(room: string): SocketEmitter;
  }
  
  interface SocketEmitter {
    emit(event: string, ...args: any[]): boolean;
  }
}

// Export socket notification types
export interface TradeNotification {
  id: string | number;
  symbol: string;
  pnl: number;
  entryTime: Date;
  exitTime: Date;
}

export interface Notification {
  title: string;
  message: string;
  type: 'system' | 'trade' | 'connection' | 'challenge';
  timestamp?: Date;
}

export interface MetricsUpdate {
  challengeEntryId: number;
  metrics: {
    pnlPercentage: number;
    drawdownPercentage: number;
    tradeCount: number;
    avgRiskPerTrade: number;
  };
} 