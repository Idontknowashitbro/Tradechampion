import { Model, Optional } from 'sequelize';
import ChallengeEntry from './ChallengeEntry';
interface TradeAttributes {
    id: number;
    challengeEntryId: number;
    tradeId: string;
    symbol: string;
    lotSize: number;
    entryTime: Date;
    exitTime: Date;
    pnl: number;
    duration: number;
    createdAt?: Date;
    updatedAt?: Date;
}
interface TradeCreationAttributes extends Optional<TradeAttributes, 'id' | 'duration'> {
}
declare class Trade extends Model<TradeAttributes, TradeCreationAttributes> implements TradeAttributes {
    id: number;
    challengeEntryId: number;
    tradeId: string;
    symbol: string;
    lotSize: number;
    entryTime: Date;
    exitTime: Date;
    pnl: number;
    duration: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly challengeEntry?: ChallengeEntry;
    calculateDuration(): number;
    getPnlPercentage(accountSize: number): number;
    isScalp(minDuration: number): boolean;
}
export default Trade;
