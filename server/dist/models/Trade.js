"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const ChallengeEntry_1 = __importDefault(require("./ChallengeEntry"));
// Trade model
class Trade extends sequelize_1.Model {
    // Calculate trade duration before saving
    calculateDuration() {
        const entryMs = this.entryTime.getTime();
        const exitMs = this.exitTime.getTime();
        return Math.floor((exitMs - entryMs) / 1000); // Duration in seconds
    }
    // Calculate PnL as percentage of account size (account size will be provided)
    getPnlPercentage(accountSize) {
        return (this.pnl / accountSize) * 100;
    }
    // Check if trade is a scalp (duration less than minimum)
    isScalp(minDuration) {
        return this.duration < minDuration;
    }
}
// Initialize Trade model
Trade.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    challengeEntryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'challenge_entries',
            key: 'id',
        },
    },
    tradeId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: 'Trade ID from cTrader',
    },
    symbol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lotSize: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    entryTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    exitTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    pnl: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Trade duration in seconds',
    },
}, {
    sequelize: database_1.default,
    tableName: 'trades',
    indexes: [
        {
            fields: ['challengeEntryId'],
            name: 'trades_challenge_entry_id',
        },
        {
            unique: true,
            fields: ['challengeEntryId', 'tradeId'],
            name: 'unique_entry_trade',
        },
    ],
    hooks: {
        beforeCreate: (trade) => {
            trade.duration = trade.calculateDuration();
        },
        beforeUpdate: (trade) => {
            if (trade.changed('entryTime') || trade.changed('exitTime')) {
                trade.duration = trade.calculateDuration();
            }
        },
    },
});
// Associations
Trade.belongsTo(ChallengeEntry_1.default, { foreignKey: 'challengeEntryId' });
exports.default = Trade;
//# sourceMappingURL=Trade.js.map