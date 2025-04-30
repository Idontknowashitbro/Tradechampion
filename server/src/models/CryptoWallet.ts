import { Model, DataTypes, Optional, Op } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

// Define crypto wallet types
export type WalletType = 'btc' | 'eth' | 'usdt' | 'usdc' | 'other';

// Define crypto wallet attributes
interface CryptoWalletAttributes {
  id: number;
  userId: string;
  walletType: WalletType;
  address: string;
  label: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Attributes for wallet creation
interface CryptoWalletCreationAttributes extends Optional<CryptoWalletAttributes, 'id'> {}

// CryptoWallet model
class CryptoWallet extends Model<CryptoWalletAttributes, CryptoWalletCreationAttributes>
  implements CryptoWalletAttributes {
  public id!: number;
  public userId!: string;
  public walletType!: WalletType;
  public address!: string;
  public label!: string;
  public isDefault!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;
}

// Initialize CryptoWallet model
CryptoWallet.init(
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
    walletType: {
      type: DataTypes.ENUM('btc', 'eth', 'usdt', 'usdc', 'other'),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'crypto_wallets',
    hooks: {
      beforeCreate: async (wallet: CryptoWallet) => {
        // If this wallet is being set as default, unset any other default for this user
        if (wallet.isDefault) {
          await CryptoWallet.update(
            { isDefault: false },
            {
              where: {
                userId: wallet.userId,
                isDefault: true
              }
            }
          );
        }
      },
      beforeUpdate: async (wallet: CryptoWallet) => {
        // If this wallet is being set as default, unset any other default for this user
        if (wallet.changed('isDefault') && wallet.isDefault) {
          await CryptoWallet.update(
            { isDefault: false },
            {
              where: {
                userId: wallet.userId,
                isDefault: true,
                id: { [Op.ne]: wallet.id }
              }
            }
          );
        }
      },
    },
  }
);

// Associations
CryptoWallet.belongsTo(User, { foreignKey: 'userId' });

export default CryptoWallet;