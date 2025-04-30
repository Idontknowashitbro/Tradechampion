import { Model, Optional } from 'sequelize';
import User from './User';
import Challenge from './Challenge';
export type EntryStatus = 'pending' | 'active' | 'disqualified' | 'completed';
export type ConnectStatus = 'pending' | 'connected' | 'disconnected' | 'expired';
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
    lastPosition: object | null;
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
interface ChallengeEntryCreationAttributes extends Optional<ChallengeEntryAttributes, 'id' | 'enrollmentTime' | 'connectStatus' | 'disqualified' | 'lastPosition' | 'metrics' | 'rank' | 'status'> {
}
declare class ChallengeEntry extends Model<ChallengeEntryAttributes, ChallengeEntryCreationAttributes> implements ChallengeEntryAttributes {
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
    lastPosition: object | null;
    metrics: {
        pnlPercentage: number;
        drawdownPercentage: number;
        tradeCount: number;
        avgRiskPerTrade: number;
    };
    rank?: number;
    status: EntryStatus;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly user?: User;
    readonly challenge?: Challenge;
    meetsMinimumTrades(minTrades: number): boolean;
    exceedsMaxDrawdown(maxDrawdown: number): boolean;
    updateMetrics(pnlPercentage: number, drawdownPercentage: number, tradeCount: number, avgRiskPerTrade: number): void;
}
export default ChallengeEntry;
