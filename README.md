# Blood Donation Support System

A comprehensive web application for managing blood donation processes at healthcare facilities.

## Features

- User authentication and role-based access (Guest, Member, Staff, Admin)
- Blood type compatibility checker
- Emergency blood request system
- Donor management and scheduling
- Blood inventory management
- Location-based donor search
- Donation history tracking
- Automated reminders for donation intervals
- Dashboard and reporting system

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- Material-UI (MUI) for UI components
- React Router for navigation
- Redux Toolkit for state management
- Axios for API calls
- React Query for server state management
- React Hook Form for form handling
- Yup for form validation

### Backend
- Spring Boot 3.x
- Spring Security for authentication
- Spring Data JPA for database operations
- MySQL 8.x for database
- JWT for authentication
- Swagger/OpenAPI for API documentation
- Maven for dependency management

### Development Tools
- Git for version control
- Docker for containerization
- Jira/Trello for project management
- GitHub Actions for CI/CD
- SonarQube for code quality
- Postman for API testing

## Prerequisites

- Node.js (v16 or higher)
- JDK 17 or higher
- MySQL 8.x
- Maven
- Docker (optional)

## Project Structure

```
blood-donation-system/
├── frontend/                # React + Vite frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
│
├── backend/                # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   ├── controllers/    # REST controllers
│   │   │   │   ├── services/       # Business logic
│   │   │   │   ├── repositories/   # Data access
│   │   │   │   ├── models/         # Entity classes
│   │   │   │   ├── dto/            # Data transfer objects
│   │   │   │   ├── config/         # Configuration classes
│   │   │   │   └── security/       # Security configuration
│   │   │   └── resources/
│   │   │       ├── application.yml # Application properties
│   │   │       └── db/             # Database migrations
│   │   └── test/                   # Test classes
│   └── pom.xml                     # Maven configuration
│
└── docs/                   # Project documentation
    ├── api/               # API documentation
    ├── database/          # Database schema
    └── deployment/        # Deployment guides
```

## Development Workflow

1. **Project Setup**
   - Use Git Flow branching strategy
   - Set up development, staging, and production environments
   - Configure CI/CD pipelines

2. **Frontend Development**
   ```bash
   # Create new React + Vite project
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install
   ```

3. **Backend Development**
   ```bash
   # Create new Spring Boot project using Spring Initializr
   # Add dependencies:
   # - Spring Web
   # - Spring Data JPA
   # - Spring Security
   # - MySQL Driver
   # - Lombok
   # - Validation
   ```

4. **Database Setup**
   ```sql
   # Create database and user
   CREATE DATABASE blood_donation_db;
   CREATE USER 'blood_donation_user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON blood_donation_db.* TO 'blood_donation_user'@'localhost';
   ```

## Project Management Recommendations

1. **Agile Methodology**
   - Use 2-week sprints
   - Daily standup meetings
   - Sprint planning and retrospectives
   - Use Jira/Trello for task tracking

2. **Code Quality**
   - Implement code review process
   - Use SonarQube for code quality checks
   - Follow coding standards and style guides
   - Write unit tests (minimum 80% coverage)

3. **Documentation**
   - Maintain API documentation using Swagger
   - Document database schema changes
   - Keep README and setup instructions updated
   - Document deployment procedures

4. **Version Control**
   - Use Git Flow branching strategy
   - Main branches: main, develop
   - Feature branches: feature/*
   - Release branches: release/*
   - Hotfix branches: hotfix/*

5. **Testing Strategy**
   - Unit tests for both frontend and backend
   - Integration tests for API endpoints
   - E2E tests for critical user flows
   - Performance testing for scalability

6. **Security Measures**
   - Implement OWASP security guidelines
   - Regular security audits
   - Input validation and sanitization
   - Secure password storage
   - Rate limiting
   - CORS configuration

## Getting Started

1. Clone the repository
2. Set up the development environment
3. Install dependencies
4. Configure environment variables
5. Start the development servers

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 