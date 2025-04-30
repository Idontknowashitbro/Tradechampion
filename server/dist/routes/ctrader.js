"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const ctraderController_1 = require("../controllers/ctraderController");
const router = (0, express_1.Router)();
// Public routes
router.get('/auth-url', auth_1.authenticate, ctraderController_1.getAuthorizationUrl);
router.get('/callback', ctraderController_1.oauthCallback);
// Protected routes
router.post('/connect', auth_1.authenticate, ctraderController_1.connectAccount);
router.post('/disconnect/:challengeEntryId', auth_1.authenticate, ctraderController_1.disconnectAccount);
router.get('/trades/:challengeEntryId', auth_1.authenticate, ctraderController_1.fetchTrades);
router.get('/account/:challengeEntryId', auth_1.authenticate, ctraderController_1.getAccountDetails);
// Admin route to check all WebSocket connection status
router.get('/admin/connections', auth_1.authenticate, ctraderController_1.checkConnectionStatus);
exports.default = router;
//# sourceMappingURL=ctrader.js.map