const bcrypt = require('bcryptjs');

/**
 * Hash a password using bcrypt
 * @param {string} password - The plain text password
 * @param {number} saltRounds - Number of salt rounds (default: 10)
 * @returns {Promise<string>} - The hashed password
 */
async function hashPassword(password, saltRounds = 10) {
    if (!password || typeof password !== 'string') {
        throw new Error('Password must be a non-empty string');
    }
    
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - The plain text password
 * @param {string} hashedPassword - The hashed password
 * @returns {Promise<boolean>} - True if passwords match
 */
async function comparePassword(password, hashedPassword) {
    if (!password || !hashedPassword) {
        return false;
    }
    
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Validate user input for registration
 * @param {Object} userData - User data object
 * @param {string} userData.username - Username
 * @param {string} userData.password - Password
 * @returns {Object} - Validation result with isValid and errors
 */
function validateUserInput(userData) {
    const errors = [];
    
    if (!userData.username || typeof userData.username !== 'string') {
        errors.push('Username is required and must be a string');
    } else if (userData.username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    } else if (userData.username.length > 50) {
        errors.push('Username must be less than 50 characters');
    }
    
    if (!userData.password || typeof userData.password !== 'string') {
        errors.push('Password is required and must be a string');
    } else if (userData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    } else if (userData.password.length > 100) {
        errors.push('Password must be less than 100 characters');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validate idea input data
 * @param {Object} ideaData - Idea data object
 * @param {string} ideaData.title - Idea title
 * @param {string} ideaData.description - Idea description
 * @param {string} ideaData.status - Idea status
 * @returns {Object} - Validation result with isValid and errors
 */
function validateIdeaInput(ideaData) {
    const errors = [];
    const validStatuses = ['Concept', 'In Progress', 'Completed', 'On Hold'];
    
    if (!ideaData.title || typeof ideaData.title !== 'string') {
        errors.push('Title is required and must be a string');
    } else if (ideaData.title.length < 1) {
        errors.push('Title cannot be empty');
    } else if (ideaData.title.length > 200) {
        errors.push('Title must be less than 200 characters');
    }
    
    if (ideaData.description && typeof ideaData.description !== 'string') {
        errors.push('Description must be a string');
    } else if (ideaData.description && ideaData.description.length > 1000) {
        errors.push('Description must be less than 1000 characters');
    }
    
    if (ideaData.status && !validStatuses.includes(ideaData.status)) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Format API response with consistent structure
 * @param {boolean} success - Success status
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @param {number} count - Count of items (optional)
 * @returns {Object} - Formatted response object
 */
function formatApiResponse(success, data = null, message = '', count = null) {
    const response = {
        success,
        message
    };
    
    if (data !== null) {
        response.data = data;
    }
    
    if (count !== null) {
        response.count = count;
    }
    
    return response;
}

/**
 * Sanitize query parameters for database operations
 * @param {Object} query - Query parameters object
 * @returns {Object} - Sanitized query parameters
 */
function sanitizeQueryParams(query) {
    const sanitized = {};
    
    // Sanitize limit parameter
    if (query._limit) {
        const limit = parseInt(query._limit);
        sanitized.limit = (limit > 0 && limit <= 100) ? limit : 10;
    }
    
    // Sanitize page parameter
    if (query._page) {
        const page = parseInt(query._page);
        sanitized.page = (page > 0) ? page : 1;
    }
    
    // Sanitize sort parameter
    if (query._sort) {
        const allowedSortFields = ['title', 'createdAt', 'status'];
        sanitized.sort = allowedSortFields.includes(query._sort) ? query._sort : 'createdAt';
    }
    
    // Sanitize order parameter
    if (query._order) {
        sanitized.order = (query._order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';
    }
    
    return sanitized;
}

module.exports = {
    hashPassword,
    comparePassword,
    validateUserInput,
    validateIdeaInput,
    formatApiResponse,
    sanitizeQueryParams
};
