"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// Challenge Entry model
class ChallengeEntry extends sequelize_1.Model {
    // Check if the entry meets minimum trade requirements
    meetsMinimumTrades(minTrades) {
        return this.metrics.tradeCount >= minTrades;
    }
    // Check if exceeds max drawdown
    exceedsMaxDrawdown(maxDrawdown) {
        return this.metrics.drawdownPercentage > maxDrawdown;
    }
    // Update metrics after a trade
    updateMetrics(pnlPercentage, drawdownPercentage, tradeCount, avgRiskPerTrade) {
        this.metrics = {
            pnlPercentage,
            drawdownPercentage,
            tradeCount,
            avgRiskPerTrade
        };
    }
}
// Initialize ChallengeEntry model
ChallengeEntry.init({
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
        allowNull: false,
        references: {
            model: 'challenges',
            key: 'id',
        },
    },
    ctraderAccountId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ctraderAccessToken: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    ctraderRefreshToken: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    enrollmentTime: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    connectStatus: {
        type: sequelize_1.DataTypes.ENUM('pending', 'connected', 'disconnected', 'expired'),
        defaultValue: 'pending',
    },
    disqualified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    disqualificationReason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lastPosition: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    metrics: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
            pnlPercentage: 0,
            drawdownPercentage: 0,
            tradeCount: 0,
            avgRiskPerTrade: 0,
        },
    },
    rank: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'active', 'disqualified', 'completed'),
        defaultValue: 'pending',
    },
}, {
    sequelize: database_1.default,
    tableName: 'challenge_entries',
    indexes: [
        {
            unique: true,
            fields: ['userId', 'challengeId'],
            name: 'unique_user_challenge',
        },
    ],
});
// Associations are defined in models/index.ts
exports.default = ChallengeEntry;
//# sourceMappingURL=ChallengeEntry.js.map