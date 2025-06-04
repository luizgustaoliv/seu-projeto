// services/TaskService.js
const TaskRepository = require("../repositories/TaskRepository");
const { createTaskSchema, updateTaskSchema } = require("../models/TaskModel");

class TaskService {
    async createTask(taskData) {
        // 1. Validar dados de entrada
        const { error, value } = createTaskSchema.validate(taskData);
        if (error) {
            // Lança um erro específico para ser tratado no controller
            const validationError = new Error(error.details.map(d => d.message).join(", "));
            validationError.statusCode = 400; // Bad Request
            throw validationError;
        }

        // 2. Chamar o repositório para criar a tarefa
        try {
            const newTask = await TaskRepository.createTask(value);
            return newTask;
        } catch (err) {
            // Logar o erro original e lançar um erro genérico ou mais específico
            console.error("Erro no Service ao criar tarefa:", err);
            throw new Error("Erro ao criar a tarefa no banco de dados.");
        }
    }

    async getAllTasks() {
        try {
            const tasks = await TaskRepository.getAllTasks();
            return tasks;
        } catch (err) {
            console.error("Erro no Service ao buscar todas as tarefas:", err);
            throw new Error("Erro ao buscar tarefas no banco de dados.");
        }
    }

    async getTaskById(id) {
        // Validar ID (simples verificação se é um número)
        if (isNaN(parseInt(id))) {
            const error = new Error("ID da tarefa inválido.");
            error.statusCode = 400;
            throw error;
        }

        try {
            const task = await TaskRepository.getTaskById(id);
            if (!task) {
                const error = new Error("Tarefa não encontrada.");
                error.statusCode = 404; // Not Found
                throw error;
            }
            return task;
        } catch (err) {
            // Se o erro já tem statusCode (lançado acima), repassa
            if (err.statusCode) throw err;
            // Senão, loga e lança erro genérico
            console.error(`Erro no Service ao buscar tarefa por ID ${id}:`, err);
            throw new Error("Erro ao buscar a tarefa no banco de dados.");
        }
    }

    async updateTask(id, taskData) {
        // 1. Validar ID
        if (isNaN(parseInt(id))) {
            const error = new Error("ID da tarefa inválido.");
            error.statusCode = 400;
            throw error;
        }

        // 2. Validar dados de entrada para atualização
        const { error, value } = updateTaskSchema.validate(taskData);
        if (error) {
            const validationError = new Error(error.details.map(d => d.message).join(", "));
            validationError.statusCode = 400;
            throw validationError;
        }

        // 3. Chamar o repositório para atualizar
        try {
            // Verificar se a tarefa existe antes de tentar atualizar
            const existingTask = await TaskRepository.getTaskById(id);
            if (!existingTask) {
                const error = new Error("Tarefa não encontrada para atualização.");
                error.statusCode = 404;
                throw error;
            }

            const updatedTask = await TaskRepository.updateTask(id, value);
            return updatedTask;
        } catch (err) {
            if (err.statusCode) throw err;
            console.error(`Erro no Service ao atualizar tarefa ${id}:`, err);
            throw new Error("Erro ao atualizar a tarefa no banco de dados.");
        }
    }

    async deleteTask(id) {
        // 1. Validar ID
        if (isNaN(parseInt(id))) {
            const error = new Error("ID da tarefa inválido.");
            error.statusCode = 400;
            throw error;
        }

        // 2. Chamar o repositório para deletar
        try {
            const deletedTask = await TaskRepository.deleteTask(id);
            if (!deletedTask) {
                const error = new Error("Tarefa não encontrada para exclusão.");
                error.statusCode = 404;
                throw error;
            }
            return deletedTask; // Retorna a tarefa que foi deletada
        } catch (err) {
            if (err.statusCode) throw err;
            console.error(`Erro no Service ao deletar tarefa ${id}:`, err);
            throw new Error("Erro ao deletar a tarefa no banco de dados.");
        }
    }
}

module.exports = new TaskService();
