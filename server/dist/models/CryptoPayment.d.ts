import { Model, Optional } from 'sequelize';
import User from './User';
import Challenge from './Challenge';
export type PaymentStatus = 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'partially_paid' | 'finished' | 'failed' | 'refunded' | 'expired';
interface CryptoPaymentAttributes {
    id: number;
    userId: string;
    challengeId?: number;
    paymentId: string;
    invoiceId?: string;
    amount: number;
    cryptoCurrency: string;
    actualCryptoAmount?: number;
    paymentAddress?: string;
    status: PaymentStatus;
    ipnSecret?: string;
    description: string;
    callbackUrl?: string;
    successUrl?: string;
    cancelUrl?: string;
    extraData?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface CryptoPaymentCreationAttributes extends Optional<CryptoPaymentAttributes, 'id' | 'status' | 'extraData'> {
}
declare class CryptoPayment extends Model<CryptoPaymentAttributes, CryptoPaymentCreationAttributes> implements CryptoPaymentAttributes {
    id: number;
    userId: string;
    challengeId?: number;
    paymentId: string;
    invoiceId?: string;
    amount: number;
    cryptoCurrency: string;
    actualCryptoAmount?: number;
    paymentAddress?: string;
    status: PaymentStatus;
    ipnSecret?: string;
    description: string;
    callbackUrl?: string;
    successUrl?: string;
    cancelUrl?: string;
    extraData?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly user?: User;
    readonly challenge?: Challenge;
    getExtraData(): any;
    setExtraData(data: any): void;
}
export default CryptoPayment;
