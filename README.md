# INSY7314-POE-Part-1
# HustleHub+
Youtube Link : https://youtu.be/AwQ5rBtG09k

## Secure Freelance Marketplace Platform

HustleHub+ is a secure web-based freelance marketplace designed to connect clients with freelancers through a controlled and secure digital platform. The system allows freelancers to advertise their services while clients can browse available services and interact with the marketplace.

The application is developed using the MERN technology stack, consisting of MongoDB, Express.js, React, and Node.js. Security is treated as a fundamental part of the system architecture rather than an additional feature added after development.

The system processes sensitive information, including user credentials, authentication tokens, booking-related information, transaction records, and income-related data. Consequently, the application incorporates security controls throughout the authentication, API, validation, communication, and data-processing layers.

---

# 1. System Purpose

The primary purpose of HustleHub+ is to provide a secure freelance marketplace where users can interact according to their assigned roles.

The platform is designed to support the following core activities:

- User registration and authentication.
- Secure login using credentials.
- Authentication of subsequent requests using JSON Web Tokens (JWT).
- Role-based access for Clients, Freelancers, and Administrators.
- Freelancer service management.
- Client access to available freelance services.
- Secure communication between the frontend and backend.
- Validation of user-supplied information before it is processed.
- Protection of backend API routes from unauthorised access.
- Secure handling of errors without exposing sensitive implementation details.

The system is being developed incrementally. The initial implementation establishes the secure backend foundation, including authentication, password protection, JWT-based authentication, HTTPS, input validation, and controlled error handling. Later development stages extend this foundation into the complete marketplace application.

Security is therefore considered throughout the system lifecycle. Rather than relying solely on frontend restrictions, important security decisions are enforced at the backend API level because the backend is responsible for protecting application resources and enforcing access to protected functionality.

---

# 2. Intended Users

HustleHub+ supports three primary user roles.

## 2.1 Client

Clients are users who require freelance services.

A Client is expected to use the platform to:

- Register an account.
- Log into the platform.
- Browse available freelance services.
- View relevant gig information.
- Initiate bookings in later versions of the system.

Client actions are restricted according to the permissions assigned to the Client role.

---

## 2.2 Freelancer

Freelancers are users who provide services through the marketplace.

A Freelancer is expected to use the platform to:

- Register an account.
- Log into the platform.
- Create and manage service listings.
- View bookings associated with their services.
- Track income generated through bookings in later versions.
- View estimated tax information in the completed system.

Freelancer functionality is protected so that users cannot access or modify resources belonging to other users.

---

## 2.3 Administrator

Administrators are users responsible for privileged system-level functionality.

The Administrator role exists separately from the Client and Freelancer roles so that administrative functionality can be restricted to authorised users.

Administrative permissions are enforced through role-based access control rather than relying on the frontend to hide functionality. This ensures that a user cannot gain access to administrative functionality simply by manually constructing an API request.

---

# 3. Technology Stack

HustleHub+ follows the MERN architecture.

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | Provides the user interface |
| Backend | Node.js | Provides the server-side runtime |
| API Framework | Express.js | Handles HTTP requests and API routing |
| Database | MongoDB | Stores application data |
| Authentication | JSON Web Tokens (JWT) | Authenticates protected requests |
| Password Security | Password hashing | Protects stored user passwords |
| Transport Security | HTTPS | Protects communication between clients and the API |
| API Testing | Postman | Tests API endpoints and security scenarios |

The MERN architecture is required by the assessment specification and forms the foundation of the application's overall architecture. The POE requires the architecture diagram to represent the overall system, security features, system boundaries, and MERN architecture.

---

# 4. System Architecture

HustleHub+ follows a layered client-server architecture.

The major architectural components are:

1. Client/User Layer
2. React Presentation Layer
3. Node.js/Express Application Layer
4. Security Middleware Layer
5. Business Logic Layer
6. Data Access Layer
7. MongoDB Data Layer

The architecture separates responsibilities between the frontend, backend, and database. This separation improves maintainability and allows security controls to be enforced centrally within the backend.

## 4.1 Backend Structure

The backend follows a modular structure that separates routing, request
validation, authentication, business logic, data models and error handling.

