// Script to create an admin user
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Database setup
const dbPath = path.resolve(__dirname, '../database.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

// Define User model
const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  discordUsername: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  walletBalance: {
    type: Sequelize.DECIMAL(10, 2),
    defaultValue: 0,
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'active',
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: 'admin',
  },
});

async function createAdminUser() {
  try {
    // Check if database exists
    if (!fs.existsSync(dbPath)) {
      console.error('Database file not found. Please ensure your app has initialized the database.');
      return;
    }

    // Check if User table exists
    await sequelize.authenticate();
    
    // Create admin user
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Admin User',
        password: hashedPassword,
        discordUsername: 'AdminUser#1234',
        walletBalance: 1000,
        status: 'active',
        role: 'admin'
      }
    });
    
    if (created) {
      console.log('Admin user created successfully.');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdminUser(); 