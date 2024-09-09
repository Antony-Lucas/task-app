# Task App - Jack Experts
<p align="center">
  <img src="https://github.com/user-attachments/assets/1043cd51-9bb7-4a8e-a70e-981a830a36fa" alt="Captura de tela 2024-09-08 204426" width="1000" height="800"/>
  <img src="https://github.com/user-attachments/assets/64c2e93b-b664-4eee-8f62-65691ba1bd30" alt="iPhone-13-PRO-localhost" width="200" height="800"/>
</p>


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

### Estrutura do Banco de Dados
- O banco de dados foi modelado usando Prisma e MySQL com as seguintes tabelas principais:

- User: Armazena dados dos usuários.
- Tasks: Cada tarefa está associada a um usuário, com campos para status, prioridade, e timestamps.
- RefreshToken: Tabela para controle de tokens de atualização.
- enums para setar os valores padrões dos status e prioridades

Schema Prisma usado:
```
model User {
  id         Int      @id @default(autoincrement())
  username   String   @unique
  password   String
  name       String
  email      String   @unique
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  tasks      Tasks[]  @relation("UserTasks")
}

model Tasks {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      Status   @default(PENDING)
  priority    Priority @default(MEDIUM)
  userId      Int
  user        User     @relation("UserTasks", fields: [userId], references: [id])
}

enum Status {
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

```

## Docker
- Optei por usar o Docker para facilitar a configuração do ambiente de desenvolvimento e execução do projeto
- Também usei docker compose pra orquestrar os contêiners docker