The main backend components are:

- `routes/` – Defines API endpoints and maps requests to controllers.
- `controllers/` – Contains the main application and authentication logic.
- `models/` – Defines the structure used for user and application data.
- `middleware/` – Provides reusable security and request-processing controls,
  including authentication, validation and error handling.
- `server.js` – Initialises the Express application and HTTPS server.
- `cert/` – Contains the locally configured SSL certificate and private key
  required for HTTPS development.
- `postman/` – Contains the Postman collection used to test API functionality
  and security scenarios.

This separation ensures that routing, authentication, validation and business
logic are not unnecessarily combined into a single component. It improves
maintainability and allows security controls to be applied consistently across
the API.

## 4.2 API Request Flow

A typical request to the HustleHub+ API follows the following process:

1. A user interacts with the React frontend.
2. The frontend sends an HTTPS request to the Express API.
3. The request is received by the Node.js/Express server.
4. The appropriate route identifies the requested API endpoint.
5. Validation middleware checks that the supplied input is valid.
6. Authentication middleware verifies the JWT when the endpoint is protected.
7. The request is passed to the appropriate controller.
8. The controller performs the required business logic.
9. The relevant data is accessed through the application's data layer.
10. The server returns a controlled JSON response to the frontend.

For unauthenticated requests, such as registration and login, authentication
middleware is not required. For protected endpoints, the JWT must be supplied
and successfully validated before the request can proceed.

If validation or authentication fails, the request is rejected before the
protected business logic is executed.

---

# 5. Security Decisions

This section explains the security decisions implemented in the current version of HustleHub+ and the reasoning behind them.

The current implementation includes:

- HTTPS transport security
- Centralised error handling
- Password hashing
- JSON Web Token (JWT) authentication
- Input validation
- Input sanitisation
- Role restrictions
- Protected API routes
- API testing using Postman

These controls are implemented mainly within the backend because security-sensitive decisions should not rely only on frontend restrictions.

---

## 5.1 HTTPS

The API is served over HTTPS rather than plain HTTP.

This decision was made because the system handles sensitive information such as user credentials, authentication tokens, booking information, transaction information and other user-related data.

Without HTTPS, data transmitted between the client and server could potentially be exposed while travelling across a network.

For local development, HustleHub+ uses a self-signed HTTPS certificate. The certificate can be generated automatically during setup and is loaded by the Node.js server using the built-in HTTPS module.

A self-signed certificate is suitable for the local development environment. In a production environment, this certificate would be replaced with one issued by a trusted certificate authority.

---

## 5.2 Error Handling

All API errors are processed through centralised Express error-handling middleware rather than returning uncontrolled error information directly to the client.

This provides consistent JSON responses and helps prevent internal implementation details from being exposed.

Sensitive information such as stack traces, internal file paths and library error details should not be returned to users.

The system therefore returns controlled error responses containing an appropriate HTTP status code and a short message.

Expected application errors, such as duplicate registrations or incorrect login credentials, can return appropriate client-facing messages.

Unexpected internal errors are handled safely so that unnecessary technical details are not exposed.

---

## 5.3 Password Security

User passwords are not stored as plain text.

During registration, passwords are hashed using bcrypt before being stored.

Password hashing is important because if application data were exposed, plain-text passwords would immediately reveal user credentials.

During login, the submitted password is compared against the stored password hash.

The original password does not need to be stored or recovered.

---

## 5.4 JSON Web Token Authentication

HustleHub+ uses JSON Web Tokens (JWT) for authentication.

After a user successfully logs in, the backend issues a JWT containing information required to identify the authenticated user.

The token is then supplied with requests to protected API routes.

Authentication middleware validates the token before allowing the request to continue.

If a token is missing, invalid or expired, access to the protected route is denied.

This allows protected backend functionality to remain inaccessible to unauthenticated users.

---

## 5.5 Input Validation

Server-side validation is implemented for both registration and login requests.

Validation is performed using Express Validator before authentication logic is executed.

Registration validation checks information such as:

- Required name fields
- Valid email format
- Required password
- Minimum password length
- Valid user role

Login validation checks:

- Email address
- Password
- Required fields

