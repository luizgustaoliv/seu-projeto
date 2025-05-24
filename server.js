// server.js
const express = require("express");
const bodyParser = require("body-parser"); // Importado
const cors = require("cors"); // Importado
const routes = require("./routes"); // Importado para as rotas da API
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Adicionado
app.use(bodyParser.json()); // Adicionado

// Usando as rotas definidas para a API de tarefas
app.use("/api", routes); // Adicionado

// Rota de teste original (opcional, pode ser mantida ou removida)
// app.get('/', async (req, res) => {
//   try {
//     // Tentará usar o pool de conexão configurado em config/database.js
//     const pool = require('./config/database'); // Ajustado para o caminho esperado
//     const result = await pool.query('SELECT NOW()');
//     res.send(`Hora atual no banco: ${result.rows[0].now}`);
//   } catch (err) {
//     console.error("Erro na rota de teste /:", err);
//     res.status(500).send('Erro ao conectar com o banco ou carregar config/database.js.');
//   }
// });

// Verifica a conexão com o banco de dados antes de iniciar o servidor
try {
  const pool = require("./config/database"); // Caminho esperado conforme instruções anteriores
  pool.query("SELECT NOW()", (err, dbRes) => {
    if (err) {
      console.error("Erro ao conectar ao banco de dados:", err);
      // Decide se quer iniciar o servidor mesmo sem DB ou parar
      // Considerar não iniciar se o DB for essencial
      // app.listen(port, () => {
      //   console.log(`Servidor rodando na porta ${port}, mas SEM conexão com o banco de dados.`);
      // });
      console.error("O servidor NÃO será iniciado devido a erro na conexão com o banco.");
      process.exit(1); // Encerra o processo se não puder conectar
    } else {
      console.log("Conexão com o banco de dados estabelecida com sucesso.");
      app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
      });
    }
  });
} catch (error) {
    console.error("Erro crítico: Não foi possível carregar a configuração do banco de dados (./config/database.js). Verifique se o arquivo existe, está correto e se as variáveis no .env estão definidas.", error);
    console.error("O servidor NÃO será iniciado.");
    process.exit(1); // Encerra o processo
}

// Tratamento básico para rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).send("Erro 404: Rota não encontrada.");
});

// Tratamento básico de erros (500)
app.use((err, req, res, next) => {
  console.error("Erro interno no servidor:", err.stack);
  res.status(500).send("Erro 500: Algo deu errado no servidor!");
});
