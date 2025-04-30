"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const challengeRulesController_1 = __importDefault(require("../controllers/challengeRulesController"));
const auth_1 = require("../middleware/auth");
const validateAdmin_1 = require("../middleware/validateAdmin");
const router = express_1.default.Router();
// Public routes
router.get('/defaults/:type', challengeRulesController_1.default.getDefaultRules);
// Protected routes (require authentication)
router.get('/validate/:challengeEntryId', auth_1.authenticate, challengeRulesController_1.default.validateRules);
// Admin routes
router.put('/:challengeId', auth_1.authenticate, validateAdmin_1.validateAdmin, challengeRulesController_1.default.updateRules);
router.post('/', auth_1.authenticate, validateAdmin_1.validateAdmin, challengeRulesController_1.default.createChallengeWithRules);
exports.default = router;
//# sourceMappingURL=challengeRules.js.map