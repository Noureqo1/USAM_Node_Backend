const {
    hashPassword,
    comparePassword,
    validateUserInput,
    validateIdeaInput,
    formatApiResponse,
    sanitizeQueryParams
} = require('../utils');

describe('Utils - Password Functions', () => {
    test('hashPassword should hash a password successfully', async () => {
        const password = 'mysecretpassword';
        const hashedPassword = await hashPassword(password);
        
        expect(hashedPassword).toBeDefined();
        expect(hashedPassword).not.toBe(password);
        expect(hashedPassword.length).toBeGreaterThan(50);
    });

    test('hashPassword should throw error for invalid input', async () => {
        await expect(hashPassword('')).rejects.toThrow('Password must be a non-empty string');
        await expect(hashPassword(null)).rejects.toThrow('Password must be a non-empty string');
        await expect(hashPassword(123)).rejects.toThrow('Password must be a non-empty string');
    });

    test('comparePassword should return true for matching passwords', async () => {
        const password = 'testpassword123';
        const hashedPassword = await hashPassword(password);
        const isMatch = await comparePassword(password, hashedPassword);
        
        expect(isMatch).toBe(true);
    });

    test('comparePassword should return false for non-matching passwords', async () => {
        const password = 'testpassword123';
        const wrongPassword = 'wrongpassword';
        const hashedPassword = await hashPassword(password);
        const isMatch = await comparePassword(wrongPassword, hashedPassword);
        
        expect(isMatch).toBe(false);
    });

    test('comparePassword should return false for empty inputs', async () => {
        expect(await comparePassword('', 'hash')).toBe(false);
        expect(await comparePassword('password', '')).toBe(false);
        expect(await comparePassword('', '')).toBe(false);
    });
});

describe('Utils - User Input Validation', () => {
    test('validateUserInput should return valid for correct input', () => {
        const userData = {
            username: 'testuser',
            password: 'password123'
        };
        
        const result = validateUserInput(userData);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('validateUserInput should return errors for invalid username', () => {
        const userData = {
            username: 'ab', // too short
            password: 'password123'
        };
        
        const result = validateUserInput(userData);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Username must be at least 3 characters long');
    });

    test('validateUserInput should return errors for invalid password', () => {
        const userData = {
            username: 'testuser',
            password: '123' // too short
        };
        
        const result = validateUserInput(userData);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Password must be at least 6 characters long');
    });

    test('validateUserInput should return errors for missing fields', () => {
        const userData = {};
        
        const result = validateUserInput(userData);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Username is required and must be a string');
        expect(result.errors).toContain('Password is required and must be a string');
    });
});

describe('Utils - Idea Input Validation', () => {
    test('validateIdeaInput should return valid for correct input', () => {
        const ideaData = {
            title: 'Test Idea',
            description: 'This is a test idea',
            status: 'Concept'
        };
        
        const result = validateIdeaInput(ideaData);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('validateIdeaInput should return errors for missing title', () => {
        const ideaData = {
            description: 'This is a test idea',
            status: 'Concept'
        };
        
        const result = validateIdeaInput(ideaData);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required and must be a string');
    });

    test('validateIdeaInput should return errors for invalid status', () => {
        const ideaData = {
            title: 'Test Idea',
            description: 'This is a test idea',
            status: 'Invalid Status'
        };
        
        const result = validateIdeaInput(ideaData);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Status must be one of: Concept, In Progress, Completed, On Hold');
    });

    test('validateIdeaInput should allow empty description', () => {
        const ideaData = {
            title: 'Test Idea',
            status: 'Concept'
        };
        
        const result = validateIdeaInput(ideaData);
        expect(result.isValid).toBe(true);
    });
});

describe('Utils - API Response Formatting', () => {
    test('formatApiResponse should format success response with data', () => {
        const data = { id: 1, name: 'test' };
        const response = formatApiResponse(true, data, 'Success');
        
        expect(response).toEqual({
            success: true,
            message: 'Success',
            data: data
        });
    });

    test('formatApiResponse should format error response without data', () => {
        const response = formatApiResponse(false, null, 'Error occurred');
        
        expect(response).toEqual({
            success: false,
            message: 'Error occurred'
        });
    });

    test('formatApiResponse should include count when provided', () => {
        const data = [{ id: 1 }, { id: 2 }];
        const response = formatApiResponse(true, data, 'Success', 2);
        
        expect(response).toEqual({
            success: true,
            message: 'Success',
            data: data,
            count: 2
        });
    });
});

describe('Utils - Query Parameter Sanitization', () => {
    test('sanitizeQueryParams should sanitize limit parameter', () => {
        const query = { _limit: '20' };
        const result = sanitizeQueryParams(query);
        
        expect(result.limit).toBe(20);
    });

    test('sanitizeQueryParams should use default limit for invalid values', () => {
        const query = { _limit: '150' }; // exceeds max
        const result = sanitizeQueryParams(query);
        
        expect(result.limit).toBe(10);
    });

    test('sanitizeQueryParams should sanitize page parameter', () => {
        const query = { _page: '3' };
        const result = sanitizeQueryParams(query);
        
        expect(result.page).toBe(3);
    });

    test('sanitizeQueryParams should use default page for invalid values', () => {
        const query = { _page: '0' }; // invalid page
        const result = sanitizeQueryParams(query);
        
        expect(result.page).toBe(1);
    });

    test('sanitizeQueryParams should sanitize sort parameter', () => {
        const query = { _sort: 'title' };
        const result = sanitizeQueryParams(query);
        
        expect(result.sort).toBe('title');
    });

    test('sanitizeQueryParams should use default sort for invalid values', () => {
        const query = { _sort: 'invalid_field' };
        const result = sanitizeQueryParams(query);
        
        expect(result.sort).toBe('createdAt');
    });

    test('sanitizeQueryParams should sanitize order parameter', () => {
        const query = { _order: 'desc' };
        const result = sanitizeQueryParams(query);
        
        expect(result.order).toBe('DESC');
    });
});
