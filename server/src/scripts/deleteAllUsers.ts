import { User } from '../models';
import sequelize from '../config/database';

async function deleteAllUsers() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Deleting all users...');
    const deletedCount = await User.destroy({
      where: {},
      truncate: true,
      cascade: true,
      force: true
    });

    console.log(`Successfully deleted all users. Count: ${deletedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error deleting users:', error);
    process.exit(1);
  }
}

// Run the function
deleteAllUsers();
