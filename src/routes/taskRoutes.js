const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const auth = require('../middlewares/auth');

// Todas as rotas de tarefas requerem autenticação
router.use(auth);

router.post('/', TaskController.create);
router.get('/', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);

module.exports = router; 