# EN2H Booking Platform REST API

A progressive, enterprise-grade NestJS REST API engine designed for managing customer service catalogs and appointment bookings. It features secure JWT authentication, automatic input schema validations, database entity relations with PostgreSQL, and interactive API documentation.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Installation Steps](#installation-steps)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Running Migrations](#running-migrations)
7. [API Documentation](#api-documentation)
8. [Assumptions Made](#assumptions-made)
9. [Future Improvements](#future-improvements)

---

## Project Overview

The **EN2H Booking Platform REST API** acts as the backend booking ledger system. It separates concerns between administrative/staff operations and client-facing features:
- **Administrative Users**: Can register, log in, and perform full CRUD operations on services. They also manage booking statuses and cancellations.
- **Anonymous Customers**: Can browse the available services catalog and request bookings without requiring an account.

### Features
- **JWT Security**: Secures administrative endpoints.
- **Global Validation & Exception Handling**: Rejects malformed JSON bodies and converts exception messages into standard response schemas.
- **Relational Integrity**: Integrates PostgreSQL using TypeORM with cascade behavior.
- **Advanced Bookings Queries**: Offers pagination, case-insensitive keyword searches, and status filtering out-of-the-box.

---

## Installation Steps

1. **Clone or Extract the Project Directory**
   Ensure you are in the root directory containing `package.json`.

2. **Install Dependencies**
   Run the following command to download and install all necessary npm modules:
   ```bash
   npm install
   ```

---

## Environment Variables

The application relies on environment configurations. In the root directory, create a `.env` file matching the schema defined in `.env.example`:

```env
# Application Port Config
PORT=3000

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=en2h_booking_db

# Security & Tokens Configuration
JWT_SECRET=your_super_secret_jwt_token_key_abc_123_xyz
JWT_EXPIRATION=3600s
```

---

## Database Setup

1. **Install PostgreSQL**
   Ensure PostgreSQL is installed locally or running in a container.

2. **Create the Database**
   Log into your PostgreSQL instance and create the target database schema:
   ```sql
   CREATE DATABASE en2h_booking_db;
   ```

3. **Development Auto-Sync**
   By default, the application is configured to run in development speed mode (`synchronize: true` in `app.module.ts`). On application startup, TypeORM will automatically inspect your models and create the `users`, `services`, and `bookings` tables for you.

---

## Running the Application

You can execute the NestJS server using the following commands:

```bash
# Run in development watch mode (Hot-reload enabled)
npm run start:dev

# Build the production bundle
npm run build

# Run the compiled production bundle
npm run start:prod
```

---

## Running Migrations

Database schema updates are managed using TypeORM migrations. In development and production, schema synchronization is disabled (`synchronize: false` in [app.module.ts](file:///c:/Users/RCS/intern/en2h-booking-platform/src/app.module.ts)) to prevent data loss.

### Automatic Runs on Startup
Since `migrationsRun: true` is configured in `AppModule`, any pending migrations inside `src/db/migrations/` will run automatically when you boot the server via `npm run start` or `npm run start:dev`.

### Manual Migration Scripts
You can also run or generate migrations manually using the following npm scripts:

- **Run Pending Migrations**:
  ```bash
  npm run migration:run
  ```

- **Generate a New Migration (based on entity schema changes)**:
  ```bash
  npm run migration:generate -- src/db/migrations/YourMigrationName
  ```

- **Revert the Last Applied Migration**:
  ```bash
  npm run typeorm migration:revert
  ```

- **Configuration File**: All migrations use the database parameters loaded from the `.env` file via [typeorm.config.ts](file:///c:/Users/RCS/intern/en2h-booking-platform/typeorm.config.ts).

---

## API Documentation

Interactive API documentation is generated automatically using **Swagger (OpenAPI)**. 

- **Local Swagger UI Link**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
  *(Accessible once the local server is running)*

### Endpoint Highlights

#### 🔐 Authentication (`/auth`)
* `POST /auth/register` - Registers a new user.
* `POST /auth/login` - Authenticates user credentials and returns a JWT Bearer token.

#### 🛠️ Service Catalog Management (`/services`)
* `GET /services` *(Public)* - Retrieves all active and inactive services.
* `GET /services/:id` *(Public)* - Retrieves details for a specific service.
* `POST /services` *(Authenticated)* - Creates a new catalog item.
* `PATCH /services/:id` *(Authenticated)* - Updates service pricing, description, duration, or active status.
* `DELETE /services/:id` *(Authenticated)* - Deletes a service.

#### 📅 Booking Management (`/bookings`)
* `POST /bookings` *(Public)* - Places an appointment booking request for an active service.
* `GET /bookings` *(Authenticated)* - Retrieves historical bookings (supports `page`, `limit`, `search`, and `status` query filters).
* `GET /bookings/:id` *(Authenticated)* - Retrieves a specific booking.
* `PATCH /bookings/:id/status` *(Authenticated)* - Updates a booking state.
* `DELETE /bookings/:id/cancel` *(Authenticated)* - Cancels a booking.

---

## Assumptions Made

1. **Service Visibility**: Retrieve operations for services (`GET /services` and `GET /services/:id`) are public. This ensures anonymous customers can discover services in order to book them.
2. **Booking Date Boundaries**: The date comparison checks that the requested appointment date is on or after the current UTC date string (`YYYY-MM-DD`). 
3. **Service Availability**: A booking can only be placed on a service whose `isActive` flag is explicitly set to `true`.
4. **Duplicate Prevention**: The check prevents duplicate bookings only if the existing matching booking is in a `CONFIRMED` state. Customers can create identical requests if the matching slot is still `PENDING`, `CANCELLED`, or `COMPLETED`.
5. **State Transition Constraint**: Only the direct transition from `CANCELLED` status to `COMPLETED` status is blocked, in accordance with the requirement *"Canceled bookings cannot be marked as completed."*

---

## Future Improvements

1. **Docker Containerization**: Add a `Dockerfile` and `docker-compose.yml` to bundle the Node application and Postgres database into an isolated orchestratable stack.
2. **Refresh Token Rotation**: Implement standard token rotation via HttpOnly cookies to keep administrative users safely logged in.
3. **Comprehensive Unit Testing**: Replace boilerplate spec files with mock-injected test suites verifying service-level database exceptions, validation dtos, and boundary rules.
4. **Advanced Date/Time Slot Logic**: Integrate time zone handling (e.g., luxon or moment-timezone) and calculate service durations to prevent overlapping bookings.
5. **Strict Booking State Machine**: Restrict status modifications so once a booking is marked as `COMPLETED` or `CANCELLED`, its state becomes immutable.