Invalid requests are rejected with an appropriate `400 Bad Request` response before they reach the main authentication controller.

Server-side validation is necessary because frontend validation can be bypassed by manually sending API requests.

---

## 5.6 Role Restrictions

HustleHub+ distinguishes between different user roles, including:

- Client
- Freelancer
- Administrator

Public registration is restricted so that users cannot simply manipulate an API request to assign themselves an administrator role.

Role restrictions support the overall role-based access control approach used by the platform.

Administrative functionality must only be accessible to users who have been granted the appropriate permissions.

---

## 5.7 Protected Routes

Protected API routes require a valid JWT.

The authentication middleware checks the supplied token before allowing access.

A valid token allows the authenticated request to continue.

A missing or invalid token results in an unauthorised response.

A protected authentication test route is included in the current implementation to demonstrate this behaviour.

---

# 6. Input Validation and API Testing

HustleHub+ includes a Postman collection that tests the authentication API and validation behaviour.

The testing collection covers both successful and unsuccessful requests.

The following scenarios are tested:

1. API health check
2. Successful user registration
3. Duplicate email registration
4. Successful login
5. Incorrect password
6. Missing registration fields
7. Invalid email address
8. Invalid user role
9. Malformed JSON
10. Protected route with valid JWT
11. Protected route without JWT

These tests confirm that the API correctly handles both valid requests and common invalid or malicious inputs.

---

## 6.1 Successful Registration

A valid registration request should pass validation and create the new user.

The API returns a successful response indicating that registration has completed correctly.

---

## 6.2 Duplicate User Testing

The same email address cannot be registered more than once.

Attempting to register an existing email produces a controlled error response.

This helps preserve the uniqueness of user accounts.

---

## 6.3 Login Testing

A user with valid credentials can log in successfully.

Following successful authentication, a JWT is returned.

The Postman collection stores the token so that it can be used in subsequent protected-route tests.

---

## 6.4 Invalid Credential Testing

Incorrect login credentials are rejected.

For example, supplying an incorrect password results in an unauthorised response instead of granting access.

---

## 6.5 Validation Testing

The Postman collection includes multiple requests specifically designed to verify the validation middleware.

Examples include:

- Missing required fields
- Invalid email addresses
- Invalid roles
- Incorrect passwords
- Malformed JSON

These tests demonstrate that invalid input is rejected safely before normal business logic continues.

---

## 6.6 JWT Protected Route Testing

The authentication flow is tested using both valid and missing authentication tokens.

When a valid JWT is supplied, the protected endpoint can be accessed.

When no JWT is supplied, the request is rejected.

This demonstrates that authentication is enforced at the backend API level.

### JWT Lifecycle

The JWT authentication process follows these steps:

1. The user submits their email and password through the login endpoint.
2. The server validates the submitted input.
3. The submitted password is compared against the stored password hash.
4. If the credentials are valid, the server generates a JWT containing the
   appropriate user identification information.
5. The JWT is returned to the client after successful authentication.
6. The client supplies the JWT when accessing protected API endpoints.
7. Authentication middleware verifies the token before allowing the request
   to continue.
8. If the token is missing, invalid or expired, the API rejects the request.

The JWT secret is stored outside the source code using environment
configuration rather than being hard-coded into the application.

---

# 7. Postman Collection

The project contains a Postman collection for testing the API.

The collection can be found in:

```text
postman/HustleHub_API.postman_collection.json
```






---

# Part 2 - Overview

The Part 2 implementation extends the secure backend from Part 1 into a full-stack MERN application. Freelancers publish gigs, clients browse and book them, every booking creates a transaction, and freelancers can track the income they earn from their bookings.

The application provides the following features:

- **Accounts:** Registration and login for clients and freelancers, with JWT authentication.
- **Gig management:** Freelancers create, view, update and delete their own gigs.
- **Browsing:** Clients browse the active gigs offered by freelancers.
- **Bookings:** Clients book a gig and receive a simulated confirmation. No real payment is taken.
- **Transactions:** A transaction record is created automatically for every booking and linked to the client and the freelancer.
- **Income tracking:** Freelancers see the income they earn from their confirmed transactions.
- **Security:** HTTPS, role-based access control, input validation and sanitisation, rate limiting, security headers with a Content Security Policy, restricted CORS and controlled error responses.
- **Testing:** Postman and Newman API tests and Vitest frontend tests.

