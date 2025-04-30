# cTrader Connection Troubleshooting Guide

## Issue: "Failed to get authorization URL from server"

This error occurs when the frontend application cannot get a response from the server's cTrader authentication endpoints.

## Solution Steps

### 1. Verify Backend Server Is Running

The frontend is running at http://localhost:8081, but the backend server should be running at http://localhost:5002.

```bash
# Navigate to the server directory
cd trade-challenge-hub-main/server

# Install dependencies if not already installed
npm install

# Start the server
npm run dev
# or
npx nodemon src/index.ts
```

### 2. Check Server Logs

Look for any error messages in the server console that might indicate why the cTrader connection is failing.

### 3. Verify Environment Variables

Ensure all required cTrader API credentials are properly set in the `.env` file:

```
CTRADER_API_URL=https://openapi.ctrader.com
CTRADER_CLIENT_ID=your_client_id
CTRADER_CLIENT_SECRET=your_client_secret
CTRADER_REDIRECT_URI=http://localhost:5002/api/ctrader/callback
CTRADER_WS_URL=wss://openapi.ctrader.com:5035
```

### 4. Test API Connection Directly

Use the included test script to verify API connectivity:

```bash
node test-ctrader.js
```

### 5. Check Authentication

The cTrader endpoints require authentication. Make sure:

- You are logged in to the application
- Your authentication token is valid
- The user has permissions to access the cTrader endpoints

### 6. Common Issues

1. **Server Not Running**: Start the server as described in step 1.

2. **Missing Dependencies**: Run `npm install` in the server directory.

3. **Invalid Credentials**: Verify your cTrader API credentials.

4. **CORS Issues**: Ensure the server's CORS configuration allows requests from your frontend domain.

5. **Network Issues**: Check if your firewall or network settings are blocking connections.

### 7. Additional Debugging

Try accessing the endpoint directly using curl or a tool like Postman:

```bash
curl -X POST http://localhost:5002/api/ctrader/connect \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"challengeEntryId": 1, "accountId": "your_account_id"}'
```

## Contact Support

If you continue to experience issues, please contact support with:

1. Server logs
2. Results of the cTrader API test script
3. Details about your environment (OS, Node.js version, etc.) 