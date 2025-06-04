const db = require('../config/db');
const { createTaskSchema, updateTaskSchema } = require('../models/TaskModel');

class TaskController {
    async create(req, res) {
        try {
            const { error } = createTaskSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { nome, descricao, status = 'pendente', category_id } = req.body;
            const user_id = req.user.id;

            // Verifica se a categoria existe (se fornecida)
            if (category_id) {
                const categoryExists = await db.query('SELECT id FROM categories WHERE id = $1', [category_id]);
                if (categoryExists.rows.length === 0) {
                    return res.status(400).json({ error: 'Categoria não encontrada' });
                }
            }

            const result = await db.query(
                'INSERT INTO tasks (nome, descricao, status, user_id, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [nome, descricao, status, user_id, category_id]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getAll(req, res) {
        try {
            const user_id = req.user.id;
            const result = await db.query(
                `SELECT t.*, c.nome as categoria_nome, c.cor as categoria_cor 
                FROM tasks t 
                LEFT JOIN categories c ON t.category_id = c.id 
                WHERE t.user_id = $1 
                ORDER BY t.created_at DESC`,
                [user_id]
            );
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user.id;

            const result = await db.query(
                `SELECT t.*, c.nome as categoria_nome, c.cor as categoria_cor 
                FROM tasks t 
                LEFT JOIN categories c ON t.category_id = c.id 
                WHERE t.id = $1 AND t.user_id = $2`,
                [id, user_id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }

            res.json(result.rows[0]);
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
            const { nome, descricao, status, category_id } = req.body;

            // Verifica se a categoria existe (se fornecida)
            if (category_id) {
                const categoryExists = await db.query('SELECT id FROM categories WHERE id = $1', [category_id]);
                if (categoryExists.rows.length === 0) {
                    return res.status(400).json({ error: 'Categoria não encontrada' });
                }
            }

            const result = await db.query(
                `UPDATE tasks 
                SET nome = COALESCE($1, nome), 
                    descricao = COALESCE($2, descricao), 
                    status = COALESCE($3, status),
                    category_id = COALESCE($4, category_id),
                    updated_at = NOW() 
                WHERE id = $5 AND user_id = $6 
                RETURNING *`,
                [nome, descricao, status, category_id, id, user_id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user.id;

            const result = await db.query(
                'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
                [id, user_id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }

            res.json({ message: 'Tarefa excluída com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new TaskController(); 