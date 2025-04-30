# cTrader API Integration Guide

This document provides a comprehensive guide for implementing cTrader API integration in TradeChampionX.

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Setting Up The Environment](#setting-up-the-environment)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## Introduction

The cTrader API integration allows users to connect their cTrader accounts to TradeChampionX, enabling automatic trade tracking for challenges, leaderboards, and other platform features.

This integration follows the OAuth2 authorization code flow and includes token management for secure access to the API.

## Prerequisites

Before starting the implementation, you need:

1. A cTrader developer account
2. Client ID and Client Secret from cTrader Developer Portal
3. Node.js and TypeScript installed
4. MongoDB database
5. Understanding of OAuth2 authentication flow

## Setting Up The Environment

1. Create a `.env` file in the server root directory with the following variables:

```
CTRADER_API_URL=https://api.ctrader.com
CTRADER_CLIENT_ID=your_client_id
CTRADER_CLIENT_SECRET=your_client_secret
CTRADER_REDIRECT_URI=http://localhost:5002/api/ctrader/callback
TOKEN_REFRESH_INTERVAL=30
PORT=5002
MONGODB_URI=mongodb://localhost:27017/tradechampionx
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key
NODE_ENV=development
```

2. Install the required packages:

```bash
cd server
npm install axios cron dotenv 
npm install @types/cron --save-dev
```

## Backend Implementation

### 1. User Model Update

Update the User model to include cTrader credentials:

```typescript
// In models/User.ts
interface CTraderAccount {
  accountId: string;
  accountNumber: string;
  broker: string;
  accountType: 'demo' | 'live';
  balance: number;
  currency: string;
}

interface CTraderCredentials {
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  isConnected: boolean;
  accounts: CTraderAccount[];
}

// Add to UserAttributes interface:
ctrader?: CTraderCredentials;

// Add to User model initialization:
ctrader: {
  type: DataTypes.JSON,
  allowNull: true,
  defaultValue: {
    isConnected: false,
    accounts: []
  }
}
```

### 2. Create cTrader Service

Create a service to handle interactions with the cTrader API:

```typescript
// In services/ctraderService.ts
import axios from 'axios';
import * as querystring from 'querystring';
import dotenv from 'dotenv';

dotenv.config();

const {
  CTRADER_API_URL,
  CTRADER_CLIENT_ID,
  CTRADER_CLIENT_SECRET,
} = process.env;

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

class CtraderService {
  public async exchangeAuthCode(code: string, redirectUri: string): Promise<TokenResponse> {
    // Implementation for exchanging auth code for tokens
  }

  public async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    // Implementation for refreshing access token
  }

  public async getAccounts(accessToken: string): Promise<any[]> {
    // Implementation for fetching user accounts
  }

  public async getAccountDetails(accessToken: string, accountId: string): Promise<any> {
    // Implementation for fetching account details
  }

  public async getAccountPositions(accessToken: string, accountId: string): Promise<any[]> {
    // Implementation for fetching account positions
  }

  public async getAccountHistory(
    accessToken: string,
    accountId: string,
    from: string,
    to: string
  ): Promise<any[]> {
    // Implementation for fetching account trade history
  }
}

export default new CtraderService();
```

### 3. Create Token Refresh Service

Create a service to periodically refresh tokens:

```typescript
// In services/tokenRefreshService.ts
import { CronJob } from 'cron';
import User from '../models/User';
import ctraderController from '../controllers/ctraderController';
import { Op } from 'sequelize';

class TokenRefreshService {
  private job: CronJob | null = null;

  public startScheduler(intervalMinutes: number = 30): void {
    // Implementation for starting the scheduler
  }

  public stopScheduler(): void {
    // Implementation for stopping the scheduler
  }

  private async refreshTokens(): Promise<void> {
    // Implementation for refreshing tokens
  }
}

export default new TokenRefreshService();
```

### 4. Create cTrader Controller

Create a controller to handle API requests:

```typescript
// In controllers/ctraderController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import ctraderService from '../services/ctraderService';
import dotenv from 'dotenv';

class CtraderController {
  public getAuthUrl(req: Request, res: Response): void {
    // Implementation for generating auth URL
  }

  public async handleCallback(req: Request, res: Response): Promise<void> {
    // Implementation for handling OAuth callback
  }

  private async fetchAndSaveAccountInfo(userId: string, accessToken: string): Promise<void> {
    // Implementation for fetching and saving account info
  }

  public async refreshToken(userId: string): Promise<string | null> {
    // Implementation for refreshing token
  }

  public async disconnectAccount(req: Request, res: Response): Promise<void> {
    // Implementation for disconnecting account
  }

  public async getAccountStatus(req: Request, res: Response): Promise<void> {
    // Implementation for getting account status
  }
}

export default new CtraderController();
```

### 5. Create Authentication Middleware

Create middleware for authenticating API requests:

```typescript
// In middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> {
  // Implementation for JWT authentication
};
```

### 6. Create API Routes

Create routes for the cTrader API:

```typescript
// In routes/ctraderRoutes.ts
import express from 'express';
import ctraderController from '../controllers/ctraderController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/auth-url', authenticateJWT, ctraderController.getAuthUrl);
router.get('/callback', authenticateJWT, ctraderController.handleCallback);
router.post('/disconnect', authenticateJWT, ctraderController.disconnectAccount);
router.get('/status', authenticateJWT, ctraderController.getAccountStatus);

export default router;
```

### 7. Register the Routes

Register the cTrader routes in the main app:

```typescript
// In index.ts
import ctraderRoutes from './routes/ctraderRoutes';

// ...

app.use('/api/ctrader', ctraderRoutes);
```

## Frontend Implementation

### 1. Create CtraderConnect Component

Create a React component for connecting to cTrader:

```tsx
// In components/CtraderConnect.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import api from '../lib/api';

const CtraderConnect: React.FC = () => {
  // Implementation for connecting to cTrader
};

export default CtraderConnect;
```

### 2. Add Component to Dashboard

Add the CtraderConnect component to the Dashboard page:

```tsx
// In pages/Dashboard.tsx
import CtraderConnect from '../components/CtraderConnect';

// Add a new tab for Connections in the TabsList:
<TabsList>
  {/* Other tabs */}
  <TabsTrigger value="connections">Connections</TabsTrigger>
</TabsList>

// Add a new TabsContent for Connections:
<TabsContent value="connections">
  <Card>
    <CardHeader>
      <CardTitle>Trading Connections</CardTitle>
      <CardDescription>Connect your trading accounts to automate trade tracking</CardDescription>
    </CardHeader>
    <CardContent>
      <CtraderConnect />
    </CardContent>
  </Card>
</TabsContent>
```

## Testing

1. **Local Testing**
   - Set up a cTrader developer account
   - Create test users in your application
   - Test the full OAuth flow
   - Verify token refresh functionality
   - Test disconnecting accounts

2. **Integration Testing**
   - Test with real cTrader accounts
   - Verify trade data synchronization
   - Test error handling and edge cases

## Deployment

1. **Environment Configuration**
   - Update production environment variables
   - Ensure HTTPS is enabled for OAuth security
   - Update redirect URIs to production URLs

2. **Security Measures**
   - Secure storage of tokens and sensitive data
   - Implement rate limiting for API requests
   - Regular token rotation and validation

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check client ID and secret
   - Verify redirect URI matches exactly

2. **Token Refresh Failures**
   - Check if refresh token is still valid
   - Verify cTrader service is online

3. **API Rate Limiting**
   - Implement exponential backoff
   - Monitor API usage carefully

### Debugging Tips

1. Enable detailed logging for OAuth flow
2. Monitor token refresh operations
3. Test with demo accounts before live accounts
4. Validate all API responses for error conditions

## Resources

- [cTrader Open API Documentation](https://help.ctrader.com/open-api/)
- [OAuth2 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)
- [JWT Authentication Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/) 