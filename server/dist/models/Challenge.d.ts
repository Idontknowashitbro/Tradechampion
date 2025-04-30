import { Model, Optional, Association } from 'sequelize';
import User from './User';
import ChallengeEntry from './ChallengeEntry';
export type ChallengeType = 'daily' | 'weekly' | 'monthly' | 'micro';
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
    minTradeDuration: number;
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
    rules?: any;
    createdAt?: Date;
    updatedAt?: Date;
}
interface ChallengeCreationAttributes extends Optional<ChallengeAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class Challenge extends Model<ChallengeAttributes, ChallengeCreationAttributes> implements ChallengeAttributes {
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
    minTradeDuration: number;
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
    rules?: any;
    createdAt: Date;
    updatedAt: Date;
    static associations: {
        entries: Association<Challenge, ChallengeEntry>;
        participants: Association<Challenge, User>;
    };
    /**
     * Calculate prize distribution
     * @returns Object with prize distribution
     */
    calculatePrizeDistribution(): any;
    /**
     * Get default challenge rules based on challenge type
     * @param type Challenge type
     * @returns Default challenge rules
     */
    static getDefaultRules(type: ChallengeType): Partial<ChallengeAttributes>;
}
export default Challenge;
