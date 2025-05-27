const db = require('../config/database');

class RelatorioRepository {
    async listarTodas() {
        console.log('[RelatorioRepository] = listando todos os relatórios');
        const result = await db.query(`
            SELECT id, paiente_nome, tipo, tempo, descricao, data_cadastro FROM relatorios
            From feridas
            ORDER BY data_cadastro DESC
        `);
        console.log('[RelatorioRepository] = relatórios listados', result.rows.length);
        return result.rows;
    }
}