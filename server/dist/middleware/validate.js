"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
/**
 * Middleware to validate request using express-validator
 * Checks for validation errors and returns them as a response if any are found
 */
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // Format errors for a cleaner response
        const formattedErrors = errors.array().map(error => ({
            field: 'param' in error ? error.param : 'unknown',
            message: error.msg
        }));
        return res.status(400).json({
            message: 'Validation failed',
            errors: formattedErrors
        });
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map