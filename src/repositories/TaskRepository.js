// repositories/TaskRepository.js
const pool = require("../config/db");

class TaskRepository {
    async createTask({ nome, descricao, status, user_id, category_id, prazo }) {
        const query = `
            INSERT INTO tasks (nome, descricao, status, user_id, category_id, prazo) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`;
        const values = [nome, descricao, status, user_id, category_id, prazo];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getAllTasksByUser(user_id) {
        const query = `
            SELECT t.*, c.nome as categoria_nome, c.cor as categoria_cor 
            FROM tasks t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.user_id = $1 
            ORDER BY t.created_at DESC`;
        const result = await pool.query(query, [user_id]);
        return result.rows;
    }

    async getTaskByIdAndUser(id, user_id) {
        const query = `
            SELECT t.*, c.nome as categoria_nome, c.cor as categoria_cor 
            FROM tasks t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.id = $1 AND t.user_id = $2`;
        const result = await pool.query(query, [id, user_id]);
        return result.rows[0];
    }

    async updateTask(id, { nome, descricao, status, category_id, user_id, prazo }) {
        const query = `
            UPDATE tasks 
            SET nome = COALESCE($1, nome), 
                descricao = COALESCE($2, descricao), 
                status = COALESCE($3, status),
                category_id = COALESCE($4, category_id),
                prazo = COALESCE($5, prazo),
                updated_at = NOW() 
            WHERE id = $6 AND user_id = $7 
            RETURNING *`;
        const values = [nome, descricao, status, category_id, prazo, id, user_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async deleteTask(id, user_id) {
        const query = `
            DELETE FROM tasks 
            WHERE id = $1 AND user_id = $2 
            RETURNING *`;
        const result = await pool.query(query, [id, user_id]);
        return result.rows[0];
    }

    async getCompletedTasks(user_id) {
        const query = `
            SELECT t.*, c.nome as categoria_nome, c.cor as categoria_cor 
            FROM tasks t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.user_id = $1 AND t.status = 'concluida'
            ORDER BY t.updated_at DESC`;
        const result = await pool.query(query, [user_id]);
        return result.rows;
    }
}

module.exports = TaskRepository;
