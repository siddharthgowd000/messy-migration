const { body, validationResult } = require('express-validator');
const { ApiResponse } = require('../utils/responseHandler');

// Validation rules
const userValidation = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Name is required'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const updateUserValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Name cannot be empty'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
    }
    next();
};

module.exports = {
    userValidation,
    loginValidation,
    updateUserValidation,
    handleValidationErrors
}; 