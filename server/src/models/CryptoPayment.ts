import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Challenge from './Challenge';

// Payment status types (based on NOWPayments statuses)
export type PaymentStatus = 
  'waiting' | 
  'confirming' | 
  'confirmed' | 
  'sending' | 
  'partially_paid' | 
  'finished' | 
  'failed' | 
  'refunded' | 
  'expired';

// Define crypto payment attributes
interface CryptoPaymentAttributes {
  id: number;
  userId: string;
  challengeId?: number;
  paymentId: string; // NOWPayments payment ID
  invoiceId?: string; // NOWPayments invoice ID if applicable
  amount: number; // Amount in fiat/stable currency
  cryptoCurrency: string; // BTC, ETH, etc.
  actualCryptoAmount?: number; // Actual amount paid in crypto
  paymentAddress?: string; // Crypto address where payment was sent
  status: PaymentStatus;
  ipnSecret?: string; // Secret for IPN verification
  description: string;
  callbackUrl?: string;
  successUrl?: string;
  cancelUrl?: string;
  extraData?: string; // For storing any additional data as JSON
  createdAt?: Date;
  updatedAt?: Date;
}

// Attributes for payment creation
interface CryptoPaymentCreationAttributes extends Optional<CryptoPaymentAttributes, 'id' | 'status' | 'extraData'> {}

// CryptoPayment model
class CryptoPayment extends Model<CryptoPaymentAttributes, CryptoPaymentCreationAttributes>
  implements CryptoPaymentAttributes {
  public id!: number;
  public userId!: string;
  public challengeId?: number;
  public paymentId!: string;
  public invoiceId?: string;
  public amount!: number;
  public cryptoCurrency!: string;
  public actualCryptoAmount?: number;
  public paymentAddress?: string;
  public status!: PaymentStatus;
  public ipnSecret?: string;
  public description!: string;
  public callbackUrl?: string;
  public successUrl?: string;
  public cancelUrl?: string;
  public extraData?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;
  public readonly challenge?: Challenge;

  // Get parsed extra data
  public getExtraData(): any {
    if (!this.extraData) return {};
    try {
      return JSON.parse(this.extraData);
    } catch (e) {
      return {};
    }
  }

  // Set extra data
  public setExtraData(data: any): void {
    this.extraData = JSON.stringify(data);
  }
}

// Initialize CryptoPayment model
CryptoPayment.init(
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
      allowNull: true,
      references: {
        model: 'challenges',
        key: 'id',
      },
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    invoiceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 8),
      allowNull: false,
    },
    cryptoCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    actualCryptoAmount: {
      type: DataTypes.DECIMAL(15, 8),
      allowNull: true,
    },
    paymentAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'waiting', 
        'confirming', 
        'confirmed', 
        'sending', 
        'partially_paid', 
        'finished', 
        'failed', 
        'refunded', 
        'expired'
      ),
      allowNull: false,
      defaultValue: 'waiting',
    },
    ipnSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    callbackUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    successUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cancelUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    extraData: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'crypto_payments',
    hooks: {
      // Add credit to user's wallet when payment is confirmed
      afterUpdate: async (payment: CryptoPayment) => {
        const { status, userId, amount, challengeId } = payment;
        
        if (payment.changed('status') && status === 'finished') {
          try {
            // Import models here to avoid circular dependencies
            const WalletTransaction = sequelize.models.WalletTransaction;
            
            // Create a wallet transaction for the payment
            if (WalletTransaction) {
              await WalletTransaction.create({
                userId,
                amount: parseFloat(amount.toString()),
                type: challengeId ? 'challenge_entry' : 'deposit',
                reason: challengeId 
                  ? `Crypto payment for challenge #${challengeId}` 
                  : 'Wallet crypto deposit',
                challengeId: challengeId || null,
              });
            }
          } catch (error) {
            console.error('Error updating wallet after crypto payment:', error);
          }
        }
      },
    },
  }
);

// Associations
CryptoPayment.belongsTo(User, { foreignKey: 'userId' });
CryptoPayment.belongsTo(Challenge, { foreignKey: 'challengeId' });

export default CryptoPayment; 