import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Challenge from './Challenge';

// Transaction Types
export type TransactionType = 
  'challenge_reward' | 
  'challenge_entry' | 
  'admin_adjustment' | 
  'expiry' | 
  'referral_bonus' |
  'deposit';

// Define wallet transaction attributes
interface WalletTransactionAttributes {
  id: number;
  userId: string;
  amount: number; // Positive for additions, negative for deductions
  type: TransactionType;
  reason: string;
  challengeId?: number; // Optional - related challenge if applicable
  expiryDate?: Date; // When these credits expire
  createdAt?: Date;
  updatedAt?: Date;
}

// Attributes for wallet transaction creation
interface WalletTransactionCreationAttributes extends Optional<WalletTransactionAttributes, 'id' | 'expiryDate'> {}

// Wallet Transaction model
class WalletTransaction extends Model<WalletTransactionAttributes, WalletTransactionCreationAttributes> 
  implements WalletTransactionAttributes {
  public id!: number;
  public userId!: string;
  public amount!: number;
  public type!: TransactionType;
  public reason!: string;
  public challengeId?: number;
  public expiryDate?: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;
  public readonly challenge?: Challenge;

  // Check if transaction is expired
  public isExpired(): boolean {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
  }

  // Get formatted transaction description
  public getDescription(): string {
    switch (this.type) {
      case 'challenge_reward':
        return `Reward from challenge #${this.challengeId}`;
      case 'challenge_entry':
        return `Entry fee for challenge #${this.challengeId}`;
      case 'admin_adjustment':
        return `Admin adjustment: ${this.reason}`;
      case 'expiry':
        return `Credits expired`;
      case 'referral_bonus':
        return `Referral bonus`;
      case 'deposit':
        return `Wallet deposit: ${this.reason}`;
      default:
        return this.reason;
    }
  }
}

// Initialize WalletTransaction model
WalletTransaction.init(
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('challenge_reward', 'challenge_entry', 'admin_adjustment', 'expiry', 'referral_bonus', 'deposit'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'challenges',
        key: 'id',
      },
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when these credits expire',
    },
  },
  {
    sequelize,
    tableName: 'wallet_transactions',
    hooks: {
      afterCreate: async (transaction: WalletTransaction) => {
        try {
          // Update user's wallet balance
          const user = await User.findByPk(transaction.userId);
          if (user) {
            user.walletBalance = parseFloat(user.walletBalance.toString()) + parseFloat(transaction.amount.toString());
            await user.save();
          }
        } catch (error) {
          console.error('Error updating user wallet balance:', error);
        }
      },
    },
  }
);

// Associations
WalletTransaction.belongsTo(User, { foreignKey: 'userId' });
WalletTransaction.belongsTo(Challenge, { foreignKey: 'challengeId' });

export default WalletTransaction; 