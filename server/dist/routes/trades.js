"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const tradeController_1 = require("../controllers/tradeController");
const router = express_1.default.Router();
// Routes
router.get('/:challengeEntryId', auth_1.authenticate, tradeController_1.getTradesByEntry);
router.post('/', auth_1.authenticate, tradeController_1.logTrade);
exports.default = router;
//# sourceMappingURL=trades.js.map