const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');

// Ordena os arquivos por nome (timestamp)
const migrationsDir = path.join(__dirname, 'src/migrations');
const files = fs.readdirSync(migrationsDir).sort();

(async () => {
  try {
    // Verifica a conexão com o banco de dados
    console.log('🔍 Verificando conexão com o banco de dados...');
    await db.query('SELECT NOW()');
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');

    // Verifica se o banco de dados existe
    console.log('🔍 Verificando se o banco de dados existe...');
    const dbExists = await db.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'task_manager']
    );
    
    if (dbExists.rows.length === 0) {
      console.log('⚠️ Banco de dados não encontrado. Criando...');
      // Conecta ao banco postgres para criar o novo banco
      const tempPool = new db.Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        port: process.env.DB_PORT || 5432,
      });
      
      await tempPool.query(`CREATE DATABASE ${process.env.DB_NAME || 'task_manager'}`);
      await tempPool.end();
      console.log('✅ Banco de dados criado com sucesso!');
    }

    // Executa as migrações
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`\n🔄 Executando: ${file}`);
      try {
        await db.query(sql);
        console.log(`✅ Migração ${file} executada com sucesso!`);
      } catch (migrationError) {
        console.error(`❌ Erro na migração ${file}:`);
        console.error('Detalhes do erro:', migrationError);
        throw migrationError;
      }
    }
    
    console.log('\n✅ Todas as migrações foram aplicadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao executar migração:');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
})();