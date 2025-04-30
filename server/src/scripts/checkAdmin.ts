import { User } from '../models';

const checkAdminUser = async () => {
  try {
    console.log('Checking admin user...');
    
    // Find admin user
    const adminUser = await User.findOne({
      where: { email: 'admin@example.com' }
    });
    
    if (!adminUser) {
      console.log('Admin user not found!');
      return;
    }
    
    console.log('Admin user found:');
    console.log(`- Name: ${adminUser.name}`);
    console.log(`- Email: ${adminUser.email}`);
    console.log(`- Role: ${adminUser.role}`);
    console.log(`- ID: ${adminUser.id}`);
    
    // Check if role is correct
    if (adminUser.role !== 'admin') {
      console.log('Updating user role to admin...');
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('User role updated to admin successfully!');
    } else {
      console.log('User already has admin role.');
    }
    
  } catch (error) {
    console.error('Error checking admin user:', error);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  checkAdminUser().then(() => {
    console.log('Done!');
    process.exit(0);
  }).catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
}

export default checkAdminUser;