The work was divided between four members. Each of the following sections describes one member's contribution.

| Section | Responsibility |
|---|---|
| Member 1 | MongoDB setup and gig management |
| Member 2 | Authentication, role-based access control and security |
| Member 3 | Browsing, bookings and transactions |
| Member 4 | Income tracking, testing and demonstration |

## Technology and Data Models

The backend uses Node.js, Express and MongoDB with Mongoose. The frontend uses React with Vite.

| Model | Main fields |
|---|---|
| User | Name, email, hashed password and role (client or freelancer) |
| Gig | Title, description, category, price, delivery days, freelancer and active status |
| Booking | Gig, client, freelancer, amount and status |
| Transaction | Booking, gig, client, freelancer, amount and status |

## API Endpoints

| Endpoint | Access | Purpose |
|---|---|---|
| `GET /health` | Public | Health check |
| `POST /api/auth/register` | Public | Creates a client or freelancer account |
| `POST /api/auth/login` | Public | Logs in and returns a JWT |
| `GET /api/auth/me` | Any signed-in user | Returns the authenticated user |
| `GET /api/gigs` | Public | Lists active gigs |
| `GET /api/gigs/my` | Freelancer | Lists the freelancer's own gigs |
| `POST /api/gigs` | Freelancer | Creates a gig |
| `PUT /api/gigs/:id` | Freelancer who owns the gig | Updates a gig |
| `DELETE /api/gigs/:id` | Freelancer who owns the gig | Deletes a gig |
| `POST /api/bookings` | Client | Books a gig and creates its transaction |
| `GET /api/bookings/my` | Client | Lists the client's bookings |
| `GET /api/bookings/freelancer` | Freelancer | Lists the bookings made for the freelancer's gigs |
| `GET /api/income` | Freelancer | Returns income from confirmed transactions |

---

# Part 2 — Member 2: Authentication & Security

**Team Member:** Raghav Maharaj  
**Student Number:** ST10458336  
**Responsibility:** Authentication, role-based access control, API security, input validation and the React authentication interface.

## Member 2.1 Authentication and Account Management

The Part 2 implementation extends the existing authentication foundation by integrating secure user registration and login with the React frontend, Express backend and MongoDB database.

The following authentication features were implemented:

- **User Registration:** The `POST /api/auth/register` endpoint validates account information, normalises email addresses, rejects unexpected request fields and prevents duplicate email registrations.
- **Password Security:** Passwords are hashed using bcrypt with a cost factor of 10 before being stored in MongoDB. Passwords are not stored in plain text.
- **User Login:** The `POST /api/auth/login` endpoint verifies user credentials and returns a signed JSON Web Token (JWT) after successful authentication.
- **JWT Authentication:** JWTs contain the user's identification and role information and expire after one hour.
- **Protected Requests:** Authenticated API requests include the JWT in the `Authorization: Bearer <token>` header.
- **Logout:** The React application clears the authentication session and redirects users to the login page.
- **Session Expiry:** When an authenticated API request receives a `401 Unauthorized` response, the application clears the stored authentication information.

Authentication tokens are stored in browser session storage for the current session. Sensitive configuration values, including the JWT signing secret, are maintained through environment variables rather than being hard-coded.

## Member 2.2 Role-Based Access Control (RBAC)

Role-Based Access Control was implemented to ensure that users can only access functionality appropriate to their assigned role.

Public registration supports two roles:

- **Client:** Can access the client workspace and client-specific functionality.
- **Freelancer:** Can access the freelancer workspace and manage their own service listings.

Users cannot assign themselves administrator privileges through public registration.

Role restrictions are enforced through backend authentication and authorisation middleware, supported by protected React routes.

| Resource | Client | Freelancer |
|---|---|---|
| Registration and login | Allowed | Allowed |
| Client workspace (`/client`) | Allowed | Denied |
| Freelancer workspace (`/my-gigs`) | Denied | Allowed |
| Own gig management | Denied | Allowed |
| Another freelancer's gig management | Denied | Denied |

