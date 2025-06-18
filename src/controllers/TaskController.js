const TaskRepository = require('../repositories/TaskRepository');
const { createTaskSchema, updateTaskSchema } = require('../models/TaskModel');

class TaskController {
    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async create(req, res) {
        try {
            console.log('BODY RECEBIDO:', req.body); // Para debug
            const { error } = createTaskSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { nome, descricao, status = 'pendente', category_id, prazo, user_id: userIdFromBody } = req.body;
            // Se existir req.user, usa o id autenticado, senão pega do body, senão undefined
            const user_id = req.user && req.user.id ? req.user.id : userIdFromBody;
            // Não valida mais se user_id está presente

            const task = await this.taskRepository.createTask({
                nome,
                descricao,
                status,
                user_id,
                category_id,
                prazo
            });

            res.status(201).json(task);
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getAll(req, res) {
        try {
            const user_id = req.user.id;
            const tasks = await this.taskRepository.getAllTasksByUser(user_id);
            res.json(tasks);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user.id;

            const task = await this.taskRepository.getTaskByIdAndUser(id, user_id);
            if (!task) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }

            res.json(task);
        } catch (error) {
            console.error('Erro ao buscar tarefa:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req, res) {
        try {
            const { error } = updateTaskSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { id } = req.params;
            const user_id = req.user.id;
            const { nome, descricao, status, category_id, prazo } = req.body;

            const task = await this.taskRepository.updateTask(id, {
                nome,
                descricao,
                status,
                category_id,
                user_id,
                prazo
            });

            if (!task) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }

            res.json(task);
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user.id;

            const task = await this.taskRepository.deleteTask(id, user_id);
            if (!task) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }

            res.json({ message: 'Tarefa excluída com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getCompleted(req, res) {
        try {
            const user_id = req.user.id;
            const tasks = await this.taskRepository.getCompletedTasks(user_id);
            res.json(tasks);
        } catch (error) {
            console.error('Erro ao buscar tarefas concluídas:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new TaskController(); 