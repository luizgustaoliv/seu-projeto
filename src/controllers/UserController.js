// controllers/UserController.js
const UserService = require("../services/UserService");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUserSchema, updateUserSchema, loginSchema } = require('../models/UserModel');

// Criar um novo usuário (Registro)
exports.criarUsuario = async (req, res) => {
    try {
        const { error } = createUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { nome, email, senha } = req.body;

        // Verifica se o email já existe
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const result = await db.query(
            'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
            [nome, email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Login de usuário
exports.loginUsuario = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, senha } = req.body;

        // Busca o usuário pelo email
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const user = result.rows[0];

        // Verifica a senha
        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Listar todos os usuários (Exemplo - proteger esta rota adequadamente)
exports.listarUsuarios = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error("Erro no Controller ao listar usuários:", err);
        res.status(err.statusCode || 500).json({ error: err.message || "Erro interno do servidor." });
    }
};

// Buscar usuário por ID (Exemplo - proteger esta rota)
exports.buscarUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        res.status(200).json(user);
    } catch (err) {
        console.error("Erro no Controller ao buscar usuário por ID:", err);
        res.status(err.statusCode || 500).json({ error: err.message || "Erro interno do servidor." });
    }
};

// Atualizar usuário (Exemplo - proteger e permitir que apenas o próprio usuário ou admin atualize)
exports.atualizarUsuario = async (req, res) => {
    try {
        const { error } = updateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { id } = req.params;
        const { nome, email, senha } = req.body;

        // Verifica se o usuário existe
        const userExists = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Se estiver atualizando o email, verifica se já existe
        if (email) {
            const emailExists = await db.query('SELECT * FROM users WHERE email = $1 AND id != $2', [email, id]);
            if (emailExists.rows.length > 0) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }
        }

        let hashedPassword;
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(senha, salt);
        }

        const result = await db.query(
            'UPDATE users SET nome = COALESCE($1, nome), email = COALESCE($2, email), senha = COALESCE($3, senha), updated_at = NOW() WHERE id = $4 RETURNING id, nome, email',
            [nome, email, hashedPassword, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Deletar usuário (Exemplo - proteger e permitir que apenas admin delete)
exports.deletarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