Backend ownership checks are used to ensure that freelancers cannot modify service listings belonging to other users.

Frontend route protection improves navigation and user experience, while backend authorisation provides the actual security enforcement.

## Member 2.3 Input Validation and Sanitisation

Server-side input validation was implemented using Express Validator to prevent invalid or unexpected data from reaching application controllers.

Authentication validation includes:

- Required registration and login fields.
- Valid email address formatting.
- Password length requirements.
- Accepted user roles.
- Email normalisation.
- Rejection of unexpected registration fields.
- Appropriate error responses for invalid requests.

Gig validation and sanitisation were also reviewed during security integration.

User-supplied gig information is validated and sanitised before processing. This reduces the risk of malicious input being stored or displayed incorrectly.

Invalid requests are rejected with controlled HTTP responses, typically `400 Bad Request`.

Server-side validation is essential because frontend validation can be bypassed through manually constructed API requests.

## Member 2.4 API and Transport Security

Several security controls were implemented and configured across the Express API and React development environment.

### HTTPS

The backend uses HTTPS for local development.

The default API address is:

`https://localhost:5000`

A self-signed certificate is generated for local development. Production deployment would require a certificate issued by a trusted certificate authority.

HTTPS protects information transmitted between the frontend and backend, including authentication credentials and JWTs.

### Helmet and Content Security Policy

Helmet middleware is used to configure HTTP security headers.

These include:

- Content Security Policy (CSP).
- `X-Content-Type-Options`.
- Additional browser security headers.

The React frontend also includes a Content Security Policy configured through Vite.

Development settings accommodate React Refresh, while the preview configuration uses a stricter script policy.

### Cross-Origin Resource Sharing (CORS)

CORS is restricted to explicitly configured frontend origins.

Allowed origins are configured through the `FRONTEND_ORIGINS` environment variable rather than allowing unrestricted browser access from arbitrary origins.

### Rate Limiting

Express rate-limiting middleware protects the API against excessive requests and repeated authentication attempts.

| Limiter | Configured Limit | Purpose |
|---|---|---|
| General API | 300 requests per 15 minutes | Reduces excessive API traffic |
| Login | 10 failed attempts per 15 minutes | Reduces repeated password guessing |
| Registration | 5 requests per hour | Reduces automated account creation |

These limits help reduce the risk of brute-force attacks, automated abuse and unnecessary server load.

### Centralised Error Handling

A centralised Express error handler provides consistent API responses.

Expected errors return appropriate HTTP status codes and messages, while unexpected internal errors are handled without exposing sensitive implementation details such as stack traces.

## Member 2.5 React Authentication Interface

The React frontend was extended to support the authentication and authorisation functionality.

The following components were implemented or integrated:

- **Login Page:** Allows registered users to authenticate securely.
- **Registration Page:** Allows new clients and freelancers to create accounts.
- **Client Dashboard:** Provides a protected workspace for authenticated clients.
- **Protected Routes:** Restrict navigation according to authentication state and user role.
- **Authentication Context:** Maintains authentication state throughout the application.
- **Axios API Client:** Attaches JWTs to authenticated requests and handles expired sessions.
- **Logout Functionality:** Clears the current authentication session.

The interface includes responsive layouts, validation feedback, loading states and password visibility controls.

## Member 2.6 Main Implementation Files

The following files contain the main authentication and security implementation.

| File | Responsibility |
|---|---|
| `controllers/authController.js` | Registration, login, password verification and JWT generation |
| `models/User.js` | MongoDB user schema, account roles and password protection |
| `middleware/authMiddleware.js` | JWT verification and role-based authorisation |
| `middleware/validation.js` | Authentication request validation |
| `middleware/rateLimiters.js` | General API, login and registration rate limiting |
| `middleware/errorHandler.js` | Centralised API error handling |
| `validators/gigValidation.js` | Gig input validation and sanitisation |
| `server.js` | HTTPS, Helmet, CSP, CORS and Express security configuration |
| `frontend/src/pages/LoginPage.jsx` | React login interface |
| `frontend/src/pages/RegisterPage.jsx` | React registration interface |
| `frontend/src/pages/ClientHomePage.jsx` | Protected client dashboard |
| `frontend/src/components/ProtectedRoute.jsx` | Authentication and role-based frontend route protection |
| `frontend/src/context/` | Authentication context and session management |
| `frontend/src/api/api.js` | Axios configuration, JWT attachment and session-expiry handling |
| `frontend/src/api/authApi.js` | Authentication API requests |
| `frontend/vite.config.js` | Vite configuration and frontend security headers |

