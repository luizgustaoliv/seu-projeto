const Joi = require('joi');

class FeridaModel {
  static get schema() {
    return Joi.object({
        paciente_nome: Joi.string().max(100).required(),
        tipo: Joi.string().valid('aguda', 'crônica').required(),
        tempo: Joi.string().max(50).required(),
        descricao: Joi.string().min(1).max(12).required(),
    });
  }
}

module.exports = FeridaModel;
