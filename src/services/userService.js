// services/UserService.js
const UserRepository = require("../repositories/UserRepository");
const { createUserSchema, updateUserSchema, loginSchema } = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Para gerar tokens JWT (precisa instalar: npm install jsonwebtoken)
require("dotenv").config(); // Para carregar a chave secreta do JWT

class UserService {
    async createUser(userData) {
        // 1. Validar dados de entrada
        const { error, value } = createUserSchema.validate(userData);
        if (error) {
            const validationError = new Error(error.details.map(d => d.message).join(", "));
            validationError.statusCode = 400;
            throw validationError;
        }

        // 2. Verificar se o email já existe
        const existingUser = await UserRepository.findUserByEmail(value.email);
        if (existingUser) {
            const conflictError = new Error("Email já cadastrado.");
            conflictError.statusCode = 409; // Conflict
            throw conflictError;
        }

        // 3. Chamar o repositório para criar o usuário (senha já é hasheada no repo)
        try {
            const newUser = await UserRepository.createUser(value);
            return newUser; // Retorna o usuário sem a senha
        } catch (err) {
            console.error("Erro no Service ao criar usuário:", err);
            throw new Error("Erro ao criar o usuário no banco de dados.");
        }
    }

    async loginUser(credentials) {
        // 1. Validar credenciais
        const { error, value } = loginSchema.validate(credentials);
        if (error) {
            const validationError = new Error("Email ou senha inválidos."); // Mensagem genérica
            validationError.statusCode = 400;
            throw validationError;
        }

        // 2. Buscar usuário pelo email
        const user = await UserRepository.findUserByEmail(value.email);
        if (!user) {
            const authError = new Error("Credenciais inválidas."); // Usuário não encontrado
            authError.statusCode = 401; // Unauthorized
            throw authError;
        }

        // 3. Comparar senha fornecida com hash armazenado
        const isMatch = await bcrypt.compare(value.senha, user.senha);
        if (!isMatch) {
            const authError = new Error("Credenciais inválidas."); // Senha incorreta
            authError.statusCode = 401;
            throw authError;
        }

        // 4. Gerar token JWT
        const payload = { userId: user.id, email: user.email }; // Informações a incluir no token
        const secret = process.env.JWT_SECRET || "fallback_secret_key"; // Usar variável de ambiente!
        const options = { expiresIn: "1h" }; // Token expira em 1 hora

        try {
            const token = jwt.sign(payload, secret, options);
            // Retornar o token e talvez informações básicas do usuário (sem senha)
            return {
                token,
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email
                }
            };
        } catch (err) {
            console.error("Erro ao gerar token JWT:", err);
            throw new Error("Erro interno ao tentar realizar login.");
        }
    }

    async getAllUsers() {
        try {
            const users = await UserRepository.getAllUsers();
            return users;
        } catch (err) {
            console.error("Erro no Service ao buscar todos os usuários:", err);
            throw new Error("Erro ao buscar usuários no banco de dados.");
        }
    }

    async getUserById(id) {
        if (isNaN(parseInt(id))) {
            const error = new Error("ID do usuário inválido.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const user = await UserRepository.findUserById(id);
            if (!user) {
                const error = new Error("Usuário não encontrado.");
                error.statusCode = 404;
                throw error;
            }
            return user;
        } catch (err) {
            if (err.statusCode) throw err;
            console.error(`Erro no Service ao buscar usuário por ID ${id}:`, err);
            throw new Error("Erro ao buscar o usuário no banco de dados.");
        }
    }

    async updateUser(id, userData) {
        if (isNaN(parseInt(id))) {
            const error = new Error("ID do usuário inválido.");
            error.statusCode = 400;
            throw error;
        }
        const { error, value } = updateUserSchema.validate(userData);
        if (error) {
            const validationError = new Error(error.details.map(d => d.message).join(", "));
            validationError.statusCode = 400;
            throw validationError;
        }

        try {
            const existingUser = await UserRepository.findUserById(id);
            if (!existingUser) {
                const error = new Error("Usuário não encontrado para atualização.");
                error.statusCode = 404;
                throw error;
            }
            // A validação de email duplicado é feita no repositório
            const updatedUser = await UserRepository.updateUser(id, value);
            return updatedUser;
        } catch (err) {
            if (err.statusCode) throw err; // Repassa erros específicos (como 409 do repo)
            console.error(`Erro no Service ao atualizar usuário ${id}:`, err);
            throw new Error("Erro ao atualizar o usuário no banco de dados.");
        }
    }

    async deleteUser(id) {
        if (isNaN(parseInt(id))) {
            const error = new Error("ID do usuário inválido.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const deletedUser = await UserRepository.deleteUser(id);
            if (!deletedUser) {
                const error = new Error("Usuário não encontrado para exclusão.");
                error.statusCode = 404;
                throw error;
            }
            return deletedUser;
        } catch (err) {
            if (err.statusCode) throw err;
            console.error(`Erro no Service ao deletar usuário ${id}:`, err);
            // Considerar o que acontece com tarefas associadas a este usuário (FK constraint?)
            throw new Error("Erro ao deletar o usuário no banco de dados.");
        }
    }

}

module.exports = new UserService();
