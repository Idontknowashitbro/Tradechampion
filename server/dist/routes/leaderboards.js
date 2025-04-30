"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaderboardController_1 = require("../controllers/leaderboardController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public route to get leaderboard
router.get('/:challengeId', leaderboardController_1.getLeaderboard);
// Get top performers (useful for prize distribution)
router.get('/:challengeId/top/:percentage', authMiddleware_1.authenticateJWT, leaderboardController_1.getTopPerformers);
// Get disqualified entries with reasons
router.get('/:challengeId/disqualified', authMiddleware_1.authenticateJWT, leaderboardController_1.getDisqualifiedEntries);
// Get entries at risk of disqualification
router.get('/:challengeId/at-risk/:threshold?', authMiddleware_1.authenticateJWT, leaderboardController_1.getEntriesAtRisk);
// Admin only - manually update leaderboard
router.post('/:challengeId/update', authMiddleware_1.authenticateJWT, authMiddleware_1.isAdmin, leaderboardController_1.updateLeaderboard);
exports.default = router;
//# sourceMappingURL=leaderboards.js.map