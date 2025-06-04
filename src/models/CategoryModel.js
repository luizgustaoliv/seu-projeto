const Joi = require("joi");

// Schema para criação de categoria
const createCategorySchema = Joi.object({
    nome: Joi.string().max(255).required().messages({
        "string.base": "O nome deve ser um texto.",
        "string.max": "O nome não pode ter mais que 255 caracteres.",
        "any.required": "O nome é obrigatório."
    }),
    descricao: Joi.string().allow('').optional().messages({
        "string.base": "A descrição deve ser um texto."
    }),
    cor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional().messages({
        "string.pattern.base": "A cor deve estar no formato hexadecimal (ex: #FF0000)."
    })
});

// Schema para atualização de categoria
const updateCategorySchema = Joi.object({
    nome: Joi.string().max(255).optional().messages({
        "string.base": "O nome deve ser um texto.",
        "string.max": "O nome não pode ter mais que 255 caracteres."
    }),
    descricao: Joi.string().allow('').optional().messages({
        "string.base": "A descrição deve ser um texto."
    }),
    cor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional().messages({
        "string.pattern.base": "A cor deve estar no formato hexadecimal (ex: #FF0000)."
    })
}).min(1).messages({
    "object.min": "Pelo menos um campo deve ser fornecido para atualização."
});

module.exports = {
    createCategorySchema,
    updateCategorySchema
};
