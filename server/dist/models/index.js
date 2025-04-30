"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = exports.CryptoPayment = exports.CryptoWallet = exports.Notification = exports.WalletTransaction = exports.Trade = exports.ChallengeEntry = exports.Challenge = exports.User = exports.sequelize = void 0;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Challenge_1 = __importDefault(require("./Challenge"));
exports.Challenge = Challenge_1.default;
const ChallengeEntry_1 = __importDefault(require("./ChallengeEntry"));
exports.ChallengeEntry = ChallengeEntry_1.default;
const Trade_1 = __importDefault(require("./Trade"));
exports.Trade = Trade_1.default;
const WalletTransaction_1 = __importDefault(require("./WalletTransaction"));
exports.WalletTransaction = WalletTransaction_1.default;
const Notification_1 = __importDefault(require("./Notification"));
exports.Notification = Notification_1.default;
const CryptoWallet_1 = __importDefault(require("./CryptoWallet"));
exports.CryptoWallet = CryptoWallet_1.default;
const CryptoPayment_1 = __importDefault(require("./CryptoPayment"));
exports.CryptoPayment = CryptoPayment_1.default;
const database_1 = __importDefault(require("../config/database"));
exports.sequelize = database_1.default;
// Define all associations
// User associations
User_1.default.hasMany(ChallengeEntry_1.default, { foreignKey: 'userId', as: 'userEntries' });
User_1.default.hasMany(WalletTransaction_1.default, { foreignKey: 'userId', as: 'walletTransactions' });
User_1.default.hasMany(Notification_1.default, { foreignKey: 'userId', as: 'notifications' });
User_1.default.hasMany(CryptoWallet_1.default, { foreignKey: 'userId', as: 'cryptoWallets' });
User_1.default.hasMany(CryptoPayment_1.default, { foreignKey: 'userId', as: 'cryptoPayments' });
// Challenge associations
Challenge_1.default.hasMany(ChallengeEntry_1.default, { foreignKey: 'challengeId', as: 'challengeEntries' });
Challenge_1.default.hasMany(WalletTransaction_1.default, { foreignKey: 'challengeId', as: 'transactions' });
Challenge_1.default.hasMany(CryptoPayment_1.default, { foreignKey: 'challengeId', as: 'cryptoPayments' });
// ChallengeEntry associations
ChallengeEntry_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
ChallengeEntry_1.default.belongsTo(Challenge_1.default, { foreignKey: 'challengeId', as: 'challenge' });
ChallengeEntry_1.default.hasMany(Trade_1.default, { foreignKey: 'challengeEntryId', as: 'trades' });
// Trade associations
Trade_1.default.belongsTo(ChallengeEntry_1.default, { foreignKey: 'challengeEntryId', as: 'challengeEntry' });
// WalletTransaction associations
WalletTransaction_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
WalletTransaction_1.default.belongsTo(Challenge_1.default, { foreignKey: 'challengeId', as: 'challenge' });
// Notification associations
Notification_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'notificationUser' });
// CryptoWallet associations
CryptoWallet_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
// CryptoPayment associations
CryptoPayment_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
CryptoPayment_1.default.belongsTo(Challenge_1.default, { foreignKey: 'challengeId', as: 'challenge' });
// Initialize database
const initDatabase = async (sync = false) => {
    try {
        // Test the connection
        await database_1.default.authenticate();
        console.log('Database connection has been established successfully.');
        if (sync) {
            // Sync all models with the database (use with caution in production)
            await database_1.default.sync({ alter: true });
            console.log('Database synchronized successfully.');
        }
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};
exports.initDatabase = initDatabase;
//# sourceMappingURL=index.js.map