## Member 2.7 Local Development Setup

The backend runs from the repository root, while the React frontend runs from the `frontend` directory.

### Prerequisites

The following software is required:

- Node.js and npm.
- MongoDB.
- A modern web browser.
- Visual Studio, Visual Studio Code or another suitable development environment.
- Postman for manual API testing.

### Backend Environment Configuration

Create a `.env` file in the repository root using `.env.example` as a guide.

The backend uses the following environment variables:

| Variable | Purpose |
|---|---|
| `PORT` | Backend HTTPS server port |
| `NODE_ENV` | Application environment |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `MONGO_URI` | MongoDB connection string |
| `FRONTEND_ORIGINS` | Permitted frontend origins for CORS |

For local development, MongoDB can use:

`mongodb://127.0.0.1:27017/hustlehub`

Real secrets, environment files and private certificate files must not be committed to Git.

### Frontend Environment Configuration

Create `frontend/.env` using `frontend/.env.example` as a guide.

Configure the backend URL:

```env
VITE_API_URL=https://localhost:5000
```

### Starting the Backend

Open a terminal in the repository root and run:

```powershell
npm.cmd install
npm.cmd start
```

The backend runs at:

`https://localhost:5000`

The health endpoint can be used to confirm that the API is running:

`https://localhost:5000/health`

### Starting the Frontend

Open a second terminal and run:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

The React application runs at:

`http://localhost:5173`

MongoDB must be running before starting the backend.

A browser may display a certificate warning when first accessing the locally generated self-signed HTTPS certificate.

## Member 2.8 Security Verification and Testing

Manual security testing was performed using Postman, the React application and browser developer tools.

The tests focused on authentication, role restrictions, validation, rate limiting and security headers.

| Test Scenario | Observed Result |
|---|---|
| Valid account registration | Registration successful |
| Login with valid credentials | Authentication successful |
| Access protected client dashboard | Authenticated client granted access |
| Logout | Session cleared and redirected to `/login` |
| Freelancer accessing `/client` | Access denied with `403` |
| `GET /api/gigs/my` without JWT | `401 Unauthorized` |
| `GET /api/gigs/my` with client JWT | `403 Forbidden` |
| `GET /api/gigs/my` with freelancer JWT | `200 OK` |
| Registration with invalid input | `400 Bad Request` |
| Registration with unexpected `isAdmin` field | `400 Bad Request` |
| Repeated failed login attempts | `429 Too Many Requests` |
| Backend security headers | Helmet headers and CSP present |
| Frontend CSP | CSP present and no remaining CSP console error during verification |

These results demonstrate that authentication and role restrictions are enforced at the API level rather than relying only on frontend navigation.

### Additional Testing Before Final Submission

The following verification activities remain part of the final project testing and integration process:

- Final Postman collection verification.
- Newman automated API test execution.
- React automated testing.
- Integration testing with booking and transaction functionality.
- Final end-to-end application verification.

The completed manual tests are documented separately from automated tests that have not yet been confirmed.

## Member 2.9 Security Considerations

The implemented security controls provide multiple layers of protection.

Authentication establishes the identity of the user, while authorisation determines which resources the user may access.

Validation and sanitisation reduce the risk of malformed or malicious input.

HTTPS protects information during transmission, while Helmet, CSP, CORS and rate limiting provide additional safeguards.

Centralised error handling prevents unnecessary disclosure of internal server information.

The implementation follows a defence-in-depth approach, where multiple independent controls contribute to the overall security of HustleHub+.

---

# Part 2 - Member 4: Income Tracking, Testing and Demonstration

**Team Member:** Ophec Funis  
**Student Number:** ST10089492  
**Responsibility:** Freelancer income tracking, automated API and frontend testing, test evidence and the demonstration video.

