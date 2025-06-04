// repositories/CategoryRepository.js
const pool = require("../db");

class CategoryRepository {
    async createCategory({ nome }) {
        const query = "INSERT INTO categories (nome) VALUES ($1) RETURNING *";
        const values = [nome];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getAllCategories() {
        const query = "SELECT * FROM categories ORDER BY nome ASC";
        const result = await pool.query(query);
        return result.rows;
    }

    async getCategoryById(id) {
        const query = "SELECT * FROM categories WHERE id = $1";
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getCategoryByName(nome) {
        const query = "SELECT * FROM categories WHERE nome = $1";
        const values = [nome];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async updateCategory(id, { nome }) {
        const query = "UPDATE categories SET nome = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *";
        const values = [nome, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async deleteCategory(id) {
        const query = "DELETE FROM categories WHERE id = $1 RETURNING *";
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = new CategoryRepository();
