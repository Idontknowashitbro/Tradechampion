const { User } = require('./dist/models');

async function updateAdmin() {
  try {
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
    }
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    process.exit();
  }
}

updateAdmin();
