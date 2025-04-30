"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const Challenge_1 = __importDefault(require("./Challenge"));
// CryptoPayment model
class CryptoPayment extends sequelize_1.Model {
    // Get parsed extra data
    getExtraData() {
        if (!this.extraData)
            return {};
        try {
            return JSON.parse(this.extraData);
        }
        catch (e) {
            return {};
        }
    }
    // Set extra data
    setExtraData(data) {
        this.extraData = JSON.stringify(data);
    }
}
// Initialize CryptoPayment model
CryptoPayment.init({
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
    challengeId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'challenges',
            key: 'id',
        },
    },
    paymentId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    invoiceId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 8),
        allowNull: false,
    },
    cryptoCurrency: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    actualCryptoAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 8),
        allowNull: true,
    },
    paymentAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('waiting', 'confirming', 'confirmed', 'sending', 'partially_paid', 'finished', 'failed', 'refunded', 'expired'),
        allowNull: false,
        defaultValue: 'waiting',
    },
    ipnSecret: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    callbackUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    successUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    cancelUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    extraData: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'crypto_payments',
    hooks: {
        // Add credit to user's wallet when payment is confirmed
        afterUpdate: async (payment) => {
            const { status, userId, amount, challengeId } = payment;
            if (payment.changed('status') && status === 'finished') {
                try {
                    // Import models here to avoid circular dependencies
                    const WalletTransaction = database_1.default.models.WalletTransaction;
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
                }
                catch (error) {
                    console.error('Error updating wallet after crypto payment:', error);
                }
            }
        },
    },
});
// Associations
CryptoPayment.belongsTo(User_1.default, { foreignKey: 'userId' });
CryptoPayment.belongsTo(Challenge_1.default, { foreignKey: 'challengeId' });
exports.default = CryptoPayment;
//# sourceMappingURL=CryptoPayment.js.map