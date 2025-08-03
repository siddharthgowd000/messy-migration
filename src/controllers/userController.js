const User = require('../models/User');
const { ApiResponse } = require('../utils/responseHandler');

class UserController {
    // Get all users
    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            
            return ApiResponse.success(res, {
                data: users,
                count: users.length
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            return ApiResponse.error(res, 'Failed to fetch users');
        }
    }

    // Get user by ID
    static async getUserById(req, res) {
        try {
            const userId = parseInt(req.params.user_id);

            if (isNaN(userId) || userId <= 0) {
                return ApiResponse.badRequest(res, 'User ID must be a positive integer');
            }

            const user = await User.findById(userId);
            
            if (!user) {
                return ApiResponse.notFound(res, `No user found with ID ${userId}`);
            }

            return ApiResponse.success(res, { data: user });
        } catch (error) {
            console.error('Error fetching user:', error);
            return ApiResponse.error(res, 'Failed to fetch user');
        }
    }

    // Create new user
    static async createUser(req, res) {
        try {
            const { name, email, password } = req.body;

            // Check if email already exists
            const emailExists = await User.emailExists(email);
            if (emailExists) {
                return ApiResponse.conflict(res, 'A user with this email already exists');
            }

            const newUser = await User.create({ name, email, password });

            console.log('User created successfully with ID:', newUser.id);
            return ApiResponse.created(res, {
                message: 'User created successfully',
                data: newUser
            });
        } catch (error) {
            console.error('Error creating user:', error);
            return ApiResponse.error(res, 'Failed to create user');
        }
    }

    // Update user
    static async updateUser(req, res) {
        try {
            const userId = parseInt(req.params.user_id);
            const { name, email } = req.body;

            if (isNaN(userId) || userId <= 0) {
                return ApiResponse.badRequest(res, 'User ID must be a positive integer');
            }

            if (!name && !email) {
                return ApiResponse.badRequest(res, 'At least one field (name or email) must be provided');
            }

            // Check if user exists
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                return ApiResponse.notFound(res, `No user found with ID ${userId}`);
            }

            // Check if email is being updated and if it already exists
            if (email) {
                const emailExists = await User.emailExists(email, userId);
                if (emailExists) {
                    return ApiResponse.conflict(res, 'A user with this email already exists');
                }
            }

            const result = await User.update(userId, { name, email });

            if (result.changes > 0) {
                return ApiResponse.success(res, { message: 'User updated successfully' });
            } else {
                return ApiResponse.notFound(res, `No user found with ID ${userId}`);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            return ApiResponse.error(res, 'Failed to update user');
        }
    }

    // Delete user
    static async deleteUser(req, res) {
        try {
            const userId = parseInt(req.params.user_id);

            if (isNaN(userId) || userId <= 0) {
                return ApiResponse.badRequest(res, 'User ID must be a positive integer');
            }

            const result = await User.delete(userId);

            if (result.changes > 0) {
                console.log(`User ${userId} deleted successfully`);
                return ApiResponse.success(res, { message: 'User deleted successfully' });
            } else {
                return ApiResponse.notFound(res, `No user found with ID ${userId}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            return ApiResponse.error(res, 'Failed to delete user');
        }
    }

    // Search users
    static async searchUsers(req, res) {
        try {
            const name = req.query.name?.trim();

            if (!name) {
                return ApiResponse.badRequest(res, 'Please provide a name parameter to search');
            }

            if (name.length < 2) {
                return ApiResponse.badRequest(res, 'Search term must be at least 2 characters long');
            }

            const users = await User.findByName(name);

            return ApiResponse.success(res, {
                data: users,
                count: users.length,
                searchTerm: name
            });
        } catch (error) {
            console.error('Error searching users:', error);
            return ApiResponse.error(res, 'Failed to search users');
        }
    }

    // Login
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.authenticate(email, password);

            if (user) {
                return ApiResponse.success(res, {
                    message: 'Login successful',
                    data: user
                });
            } else {
                return ApiResponse.unauthorized(res, 'Invalid email or password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            return ApiResponse.error(res, 'Failed to process login');
        }
    }
}

module.exports = UserController; 