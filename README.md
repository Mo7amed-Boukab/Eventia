# Eventia

Eventia is a full-stack event management platform designed for organizing, managing, and participating in professional events. The application provides a premium user experience with features for event browsing, reservation management, and administrative control.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [API Reference](#api-reference)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

Eventia is a modern event management system built with Next.js for the frontend and NestJS for the backend. It enables administrators to create and manage events while participants can browse, reserve spots, and download PDF tickets with QR codes for confirmed reservations.

## Features

### Public Features
- Browse upcoming events with filtering by category
- View detailed event information
- User registration and authentication
- Responsive design optimized for all devices

### Participant Features
- Reserve spots for events
- View personal reservations and their status
- Download PDF tickets with QR codes for confirmed reservations
- Cancel pending reservations

### Administrator Features
- Create, edit, and delete events
- Manage event status (Draft, Published, Canceled)
- View and manage all reservations
- Confirm, reject, or cancel reservations
- Access dashboard with statistics and analytics

### Security Features
- JWT-based authentication with access and refresh tokens
- Role-based access control (RBAC)
- Protected routes and API endpoints
- Secure password hashing with bcrypt

## Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6
- **Language**: TypeScript 5
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database**: MongoDB with Mongoose 9
- **Authentication**: Passport.js with JWT
- **Validation**: class-validator, class-transformer
- **PDF Generation**: PDFKit
- **QR Code**: qrcode
- **Testing**: Jest, Supertest

### DevOps
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Linting**: ESLint, Prettier

## Architecture

The application follows a monorepo structure with separate frontend and backend directories:

```
Eventia/
├── frontend/          # Next.js application
├── backend/           # NestJS application
├── docker-compose.yml # Docker orchestration
└── .github/           # CI/CD workflows
```

### Database Schema

**User**
- first_name, last_name, email, password
- role: ADMIN | PARTICIPANT
- refreshToken (for JWT refresh)

**Event**
- title, description, category, date, time, location
- price, status (DRAFT | PUBLISHED | CANCELED)
- image, participants, maxParticipants

**Reservation**
- userId (reference to User)
- eventId (reference to Event)
- status: PENDING | CONFIRMED | CANCELED | REJECTED
- ticketNumber (generated upon confirmation)

## Prerequisites

- Node.js 20 or higher
- npm 10 or higher
- MongoDB 7 or higher (or Docker)
- Docker and Docker Compose (for containerized deployment)

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/eventia.git
cd eventia
```

### Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

**Root `.env` (for Docker Compose):**
```env
# Backend Configuration
MONGO_URI=mongodb://mongo:27017/eventia
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Backend `.env` (for local development without Docker):**
```env
MONGO_URI=mongodb://localhost:27017/eventia
PORT=4000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Frontend `.env` (for local development without Docker):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Running the Application

### Local Development (Without Docker)

1. **Start MongoDB** (if not using Docker):
   ```bash
   mongod
   ```

2. **Start the Backend:**
   ```bash
   cd backend
   npm run start:dev
   ```
   The API will be available at `http://localhost:4000`

3. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### Database Seeding

To populate the database with sample data:
```bash
cd backend
npm run seed
```

## Docker Deployment

### Development with Docker Compose

1. **Ensure the `.env` file exists** in the root directory with the required variables.

2. **Build and start all services:**
   ```bash
   docker compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Mongo Express (Database UI): http://localhost:8081

4. **Stop all services:**
   ```bash
   docker compose down
   ```

### Services

| Service        | Port  | Description                     |
|----------------|-------|---------------------------------|
| frontend       | 3000  | Next.js application             |
| backend        | 4000  | NestJS API                      |
| mongo          | 27017 | MongoDB database                |
| mongo-express  | 8081  | MongoDB administration interface|

## API Reference

### Authentication

| Method | Endpoint          | Description              | Auth Required |
|--------|-------------------|--------------------------|---------------|
| POST   | /auth/register    | Register a new user      | No            |
| POST   | /auth/login       | User login               | No            |
| POST   | /auth/refresh     | Refresh access token     | Yes (Refresh) |
| POST   | /auth/logout      | User logout              | Yes           |
| GET    | /auth/profile     | Get current user profile | Yes           |

### Events

| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| GET    | /events               | Get all events           | No            |
| GET    | /events/upcoming      | Get upcoming events      | No            |
| GET    | /events/:id           | Get event by ID          | No            |
| POST   | /events               | Create a new event       | Yes (Admin)   |
| PATCH  | /events/:id           | Update an event          | Yes (Admin)   |
| DELETE | /events/:id           | Delete an event          | Yes (Admin)   |

### Reservations

| Method | Endpoint                    | Description                     | Auth Required    |
|--------|-----------------------------|---------------------------------|------------------|
| GET    | /reservations               | Get all reservations            | Yes (Admin)      |
| GET    | /reservations/me            | Get user's reservations         | Yes              |
| GET    | /reservations/status/:eventId| Check reservation status       | Yes              |
| POST   | /reservations               | Create a reservation            | Yes (Participant)|
| PATCH  | /reservations/:id/confirm   | Confirm a reservation           | Yes (Admin)      |
| PATCH  | /reservations/:id/reject    | Reject a reservation            | Yes (Admin)      |
| PATCH  | /reservations/:id/cancel    | Cancel a reservation            | Yes              |
| GET    | /reservations/:id/ticket    | Download PDF ticket             | Yes              |

## Testing

### Backend Testing

```bash
cd backend

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

### Frontend Testing

```bash
cd frontend

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration. The pipeline runs on every push and pull request to the `main` branch.

### Pipeline Jobs

**Backend CI:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Run linting
5. Run unit tests
6. Build the application

**Frontend CI:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Run linting
5. Run tests
6. Build the application

The CI configuration is located at `.github/workflows/ci.yml`.

## Project Structure

```
Eventia/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── backend/
│   ├── src/
│   │   ├── auth/               # Authentication module
│   │   │   ├── decorators/     # Custom decorators
│   │   │   ├── dto/            # Data transfer objects
│   │   │   ├── guards/         # Auth guards
│   │   │   └── strategies/     # Passport strategies
│   │   ├── config/             # Configuration module
│   │   ├── database/           # Database module
│   │   ├── events/             # Events module
│   │   │   ├── dto/            # Event DTOs
│   │   │   └── schemas/        # Mongoose schemas
│   │   ├── reservations/       # Reservations module
│   │   │   ├── dto/            # Reservation DTOs
│   │   │   └── schemas/        # Mongoose schemas
│   │   ├── users/              # Users module
│   │   │   └── schemas/        # User schema
│   │   ├── app.module.ts       # Root module
│   │   ├── main.ts             # Application entry point
│   │   └── seed.ts             # Database seeder
│   ├── test/                   # E2E tests
│   ├── Dockerfile              # Backend Docker configuration
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── admin/              # Admin dashboard pages
│   │   │   ├── dashboard/      # Dashboard home
│   │   │   ├── events/         # Event management
│   │   │   └── reservations/   # Reservation management
│   │   ├── events/             # Event detail pages
│   │   ├── login/              # Login page
│   │   ├── my-reservations/    # User reservations
│   │   ├── register/           # Registration page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── admin/              # Admin components
│   │   ├── auth/               # Auth forms
│   │   ├── home/               # Home page sections
│   │   ├── ui/                 # Reusable UI components
│   │   ├── Footer.tsx          # Footer component
│   │   ├── Header.tsx          # Header component
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── context/                # React contexts
│   ├── lib/
│   │   ├── services/           # API services
│   │   └── types/              # TypeScript types
│   ├── __tests__/              # Frontend tests
│   ├── Dockerfile              # Frontend Docker configuration
│   └── package.json
├── docker-compose.yml          # Docker Compose configuration
├── .env.example                # Environment variables template
├── DEPLOYMENT.md               # Deployment documentation
└── README.md                   # This file
```

## User Roles

### Administrator (ADMIN)
- Full access to event management
- Can create, edit, publish, and delete events
- Can manage all reservations (confirm, reject, cancel)
- Access to dashboard with analytics

### Participant (PARTICIPANT)
- Can browse and view events
- Can make reservations for events
- Can view and manage personal reservations
- Can download tickets for confirmed reservations

### Code Style

- Follow the existing code style
- Run linting before committing: `npm run lint`
- Write tests for new features
- Keep commits atomic and descriptive

---

Developed with precision and care for professional work.
