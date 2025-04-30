"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
// CryptoWallet model
class CryptoWallet extends sequelize_1.Model {
}
// Initialize CryptoWallet model
CryptoWallet.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    walletType: {
        type: sequelize_1.DataTypes.ENUM('btc', 'eth', 'usdt', 'usdc', 'other'),
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    label: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isDefault: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: database_1.default,
    tableName: 'crypto_wallets',
    hooks: {
        beforeCreate: async (wallet) => {
            // If this wallet is being set as default, unset any other default for this user
            if (wallet.isDefault) {
                await CryptoWallet.update({ isDefault: false }, {
                    where: {
                        userId: wallet.userId,
                        isDefault: true
                    }
                });
            }
        },
        beforeUpdate: async (wallet) => {
            // If this wallet is being set as default, unset any other default for this user
            if (wallet.changed('isDefault') && wallet.isDefault) {
                await CryptoWallet.update({ isDefault: false }, {
                    where: {
                        userId: wallet.userId,
                        isDefault: true,
                        id: { [sequelize_1.Op.ne]: wallet.id }
                    }
                });
            }
        },
    },
});
// Associations
CryptoWallet.belongsTo(User_1.default, { foreignKey: 'userId' });
exports.default = CryptoWallet;
//# sourceMappingURL=CryptoWallet.js.map