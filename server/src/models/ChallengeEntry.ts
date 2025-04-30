import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Challenge from './Challenge';

// Entry status types
export type EntryStatus = 'pending' | 'active' | 'disqualified' | 'completed';

// Connection status types
export type ConnectStatus = 'pending' | 'connected' | 'disconnected' | 'expired';

// Define challenge entry attributes
interface ChallengeEntryAttributes {
  id: number;
  userId: string;
  challengeId: number;
  ctraderAccountId: string;
  ctraderAccessToken: string;
  ctraderRefreshToken: string;
  enrollmentTime: Date;
  connectStatus: ConnectStatus;
  disqualified: boolean;
  disqualificationReason?: string;
  lastPosition: object | null; // Latest trade position data (stored as JSONB)
  metrics: {
    pnlPercentage: number;
    drawdownPercentage: number;
    tradeCount: number;
    avgRiskPerTrade: number;
  };
  rank?: number;
  status: EntryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// Attributes for challenge entry creation
interface ChallengeEntryCreationAttributes extends Optional<ChallengeEntryAttributes, 
  'id' | 'enrollmentTime' | 'connectStatus' | 'disqualified' | 'lastPosition' | 'metrics' | 'rank' | 'status'> {}

// Challenge Entry model
class ChallengeEntry extends Model<ChallengeEntryAttributes, ChallengeEntryCreationAttributes> 
  implements ChallengeEntryAttributes {
  public id!: number;
  public userId!: string;
  public challengeId!: number;
  public ctraderAccountId!: string;
  public ctraderAccessToken!: string;
  public ctraderRefreshToken!: string;
  public enrollmentTime!: Date;
  public connectStatus!: ConnectStatus;
  public disqualified!: boolean;
  public disqualificationReason?: string;
  public lastPosition!: object | null;
  public metrics!: {
    pnlPercentage: number;
    drawdownPercentage: number;
    tradeCount: number;
    avgRiskPerTrade: number;
  };
  public rank?: number;
  public status!: EntryStatus;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;
  public readonly challenge?: Challenge;

  // Check if the entry meets minimum trade requirements
  public meetsMinimumTrades(minTrades: number): boolean {
    return this.metrics.tradeCount >= minTrades;
  }

  // Check if exceeds max drawdown
  public exceedsMaxDrawdown(maxDrawdown: number): boolean {
    return this.metrics.drawdownPercentage > maxDrawdown;
  }

  // Update metrics after a trade
  public updateMetrics(
    pnlPercentage: number, 
    drawdownPercentage: number, 
    tradeCount: number,
    avgRiskPerTrade: number
  ): void {
    this.metrics = {
      pnlPercentage,
      drawdownPercentage,
      tradeCount,
      avgRiskPerTrade
    };
  }
}

// Initialize ChallengeEntry model
ChallengeEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'challenges',
        key: 'id',
      },
    },
    ctraderAccountId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ctraderAccessToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ctraderRefreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    enrollmentTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    connectStatus: {
      type: DataTypes.ENUM('pending', 'connected', 'disconnected', 'expired'),
      defaultValue: 'pending',
    },
    disqualified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    disqualificationReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastPosition: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    metrics: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        pnlPercentage: 0,
        drawdownPercentage: 0,
        tradeCount: 0,
        avgRiskPerTrade: 0,
      },
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'disqualified', 'completed'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'challenge_entries',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'challengeId'],
        name: 'unique_user_challenge',
      },
    ],
  }
);

// Associations are defined in models/index.ts

export default ChallengeEntry; 