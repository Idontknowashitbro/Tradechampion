"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const challengeEntryController_1 = require("../controllers/challengeEntryController");
const router = express_1.default.Router();
// Routes
router.post('/', auth_1.authenticate, challengeEntryController_1.enterChallenge);
router.get('/:id', auth_1.authenticate, challengeEntryController_1.getEntryById);
router.get('/user', auth_1.authenticate, challengeEntryController_1.getUserEntries);
router.patch('/:id/connect', auth_1.authenticate, challengeEntryController_1.updateConnection);
exports.default = router;
//# sourceMappingURL=challengeEntries.js.map