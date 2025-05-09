# Documento de Arquitetura Web (WAD) - Gerenciador de Tarefas

## 1. Introdução

A estrutura desse projeto corresponde a um sistema de Gerenciador de Tarefas, uma aplicação web projetada para permitir que usuários organizem e acompanhem suas atividades. O sistema é desenvolvido utilizando Node.js com o framework Express para o backend e PostgreSQL como banco de dados relacional para persistência dos dados.

O objetivo principal é fornecer uma plataforma simples e eficiente para o gerenciamento de tarefas pessoais ou de equipe, com funcionalidades como cadastro de usuários, criação de tarefas, atribuição de categorias e acompanhamento do progresso das tarefas.

A arquitetura busca seguir boas práticas de desenvolvimento, incluindo a separação de responsabilidades (potencialmente evoluindo para um padrão MVC - Model-View-Controller), configuração desacoplada através de variáveis de ambiente e um sistema de migrações para gerenciar a evolução do esquema do banco de dados de forma controlada e versionada.

## 2. Diagrama do Banco de Dados (Modelo Relacional e Físico)

A seguir, apresentamos a descrição das entidades (tabelas) e seus relacionamentos, que formam a base do banco de dados do Gerenciador de Tarefas. O modelo físico detalhado, com os comandos SQL para criação das tabelas, encontra-se no arquivo `gerenciador_tarefas.sql` (ou no arquivo de migração correspondente no projeto, como `src/migrations/AAAAMMDDHHMM_gerenciador_tarefas.sql`).

### Entidades Principais e Relacionamentos:

1.  **Tabela `users` (Usuários)**
    *   **Descrição:** Armazena informações sobre os usuários do sistema.
    *   **Campos Principais:**
        *   `id` (UUID, Chave Primária): Identificador único do usuário.
        *   `nome` (VARCHAR): Nome completo do usuário.
        *   `email` (VARCHAR, Único): Endereço de e-mail do usuário, utilizado para login e comunicação.
        *   `senha` (VARCHAR): Hash da senha do usuário (importante: nunca armazenar senhas em texto plano).
        *   `data_criacao` (TIMESTAMP): Data e hora em que o usuário foi cadastrado.
    *   **Relacionamentos:**
        *   Um usuário pode ter várias tarefas (relação de um-para-muitos com a tabela `tasks`).

2.  **Tabela `categories` (Categorias)**
    *   **Descrição:** Armazena as categorias que podem ser usadas para classificar as tarefas.
    *   **Campos Principais:**
        *   `id` (UUID, Chave Primária): Identificador único da categoria.
        *   `nome` (VARCHAR, Único): Nome da categoria (ex: "Trabalho", "Estudo", "Pessoal").
        *   `data_criacao` (TIMESTAMP): Data e hora em que a categoria foi criada.
    *   **Relacionamentos:**
        *   Uma categoria pode estar associada a várias tarefas (relação de um-para-muitos com a tabela `tasks`).

3.  **Tabela `tasks` (Tarefas)**
    *   **Descrição:** Armazena os detalhes das tarefas criadas pelos usuários.
    *   **Campos Principais:**
        *   `id` (UUID, Chave Primária): Identificador único da tarefa.
        *   `titulo` (VARCHAR): Título breve da tarefa.
        *   `descricao` (TEXT): Descrição detalhada da tarefa (opcional).
        *   `status` (VARCHAR): Estado atual da tarefa (ex: "pendente", "em_andamento", "concluida").
        *   `data_criacao` (TIMESTAMP): Data e hora em que a tarefa foi criada.
        *   `data_limite` (TIMESTAMP): Prazo final para a conclusão da tarefa (opcional).
        *   `data_conclusao` (TIMESTAMP): Data e hora em que a tarefa foi marcada como concluída (opcional).
        *   `user_id` (UUID, Chave Estrangeira): Referencia o `id` da tabela `users`, indicando a qual usuário a tarefa pertence. Este campo é obrigatório.
        *   `category_id` (UUID, Chave Estrangeira): Referencia o `id` da tabela `categories`, indicando a qual categoria a tarefa pertence (opcional).
    *   **Relacionamentos:**
        *   Cada tarefa pertence a um único usuário (`user_id` é uma chave estrangeira para `users.id`).
        *   Cada tarefa pode, opcionalmente, pertencer a uma única categoria (`category_id` é uma chave estrangeira para `categories.id`).

