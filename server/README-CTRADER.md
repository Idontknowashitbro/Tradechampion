# cTrader API Integration

## Overview

This implementation provides integration with the cTrader Open API to enable automatic trade tracking for TradeChampionX users. The integration allows users to:

1. Connect their cTrader accounts to TradeChampionX
2. Automatically track trades for challenges
3. View account information and metrics

## Features

- OAuth2 authorization flow for secure authentication
- Automatic token refresh to maintain API access
- Account data synchronization
- REST API endpoints for frontend integration

## Implementation Components

### Backend Files

- `controllers/ctraderController.ts` - Handles API requests and responses
- `services/ctraderService.ts` - Interacts with cTrader API
- `services/tokenRefreshService.ts` - Manages token refresh scheduling
- `routes/ctraderRoutes.ts` - Defines API routes
- `middleware/authMiddleware.ts` - Provides JWT authentication
- `models/User.ts` - Includes cTrader credentials in user model
- `types/socket.d.ts` - Type definitions for socket functions

### Frontend Files

- `components/CtraderConnect.tsx` - React component for connecting to cTrader
- Dashboard integration - For displaying cTrader connection status

### Testing/Documentation

- `test-api.js` - Test script for verifying API functionality
- `docs/CTRADER_INTEGRATION.md` - Comprehensive implementation guide
- `server/docs/ctrader-integration.md` - Technical documentation

## Implementation Details

### Storage Approach

cTrader data is stored in the database as a JSON string to accommodate various database systems:

```typescript
// User model
ctrader: {
  type: DataTypes.TEXT, // Store as text to ensure compatibility
  allowNull: true,
  defaultValue: JSON.stringify({
    isConnected: false,
    accounts: []
  }),
  get() {
    const rawValue = this.getDataValue('ctrader');
    if (!rawValue) return null;
    return rawValue;
  },
  set(value: CTraderCredentials | string) {
    if (typeof value === 'object') {
      this.setDataValue('ctrader', JSON.stringify(value));
    } else {
      this.setDataValue('ctrader', value);
    }
  }
}
```

The User model provides a helper method to access cTrader data:

```typescript
// Get cTrader data as object
public getCtraderData(): CTraderCredentials {
  if (!this.ctrader) {
    return {
      isConnected: false,
      accounts: []
    };
  }
  
  if (typeof this.ctrader === 'string') {
    try {
      return JSON.parse(this.ctrader);
    } catch (e) {
      console.error('Error parsing cTrader data:', e);
      return {
        isConnected: false,
        accounts: []
      };
    }
  }
  
  return this.ctrader;
}
```

### Token Refresh Strategy

The token refresh service automatically refreshes tokens before they expire:

1. A cron job runs at configured intervals (default: 30 minutes)
2. It checks for users with tokens expiring within the next hour
3. It invokes the token refresh process for these users
4. It logs success and failure for monitoring

### Socket Notifications

Real-time updates are provided via Socket.IO:

```typescript
// When a trade is processed
socketService.to(userId.toString()).emit('tradeClosed', {
  id: trade.id,
  symbol: trade.symbol,
  pnl: trade.pnl,
  entryTime: trade.entryTime,
  exitTime: trade.exitTime
});

// When metrics are updated
socketService.to(userId.toString()).emit('metricsUpdate', {
  challengeEntryId,
  metrics: updatedEntry.metrics
});
```

## Configuration

Required environment variables:

```
CTRADER_API_URL=https://api.ctrader.com
CTRADER_CLIENT_ID=your_client_id
CTRADER_CLIENT_SECRET=your_client_secret
CTRADER_REDIRECT_URI=http://localhost:5002/api/ctrader/callback
TOKEN_REFRESH_INTERVAL=30
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ctrader/auth-url` | GET | Generates the authorization URL for OAuth |
| `/api/ctrader/callback` | GET | Handles the OAuth callback |
| `/api/ctrader/disconnect` | POST | Disconnects a user's cTrader account |
| `/api/ctrader/status` | GET | Gets the current connection status |
| `/api/ctrader/connect-challenge` | POST | Connects a cTrader account to a challenge entry |
| `/api/ctrader/disconnect-challenge/:challengeEntryId` | POST | Disconnects a cTrader account from a challenge entry |

## Usage

### Connecting a cTrader Account

1. User navigates to the Connections tab in the Dashboard
2. User clicks "Connect cTrader Account"
3. User is redirected to cTrader for authorization
4. After approval, user is redirected back to the application
5. Tokens are securely stored and the account is connected

### Automatic Trade Tracking

Once connected:
- Trades are automatically imported from cTrader
- Challenge metrics are updated in real-time
- Token refresh occurs automatically to maintain connection

## Dependencies

- axios: For HTTP requests to cTrader API
- cron: For scheduling token refresh
- jsonwebtoken: For JWT authentication
- sequelize: For database operations

## Testing

To test the cTrader integration:

```bash
# Run the test script
node test-api.js

# Test with an authorization code
node test-api.js --code=YOUR_AUTH_CODE
```

## Security Considerations

- Tokens are stored securely in the database
- All API requests require authentication
- HTTPS is used for all communication
- Token refresh is handled automatically

## Implementation Notes

1. The cTrader Open API requires an active connection maintained through a refresh token
2. Rate limits apply to the API (50 requests per second for non-historical data, 5 for historical)
3. The implementation follows OAuth2 best practices for security
4. Token refresh is scheduled to occur before expiration to prevent interruptions

---

For detailed implementation instructions, see the [comprehensive integration guide](../docs/CTRADER_INTEGRATION.md). 