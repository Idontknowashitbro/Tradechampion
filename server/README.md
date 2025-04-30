# TradeChampionX API - Backend Server

This is the backend API server for the TradeChampionX trading challenge platform.

## Technology Stack

- **Framework**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Realtime**: Socket.IO

## Project Structure

```
server/
├── src/                # Source code
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── index.ts        # Entry point
├── dist/               # Compiled JavaScript code
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd trade-challenge-hub-main/server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   
   # Database
   DB_NAME=tradechampionx
   DB_USER=postgres
   DB_PASS=postgres
   DB_HOST=localhost
   DB_PORT=5432
   
   # JWT
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=1d
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```
5. Create the database:
   ```
   createdb tradechampionx
   ```
   
### Running the Server

#### Development mode:
```
npm run dev
```

#### Production mode:
```
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get token
- `POST /api/auth/update-crypto-address` - Update crypto address

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/:id` - Update user (admin only)
- `PATCH /api/users/:id/status` - Ban/unban user (admin only)
- `PATCH /api/users/:id/wallet` - Update user wallet balance (admin only)

### Challenges
- `GET /api/challenges` - Get all active challenges
- `GET /api/challenges/:id` - Get challenge details
- `POST /api/challenges` - Create a new challenge (admin only)
- `PUT /api/challenges/:id` - Update a challenge (admin only)
- `DELETE /api/challenges/:id` - Delete a challenge (admin only)
- `PATCH /api/challenges/:id/status` - Update challenge status (admin only)

### Challenge Entries
- `POST /api/challenge-entries` - Enter a challenge
- `GET /api/challenge-entries/:id` - Get challenge entry details
- `GET /api/challenge-entries/user` - Get current user's challenge entries
- `PATCH /api/challenge-entries/:id/connect` - Update cTrader connection status

### Trades
- `GET /api/trades/:challengeEntryId` - Get trades for a challenge entry
- `POST /api/trades` - Log a new trade (internal use only)

### Wallet
- `GET /api/wallet/transactions` - Get current user's wallet transactions
- `POST /api/wallet/pay` - Use wallet credits for a challenge entry

### Notifications
- `GET /api/notifications` - Get current user's notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `POST /api/notifications` - Send a notification (admin only)

### Leaderboard
- `GET /api/leaderboards/:challengeId` - Get leaderboard for a challenge

## WebSocket Events

The server uses Socket.IO for real-time updates.

### Client Events (received by server)
- `connect_ctrader` - Connect to cTrader account
- `disconnect_ctrader` - Disconnect from cTrader account

### Server Events (sent to clients)
- `trade_closed` - When a trade is closed
- `metrics_updated` - When user metrics are updated
- `leaderboard_updated` - When leaderboard changes
- `notification` - When a new notification is sent
- `disqualified` - When a user is disqualified from a challenge

## Database Models

- **User**: User account information
- **Challenge**: Trading challenge details
- **ChallengeEntry**: User entries into challenges
- **Trade**: Individual trade records
- **WalletTransaction**: Wallet credit transactions
- **Notification**: User notifications

## Features to Implement

- [ ] Integration with cTrader API
- [ ] Payment processing with NowPayments
- [ ] WebSocket handling for real-time trade data
- [ ] Disqualification system
- [ ] Leaderboard calculation
- [ ] Prize distribution system
- [ ] Discord bot integration

## cTrader Integration

This application integrates with cTrader's API to track trading activity for challenges. To set up cTrader integration:

1. Register as a cTrader API developer at [cTrader API Portal](https://connect.spotware.com/)
2. Create an application in the cTrader developer portal
3. Configure your application with these settings:
   - Application type: Web application
   - Redirect URI: `http://localhost:5002/api/ctrader/callback` (for development)
   - Required scopes: `accounts`, `profile`, `trades`
4. Get your Client ID and Client Secret from the cTrader developer portal
5. Set the following environment variables in your `.env` file:
   ```
   CTRADER_API_URL=https://api.ctrader.com
   CTRADER_CLIENT_ID=your_client_id
   CTRADER_CLIENT_SECRET=your_client_secret
   CTRADER_REDIRECT_URI=http://localhost:5002/api/ctrader/callback
   TOKEN_REFRESH_INTERVAL=30
   ```

### OAuth2 Flow

The application implements the OAuth2 flow for cTrader integration:

1. User clicks "Connect cTrader" in the application
2. User is redirected to cTrader's authorization page
3. User grants access to their cTrader account
4. cTrader redirects back to our callback URL with an authorization code
5. Our server exchanges the authorization code for access and refresh tokens
6. Tokens are securely stored and used to access the user's trading data

### WebSocket Connection

The application establishes a WebSocket connection to cTrader to receive real-time trade updates. This connection:

1. Listens for trade close events
2. Logs trade data to our database
3. Updates user metrics (PnL, drawdown, etc.)
4. Checks for rule violations that would result in disqualification

### Token Refresh

Access tokens from cTrader expire after a short period. The application automatically:

1. Refreshes access tokens using the refresh token
2. Updates stored tokens in the database
3. Notifies users if refresh tokens expire and reconnection is needed

## Recent Updates

### cTrader Integration (Phase 6)

We've implemented a comprehensive cTrader integration with the following features:

1. **OAuth2 Authorization Flow**
   - Secure authentication with cTrader accounts
   - Token storage and management
   - Automatic token refresh mechanism

2. **WebSocket Integration**
   - Real-time trade tracking
   - Trade metrics calculation (PnL%, drawdown%, etc.)
   - Automatic disqualification handling

3. **User Interface Components**
   - Account connection modal
   - Success and error handling pages
   - Clean user flow for connecting accounts

4. **Backend Services**
   - RESTful API endpoints for cTrader operations
   - Token refresh background service
   - Secure credential storage

The integration follows the OAuth2 flow:
1. User is prompted to enter their cTrader account ID
2. User is redirected to cTrader's authorization page
3. User grants access to their cTrader account
4. cTrader redirects back to our callback URL with an authorization code
5. Our server exchanges the authorization code for access and refresh tokens
6. Trade data is tracked through a WebSocket connection

### Next Steps

- Implement NowPayments API integration for cryptocurrency payments
- Complete the Discord bot for real-time notifications
- Enhance leaderboard with real-time updates

## License

This project is proprietary and not licensed for public use.