/**
 * Script to check cTrader environment variables
 */
const dotenv = require('dotenv');
dotenv.config();

console.log('CTRADER ENVIRONMENT VARIABLES:');
console.log('------------------------------');
console.log(`CTRADER_API_URL: ${process.env.CTRADER_API_URL || 'NOT SET'}`);
console.log(`CTRADER_CLIENT_ID: ${process.env.CTRADER_CLIENT_ID ? '****' + process.env.CTRADER_CLIENT_ID.substring(process.env.CTRADER_CLIENT_ID.length - 4) : 'NOT SET'}`);
console.log(`CTRADER_CLIENT_SECRET: ${process.env.CTRADER_CLIENT_SECRET ? '********' : 'NOT SET'}`);
console.log(`CTRADER_REDIRECT_URI: ${process.env.CTRADER_REDIRECT_URI || 'NOT SET'}`);
console.log(`CTRADER_WS_URL: ${process.env.CTRADER_WS_URL || 'NOT SET'}`); 