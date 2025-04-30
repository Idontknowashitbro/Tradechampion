import { Model, DataTypes, Optional, Association } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import ChallengeEntry from './ChallengeEntry';

// Challenge types
export type ChallengeType = 'daily' | 'weekly' | 'monthly' | 'micro';

// Challenge attributes
interface ChallengeAttributes {
  id: number;
  name: string;
  description: string;
  type: ChallengeType;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  maxDrawdown: number;
  maxDailyDrawdown?: number;
  maxRiskPerTrade: number;
  minTradeDuration: number; // in minutes
  minTrades?: number;
  minTradingDays?: number;
  allowHedging: boolean;
  allowMartingale: boolean;
  allowScalping: boolean;
  entryFee: number;
  prizePool: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  swingTradingRequired?: boolean;
  consistencyRuleEnabled?: boolean;
  rules?: any; // Custom rules stored as JSON
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for Challenge creation
interface ChallengeCreationAttributes extends Optional<ChallengeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Challenge extends Model<ChallengeAttributes, ChallengeCreationAttributes> implements ChallengeAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public type!: ChallengeType;
  public startDate!: Date;
  public endDate!: Date;
  public initialBalance!: number;
  public maxDrawdown!: number;
  public maxDailyDrawdown?: number;
  public maxRiskPerTrade!: number;
  public minTradeDuration!: number;
  public minTrades?: number;
  public minTradingDays?: number;
  public allowHedging!: boolean;
  public allowMartingale!: boolean;
  public allowScalping!: boolean;
  public entryFee!: number;
  public prizePool!: number;
  public status!: 'upcoming' | 'active' | 'completed' | 'cancelled';
  public swingTradingRequired?: boolean;
  public consistencyRuleEnabled?: boolean;
  public rules?: any; // Custom rules stored as JSON
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public static associations: {
    entries: Association<Challenge, ChallengeEntry>;
    participants: Association<Challenge, User>;
  };

  /**
   * Calculate prize distribution
   * @returns Object with prize distribution
   */
  public calculatePrizeDistribution(): any {
    const prizePool = this.prizePool;
    let distribution: any = {};

    // Different distribution based on challenge type
    switch (this.type) {
      case 'daily':
        distribution = {
          firstPlace: prizePool * 0.5, // 50% to first place
          secondPlace: prizePool * 0.3, // 30% to second place
          thirdPlace: prizePool * 0.2, // 20% to third place
        };
        break;
      case 'weekly':
        distribution = {
          firstPlace: prizePool * 0.4, // 40% to first place
          secondPlace: prizePool * 0.25, // 25% to second place
          thirdPlace: prizePool * 0.15, // 15% to third place
          fourthToTenth: prizePool * 0.2, // 20% split among 4th-10th places
        };
        break;
      case 'monthly':
        distribution = {
          firstPlace: prizePool * 0.35, // 35% to first place
          secondPlace: prizePool * 0.2, // 20% to second place
          thirdPlace: prizePool * 0.15, // 15% to third place
          fourthToTenth: prizePool * 0.2, // 20% split among 4th-10th places
          participationCredits: prizePool * 0.1, // 10% for participation credits
        };
        break;
      default:
        distribution = {
          firstPlace: prizePool * 0.5,
          secondPlace: prizePool * 0.3,
          thirdPlace: prizePool * 0.2,
        };
    }

    return distribution;
  }

  /**
   * Get default challenge rules based on challenge type
   * @param type Challenge type
   * @returns Default challenge rules
   */
  public static getDefaultRules(type: ChallengeType): Partial<ChallengeAttributes> {
    switch (type) {
      case 'daily':
        return {
          initialBalance: 10000,
          maxDrawdown: 4,
          maxRiskPerTrade: 1,
          minTradeDuration: 2,
          minTrades: 1,
          allowHedging: false,
          allowMartingale: false,
          allowScalping: false,
          swingTradingRequired: false,
          consistencyRuleEnabled: false,
        };
      case 'weekly':
        return {
          initialBalance: 50000,
          maxDrawdown: 8,
          maxDailyDrawdown: 3,
          maxRiskPerTrade: 1.5,
          minTradeDuration: 2,
          minTrades: 3,
          minTradingDays: 3,
          allowHedging: false,
          allowMartingale: false,
          allowScalping: false,
          swingTradingRequired: true,
          consistencyRuleEnabled: true,
        };
      case 'monthly':
        return {
          initialBalance: 100000,
          maxDrawdown: 10,
          maxDailyDrawdown: 3,
          maxRiskPerTrade: 2,
          minTradeDuration: 2,
          minTrades: 6,
          minTradingDays: 6,
          allowHedging: false,
          allowMartingale: false,
          allowScalping: false,
          swingTradingRequired: true,
          consistencyRuleEnabled: true,
        };
      default:
        return {
          initialBalance: 10000,
          maxDrawdown: 5,
          maxRiskPerTrade: 1,
          minTradeDuration: 2,
          allowHedging: false,
          allowMartingale: false,
          allowScalping: false,
        };
    }
  }
}

Challenge.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'micro'),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    initialBalance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    maxDrawdown: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    maxDailyDrawdown: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    maxRiskPerTrade: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    minTradeDuration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false,
      defaultValue: 2,
    },
    minTrades: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    minTradingDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    allowHedging: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allowMartingale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allowScalping: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    entryFee: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    prizePool: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'active', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'upcoming',
    },
    swingTradingRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    consistencyRuleEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    rules: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'challenges',
    modelName: 'Challenge',
  }
);

// Define associations
Challenge.hasMany(ChallengeEntry, {
  foreignKey: 'challengeId',
  as: 'entries',
  onDelete: 'CASCADE',
});

export default Challenge; 