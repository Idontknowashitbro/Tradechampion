/**
 * Script to update the .env file with the correct cTrader API URL
 */
const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '.env');

try {
  console.log('Reading .env file...');
  let envContent = fs.readFileSync(envFilePath, 'utf8');
  
  // Replace api.ctrader.com with openapi.ctrader.com
  console.log('Updating cTrader API URL...');
  const updatedContent = envContent.replace(
    /CTRADER_API_URL=https:\/\/api\.ctrader\.com/g,
    'CTRADER_API_URL=https://openapi.ctrader.com'
  );
  
  // Write updated content back to .env file
  fs.writeFileSync(envFilePath, updatedContent, 'utf8');
  
  console.log('✅ Successfully updated .env file!');
  console.log('Old URL: https://api.ctrader.com');
  console.log('New URL: https://openapi.ctrader.com');
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
} 