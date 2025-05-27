const db = require('../config/database');

class FeridaRepository {
    async inserir(ferida) {
        console.log('[FeridaRepository] = inserindo ferida no banco');
        const { paciente_nome, tipo, tempo, descricao } = ferida;
        const result = await db.query(`
            INSERT INTO feridas (paciente_nome, tipo, tempo, descricao)
            VALUES ($1, $2, $3, $4)
            Returning id; paciente_nome, tipo, tempo, descricao, data_cadastro
                `, [paciente_nome, tipo, tempo, descricao]);
            console.log('[FeridaRepository] = ferida inserida', result.rows[0].id);
        return result.rows[0].id;
    }
}

module.exports = new FeridaRepository;