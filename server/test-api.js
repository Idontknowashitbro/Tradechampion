/**
 * Test script for cTrader API integration
 * 
 * To run: node test-api.js
 */

const axios = require('axios');
require('dotenv').config();

// Configuration
const API_URL = process.env.CTRADER_API_URL || 'https://api.ctrader.com';
const CLIENT_ID = process.env.CTRADER_CLIENT_ID;
const CLIENT_SECRET = process.env.CTRADER_CLIENT_SECRET;
const REDIRECT_URI = process.env.CTRADER_REDIRECT_URI || 'http://localhost:5002/api/ctrader/callback';

// Test OAuth authorization URL
function testGenerateAuthUrl() {
  console.log('\n=== Testing OAuth Authorization URL ===');
  
  const authUrl = `${API_URL}/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=accounts`;
  
  console.log(`Authorization URL:\n${authUrl}`);
  console.log('\nOpen this URL in a browser to test the OAuth flow manually.');
  
  return authUrl;
}

// Test token exchange (requires authorization code from manual testing)
async function testTokenExchange(code) {
  if (!code) {
    console.log('\n=== Token Exchange Test Skipped ===');
    console.log('No authorization code provided. To test token exchange:');
    console.log('1. Run this script with an authorization code:');
    console.log('   node test-api.js --code=YOUR_AUTH_CODE');
    return null;
  }
  
  console.log('\n=== Testing Token Exchange ===');
  
  try {
    // Create form data for token request
    const formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('client_id', CLIENT_ID);
    formData.append('client_secret', CLIENT_SECRET);
    formData.append('redirect_uri', REDIRECT_URI);
    
    // Make token request
    const response = await axios.post(`${API_URL}/oauth/token`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Token exchange successful:');
    console.log('- Access Token:', response.data.access_token.substring(0, 10) + '...');
    console.log('- Refresh Token:', response.data.refresh_token.substring(0, 10) + '...');
    console.log('- Expires In:', response.data.expires_in, 'seconds');
    console.log('- Token Type:', response.data.token_type);
    
    return response.data;
  } catch (error) {
    console.error('Token exchange failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    return null;
  }
}

// Test getting user accounts
async function testGetAccounts(accessToken) {
  if (!accessToken) {
    console.log('\n=== Get Accounts Test Skipped ===');
    console.log('No access token available.');
    return;
  }
  
  console.log('\n=== Testing Get Accounts ===');
  
  try {
    const response = await axios.get(`${API_URL}/accounts`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('Accounts retrieved successfully:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Failed to get accounts:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Test refreshing access token
async function testRefreshToken(refreshToken) {
  if (!refreshToken) {
    console.log('\n=== Refresh Token Test Skipped ===');
    console.log('No refresh token available.');
    return null;
  }
  
  console.log('\n=== Testing Token Refresh ===');
  
  try {
    // Create form data for token refresh
    const formData = new URLSearchParams();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshToken);
    formData.append('client_id', CLIENT_ID);
    formData.append('client_secret', CLIENT_SECRET);
    
    // Make token refresh request
    const response = await axios.post(`${API_URL}/oauth/token`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Token refresh successful:');
    console.log('- New Access Token:', response.data.access_token.substring(0, 10) + '...');
    console.log('- New Refresh Token:', response.data.refresh_token.substring(0, 10) + '...');
    console.log('- Expires In:', response.data.expires_in, 'seconds');
    
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('=== cTrader API Integration Tests ===');
  console.log(`Using API URL: ${API_URL}`);
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Error: CLIENT_ID and CLIENT_SECRET must be set in .env file');
    return;
  }
  
  // Check for authorization code from command line
  let authCode = null;
  process.argv.forEach(arg => {
    if (arg.startsWith('--code=')) {
      authCode = arg.split('=')[1];
    }
  });
  
  // Generate and display authorization URL
  testGenerateAuthUrl();
  
  // If auth code provided, test token exchange
  if (authCode) {
    const tokenData = await testTokenExchange(authCode);
    
    // If token exchange successful, test get accounts
    if (tokenData && tokenData.access_token) {
      await testGetAccounts(tokenData.access_token);
      
      // Test token refresh
      if (tokenData.refresh_token) {
        const refreshData = await testRefreshToken(tokenData.refresh_token);
        
        // Test get accounts with new token if refresh successful
        if (refreshData && refreshData.access_token) {
          await testGetAccounts(refreshData.access_token);
        }
      }
    }
  }
  
  console.log('\n=== Tests Complete ===');
}

// Run the tests
runTests().catch(console.error); 