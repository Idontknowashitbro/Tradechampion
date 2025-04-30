import sequelize from '../config/database';
import '../models'; // Import all models to ensure they're registered

const initDb = async () => {
  try {
    console.log('Initializing database...');
    
    // Sync all models with the database
    // Force: true will drop tables if they exist
    await sequelize.sync({ force: false });
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  initDb();
}

export default initDb;
