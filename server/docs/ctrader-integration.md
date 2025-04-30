# cTrader API Integration

This document outlines the implementation of the cTrader API integration in TradeChampionX.

## Overview

The cTrader API integration allows users to connect their cTrader accounts to the TradeChampionX platform. This connection enables automatic tracking of trades for challenges, leaderboards, and other platform features.

## Architecture

The integration consists of several components:

1. **cTrader Controller**: Handles HTTP requests related to cTrader integration
2. **cTrader Service**: Provides methods for interacting with the cTrader API
3. **Token Refresh Service**: Automatically refreshes access tokens before they expire
4. **User Model**: Stores cTrader credentials and account information

## Environment Configuration

The following environment variables must be set in the `.env` file:

```
CTRADER_API_URL=https://api.ctrader.com
CTRADER_CLIENT_ID=your_client_id
CTRADER_CLIENT_SECRET=your_client_secret
CTRADER_REDIRECT_URI=http://localhost:5002/api/ctrader/callback
TOKEN_REFRESH_INTERVAL=30
```

## OAuth2 Flow

The integration uses the OAuth2 authorization code flow:

1. User clicks "Connect cTrader" in the TradeChampionX UI
2. User is redirected to the cTrader authorization page
3. User approves access to their account
4. cTrader redirects back to our application with an authorization code
5. Our server exchanges the code for access and refresh tokens
6. Tokens are stored in the user's profile

## API Endpoints

The following endpoints are available for cTrader integration:

- `GET /api/ctrader/auth-url`: Generate authorization URL for cTrader OAuth
- `GET /api/ctrader/callback`: Handle OAuth callback from cTrader
- `POST /api/ctrader/disconnect`: Disconnect cTrader account
- `GET /api/ctrader/status`: Get account status and info

## Token Management

Access tokens for cTrader expire after a specific period. To handle this, the application:

1. Stores both access and refresh tokens in the database
2. Tracks token expiry time
3. Automatically refreshes tokens before they expire
4. Handles token refresh failures gracefully

## Data Synchronization

Once connected, the application periodically:

1. Fetches account details and positions
2. Synchronizes trade data with the TradeChampionX database
3. Updates metrics for challenges and leaderboards

## Error Handling

The integration includes comprehensive error handling:

1. Connection failures
2. Token refresh failures
3. API rate limiting
4. Account suspension or removal

## Security Considerations

To maintain security:

1. Tokens are stored securely in the database
2. Communication with cTrader is over HTTPS
3. User authentication is required for all cTrader-related operations
4. Minimal necessary permissions are requested from cTrader

## Testing

To test the integration:

1. Use cTrader demo accounts for development and testing
2. Create test users in the TradeChampionX platform
3. Connect test accounts using the OAuth flow
4. Verify data synchronization works correctly

## Troubleshooting

Common issues and solutions:

1. **Connection failures**: Check network connectivity and cTrader API status
2. **Authentication errors**: Verify client ID and secret are correct
3. **Token refresh failures**: Check if refresh token is valid
4. **Rate limiting**: Implement appropriate backoff strategies

## References

- [cTrader Open API Documentation](https://help.ctrader.com/open-api/)
- [OAuth2 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/) 