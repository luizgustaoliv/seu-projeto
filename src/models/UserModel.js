const Joi = require("joi");

// Schema para criação de usuário
const createUserSchema = Joi.object({
    nome: Joi.string().max(255).required().messages({
        "string.base": "O nome deve ser um texto.",
        "string.max": "O nome não pode ter mais que 255 caracteres.",
        "any.required": "O nome é obrigatório."
    }),
    email: Joi.string().email().required().messages({
        "string.email": "O email deve ser válido.",
        "any.required": "O email é obrigatório."
    }),
    senha: Joi.string().min(6).required().messages({
        "string.min": "A senha deve ter no mínimo 6 caracteres.",
        "any.required": "A senha é obrigatória."
    })
});

// Schema para atualização de usuário (exemplo, ajustar conforme necessidade)
const updateUserSchema = Joi.object({
    nome: Joi.string().max(255).optional().messages({
        "string.base": "O nome deve ser um texto.",
        "string.max": "O nome não pode ter mais que 255 caracteres."
    }),
    email: Joi.string().email().optional().messages({
        "string.email": "O email deve ser válido."
    }),
    senha: Joi.string().min(6).optional().messages({
        "string.min": "A senha deve ter no mínimo 6 caracteres."
    })
}).min(1).messages({
    "object.min": "Pelo menos um campo deve ser fornecido para atualização."
});

// Schema para login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().required()
});


module.exports = {
    createUserSchema,
    updateUserSchema,
    loginSchema
};
