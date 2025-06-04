const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middlewares/auth');

// Rotas públicas
router.post('/register', UserController.create);
router.post('/login', UserController.login);

// Rotas protegidas
router.put('/:id', auth, UserController.update);
router.delete('/:id', auth, UserController.delete);

module.exports = router; 