## Member 4.1 Income Tracking

The Part 2 implementation adds income tracking so that freelancers can see the money generated by their bookings.

Every confirmed booking already creates a transaction record. Income is therefore calculated from those transaction records rather than being stored separately. This ensures that the income shown to a freelancer always matches their bookings.

The `GET /api/income` endpoint returns the income of the authenticated freelancer.

| Request | Response |
|---|---|
| Freelancer with a valid JWT | `200 OK` with the total income, transaction count and transactions |
| Client with a valid JWT | `403 Forbidden` |
| Missing, invalid or expired JWT | `401 Unauthorized` |

The following rules are applied:

- **Ownership:** The freelancer is identified from the JWT. The request cannot name another freelancer, and query parameters such as `?freelancer=<id>` are ignored.
- **Confirmed transactions:** Only confirmed transactions are included in the total.
- **Deleted gigs:** If a gig is deleted after it has been booked, the transaction and the income remain. The transaction is returned with `gig` set to `null`.
- **Limited data:** Client details are not included in the response.

Authorisation is enforced by the existing authentication and role middleware, so the restriction does not depend on the frontend.

Example response:

```json
{
  "totalIncome": 370.5,
  "transactionCount": 2,
  "transactions": [
    {
      "_id": "6aca241c4f218f161c28c62c",
      "booking": "6aca241c4f218f161c28c62b",
      "gig": { "title": "Copy editing", "category": "Writing" },
      "amount": 120.5,
      "status": "confirmed",
      "createdAt": "2026-10-10T17:20:11.000Z"
    }
  ]
}
```

The React income page is available at `/income` and is opened with the **View Income** button on the My Gigs page.

The page displays:

- Total income
- Number of confirmed bookings
- Average income per booking
- A table of transactions showing the date, gig, booking reference, status and amount

The page includes loading, empty and error states. The route is protected so that only freelancers can open it.

## Member 4.2 API Testing with Postman and Newman

The Part 1 Postman collection was expanded to cover the complete Part 2 API.

The collection contains 70 requests grouped into seven folders. It covers both successful and unsuccessful requests. For example, the tests confirm that a client cannot create a gig and that one freelancer cannot change another freelancer's gig.

| Folder | Coverage |
|---|---|
| 00 Setup | Health check and the data used for the test run |
| 01 Auth | Registration, duplicate email, refused administrator role, login, token contents, incorrect password, validation and invalid tokens |
| 02 Gigs | Creating, updating and deleting gigs, validation, role checks, ownership and inactive gigs |
| 03 Bookings | Booking and transaction creation, server-side pricing, role checks and separation between users |
| 04 Income | Income totals, role checks, separation between freelancers and income after a gig is deleted |
| 05 Security | Security headers, CORS, malformed and oversized requests, operator injection and script content in a gig |
| 06 Rate limits | Booking, login and registration limits returning `429 Too Many Requests` |

Two checks are also applied to every request:

- The response must be JSON.
- The response must not contain internal information such as stack traces, password hashes or secrets.

### Running the Tests with Newman

MongoDB must be running and the dependencies must have been installed with `npm install` in the repository root.

From the repository root run:

```powershell
npm.cmd run test:api
```

The command performs the following steps:

1. Installs Newman in the `postman` folder if it is not already installed.
2. Starts the API on port 5055 using a separate test database.
3. Runs the Postman collection with Newman.
4. Saves the results in `postman/reports/`.
5. Removes the test database.

The command exits with a failure code if any assertion fails. This allows the same command to be reused in an automated pipeline.

The test database uses the name of the `MONGO_URI` database with `_test` added to the end. The `TEST_MONGO_URI` and `TEST_PORT` environment variables can be used to change the database or the port.

Newman is installed in the `postman` folder rather than in the root `package.json`. This decision was made because the security advisories reported for Newman's own dependencies are unrelated to the code that the API runs. Keeping it separate means that `npm audit` for the API only reports the packages the API uses.

The following files are produced by each run:

- `postman/reports/newman-cli.txt` - the console output of the run.
- `postman/reports/newman-junit.xml` - the same results in JUnit XML format.

