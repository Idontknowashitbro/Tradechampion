"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const Challenge_1 = __importDefault(require("./Challenge"));
// Wallet Transaction model
class WalletTransaction extends sequelize_1.Model {
    // Check if transaction is expired
    isExpired() {
        if (!this.expiryDate)
            return false;
        return new Date() > this.expiryDate;
    }
    // Get formatted transaction description
    getDescription() {
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
WalletTransaction.init({
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
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('challenge_reward', 'challenge_entry', 'admin_adjustment', 'expiry', 'referral_bonus', 'deposit'),
        allowNull: false,
    },
    reason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    challengeId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'challenges',
            key: 'id',
        },
    },
    expiryDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Date when these credits expire',
    },
}, {
    sequelize: database_1.default,
    tableName: 'wallet_transactions',
    hooks: {
        afterCreate: async (transaction) => {
            try {
                // Update user's wallet balance
                const user = await User_1.default.findByPk(transaction.userId);
                if (user) {
                    user.walletBalance = parseFloat(user.walletBalance.toString()) + parseFloat(transaction.amount.toString());
                    await user.save();
                }
            }
            catch (error) {
                console.error('Error updating user wallet balance:', error);
            }
        },
    },
});
// Associations
WalletTransaction.belongsTo(User_1.default, { foreignKey: 'userId' });
WalletTransaction.belongsTo(Challenge_1.default, { foreignKey: 'challengeId' });
exports.default = WalletTransaction;
//# sourceMappingURL=WalletTransaction.js.map