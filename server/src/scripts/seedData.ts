import { User, Challenge, ChallengeEntry, WalletTransaction } from '../models';
import bcrypt from 'bcryptjs';
import createAdminUser from './createAdmin';

const seedData = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Create admin user if it doesn't exist
    await createAdminUser();
    
    // Create regular user if it doesn't exist
    let regularUser = await User.findOne({
      where: { email: 'user@example.com' }
    });
    
    if (!regularUser) {
      console.log('Creating regular user...');
      regularUser = await User.create({
        name: 'Regular User',
        email: 'user@example.com',
        password: bcrypt.hashSync('user123', 10),
        role: 'user',
        walletBalance: 500,
        status: 'active'
      });
      console.log(`Regular user created with ID: ${regularUser.id}`);
    } else {
      console.log(`Regular user already exists with ID: ${regularUser.id}`);
    }
    
    // Create challenges if they don't exist
    const challengeCount = await Challenge.count();
    
    if (challengeCount === 0) {
      console.log('Creating sample challenges...');
      
      const challenges = await Promise.all([
        Challenge.create({
          name: 'Forex Trading Challenge',
          description: 'Test your forex trading skills in this 30-day challenge.',
          type: 'forex',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          entryFee: 100,
          prizePool: 5000,
          maxParticipants: 50,
          rules: JSON.stringify({
            maxDrawdown: 10,
            profitTarget: 15,
            minTradingDays: 20,
            maxRiskPerTrade: 2
          })
        }),
        Challenge.create({
          name: 'Crypto Trading Competition',
          description: 'Trade cryptocurrencies and compete for the highest returns.',
          type: 'crypto',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          entryFee: 50,
          prizePool: 2500,
          maxParticipants: 100,
          rules: JSON.stringify({
            maxDrawdown: 15,
            profitTarget: 20,
            minTradingDays: 10,
            maxRiskPerTrade: 5
          })
        }),
        Challenge.create({
          name: 'Stock Market Challenge',
          description: 'Test your stock picking skills in this long-term challenge.',
          type: 'stocks',
          status: 'upcoming',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          entryFee: 200,
          prizePool: 10000,
          maxParticipants: 25,
          rules: JSON.stringify({
            maxDrawdown: 12,
            profitTarget: 25,
            minTradingDays: 30,
            maxRiskPerTrade: 3
          })
        })
      ]);
      
      console.log(`Created ${challenges.length} sample challenges`);
      
      // Create a challenge entry for the regular user
      if (regularUser) {
        console.log('Creating sample challenge entry...');
        
        const entry = await ChallengeEntry.create({
          userId: regularUser.id,
          challengeId: challenges[0].id,
          status: 'active',
          startBalance: 10000,
          currentBalance: 10500,
          pnlPercentage: 5,
          maxDrawdown: 3,
          startDate: new Date(),
          lastUpdated: new Date()
        });
        
        console.log(`Created challenge entry with ID: ${entry.id}`);
        
        // Create wallet transactions for the regular user
        console.log('Creating sample wallet transactions...');
        
        await WalletTransaction.create({
          userId: regularUser.id,
          type: 'deposit',
          amount: 500,
          description: 'Initial deposit',
          status: 'completed',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
        });
        
        await WalletTransaction.create({
          userId: regularUser.id,
          type: 'fee',
          amount: -100,
          description: 'Challenge entry fee',
          status: 'completed',
          challengeId: challenges[0].id,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        });
        
        console.log('Created sample wallet transactions');
      }
    } else {
      console.log(`${challengeCount} challenges already exist, skipping creation`);
    }
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  seedData().then(() => {
    console.log('Done!');
    process.exit(0);
  }).catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
}

export default seedData;
