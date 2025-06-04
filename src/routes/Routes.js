const express = require("express");
const router = express.Router();

const TaskController = require("./controllers/TarefaController");

router.post("/tasks", TaskController.criarTarefa);
router.get("/tasks", TaskController.listarTarefas);
router.get("/tasks/:id", TaskController.buscarTarefaPorId);
router.put("/tasks/:id", TaskController.editarTarefa);
router.delete("/tasks/:id", TaskController.excluirTarefa);

module.exports = router;
