"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const challengeController_1 = require("../controllers/challengeController");
const router = express_1.default.Router();
// Validation middlewares
const challengeValidation = [
    (0, express_validator_1.body)('type').isIn(['daily', 'weekly', 'monthly', 'micro']).withMessage('Invalid challenge type'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('startDate').isISO8601().toDate().withMessage('Start date must be valid'),
    (0, express_validator_1.body)('endDate').isISO8601().toDate().withMessage('End date must be valid'),
    (0, express_validator_1.body)('initialBalance').isNumeric().withMessage('Initial balance must be a number'),
    (0, express_validator_1.body)('entryFee').isNumeric().withMessage('Entry fee must be a number'),
    (0, express_validator_1.body)('maxDrawdown').isNumeric().withMessage('Maximum drawdown must be a number'),
    (0, express_validator_1.body)('maxDailyDrawdown').isNumeric().withMessage('Maximum daily drawdown must be a number'),
    (0, express_validator_1.body)('maxRiskPerTrade').isNumeric().withMessage('Maximum risk per trade must be a number'),
    (0, express_validator_1.body)('minTrades').isInt({ min: 1 }).withMessage('Minimum trades must be a positive integer'),
    validate_1.validate
];
const idValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage('Invalid challenge ID'),
    validate_1.validate
];
// Public routes
router.get('/', challengeController_1.getChallenges);
router.get('/:id', idValidation, challengeController_1.getChallengeById);
// Admin routes (require authentication and admin privileges)
router.post('/', auth_1.authenticate, auth_1.authorizeAdmin, challengeValidation, challengeController_1.createChallenge);
router.put('/:id', auth_1.authenticate, auth_1.authorizeAdmin, idValidation, challengeValidation, challengeController_1.updateChallenge);
router.delete('/:id', auth_1.authenticate, auth_1.authorizeAdmin, idValidation, challengeController_1.deleteChallenge);
router.patch('/:id/status', auth_1.authenticate, auth_1.authorizeAdmin, idValidation, (0, express_validator_1.body)('status').isIn(['upcoming', 'active', 'completed', 'cancelled']).withMessage('Invalid status'), validate_1.validate, challengeController_1.updateChallengeStatus);
exports.default = router;
//# sourceMappingURL=challenges.js.map