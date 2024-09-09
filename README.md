# Task App - Jack Experts
<p align="center">
  <img src="https://github.com/user-attachments/assets/1043cd51-9bb7-4a8e-a70e-981a830a36fa" alt="Captura de tela 2024-09-08 204426" width="800" height="400"/>
  <img src="https://github.com/user-attachments/assets/64c2e93b-b664-4eee-8f62-65691ba1bd30" alt="iPhone-13-PRO-localhost" width="200" height="400"/>
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
## Decisões Técnicas no Desenvolvimento da Aplicação

Durante o desenvolvimento dessa aplicação, foram tomadas várias decisões técnicas que visam garantir a escalabilidade, segurança e organização do código. Aqui estão algumas pontuações sobre minhas escolhas:

### 1. Uso do Prisma como ORM

- **Desenvolvimento rápido**: O Prisma fornece uma sintaxe intuitiva, facilitando a criação de consultas e manipulação de dados.
- **Migrações automáticas**: Geração e execução de migrações de banco de dados de maneira simples e eficaz.
- **Validação de tipos**: Como o Prisma gera modelos tipados em TypeScript, há uma melhor integração com o TypeScript, garantindo que erros relacionados a tipos sejam detectados em tempo de compilação.
- **Suporte a várias bases**: É compatível com diferentes bancos de dados, o que torna a aplicação escalável para diferentes cenários.

### 2. Uso de DTOs (Data Transfer Objects)

- **Clareza e controle sobre os dados**: Define explicitamente quais dados são esperados na requisição ou resposta, garantindo que a interface entre o cliente e o servidor esteja bem definida.
- **Validação e documentação automática**: Com o `@ApiProperty` do `@nestjs/swagger`, os DTOs também geram automaticamente a documentação da API (Swagger). 
- **Segurança**: DTOs permitem garantir que somente os campos necessários sejam manipulados ou expostos, evitando a passagem de dados indesejados.

### 3. Estrutura do Service e Controller
- **Services**: Contêm a lógica de negócios, como operações de criação, atualização, remoção e consulta de tarefas e usuários. Essa camada interage diretamente com o banco de dados via Prisma.
  - No caso de `TasksService` e `UserService`, coloquei uma lógica adicional, como a atualização do campo `completedAt` se a tarefa for marcada como concluída, e a criptografia com bcryptJS de senhas no serviço de usuário.
- **Controllers**: Definem os endpoints e lidam com as requisições HTTP. Eles chamam os métodos dos serviços para realizar a lógica de negócios e retornar a resposta adequada.

### 4. Formatação de Datas com Moment.js

- **Timezone correto**: Com a configuração `America/Sao_Paulo`, as datas são mostradas corretamente de acordo com o fuso horário UTC-3, comum no Brasil.
- **Formatos amigáveis**: Datas são formatadas em um estilo legível como `D de MMMM YYYY às HH:mm`, facilitando a leitura pelo usuário.

### 5. Criptografia de Senhas

O **bcryptJs** é utilizado para criptografar as senhas dos usuários antes de armazená-las no banco de dados. Isso garante que as senhas não sejam armazenadas em texto plano, protegendo as informações sensíveis dos usuários em caso de vazamento de dados

### 6. Autenticação com JWT

- Após o login, um token de acesso (`access_token`) e um token de atualização (`refresh_token`) são gerados.
- O token de acesso tem validade curta (5 minutos), enquanto o token de atualização tem uma validade maior (7 dias), permitindo que os usuários permaneçam autenticados por mais tempo sem precisar realizar o login repetidamente.
- Os tokens são armazenados no banco de dados e podem ser invalidados durante o logout.

### 7. Validação de Usuários e Dados

- O sistema valida se o usuário já existe ao criar uma conta ou atualizar o e-mail. Isso evita duplicidade e garante que cada usuário tenha um e-mail único. Além disso, as senhas são verificadas antes de conceder acesso ao usuário, garantindo a segurança nas autenticações.

### 8. Atualizações Condicionais e Completação de Tarefas

- No `TasksService`, foi implementada uma lógica que verifica o status da tarefa. Se o status for **COMPLETED**, a data de conclusão (`completedAt`) é registrada automaticamente. Isso permite um controle preciso de quando as tarefas foram concluídas.

### 9. Integração com Swagger

- A integração com o Swagger usando as anotações `@ApiProperty` e `@ApiBearerAuth` nos DTOs e controllers permite a geração automática da documentação da API. Isso facilita a visualização e teste dos endpoints da API, além de fornecer uma interface amigável para outros desenvolvedores que consomem a API.

Essas decisões foram tomadas para garantir que o sistema seja escalável, seguro e fácil de manter, além de proporcionar uma experiência de desenvolvimento eficiente.


## Docker
- Optei por usar o Docker para facilitar a configuração do ambiente de desenvolvimento e execução do projeto
- Também usei docker compose pra orquestrar os contêiners docker
