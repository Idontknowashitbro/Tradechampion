"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const ChallengeEntry_1 = __importDefault(require("./ChallengeEntry"));
class Challenge extends sequelize_1.Model {
    /**
     * Calculate prize distribution
     * @returns Object with prize distribution
     */
    calculatePrizeDistribution() {
        const prizePool = this.prizePool;
        let distribution = {};
        // Different distribution based on challenge type
        switch (this.type) {
            case 'daily':
                distribution = {
                    firstPlace: prizePool * 0.5,
                    secondPlace: prizePool * 0.3,
                    thirdPlace: prizePool * 0.2, // 20% to third place
                };
                break;
            case 'weekly':
                distribution = {
                    firstPlace: prizePool * 0.4,
                    secondPlace: prizePool * 0.25,
                    thirdPlace: prizePool * 0.15,
                    fourthToTenth: prizePool * 0.2, // 20% split among 4th-10th places
                };
                break;
            case 'monthly':
                distribution = {
                    firstPlace: prizePool * 0.35,
                    secondPlace: prizePool * 0.2,
                    thirdPlace: prizePool * 0.15,
                    fourthToTenth: prizePool * 0.2,
                    participationCredits: prizePool * 0.1, // 10% for participation credits
                };
                break;
            default:
                distribution = {
                    firstPlace: prizePool * 0.5,
                    secondPlace: prizePool * 0.3,
                    thirdPlace: prizePool * 0.2,
                };
        }
        return distribution;
    }
    /**
     * Get default challenge rules based on challenge type
     * @param type Challenge type
     * @returns Default challenge rules
     */
    static getDefaultRules(type) {
        switch (type) {
            case 'daily':
                return {
                    initialBalance: 10000,
                    maxDrawdown: 4,
                    maxRiskPerTrade: 1,
                    minTradeDuration: 2,
                    minTrades: 1,
                    allowHedging: false,
                    allowMartingale: false,
                    allowScalping: false,
                    swingTradingRequired: false,
                    consistencyRuleEnabled: false,
                };
            case 'weekly':
                return {
                    initialBalance: 50000,
                    maxDrawdown: 8,
                    maxDailyDrawdown: 3,
                    maxRiskPerTrade: 1.5,
                    minTradeDuration: 2,
                    minTrades: 3,
                    minTradingDays: 3,
                    allowHedging: false,
                    allowMartingale: false,
                    allowScalping: false,
                    swingTradingRequired: true,
                    consistencyRuleEnabled: true,
                };
            case 'monthly':
                return {
                    initialBalance: 100000,
                    maxDrawdown: 10,
                    maxDailyDrawdown: 3,
                    maxRiskPerTrade: 2,
                    minTradeDuration: 2,
                    minTrades: 6,
                    minTradingDays: 6,
                    allowHedging: false,
                    allowMartingale: false,
                    allowScalping: false,
                    swingTradingRequired: true,
                    consistencyRuleEnabled: true,
                };
            default:
                return {
                    initialBalance: 10000,
                    maxDrawdown: 5,
                    maxRiskPerTrade: 1,
                    minTradeDuration: 2,
                    allowHedging: false,
                    allowMartingale: false,
                    allowScalping: false,
                };
        }
    }
}
Challenge.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('daily', 'weekly', 'monthly', 'micro'),
        allowNull: false,
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    initialBalance: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    maxDrawdown: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    maxDailyDrawdown: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    maxRiskPerTrade: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    minTradeDuration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
    },
    minTrades: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    minTradingDays: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    allowHedging: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    allowMartingale: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    allowScalping: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    entryFee: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    prizePool: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('upcoming', 'active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'upcoming',
    },
    swingTradingRequired: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    consistencyRuleEnabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    rules: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'challenges',
    modelName: 'Challenge',
});
// Define associations
Challenge.hasMany(ChallengeEntry_1.default, {
    foreignKey: 'challengeId',
    as: 'entries',
    onDelete: 'CASCADE',
});
exports.default = Challenge;
//# sourceMappingURL=Challenge.js.map