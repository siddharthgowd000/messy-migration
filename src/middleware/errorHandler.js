const { ApiResponse } = require('../utils/responseHandler');

// Global error handler
const globalErrorHandler = (error, req, res, next) => {
    console.error('Unhandled error:', error);
    return ApiResponse.error(res, 'An unexpected error occurred');
};

// 404 handler
const notFoundHandler = (req, res) => {
    return ApiResponse.notFound(res, `Route ${req.method} ${req.originalUrl} not found`);
};

module.exports = {
    globalErrorHandler,
    notFoundHandler
}; 