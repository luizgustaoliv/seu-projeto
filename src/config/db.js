const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Verifica se as variáveis de ambiente estão definidas
if (!process.env.DATABASE_URL) {
    console.error('Erro: DATABASE_URL não está definida no arquivo .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20, // número máximo de clientes no pool
    idleTimeoutMillis: 30000, // tempo máximo que um cliente pode ficar inativo
    connectionTimeoutMillis: 2000, // tempo máximo para estabelecer conexão
});

// Teste de conexão
pool.connect((err, client, release) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        console.error('String de conexão:', process.env.DATABASE_URL);
    } else {
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        release();
    }
});

module.exports = pool;