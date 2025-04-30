/**
 * Test script for cTrader authentication endpoints
 */
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Test the /api/ctrader/auth-url endpoint
async function testAuthUrlEndpoint() {
  try {
    console.log('Testing /api/ctrader/auth-url endpoint...');
    
    // Create a mock token (this would normally come from authentication)
    const mockToken = 'mock_token_for_testing';
    
    const response = await axios.get('http://localhost:5002/api/ctrader/auth-url', {
      headers: {
        Authorization: `Bearer ${mockToken}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data && response.data.url) {
      console.log('✅ Success! Received authorization URL');
    } else {
      console.log('❌ Failed to get authorization URL');
    }
  } catch (error) {
    console.error('❌ Error testing auth-url endpoint:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
  }
}

// Test the /api/ctrader/connect endpoint
async function testConnectEndpoint() {
  try {
    console.log('\nTesting /api/ctrader/connect endpoint...');
    
    // Create a mock token (this would normally come from authentication)
    const mockToken = 'mock_token_for_testing';
    
    // Mock data for connecting an account
    const mockData = {
      challengeEntryId: 1, // Replace with a valid challenge entry ID
      accountId: 'test_account_123'
    };
    
    const response = await axios.post('http://localhost:5002/api/ctrader/connect', mockData, {
      headers: {
        Authorization: `Bearer ${mockToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data && response.data.url) {
      console.log('✅ Success! Received authorization URL');
    } else {
      console.log('❌ Failed to get authorization URL');
    }
  } catch (error) {
    console.error('❌ Error testing connect endpoint:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run tests
async function runTests() {
  console.log('=== cTrader Authentication API Test ===\n');
  
  // Test the endpoints
  await testAuthUrlEndpoint();
  await testConnectEndpoint();
  
  console.log('\n=== Test completed ===');
}

runTests(); 