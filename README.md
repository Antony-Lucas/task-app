# Task App
<p align="center">
  <img src="https://github.com/user-attachments/assets/1043cd51-9bb7-4a8e-a70e-981a830a36fa" alt="Captura de tela 2024-09-08 204426" width="800" height="400"/>
  <img src="https://github.com/user-attachments/assets/64c2e93b-b664-4eee-8f62-65691ba1bd30" alt="iPhone-13-PRO-localhost" width="200" height="400"/>
</p>


<p>Este projeto é uma aplicação completa para gerenciamento de tarefas, utilizando NestJS no back-end e React no front-end, com autenticação e autorização baseadas em JWT. A API foi construída utilizando MySQL como banco de dados, gerenciado via Prisma ORM, com containers Docker para facilitar a execução.</p>

### Link do Repositório:
https://github.com/Antony-Lucas/task-app.git

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
    git clone https://github.com/Antony-Lucas/task-app.git
    cd task-app
   ```
2. Abra o projeto em um editor de código da sua escolha(recomendo VsCode):
3. Suba os containers do Docker (MySQL,NestJS e a aplicação React):
   ```
   docker compose up --build
   ```
4. Acessos:
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

# Back-end

Durante o desenvolvimento dessa aplicação, foram tomadas várias decisões técnicas que visam garantir a escalabilidade, segurança e organização do código. Aqui estão algumas pontuações sobre minhas escolhas:

### 1. Uso do Prisma como ORM

- **Desenvolvimento rápido**: O Prisma fornece uma sintaxe intuitiva, facilitando a criação de consultas e manipulação de dados.
- **Migrações automáticas**: Geração e execução de migrações de banco de dados de maneira simples e eficaz.
- **Suporte a várias bases**: É compatível com diferentes bancos de dados mas nesse caso optei pelo mySQL até pela questão de estar trabalhando com ENUMS no projeto.

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

O **bcryptJs** vai ser utilizado para criptografar as senhas dos usuários antes de armazená-las no banco de dados. Isso garante que as senhas não sejam armazenadas em texto plano, protegendo as informações sensíveis dos usuários em caso de vazamento de dados

### 6. Autenticação com JWT

- Após o login, um token de acesso (`access_token`) e um token de atualização (`refresh_token`) são gerados.
- O token de acesso tem validade curta (5 minutos), enquanto o token de atualização tem uma validade maior (7 dias), permitindo que os usuários permaneçam autenticados por mais tempo sem precisar realizar o login repetidamente.
- Os tokens são armazenados no banco de dados e podem ser invalidados durante o logout.

### 7. Validação de Usuários e Dados

- O sistema valida se o usuário já existe ao criar uma conta ou atualizar o e-mail. Isso evita duplicidade e garante que cada usuário tenha um e-mail único. Além disso, as senhas são verificadas antes de conceder acesso ao usuário, garantindo a segurança nas autenticações.

### 8. Atualizações Condicionais e Completação de Tarefas

- No `TasksService`, foi implementada uma lógica que verifica o status da tarefa. Se o status for **COMPLETED**, a data de conclusão (`completedAt`) é registrada automaticamente. Isso permite um controle preciso de quando as tarefas foram concluídas.

### 9. Integração com Swagger

- A integração com o Swagger usando as anotações `@ApiProperty` e `@ApiBearerAuth` nos DTOs e controllers vai permitir a geração automática da documentação da API. Isso facilita a visualização e teste dos endpoints da API, além de fornecer uma interface amigável para outras pessoas que consomem a API.

Essas decisões foram tomadas para garantir que o sistema seja escalável, seguro e fácil de manter, além de proporcionar uma experiência de desenvolvimento eficiente.

# Front-end

## Estrutura do Projeto

O fluxo principal é dividido em componentes e hooks personalizados para manter a lógica organizada e reutilizável.

## Estrutura de Arquivos

- **`App.js`**: O componente principal que configura o roteamento e o contexto de autenticação.
- **`components/loginOrRegister.js`**: Componente para gerenciar o login e registro na aplicação.
- **`components/home.js`**: Componente pai para organizar os elementos das tarefas.
- **`components/tasks.js`**: Componente para renderização das tarefas.
- **`components/Sidenav.js`**: Componente de navegação lateral.
- **`components/Topnav.js`**: Componente de navegação superior.
- **`hooks/useUser.js`**: Hook personalizado para gerenciar dados do usuário e autenticação.
- **`services/userService.js`**: Funções para realizar operações com a API relacionadas ao usuário.
- **`PrivateRoute.js`**: Componente que gerencia o acesso às rotas privadas.

## Componentes Principais

### `App.js`

O componente principal `App` gerencia o estado de carregamento inicial e define as rotas da aplicação. Utiliza o `AuthProvider` para fornecer o contexto de autenticação a todos os componentes filhos. As rotas principais incluem:

- **`"/"`**: Redireciona para `"/home"`.
- **`"/login"`**: Renderiza o componente `LoginOrRegister`.
- **`"/home"`**: Protegido por `PrivateRoute` e renderiza o componente `Home`.

### `AuthProvider`

O `AuthProvider` é responsável por gerenciar a autenticação do usuário. Ele usa o estado local para armazenar informações de autenticação e fornece métodos para login, registro e logout:

- **`login`**: Realiza login do usuário e armazena tokens e dados no `sessionStorage`.
- **`signUp`**: Registra um novo usuário e armazena dados de autenticação.
- **`logout`**: Faz logout e limpa os dados de autenticação.

### `Sidenav`

O `Sidenav` é a barra de navegação lateral que permite a navegação entre diferentes seções da aplicação. Inclui:

- **Menu**: Links para diferentes seções.
- **Botão de Toggle**: Para abrir e fechar o menu lateral.

### `Topnav`

O `Topnav` é a barra de navegação superior que inclui:

- **Menu de Usuário**: Exibe informações do usuário e fornece opções para atualizar o perfil e sair da aplicação.
- **Campo de Busca**: Para realizar buscas na aplicação.

### `useUser` (Hook Personalizado)

O hook `useUser` fornece uma interface para gerenciar e atualizar dados do usuário. Inclui funções para:

- **`fetchUserData`**: Buscar dados do usuário.
- **`updateUserData`**: Atualizar dados do usuário.
- **`deleteUserData`**: Excluir a conta do usuário.
- **`handleLogout`**: Realizar logout e redirecionar para a página de login.

### `userService.js`

Este arquivo contém funções para interagir com a API relacionadas ao usuário:

- **`updateUser`**: Atualiza os dados do usuário e exibe uma mensagem de sucesso.
- **`deleteUser`**: Exclui a conta do usuário e realiza logout.

- # Task Management Context

O `TaskContext` fornece um contexto para gerenciar tarefas em uma aplicação React. Ele inclui funcionalidades para criar, atualizar, deletar e filtrar tarefas. O contexto também fornece funções utilitárias para formatar status e prioridade das tarefas, bem como gerenciar modais e filtros de busca.

## Providers e Hooks

### TaskProvider

O `TaskProvider` é responsável por fornecer o contexto das tarefas para os componentes filhos. Ele utiliza os hooks `useState`, `useEffect`, `useCallback` e `useAuth` para gerenciar o estado das tarefas e interagir com o serviço de autenticação.

### TasksServices

O `TasksServices` fornece funções para interagir com a API de tarefas.

### ToastServices

O `ToastServices` fornece funções para exibir mensagens de toast (notificações).

#### Funções principais

- **SuccessToastMessage(message, position)**: Exibe uma mensagem de sucesso.
- **ErrorToastMessage(message, position)**: Exibe uma mensagem de erro.

## Interceptor

O interceptor configura a autenticação e o gerenciamento de tokens com Axios.

### Configurações principais

- **getAccessToken()**: Obtém o token de acesso do `sessionStorage`.
- **getRefreshToken()**: Obtém o token de refresh do `sessionStorage`.
- **apiClient**: Instância do Axios configurada com interceptores.

### Interceptores

- **Request Interceptor**: Adiciona o token de acesso no cabeçalho das requisições.
- **Response Interceptor**: Gerencia a resposta de erro 401 e realiza a renovação do token, se necessário.

#### Funções principais

- **addTokenToSessionStorage(accessToken, refreshToken)**: Armazena os tokens no `sessionStorage`.
- 
### `PrivateRoute`

O componente `PrivateRoute` protege as rotas privadas. Exibe um carregamento até que as informações de autenticação estejam disponíveis e, se o usuário estiver autenticado, renderiza o layout com o `Sidenav` e o `Topnav`.

## Decisões de funcionalidades 

- **Contextos**: Usamos `AuthProvider` para fornecer o estado de autenticação para toda a aplicação, garantindo que a lógica de autenticação e a gestão de tokens estejam centralizadas e acessíveis em qualquer parte da aplicação.
- **Componentização**: Dividimos a aplicação em componentes como `Sidenav` e `Topnav` para uma melhor separação de preocupações e reutilização de código.
- **Hooks Personalizados**: Utilizamos o hook `useUser` para encapsular a lógica de gerenciamento do usuário, permitindo um código mais limpo e modular.
- **Rotas Protegidas**: O componente `PrivateRoute` protege as rotas que requerem autenticação, redirecionando usuários não autenticados para a página de login.
- 
## Docker
- Optei por usar o Docker para facilitar a configuração do ambiente de desenvolvimento e execução do projeto
- Também usei docker compose pra orquestrar os contêiners docker

![image](https://github.com/user-attachments/assets/f2948522-6876-4af6-b243-7b1895dd2a17)


