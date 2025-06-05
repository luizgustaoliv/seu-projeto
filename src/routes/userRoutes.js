const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Rotas de usuários
router.post('/register', UserController.criarUsuario);
router.post('/login', UserController.loginUsuario);
router.get('/', UserController.listarUsuarios);
router.get('/:id', UserController.buscarUsuarioPorId);
router.put('/:id', UserController.atualizarUsuario);
router.delete('/:id', UserController.deletarUsuario);

module.exports = router;