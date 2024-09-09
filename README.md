# Task App - Jack Experts
<p>Este projeto é uma aplicação completa para gerenciamento de tarefas, utilizando NestJS no back-end e React no front-end, com autenticação e autorização baseadas em JWT. A API foi construída utilizando MySQL como banco de dados, gerenciado via Prisma ORM, com containers Docker para facilitar a execução.</p>

### Link do Repositório:
https://github.com/Antony-Lucas/task-app-jack-experts.git

## Instruções Gerais

### Documentação:
- Este README inclui instruções detalhadas de como rodar o projeto e as decisões tomadas durante o desenvolvimento.

## Tecnologias Utilizadas
- Backend: NestJS, Prisma ORM, MySQL
- Frontend: React, Axios, React-Router-Dom
- Autenticação: JWT
- Docker: Configuração completa para ambiente local com Docker Compose
- Swagger: Disponível em localhost:3000/api para documentação e teste da API

## Requisitos
- npm ou yarn
- Node.js: v20 ou superior
- Docker: Última versão estável

## Executando o Projeto

1. Clone o repositório:
   ```
    git clone https://github.com/Antony-Lucas/task-app-jack-experts.git
    cd task-app-jack-experts
   ```
2. Suba os containers do Docker (MySQL,NestJS e a aplicação React):
   ```
   docker compose up --build
   ```
3. Acessos:
> aplicação React(UI): http://localhost:80

> API: http://localhost:3000

> documentação Swagger: http://localhost:3000/api.
   
