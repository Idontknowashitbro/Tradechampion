import { User } from '../models';
import sequelize from '../config/database';

async function checkAdminUser() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Checking for admin user...');
    const adminUser = await User.findOne({
      where: { email: 'admin@example.com' }
    });

    if (adminUser) {
      console.log('Admin user found:');
      console.log(`ID: ${adminUser.id}`);
      console.log(`Email: ${adminUser.email}`);
      console.log(`Name: ${adminUser.name}`);
      console.log(`Role: ${adminUser.role}`);
      console.log(`Status: ${adminUser.status}`);
      
      // Update the user to be an admin if not already
      if (adminUser.role !== 'admin') {
        console.log('Updating user to admin role...');
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('User updated to admin role successfully!');
      } else {
        console.log('User already has admin role.');
      }
    } else {
      console.log('Admin user not found.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking admin user:', error);
    process.exit(1);
  }
}

// Run the function
checkAdminUser();
