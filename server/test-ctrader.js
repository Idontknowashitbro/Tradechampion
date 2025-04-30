/**
 * cTrader API Connection Test
 * 
 * This script tests the cTrader API connection to verify credentials and connectivity.
 * 
 * Usage: node test-ctrader.js
 */

const axios = require('axios');
const dotenv = require('dotenv');
const dns = require('dns');
const { exec } = require('child_process');
const url = require('url');

// Load environment variables
dotenv.config();

// Check environment variables
const {
  CTRADER_API_URL,
  CTRADER_CLIENT_ID,
  CTRADER_CLIENT_SECRET,
  CTRADER_REDIRECT_URI,
  CTRADER_WS_URL
} = process.env;

// Utility to get hostname from URL
function getHostname(urlString) {
  try {
    return url.parse(urlString).hostname;
  } catch (error) {
    return urlString;
  }
}

// Promise wrapper for DNS lookup
function dnsLookup(hostname) {
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, (err, address) => {
      if (err) reject(err);
      else resolve(address);
    });
  });
}

// Promise wrapper for ping
function pingHost(hostname) {
  return new Promise((resolve, reject) => {
    // Use the appropriate ping command based on OS
    const isWindows = process.platform === 'win32';
    const cmd = isWindows
      ? `ping -n 1 ${hostname}`
      : `ping -c 1 ${hostname}`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
}

async function runTests() {
  console.log('🔍 cTrader API Connection Test');
  console.log('=============================\n');

  // Check environment variables
  console.log('📋 Environment Variables Check:');
  let hasErrors = false;

  if (!CTRADER_API_URL) {
    console.error('❌ CTRADER_API_URL is missing');
    hasErrors = true;
  } else {
    console.log('✅ CTRADER_API_URL:', CTRADER_API_URL);
  }

  if (!CTRADER_CLIENT_ID) {
    console.error('❌ CTRADER_CLIENT_ID is missing');
    hasErrors = true;
  } else {
    console.log('✅ CTRADER_CLIENT_ID:', CTRADER_CLIENT_ID.substring(0, 10) + '...');
  }

  if (!CTRADER_CLIENT_SECRET) {
    console.error('❌ CTRADER_CLIENT_SECRET is missing');
    hasErrors = true;
  } else {
    console.log('✅ CTRADER_CLIENT_SECRET:', '*'.repeat(10));
  }

  if (!CTRADER_REDIRECT_URI) {
    console.error('❌ CTRADER_REDIRECT_URI is missing');
    hasErrors = true;
  } else {
    console.log('✅ CTRADER_REDIRECT_URI:', CTRADER_REDIRECT_URI);
  }

  if (!CTRADER_WS_URL) {
    console.error('❌ CTRADER_WS_URL is missing');
    hasErrors = true;
  } else {
    console.log('✅ CTRADER_WS_URL:', CTRADER_WS_URL);
  }

  console.log('\n');

  if (hasErrors) {
    console.error('❌ Environment variables check failed. Please check your .env file.');
    return;
  }

  // Check DNS resolution
  console.log('🔍 DNS Resolution Test:');
  const apiHostname = getHostname(CTRADER_API_URL);
  const wsHostname = getHostname(CTRADER_WS_URL);
  
  try {
    const apiIp = await dnsLookup(apiHostname);
    console.log(`✅ ${apiHostname} resolves to ${apiIp}`);
  } catch (error) {
    console.error(`❌ ${apiHostname} DNS resolution failed:`, error.message);
    hasErrors = true;
    
    // Print additional DNS troubleshooting info
    console.log('\n📌 Troubleshooting Suggestions:');
    console.log('1. Check your internet connection');
    console.log('2. Try using a public DNS server (e.g., 8.8.8.8 or 1.1.1.1)');
    console.log('3. Verify the domain name is correct (api.ctrader.com)');
    console.log('4. Check if the domain is accessible from your location/network');
  }
  
  try {
    const wsIp = await dnsLookup(wsHostname);
    console.log(`✅ ${wsHostname} resolves to ${wsIp}`);
  } catch (error) {
    console.error(`❌ ${wsHostname} DNS resolution failed:`, error.message);
    hasErrors = true;
  }
  
  console.log('\n');
  
  // Ping test
  console.log('🔄 Ping Test:');
  try {
    const apiPingResult = await pingHost(apiHostname);
    console.log(`✅ ${apiHostname} ping successful`);
  } catch (error) {
    console.error(`❌ ${apiHostname} ping failed`);
    hasErrors = true;
  }
  
  try {
    const wsPingResult = await pingHost(wsHostname);
    console.log(`✅ ${wsHostname} ping successful`);
  } catch (error) {
    console.error(`❌ ${wsHostname} ping failed`);
    hasErrors = true;
  }
  
  console.log('\n');

  // Check API connectivity
  console.log('🌐 API Connectivity Test:');
  try {
    const response = await axios.get(`${CTRADER_API_URL}/ping`, {
      validateStatus: () => true,
      timeout: 5000
    });

    if (response.status >= 200 && response.status < 500) {
      console.log('✅ cTrader API is reachable');
    } else {
      console.error('❌ cTrader API connectivity test failed with status:', response.status);
      hasErrors = true;
    }
  } catch (error) {
    console.error('❌ cTrader API connectivity test failed:', error.message);
    
    // Provide more specific error information
    if (error.code === 'ENOTFOUND') {
      console.error('   The cTrader API domain could not be resolved. DNS resolution failed.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   Connection was refused. The server might be down or not accepting connections.');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'TIMEOUT') {
      console.error('   Connection timed out. The server might be unreachable or busy.');
    }
    
    hasErrors = true;
  }

  console.log('\n');

  if (hasErrors) {
    console.error('❌ Some tests failed. Please fix the issues above before continuing.');
    console.log('\n📌 Connection Troubleshooting:');
    console.log('1. Verify your internet connection is working properly');
    console.log('2. Check if you can access https://ctrader.com in your browser');
    console.log('3. Verify if the cTrader API is currently available');
    console.log('4. Check if you need to configure a proxy to access external APIs');
    console.log('5. Consider using a different DNS server or check your network firewall');
  } else {
    console.log('✅ All tests passed!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the server with "npm run dev"');
    console.log('2. Try connecting a cTrader account through the UI');
    console.log('3. Check server logs for detailed debugging information');
  }

  console.log('\n🔗 Authorization URL for manual testing:');
  const authUrl = `${CTRADER_API_URL}/oauth/authorize?response_type=code&client_id=${CTRADER_CLIENT_ID}&redirect_uri=${encodeURIComponent(CTRADER_REDIRECT_URI)}&scope=accounts`;
  console.log(authUrl);
}

runTests().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
}); 