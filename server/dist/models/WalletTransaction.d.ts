import { Model, Optional } from 'sequelize';
import User from './User';
import Challenge from './Challenge';
export type TransactionType = 'challenge_reward' | 'challenge_entry' | 'admin_adjustment' | 'expiry' | 'referral_bonus' | 'deposit';
interface WalletTransactionAttributes {
    id: number;
    userId: string;
    amount: number;
    type: TransactionType;
    reason: string;
    challengeId?: number;
    expiryDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
interface WalletTransactionCreationAttributes extends Optional<WalletTransactionAttributes, 'id' | 'expiryDate'> {
}
declare class WalletTransaction extends Model<WalletTransactionAttributes, WalletTransactionCreationAttributes> implements WalletTransactionAttributes {
    id: number;
    userId: string;
    amount: number;
    type: TransactionType;
    reason: string;
    challengeId?: number;
    expiryDate?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly user?: User;
    readonly challenge?: Challenge;
    isExpired(): boolean;
    getDescription(): string;
}
export default WalletTransaction;
