import { Request, Response } from 'express';
/**
 * Generate OAuth2 authorization URL
 */
export declare const getAuthorizationUrl: (req: Request, res: Response) => void;
/**
 * OAuth2 callback handler
 */
export declare const oauthCallback: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Connect cTrader account to challenge entry
 */
export declare const connectAccount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Disconnect cTrader account from challenge entry
 */
export declare const disconnectAccount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Manually fetch trades for a challenge entry
 */
export declare const fetchTrades: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get account details
 */
export declare const getAccountDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Admin-only route to check WebSocket connection status for all challenge entries
 */
export declare const checkConnectionStatus: (req: Request, res: Response) => Promise<void>;
/**
 * Controller for handling cTrader API integration
 */
declare class CtraderController {
    /**
     * Generate the authorization URL for cTrader OAuth
     */
    getAuthUrl(req: Request, res: Response): void;
    /**
     * Handle the callback from cTrader OAuth
     */
    handleCallback(req: Request, res: Response): Promise<void>;
    /**
     * Fetch account info from cTrader API
     */
    private fetchAndSaveAccountInfo;
    /**
     * Refresh the access token
     */
    refreshToken(userId: string): Promise<string | null>;
    /**
     * Disconnect cTrader account
     */
    disconnectAccount(req: Request, res: Response): Promise<void>;
    /**
     * Get user's cTrader account status and info
     */
    getAccountStatus(req: Request, res: Response): Promise<void>;
    /**
     * Connect cTrader account to challenge entry (for challenge-specific connections)
     */
    connectToChallengeEntry(req: Request, res: Response): Promise<void>;
    /**
     * Disconnect cTrader account from challenge entry
     */
    disconnectFromChallengeEntry(req: Request, res: Response): Promise<void>;
}
declare const _default: CtraderController;
export default _default;
