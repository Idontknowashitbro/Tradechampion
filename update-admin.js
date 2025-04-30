const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Create a connection to the SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: 'user'
  }
}, {
  tableName: 'users'
});

async function updateAdmin() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Find the user by email
    const user = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (user) {
      // Update the role to admin
      user.role = 'admin';
      await user.save();
      console.log('User role updated to admin');
      console.log(JSON.stringify(user.toJSON(), null, 2));
    } else {
      console.log('User not found');
      
      // List all users
      const users = await User.findAll();
      console.log('All users:');
      users.forEach(u => {
        console.log(`${u.email} - ${u.role}`);
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

updateAdmin();
