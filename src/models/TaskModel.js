const Joi = require('joi');

// Define o schema de validação para a criação de uma tarefa
const createTaskSchema = Joi.object({
    nome: Joi.string().max(255).required().messages({
        'string.base': 'O nome deve ser um texto.',
        'string.max': 'O nome não pode ter mais que 255 caracteres.',
        'any.required': 'O nome é obrigatório.'
    }),
    descricao: Joi.string().allow('').optional().messages({
        'string.base': 'A descrição deve ser um texto.'
    }),
    status: Joi.string().valid('pendente', 'em_andamento', 'concluida').default('pendente').messages({
        'string.base': 'O status deve ser um texto.',
        'any.only': 'O status deve ser um dos seguintes: pendente, em_andamento, concluida.'
    }),
    category_id: Joi.number().integer().positive().optional().messages({
        'number.base': 'O ID da categoria deve ser um número.',
        'number.integer': 'O ID da categoria deve ser um número inteiro.',
        'number.positive': 'O ID da categoria deve ser um número positivo.'
    }),
    prazo: Joi.date().iso().allow('').optional().messages({
        'date.base': 'O prazo deve ser uma data válida.',
        'date.format': 'O prazo deve estar no formato ISO (YYYY-MM-DD).'
    }),
    prioridade: Joi.string().valid('baixa', 'media', 'alta').default('media').optional().messages({
        'string.base': 'A prioridade deve ser um texto.',
        'any.only': 'A prioridade deve ser baixa, media ou alta.'
    }),
    user_id: Joi.string().optional(),
});

// Define o schema de validação para a atualização de uma tarefa
const updateTaskSchema = Joi.object({
    nome: Joi.string().max(255).optional().messages({
        'string.base': 'O nome deve ser um texto.',
        'string.max': 'O nome não pode ter mais que 255 caracteres.'
    }),
    descricao: Joi.string().allow('').optional().messages({
        'string.base': 'A descrição deve ser um texto.'
    }),
    status: Joi.string().valid('pendente', 'em_andamento', 'concluida').optional().messages({
        'string.base': 'O status deve ser um texto.',
        'any.only': 'O status deve ser um dos seguintes: pendente, em_andamento, concluida.'
    }),
    category_id: Joi.number().integer().positive().optional().messages({
        'number.base': 'O ID da categoria deve ser um número.',
        'number.integer': 'O ID da categoria deve ser um número inteiro.',
        'number.positive': 'O ID da categoria deve ser um número positivo.'
    }),
    prazo: Joi.date().iso().allow('').optional().messages({
        'date.base': 'O prazo deve ser uma data válida.',
        'date.format': 'O prazo deve estar no formato ISO (YYYY-MM-DD).'
    }),
    prioridade: Joi.string().valid('baixa', 'media', 'alta').optional().messages({
        'string.base': 'A prioridade deve ser um texto.',
        'any.only': 'A prioridade deve ser baixa, media ou alta.'
    })
}).min(1).messages({ // Garante que pelo menos um campo seja enviado para atualização
    'object.min': 'Pelo menos um campo deve ser fornecido para atualização.'
});

module.exports = {
    createTaskSchema,
    updateTaskSchema
};
