import { User } from '../models';
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
  try {
    console.log('Checking for existing admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { role: 'admin' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`- Name: ${existingAdmin.name}`);
      console.log(`- Email: ${existingAdmin.email}`);
      console.log(`- ID: ${existingAdmin.id}`);
      return;
    }
    
    // Create admin user
    console.log('Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      walletBalance: 1000, // Give admin some initial balance
      status: 'active'
    });
    
    console.log('Admin user created successfully:');
    console.log(`- Name: ${adminUser.name}`);
    console.log(`- Email: ${adminUser.email}`);
    console.log(`- Password: admin123`);
    console.log(`- ID: ${adminUser.id}`);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  createAdminUser().then(() => {
    console.log('Done!');
    process.exit(0);
  }).catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
}

export default createAdminUser;
