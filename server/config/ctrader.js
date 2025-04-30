/**
 * cTrader API Configuration
 */
const ctraderConfig = {
  apiUrl: process.env.CTRADER_API_URL || 'https://api.ctrader.com',
  clientId: process.env.CTRADER_CLIENT_ID,
  clientSecret: process.env.CTRADER_CLIENT_SECRET,
  redirectUri: process.env.CTRADER_REDIRECT_URI || 'http://localhost:5002/api/ctrader/callback',
  scope: 'accounts profile trades'
};

module.exports = ctraderConfig; 