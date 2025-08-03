class ApiResponse {
    static success(res, data = {}) {
        return res.status(200).json({
            success: true,
            ...data
        });
    }

    static created(res, data = {}) {
        return res.status(201).json({
            success: true,
            ...data
        });
    }

    static badRequest(res, message = 'Bad request') {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message
        });
    }

    static unauthorized(res, message = 'Unauthorized') {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message
        });
    }

    static notFound(res, message = 'Not found') {
        return res.status(404).json({
            success: false,
            error: 'Not Found',
            message
        });
    }

    static conflict(res, message = 'Conflict') {
        return res.status(409).json({
            success: false,
            error: 'Conflict',
            message
        });
    }

    static error(res, message = 'Internal server error') {
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message
        });
    }

    static validationError(res, details) {
        return res.status(400).json({
            success: false,
            error: 'Validation Failed',
            details
        });
    }
}

module.exports = { ApiResponse }; 