const express = require('express');
const UserController = require('../controllers/userController');
const { 
    userValidation, 
    loginValidation, 
    updateUserValidation, 
    handleValidationErrors 
} = require('../middleware/validation');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'User Management System',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

router.get('/users', UserController.getAllUsers);
router.get('/user/:user_id', UserController.getUserById);
router.post('/users', userValidation, handleValidationErrors, UserController.createUser);
router.put('/user/:user_id', updateUserValidation, handleValidationErrors, UserController.updateUser);
router.delete('/user/:user_id', UserController.deleteUser);

router.get('/search', UserController.searchUsers);
router.post('/login', loginValidation, handleValidationErrors, UserController.login);

module.exports = router; 