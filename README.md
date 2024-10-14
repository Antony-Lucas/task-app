# Task App
<p align="center">
  <img src="https://github.com/user-attachments/assets/1043cd51-9bb7-4a8e-a70e-981a830a36fa" alt="Captura de tela 2024-09-08 204426" width="800" height="400"/>
  <img src="https://github.com/user-attachments/assets/64c2e93b-b664-4eee-8f62-65691ba1bd30" alt="iPhone-13-PRO-localhost" width="200" height="400"/>
</p>


This project is a complete task management application, using NestJS for the back-end and React for the front-end, with authentication and authorization based on JWT. The API was built using MySQL as the database, managed via Prisma ORM, with Docker containers for easier execution.

Repository Link:  
https://github.com/Antony-Lucas/task-app.git

## General Instructions
**Documentation**:  
This README includes detailed instructions on how to run the project and the decisions made during development.

## Technologies Used
- **Backend**: NestJS, Prisma ORM, MySQL  
- **Frontend**: React, Axios, React-Router-Dom  
- **Authentication**: JWT  
- **Docker**: Complete configuration for local environment with Docker Compose  
- **Swagger**: Available at `localhost:3000/api` for API documentation and testing  

## Requirements
- npm or yarn  
- Node.js: v20 or higher  
- Docker: Latest stable version  

## Running the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/Antony-Lucas/task-app.git
   cd task-app
   ```

2. Open the project in a code editor of your choice (VSCode recommended).

3. Start the Docker containers (MySQL, NestJS, and the React app):
   ```bash
   docker compose up --build
   ```

### Access:
- React application (UI): http://localhost:80  
- API: http://localhost:3000  
- Swagger documentation: http://localhost:3000/api

## Database Structure

The database was modeled using Prisma and MySQL with the following main tables:

- **User**: Stores user data.  
- **Tasks**: Each task is associated with a user, with fields for status, priority, and timestamps.  
- **RefreshToken**: Table for managing refresh tokens.  

Enums are used to set default values for statuses and priorities.

**Prisma Schema Used**:

```prisma
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

## Technical Decisions in Application Development

### Back-end
During the development of this application, several technical decisions were made to ensure scalability, security, and code organization. Here are some key points:

1. **Use of Prisma ORM**
   - **Rapid Development**: Prisma provides an intuitive syntax, making it easier to create queries and manipulate data.
   - **Automatic Migrations**: Simple and effective generation and execution of database migrations.
   - **Support for Multiple Databases**: Prisma is compatible with different databases, but MySQL was chosen for this project due to its use of ENUMs.

2. **Use of DTOs (Data Transfer Objects)**
   - **Clarity and Data Control**: DTOs define explicitly which data is expected in requests or responses, ensuring a well-defined interface between client and server.
   - **Automatic Validation and Documentation**: With `@ApiProperty` from `@nestjs/swagger`, DTOs automatically generate API documentation (Swagger).
   - **Security**: DTOs ensure that only the necessary fields are handled or exposed, avoiding unwanted data transmission.

3. **Service and Controller Structure**
   - **Services**: Contain business logic, such as creating, updating, removing, and querying tasks and users. This layer interacts directly with the database via Prisma.
   - **Controllers**: Define endpoints and handle HTTP requests, calling service methods to execute business logic and return the appropriate response.

4. **Date Formatting with Moment.js**
   - **Correct Timezone**: Using the America/Sao_Paulo configuration, dates are displayed according to the UTC-3 timezone.
   - **User-Friendly Formats**: Dates are formatted in a readable style, like "D of MMMM YYYY at HH:mm".

5. **Password Encryption**
   - **bcryptJs**: Used to encrypt user passwords before storing them in the database, ensuring that sensitive information is protected in case of data leaks.

6. **JWT Authentication**
   - Upon login, an access token (`access_token`) and a refresh token (`refresh_token`) are generated.
   - The access token is short-lived (5 minutes), while the refresh token lasts longer (7 days), allowing users to remain logged in without needing to re-authenticate frequently.
   - Tokens are stored in the database and can be invalidated during logout.

7. **User and Data Validation**
   - The system validates if a user already exists when creating an account or updating the email, ensuring that each user has a unique email.

8. **Conditional Updates and Task Completion**
   - In `TasksService`, logic checks if the task status is COMPLETED. If so, the `completedAt` date is automatically recorded, ensuring precise control over task completion.

9. **Integration with Swagger**
   - Swagger integration via `@ApiProperty` and `@ApiBearerAuth` annotations allows automatic generation of API documentation.

### Front-end

The main flow is divided into components and custom hooks to keep the logic organized and reusable.

#### File Structure:
- **App.js**: Main component that sets up routing and authentication context.
- **components/loginOrRegister.js**: Manages login and registration.
- **components/home.js**: Parent component organizing task elements.
- **components/tasks.js**: Renders tasks.
- **components/Sidenav.js**: Side navigation component.
- **components/Topnav.js**: Top navigation component.
- **hooks/useUser.js**: Custom hook for managing user data and authentication.
- **services/userService.js**: Functions for user-related API operations.
- **PrivateRoute.js**: Manages access to private routes.

### Main Functionalities

- **App.js**: Manages the initial loading state and defines application routes.
- **AuthProvider**: Manages user authentication, providing methods for login, registration, and logout.
- **Sidenav**: Lateral navigation bar for navigating between sections.
- **Topnav**: Top navigation bar with user info and search functionality.
- **useUser (Custom Hook)**: Provides an interface for managing and updating user data.
- **PrivateRoute**: Protects private routes, displaying a loading state until authentication info is available.

### Docker

Docker was chosen to simplify the setup and execution of the development environment, using Docker Compose to orchestrate the containers.

![image](https://github.com/user-attachments/assets/f2948522-6876-4af6-b243-7b1895dd2a17)


