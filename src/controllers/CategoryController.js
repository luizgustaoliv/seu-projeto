// controllers/CategoryController.js
const db = require('../config/db');
const { createCategorySchema, updateCategorySchema } = require('../models/CategoryModel');

class CategoryController {
    async create(req, res) {
        try {
            const { error } = createCategorySchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { nome, descricao, cor } = req.body;
            const result = await db.query(
                'INSERT INTO categories (nome, descricao, cor) VALUES ($1, $2, $3) RETURNING *',
                [nome, descricao, cor]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getAll(req, res) {
        try {
            const result = await db.query('SELECT * FROM categories ORDER BY nome');
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao buscar categoria:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req, res) {
        try {
            const { error } = updateCategorySchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { id } = req.params;
            const { nome, descricao, cor } = req.body;

            const result = await db.query(
                'UPDATE categories SET nome = COALESCE($1, nome), descricao = COALESCE($2, descricao), cor = COALESCE($3, cor), updated_at = NOW() WHERE id = $4 RETURNING *',
                [nome, descricao, cor, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            // Verifica se existem tarefas usando esta categoria
            const tasksResult = await db.query('SELECT COUNT(*) FROM tasks WHERE category_id = $1', [id]);
            if (tasksResult.rows[0].count > 0) {
                return res.status(400).json({ error: 'Não é possível excluir uma categoria que possui tarefas associadas' });
            }

            const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            res.json({ message: 'Categoria excluída com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new CategoryController();
