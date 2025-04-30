"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ctraderController_1 = __importDefault(require("../controllers/ctraderController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Generate authorization URL for cTrader OAuth
router.get('/auth-url', authMiddleware_1.authenticateJWT, ctraderController_1.default.getAuthUrl);
// Handle OAuth callback from cTrader
router.get('/callback', authMiddleware_1.authenticateJWT, ctraderController_1.default.handleCallback);
// Disconnect cTrader account
router.post('/disconnect', authMiddleware_1.authenticateJWT, ctraderController_1.default.disconnectAccount);
// Get account status and info
router.get('/status', authMiddleware_1.authenticateJWT, ctraderController_1.default.getAccountStatus);
// Challenge-specific routes
router.post('/connect-challenge', authMiddleware_1.authenticateJWT, ctraderController_1.default.connectToChallengeEntry);
router.post('/disconnect-challenge/:challengeEntryId', authMiddleware_1.authenticateJWT, ctraderController_1.default.disconnectFromChallengeEntry);
exports.default = router;
//# sourceMappingURL=ctraderRoutes.js.map