# Projeto Gerenciador de Tarefas com Node.js e PostgreSQL

## 1. Descrição do Sistema Escolhido

Este projeto implementa um sistema de Gerenciador de Tarefas básico. Ele permite que usuários cadastrem-se, criem tarefas, organizem-nas por categorias e acompanhem seu status (pendente, em andamento, concluída). O objetivo principal é demonstrar a integração de uma aplicação Node.js com um banco de dados PostgreSQL, utilizando um sistema de migrações para gerenciar a estrutura do banco de dados.

Funcionalidades principais (previstas/implementadas):

*   **Usuários:** Cadastro e autenticação de usuários (a autenticação em si pode ser um próximo passo, o modelo de dados suporta).
*   **Categorias:** Criação e gerenciamento de categorias para organizar as tarefas.
*   **Tarefas:** Criação, visualização, atualização e exclusão de tarefas. Cada tarefa está associada a um usuário e pode, opcionalmente, pertencer a uma categoria.

O backend é construído com Node.js e Express, e o banco de dados utilizado é o PostgreSQL. As migrações de banco de dados são gerenciadas por um script customizado que executa arquivos SQL sequencialmente.

## 2. Estrutura de Pastas e Arquivos

A estrutura de pastas e arquivos sugerida para este projeto é a seguinte:

SEU-PROJETO/
├── .env                   # Variáveis de ambiente (não versionar)
├── .env.example           # Exemplo de arquivo de variáveis de ambiente
├── .gitignore             # Arquivos e pastas a serem ignorados pelo Git
├── package.json           # Dependências e scripts do projeto
├── package-lock.json      # Lockfile para dependências
├── src/                   # Pasta principal do código-fonte da aplicação
│   ├── config/            # Configurações da aplicação
│   │   └── db.js          # Configuração do banco de dados (ex: conexão com PostgreSQL)
│   ├── controllers/       # Controladores (lógica de requisição/resposta)
│   │   └── HomeController.js # Exemplo de controlador para a página inicial
│   ├── migrations/        # Arquivos de migração do banco de dados
│   │   └── 202405092230_usuarios.sql # Exemplo de arquivo de migração para a tabela de usuários
│   ├── models/            # Modelos de dados (representação das tabelas do banco)
│   │   └── User.js        # Exemplo de modelo para a tabela de usuários
│   ├── routes/            # Definições das rotas da API
│   │   └── index.js       # Rota principal (ex: /)
│   │   └── users.js       # Rotas relacionadas a usuários (ex: /users)
│   ├── services/          # Serviços ou lógica de negócio mais complexa
│   │   └── userService.js # Exemplo de serviço para operações com usuários
│   └── server.js          # Arquivo principal para iniciar o servidor Node.js
├── tests/                 # Testes automatizados
│   └── example.test.js    # Exemplo de arquivo de teste
└── README.md              # Documentação principal do projeto

**Descrição dos principais componentes:**

*   **`src/`**: Contém todo o código-fonte da aplicação.
    *   **`config/db.js`**: Responsável por estabelecer a conexão com o banco de dados PostgreSQL utilizando as credenciais do arquivo `.env`.
    *   **`migrations/`**: Armazena os scripts SQL para criar e alterar a estrutura do banco de dados. Os arquivos são nomeados com um timestamp para garantir a ordem de execução.
    *   **`runMigration.js`**: Script Node.js que lê os arquivos da pasta `migrations/` e os executa no banco de dados.
    *   **`server.js`**: Ponto de entrada da aplicação. Configura o servidor Express, define rotas básicas (como a de teste de conexão com o banco) e inicia o servidor.
    *   **`models/`, `controllers/`, `routes/`**: (Sugestão para evolução do projeto seguindo o padrão MVC) Pastas para organizar a lógica de modelos de dados, controladores de requisições e definições de rotas da API, respectivamente.
*   **`.env`**: Arquivo (não versionado) que armazena variáveis de ambiente sensíveis, como credenciais do banco de dados e a porta da aplicação.
*   **`.env.example`**: Um arquivo de exemplo para o `.env`, mostrando quais variáveis são necessárias. Este arquivo DEVE ser versionado.
*   **`.gitignore`**: Define quais arquivos e pastas não devem ser incluídos no controle de versão Git (ex: `node_modules/`, `.env`).
*   **`package.json`**: Arquivo padrão do Node.js que contém informações sobre o projeto, suas dependências e scripts (como `start` e `migration`).

## 3. Como Executar o Projeto Localmente

### Pré-requisitos

*   **Node.js e npm:** Certifique-se de ter o Node.js (versão 14.x ou superior recomendada) e o npm instalados. Você pode baixá-los em [nodejs.org](https://nodejs.org/) .
*   **PostgreSQL:** É necessário ter um servidor PostgreSQL instalado e em execução. Você pode baixá-lo em [postgresql.org](https://www.postgresql.org/) .
    *   Após a instalação, crie um banco de dados para este projeto (ex: `gerenciador_tarefas_db`).
    *   Anote o nome do banco, usuário, senha, host e porta do seu PostgreSQL, pois serão necessários para o arquivo `.env`.

### Passos para Configuração e Execução

1.  **Clonar o Repositório (se aplicável):**
    ```bash
    git clone <url_do_seu_repositorio>
    cd seu-projeto-gerenciador-tarefas
    ```
    Se você estiver montando o projeto do zero, crie a pasta do projeto e navegue até ela.

2.  **Instalar as Dependências:**
    Execute o comando abaixo na raiz do projeto para instalar as bibliotecas listadas no `package.json` (como Express, pg, dotenv):
    ```bash
    npm install
    ```

3.  **Configurar Variáveis de Ambiente:**
    *   Crie uma cópia do arquivo `.env.example` e renomeie-a para `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Abra o arquivo `.env` e substitua os valores de exemplo pelas suas credenciais reais do PostgreSQL e outras configurações:
        ```plaintext
        DB_HOST=localhost
        DB_PORT=5432
        DB_USER=seu_usuario_postgresql
        DB_PASSWORD=sua_senha_postgresql
        DB_DATABASE=gerenciador_tarefas_db # Ou o nome que você deu ao seu banco
        PORT=3000
        ```

4.  **Executar as Migrações do Banco de Dados:**
    Para criar as tabelas no seu banco de dados PostgreSQL, execute o script de migração:
    ```bash
    npm run migration
    ```
    Este comando executará os arquivos SQL localizados na pasta `src/migrations/` em ordem.
    Verifique o console para mensagens de sucesso ou erro. Se houver erros, verifique suas configurações no `.env` e se o servidor PostgreSQL está acessível.

5.  **Iniciar o Servidor:**
    Após configurar o banco de dados, inicie a aplicação Node.js:
    ```bash
    npm start
    ```
    Ou, alternativamente:
    ```bash
    node src/server.js
    ```
    Se tudo estiver correto, você verá uma mensagem no console indicando que o servidor está rodando, por exemplo: `Servidor rodando em http://localhost:3000`.

6.  **Testar a Aplicação:**
    Abra seu navegador ou uma ferramenta como o Postman/Insomnia e acesse a rota principal (geralmente `http://localhost:3000/`) . Se a conexão com o banco estiver funcionando, você deverá ver uma mensagem de confirmação (o `server.js` do tutorial inicial exibe a hora atual do banco).