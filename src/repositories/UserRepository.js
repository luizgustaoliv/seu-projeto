// repositories/UserRepository.js
const pool = require("../db");
const bcrypt = require("bcryptjs"); // Para hashing de senha

class UserRepository {
    async createUser({ nome, email, senha }) {
        // Gerar hash da senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const query = "INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, created_at"; // Não retornar a senha
        const values = [nome, email, hashedPassword];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async findUserByEmail(email) {
        const query = "SELECT * FROM users WHERE email = $1";
        const values = [email];
        const result = await pool.query(query, values);
        return result.rows[0]; // Retorna o usuário completo (incluindo hash da senha) ou undefined
    }

    async findUserById(id) {
        const query = "SELECT id, nome, email, created_at, updated_at FROM users WHERE id = $1"; // Não retornar senha
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Adicionar métodos para listar, atualizar, deletar usuários se necessário
    async getAllUsers() {
        const query = "SELECT id, nome, email, created_at, updated_at FROM users ORDER BY nome ASC";
        const result = await pool.query(query);
        return result.rows;
    }

    async updateUser(id, { nome, email }) {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (nome !== undefined) {
            fields.push(`nome = $${paramIndex++}`);
            values.push(nome);
        }
        if (email !== undefined) {
            // Adicionar validação para garantir que o novo email não está em uso por outro usuário
            const existingUser = await this.findUserByEmail(email);
            if (existingUser && existingUser.id !== parseInt(id)) {
                 const error = new Error("Email já está em uso por outro usuário.");
                 error.statusCode = 409; // Conflict
                 throw error;
            }
            fields.push(`email = $${paramIndex++}`);
            values.push(email);
        }

        if (fields.length === 0) {
            return this.findUserById(id);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramIndex++} RETURNING id, nome, email, created_at, updated_at`;
        values.push(id);

        const result = await pool.query(query, values);
        return result.rows[0];
    }

     async deleteUser(id) {
        const query = "DELETE FROM users WHERE id = $1 RETURNING id, nome, email"; // Retorna dados básicos do usuário deletado
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

}

module.exports = new UserRepository();
