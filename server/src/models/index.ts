import User from './User';
import Challenge from './Challenge';
import ChallengeEntry from './ChallengeEntry';
import Trade from './Trade';
import WalletTransaction from './WalletTransaction';
import Notification from './Notification';
import CryptoWallet from './CryptoWallet';
import CryptoPayment from './CryptoPayment';
import sequelize from '../config/database';

// Define all associations

// User associations
User.hasMany(ChallengeEntry, { foreignKey: 'userId', as: 'userEntries' });
User.hasMany(WalletTransaction, { foreignKey: 'userId', as: 'walletTransactions' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
User.hasMany(CryptoWallet, { foreignKey: 'userId', as: 'cryptoWallets' });
User.hasMany(CryptoPayment, { foreignKey: 'userId', as: 'cryptoPayments' });

// Challenge associations
Challenge.hasMany(ChallengeEntry, { foreignKey: 'challengeId', as: 'challengeEntries' });
Challenge.hasMany(WalletTransaction, { foreignKey: 'challengeId', as: 'transactions' });
Challenge.hasMany(CryptoPayment, { foreignKey: 'challengeId', as: 'cryptoPayments' });

// ChallengeEntry associations
ChallengeEntry.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ChallengeEntry.belongsTo(Challenge, { foreignKey: 'challengeId', as: 'challenge' });
ChallengeEntry.hasMany(Trade, { foreignKey: 'challengeEntryId', as: 'trades' });

// Trade associations
Trade.belongsTo(ChallengeEntry, { foreignKey: 'challengeEntryId', as: 'challengeEntry' });

// WalletTransaction associations
WalletTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WalletTransaction.belongsTo(Challenge, { foreignKey: 'challengeId', as: 'challenge' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'notificationUser' });

// CryptoWallet associations
CryptoWallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// CryptoPayment associations
CryptoPayment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CryptoPayment.belongsTo(Challenge, { foreignKey: 'challengeId', as: 'challenge' });

// Export models
export {
  sequelize,
  User,
  Challenge,
  ChallengeEntry,
  Trade,
  WalletTransaction,
  Notification,
  CryptoWallet,
  CryptoPayment
};

// Initialize database
export const initDatabase = async (sync = false) => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    if (sync) {
      // Sync all models with the database (use with caution in production)
      await sequelize.sync({ alter: true });
      console.log('Database synchronized successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}; 