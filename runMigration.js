const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Verifica se o arquivo .env existe
if (!fs.existsSync(path.join(__dirname, '.env'))) {
    console.error('❌ Erro: Arquivo .env não encontrado!');
    console.error('Por favor, crie um arquivo .env na raiz do projeto com a string de conexão do Supabase.');
    process.exit(1);
}

// Verifica se a string de conexão está definida
if (!process.env.DATABASE_URL) {
    console.error('❌ Erro: DATABASE_URL não está definida no arquivo .env!');
    console.error('Por favor, adicione a string de conexão do Supabase no arquivo .env.');
    process.exit(1);
}

const db = require('./src/config/db');

// Ordena os arquivos por nome (timestamp)
const migrationsDir = path.join(__dirname, 'src/migrations');

// Verifica se o diretório de migrações existe
if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Erro: Diretório de migrações não encontrado!');
    console.error(`O diretório ${migrationsDir} não existe.`);
    process.exit(1);
}

const files = fs.readdirSync(migrationsDir).sort();

(async () => {
  try {
    // Verifica a conexão com o banco de dados
    console.log('🔍 Verificando conexão com o banco de dados...');
    await db.query('SELECT NOW()');
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');

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