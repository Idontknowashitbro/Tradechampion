import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import ChallengeEntry from './ChallengeEntry';

// Define trade attributes
interface TradeAttributes {
  id: number;
  challengeEntryId: number;
  tradeId: string;
  symbol: string;
  lotSize: number;
  entryTime: Date;
  exitTime: Date;
  pnl: number;
  duration: number; // Duration in seconds
  createdAt?: Date;
  updatedAt?: Date;
}

// Attributes for trade creation
interface TradeCreationAttributes extends Optional<TradeAttributes, 'id' | 'duration'> {}

// Trade model
class Trade extends Model<TradeAttributes, TradeCreationAttributes> implements TradeAttributes {
  public id!: number;
  public challengeEntryId!: number;
  public tradeId!: string;
  public symbol!: string;
  public lotSize!: number;
  public entryTime!: Date;
  public exitTime!: Date;
  public pnl!: number;
  public duration!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association
  public readonly challengeEntry?: ChallengeEntry;

  // Calculate trade duration before saving
  public calculateDuration(): number {
    const entryMs = this.entryTime.getTime();
    const exitMs = this.exitTime.getTime();
    return Math.floor((exitMs - entryMs) / 1000); // Duration in seconds
  }

  // Calculate PnL as percentage of account size (account size will be provided)
  public getPnlPercentage(accountSize: number): number {
    return (this.pnl / accountSize) * 100;
  }

  // Check if trade is a scalp (duration less than minimum)
  public isScalp(minDuration: number): boolean {
    return this.duration < minDuration;
  }
}

// Initialize Trade model
Trade.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    challengeEntryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'challenge_entries',
        key: 'id',
      },
    },
    tradeId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Trade ID from cTrader',
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lotSize: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    entryTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    exitTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pnl: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Trade duration in seconds',
    },
  },
  {
    sequelize,
    tableName: 'trades',
    indexes: [
      {
        fields: ['challengeEntryId'],
        name: 'trades_challenge_entry_id',
      },
      {
        unique: true,
        fields: ['challengeEntryId', 'tradeId'],
        name: 'unique_entry_trade',
      },
    ],
    hooks: {
      beforeCreate: (trade: Trade) => {
        trade.duration = trade.calculateDuration();
      },
      beforeUpdate: (trade: Trade) => {
        if (trade.changed('entryTime') || trade.changed('exitTime')) {
          trade.duration = trade.calculateDuration();
        }
      },
    },
  }
);

// Associations
Trade.belongsTo(ChallengeEntry, { foreignKey: 'challengeEntryId' });

export default Trade; 