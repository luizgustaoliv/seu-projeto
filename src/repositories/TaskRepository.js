// repositories/TaskRepository.js
const pool = require("../db"); // Importa o pool de conexão configurado

class TaskRepository {
    async createTask({ nome, descricao }) {
        const query = "INSERT INTO tasks (nome, descricao) VALUES ($1, $2) RETURNING *";
        const values = [nome, descricao];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getAllTasks() {
        const query = "SELECT * FROM tasks ORDER BY created_at DESC"; // Ordenar por criação, por exemplo
        const result = await pool.query(query);
        return result.rows;
    }

    async getTaskById(id) {
        const query = "SELECT * FROM tasks WHERE id = $1";
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0]; // Retorna a tarefa ou undefined se não encontrada
    }

    async updateTask(id, { nome, descricao, status }) {
        // Constrói a query dinamicamente para atualizar apenas os campos fornecidos
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (nome !== undefined) {
            fields.push(`nome = $${paramIndex++}`);
            values.push(nome);
        }
        if (descricao !== undefined) {
            fields.push(`descricao = $${paramIndex++}`);
            values.push(descricao);
        }
        if (status !== undefined) {
            fields.push(`status = $${paramIndex++}`);
            values.push(status);
        }

        if (fields.length === 0) {
            // Se nenhum campo foi fornecido, retorna a tarefa existente sem atualizar
            return this.getTaskById(id);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);

        const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${paramIndex++} RETURNING *`;
        values.push(id);

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async deleteTask(id) {
        const query = "DELETE FROM tasks WHERE id = $1 RETURNING *";
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0]; // Retorna a tarefa deletada ou undefined se não encontrada
    }
}

module.exports = new TaskRepository();
