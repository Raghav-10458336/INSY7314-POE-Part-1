# Member 3 - Docker Containerisation and Logging

This document contains the implementation notes and evidence checklist for the Part 3 Member 3 contribution.

## Implemented scope

- Separate backend and frontend Dockerfiles.
- Docker Compose for backend, frontend and MongoDB.
- Dedicated Docker bridge network.
- MongoDB persistent named volume.
- Persistent backend log named volume.
- Environment-variable based configuration.
- Container health checks and startup dependencies.
- Structured logging for HTTP requests, login attempts, bookings, transactions and API/server errors.
- Sensitive-data redaction and hashing for log safety.
- Optional Better Stack remote log forwarding.
- README documentation and test/evidence instructions.

## Docker files

- `Dockerfile` - Node.js backend image.
- `frontend/Dockerfile` - multi-stage React build served by Nginx.
- `frontend/nginx.conf` - SPA routing and basic response security headers.
- `docker-compose.yml` - complete three-service application.
- `.dockerignore` and `frontend/.dockerignore` - prevent secrets/unnecessary files entering images.
- `.env.docker.example` - safe Docker environment template.

## Logging files

- `services/logger.js` - structured JSON logging, redaction, persistent file logs and Better Stack forwarding.
- `middleware/requestLogger.js` - logs method, path, status, response time and authenticated user context.
- `controllers/authController.js` - logs successful and failed login attempts without passwords or raw email addresses.
- `controllers/bookingController.js` - logs booking and transaction creation events.
- `middleware/errorHandler.js` - records controlled API error events without returning sensitive implementation details.
- `tests/logger.test.js` - verifies redaction and hashing behaviour.

## Run with Docker Compose

1. Install and start Docker Desktop.
2. Copy `.env.docker.example` to `.env` if the repository does not already have a suitable `.env` file.
3. Set a long random `JWT_SECRET` in `.env`.
4. Optional: add the Better Stack source token and ingesting host.
5. From the repository root run:

```powershell
docker compose config
docker compose up --build -d
docker compose ps
```

Application addresses:

- Frontend: `http://localhost:5173`
- Backend health: `https://localhost:5000/health`

The backend uses the project's local self-signed HTTPS certificate. The browser may require the certificate warning to be accepted once during local development.

## Verify the complete application

Open the frontend and test:

1. Register/login.
2. Freelancer gig creation.
3. Client gig browsing.
4. Booking creation.
5. Freelancer bookings/income pages.

Check container status:

```powershell
docker compose ps
```

Check backend container output:

```powershell
docker compose logs backend
```

Check the persistent structured log inside the backend container:

```powershell
docker compose exec backend sh -c "tail -n 50 /app/logs/application.log"
```

Check error-only logs:

```powershell
docker compose exec backend sh -c "tail -n 50 /app/logs/error.log"
```

## MongoDB persistent storage proof

Create application data, then run:

```powershell
docker compose down
docker compose up -d
```

Confirm the previously created users/gigs/bookings are still present. The `hustlehub_mongo_data` named volume persists database data across normal container removal/recreation.

To list the volumes:

```powershell
docker volume ls
```

Do not use `docker compose down -v` during persistence testing because `-v` intentionally deletes named volumes.

## Logging events

The application produces structured JSON events including:

- `server_started`
- `http_request`
- `login_succeeded`
- `login_failed`
- `booking_created`
- `transaction_created`
- `transaction_creation_failed`
- `booking_rollback_failed`
- `api_error`
- `server_startup_failed`

## Sensitive-data protection

The logger intentionally does not record request bodies. Common sensitive keys such as passwords, tokens, authorization values, cookies, JWT secrets, MongoDB URIs and monitoring source tokens are redacted.

Raw email addresses and IP addresses are not logged for login events. They are converted to short SHA-256 hashes for correlation without exposing the original values.

Booking and transaction log events contain IDs/status information but do not log payment amounts.

`.env` and runtime `.log` files remain ignored by Git.

## Better Stack integration

Better Stack forwarding is optional at runtime but fully integrated in the code. Local file/console logging continues to work when Better Stack is not configured.

To enable it:

1. Create a Better Stack Telemetry log source for Node.js/HTTP logs.
2. Copy the Source token.
3. Copy the source Ingesting host.
4. Add both to `.env`:

```text
BETTERSTACK_SOURCE_TOKEN=your_source_token
BETTERSTACK_INGESTING_HOST=your_ingesting_host
```

5. Recreate the backend container:

```powershell
docker compose up -d --build backend
```

6. Perform login and booking actions.
7. Open Better Stack Live tail and confirm the structured HustleHub events arrive.

Never commit the source token to GitHub and never include it in screenshots.

## Logger test

Run:

```powershell
node --test tests/logger.test.js
```

The tests confirm that secret fields are replaced with `[REDACTED]` and hashed values do not expose their original content.

## Evidence screenshots to capture

Store screenshots under `screenshots/docker-logging/` with clear names.

1. `01-docker-compose-build.png` - successful `docker compose up --build -d`.
2. `02-docker-compose-ps.png` - frontend, backend and MongoDB running/healthy.
3. `03-frontend-container.png` - HustleHub frontend loaded from `localhost:5173`.
4. `04-backend-health.png` - backend `/health` response.
5. `05-docker-network.png` - `docker network inspect hustlehub_network` showing the services.
6. `06-docker-volumes.png` - MongoDB and backend log volumes.
7. `07-persistent-data-before.png` - sample application data before restart.
8. `08-persistent-data-after.png` - same data after `docker compose down` and `up -d`.
9. `09-login-log.png` - sanitized successful/failed login log events.
10. `10-booking-transaction-log.png` - booking and transaction events.
11. `11-error-log.png` - controlled API error event.
12. `12-better-stack-live-tail.png` - Better Stack receiving sanitized events, with source token hidden.
13. `13-logger-tests.png` - passing logger security tests.

## Recommended Git commits

Use genuine incremental commits, for example:

- `feat: add Dockerfiles for backend and frontend`
- `feat: add Docker Compose MongoDB networking and volumes`
- `feat: add structured application logging`
- `feat: log authentication booking and transaction events`
- `feat: add Better Stack log forwarding and redaction`
- `docs: add Docker and logging evidence guide`

Do not fabricate commit history. Commit each completed stage as you test it.