On macOS or Linux, use `npm` in place of `npm.cmd`.

### Running the Collection in Postman

The collection can also be imported into Postman. The local certificate is self-signed, so SSL certificate verification must be turned off in the Postman settings.

The registration limiter allows 5 requests per hour and the login limiter allows 10 failed attempts per 15 minutes. The final folder of the collection reaches these limits deliberately. The API should therefore be restarted before each run in Postman. The `npm run test:api` command does this automatically.

## Member 4.3 Frontend Testing

Automated tests for the React frontend were implemented using Vitest and React Testing Library.

The tests render the components and simulate user actions such as typing, clicking and submitting forms. This verifies the behaviour that users see rather than the internal implementation of each component.

| Test File | Coverage |
|---|---|
| `LoginPage.test.jsx` | Sign in form, submitted values, redirect for each role, error messages, password visibility and locked button |
| `RegisterPage.test.jsx` | Role selection, mismatched passwords, password length limit, server errors and redirect after registration |
| `ProtectedRoute.test.jsx` | Loading state, redirect to login, access denied for the wrong role and access for the correct role |
| `GigCard.test.jsx` and `GigForm.test.jsx` | Gig details, edit and delete actions, numeric values, edit mode, cancel and busy state |
| `ClientHomePage.test.jsx` | Gig list, empty and error states, details dialog, booking success and failure, bookings list and logout |
| `MyGigsPage.test.jsx` | Gigs and bookings, creating a gig, validation messages, deleting with confirmation and access message |
| `IncomePage.test.jsx` | Totals, transaction rows, deleted gig label, empty and error states and navigation |
| `api.test.js` | Token header, session cleared when a token is rejected and no reaction to a failed login |
| `AuthContext.test.jsx` | Restoring a session, removing a rejected token, login and logout |

There are 63 tests in 10 test files.

From the `frontend` directory run:

```powershell
npm.cmd install
npm.cmd test
```

The output of a complete run is stored in `frontend/reports/vitest-verbose.txt`.

## Member 4.4 Test Evidence

The following evidence is included with the Part 2 submission.

| Evidence | Location |
|---|---|
| Newman test run | `postman/reports/` |
| Frontend test run | `frontend/reports/vitest-verbose.txt` |
| Application screenshots | `screenshots/` |
| Demonstration video | Link to be added |

The testing guide, the list of screenshots and the demonstration script are included in `MEMBER4_TESTING.md`.

## Member 4.5 Main Implementation Files

The following files contain the main Member 4 implementation.

| File | Responsibility |
|---|---|
| `controllers/incomeController.js` | Income calculation for the authenticated freelancer |
| `routes/incomeRoutes.js` | Income route with authentication and freelancer role checks |
| `frontend/src/pages/IncomePage.jsx` | React income page |
| `frontend/src/api/incomeApi.js` | Income API request |
| `postman/HustleHub_API.postman_collection.json` | API test collection |
| `postman/runNewman.js` | Starts the API with a test database and runs the collection |
| `frontend/vitest.config.js` | Frontend test configuration |
| `frontend/src/**/*.test.{js,jsx}` | Frontend component and behaviour tests |
| `MEMBER4_TESTING.md` | Testing guide, screenshot list and demonstration script |

## Member 4.6 First-Time Setup Notes

The full local setup steps are described in Member 2.7. The following notes apply when the project is run for the first time on a new computer. They were checked on a new copy of the repository on Windows.

- **Node.js:** Version 20.19 or newer is required.
- **Environment file:** If the `.env` file does not exist, `npm.cmd start` creates it with a random JWT secret and the local MongoDB connection string. The HTTPS certificate is also created automatically.
- **Local certificate:** The API uses a self-signed certificate, which browsers do not trust automatically. Open `https://localhost:5000/health` in the same browser, choose **Advanced** and then **Continue to localhost**. This normally needs to be done once for each browser session. Until it has been done, the frontend cannot reach the API and registration and login fail.
- **Accounts:** No accounts are created in advance. A freelancer and a client can be registered from the registration page.
- **Ports:** If port 5000 is already in use, set `PORT` in `.env` and `VITE_API_URL` in `frontend/.env` to a free port.

---
