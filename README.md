# INSY7314-POE-Part-1
# HustleHub+
Youtube Link : https://youtu.be/AwQ5rBtG09k

Part 2 Youtube Link : https://www.youtube.com/watch?v=MFMNTNQQZnQ

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
- Book gigs and view their bookings.

Client actions are restricted according to the permissions assigned to the Client role.

---

## 2.2 Freelancer

Freelancers are users who provide services through the marketplace.

A Freelancer is expected to use the platform to:

- Register an account.
- Log into the platform.
- Create and manage service listings.
- View bookings associated with their services.
- Track income generated through bookings.
- View estimated tax information in the completed system.

Freelancer functionality is protected so that users cannot access or modify resources belonging to other users.

---

## 2.3 Administrator

Administrators are users responsible for privileged system-level functionality.

The Administrator role exists separately from the Client and Freelancer roles so that administrative functionality can be restricted to authorised users.

In the current Part 2 implementation, public registration only creates Client and Freelancer accounts. Administrator functionality has not been built yet and is planned for a later stage of the project.

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

- `routes/` - Defines API endpoints and maps requests to controllers.
- `controllers/` - Contains the main application and authentication logic.
- `models/` - Defines the structure used for user and application data.
- `middleware/` - Provides reusable security and request-processing controls,
  including authentication, validation and error handling.
- `server.js` - Initialises the Express application and HTTPS server.
- `cert/` - Contains the locally configured SSL certificate and private key
  required for HTTPS development.
- `postman/` - Contains the Postman collection used to test API functionality
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

The scenarios below are the authentication tests created in Part 1. In Part 2 the collection was expanded to cover gigs, bookings, income, security and rate limiting, and the expanded collection is described in Member 4.2.

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

In Part 2 the collection contains 72 requests and is run with Newman. The details are in Member 4.2.






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

# Part 2 - Member 1: Project Setup and Gig Management

**Team Member:** Rahil Ramdass  
**Student Number:** ST10434494  
**Responsibility:** Part 2 project setup, MongoDB integration, gig management and the React gig management interface.

## Member 1.1 Project Setup and MongoDB

The Part 2 project was built on top of the completed Part 1 backend, and a React frontend was added in the `frontend` directory using Vite.

MongoDB is used to store the application data. The database connection is created in `config/db.js` using Mongoose and the `MONGO_URI` environment variable. The HTTPS server only starts after the database connection has succeeded, so the API is not available without its database.

The project dependencies were reviewed and updated at the start of Part 2, including the removal of a reported audit vulnerability.

## Member 1.2 Gig Management API

Freelancers can create, view, update and delete their own gigs.

| Endpoint | Access | Purpose |
|---|---|---|
| `GET /api/gigs` | Public | Lists active gigs, newest first |
| `GET /api/gigs/my` | Freelancer | Lists all of the freelancer's own gigs, including inactive gigs |
| `POST /api/gigs` | Freelancer | Creates a gig |
| `PUT /api/gigs/:id` | Freelancer who owns the gig | Updates a gig |
| `DELETE /api/gigs/:id` | Freelancer who owns the gig | Deletes a gig |

Ownership is enforced in the database query. When a gig is updated or deleted, the query matches both the gig identifier and the identifier of the authenticated freelancer taken from the JWT. A freelancer who tries to change another freelancer's gig receives `404 Not Found`, which also avoids confirming that the gig exists.

The owner of a gig is always taken from the JWT, so a request cannot assign a gig to another user.

An inactive gig is hidden from clients but remains visible to its owner.

## Member 1.3 Gig Validation

Gig details are validated on the server before they are stored.

| Field | Rule |
|---|---|
| `title` | Text between 3 and 80 characters |
| `description` | Text between 10 and 1000 characters |
| `category` | Text between 2 and 50 characters |
| `price` | A number that is 0 or more |
| `deliveryDays` | A whole number from 1 to 365 |
| `active` | Optional true or false |

Requests that contain any other field are rejected with `400 Bad Request`. Markup is removed from the text fields before they are stored, as described in Member 2.3.

## Member 1.4 React Gig Management Interface

The My Gigs page allows freelancers to manage their listings.

- **Create and edit:** A single form creates a new gig or edits the selected gig.
- **Listings:** Each gig is shown with its category, price, delivery time and active status.
- **Delete:** A gig is only deleted after the freelancer confirms.
- **Feedback:** Success messages and the validation messages returned by the API are displayed, together with loading and empty states.
- **Access:** The page is only available to freelancers.

## Member 1.5 Main Implementation Files

| File | Responsibility |
|---|---|
| `config/db.js` | MongoDB connection |
| `models/Gig.js` | Gig schema |
| `controllers/gigController.js` | Gig listing, creation, update and deletion with ownership checks |
| `routes/gigRoutes.js` | Gig routes with authentication and role checks |
| `validators/gigValidation.js` | Gig validation and sanitisation |
| `frontend/src/pages/MyGigsPage.jsx` | Freelancer gig management page |
| `frontend/src/components/GigForm.jsx` | Gig create and edit form |
| `frontend/src/components/GigCard.jsx` | Gig listing card |

---

# Part 2 - Member 2: Authentication & Security

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

### Automated Testing

Automated API testing with Newman and automated React testing are documented in Member 4.2 and Member 4.3. Integration testing with booking, transaction and income functionality is covered by the Postman collection described in Member 4.2.

The manual tests in the table above were performed during development. The automated tests repeat the main role, validation, rate limiting and security header scenarios.

## Member 2.9 Security Considerations

The implemented security controls provide multiple layers of protection.

Authentication establishes the identity of the user, while authorisation determines which resources the user may access.

Validation and sanitisation reduce the risk of malformed or malicious input.

HTTPS protects information during transmission, while Helmet, CSP, CORS and rate limiting provide additional safeguards.

Centralised error handling prevents unnecessary disclosure of internal server information.

The implementation follows a defence-in-depth approach, where multiple independent controls contribute to the overall security of HustleHub+.

---

# Part 2 - Member 3: Bookings and Transactions

**Team Member:** Shahaan Pillay  
**Student Number:** ST10438099  
**Responsibility:** Client gig browsing, booking creation, transaction records and the React booking interface.

## Member 3.1 Browsing Gigs

Clients browse the active gigs offered by freelancers on the client dashboard. Each gig shows its title, description, category, price and delivery time, and the **View Details** button opens the details of the gig.

The list is loaded from the public `GET /api/gigs` endpoint, which only returns active gigs.

## Member 3.2 Bookings

A client books a gig with `POST /api/bookings`.

| Request | Response |
|---|---|
| Client with a valid JWT and an active gig | `201 Created` with the booking and its transaction |
| Freelancer with a valid JWT | `403 Forbidden` |
| Missing, invalid or expired JWT | `401 Unauthorized` |
| Unknown or inactive gig | `404 Not Found` |
| Invalid gig identifier or extra fields | `400 Bad Request` |

The following rules are applied:

- **Server-side pricing:** The request only contains the gig identifier. The amount comes from the gig, so a client cannot choose the price.
- **Trusted parties:** The client comes from the JWT and the freelancer comes from the gig.
- **Simulated confirmation:** No payment is taken and the booking is confirmed immediately.
- **Rate limiting:** Booking requests are limited to 10 every 15 minutes, as described in Member 2.4.

## Member 3.3 Transactions

A transaction record is created automatically for every booking. It stores the booking, the gig, the client, the freelancer, the amount and a status.

Each booking can only have one transaction. If the transaction cannot be created, the booking is removed again so that a booking never exists without its transaction.

The transaction links the booking to the correct client and freelancer, and it is the source of the income described in Member 4.1.

## Member 3.4 Viewing Bookings

| Endpoint | Access | Purpose |
|---|---|---|
| `GET /api/bookings/my` | Client | Lists the client's own bookings |
| `GET /api/bookings/freelancer` | Freelancer | Lists the bookings made for the freelancer's gigs |

Each booking includes the gig details and the identifier and status of its transaction. Clients and freelancers only see their own bookings, and a user with the wrong role receives `403 Forbidden`.

## Member 3.5 React Booking Interface

- **Client dashboard:** Clients browse gigs, open the details of a gig and book it with the **Book This Gig** button.
- **Confirmation:** After a booking, the booking and transaction identifiers are shown and the booking list is refreshed.
- **Errors:** Messages from the API, for example when the booking limit has been reached, are displayed.
- **My Bookings:** Clients see their bookings with the amount, delivery time, booking date and transaction status.
- **Client Bookings:** Freelancers see the bookings made for their gigs on the My Gigs page, together with the transaction details.

## Member 3.6 Main Implementation Files

| File | Responsibility |
|---|---|
| `models/Booking.js` | Booking schema |
| `models/Transaction.js` | Transaction schema |
| `controllers/bookingController.js` | Booking creation, transaction creation and booking lists |
| `routes/bookingRoutes.js` | Booking routes with authentication, role checks and rate limiting |
| `validators/bookingValidation.js` | Booking request validation |
| `frontend/src/pages/ClientHomePage.jsx` | Client dashboard, booking dialog and My Bookings |
| `frontend/src/api/bookingApi.js` | Booking API requests |

---

# Part 2 - Member 4: Income Tracking, Testing and Demonstration

**Team Member:** Ophec Funis  
**Student Number:** ST10089492  
**Responsibility:** Freelancer income tracking, automated API and frontend testing, test evidence and the demonstration video.

## Member 4.1 Income Tracking

The Part 2 implementation adds income tracking so that freelancers can see the money they earn from their bookings.

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

The collection contains 72 requests grouped into seven folders. It covers both successful and unsuccessful requests. For example, the tests confirm that a client cannot create a gig and that one freelancer cannot change another freelancer's gig.

| Folder | Coverage |
|---|---|
| 00 Setup | Health check and the data used for the test run |
| 01 Auth | Registration, duplicate email, refused administrator role, login, token contents, incorrect password, validation and invalid tokens |
| 02 Gigs | Creating, updating and deleting gigs, validation, role checks, ownership, inactive gigs and text stored as typed |
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
| Demonstration video | https://www.youtube.com/watch?v=MFMNTNQQZnQ |

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

# Part 3 - Member 1: Income and Tax Dashboard

**Team Member:** Raghav Mahraj  
**Student Number:** ST10458336  
**Responsibility:** Tax estimation, freelancer income dashboard enhancements, financial visualisations, integration testing and frontend quality verification.

## Member 1.1 Overview

The Part 3 implementation extends the existing freelancer income tracking functionality developed in Part 2 by introducing an estimated income tax calculation and a more comprehensive financial dashboard.

The purpose of this enhancement is to help freelancers understand their earnings, view an approximate tax liability and compare their income before and after estimated tax deductions.

The implementation builds on the existing MERN architecture and uses confirmed transaction records as the source of financial information.

The main enhancements include:

- Estimated South African income tax calculations.
- Tax-year earnings summaries.
- Estimated after-tax income.
- Marginal and effective tax rates.
- Monthly earnings visualisations.
- Income and estimated tax breakdown charts.
- Improved financial dashboard styling and responsive layouts.
- Integration with the existing freelancer income API.
- Automated testing and frontend quality checks.

The dashboard is available to authenticated freelancers through the **View Income** button on the My Gigs page.

---

## Member 1.2 Tax Estimation Component

A tax estimation component was introduced to calculate approximate South African personal income tax using the 2026/2027 tax-year structure.

The selected tax year runs from **1 March 2026 to 28 February 2027**.

The calculation uses a progressive tax system, meaning different portions of taxable income are subject to different tax rates.

### Tax Calculation Method

The estimated tax calculation follows these steps:

1. Retrieve the authenticated freelancer's confirmed transaction records.
2. Identify transactions falling within the selected tax year.
3. Calculate total earnings for that tax year.
4. Determine the applicable progressive income tax bracket.
5. Calculate tax using the bracket's base tax amount and marginal rate.
6. Apply the primary tax rebate.
7. Prevent the final estimated tax amount from falling below zero.
8. Subtract estimated tax from tax-year earnings to calculate after-tax income.
9. Calculate the effective tax rate as a percentage of earnings.

### Progressive Tax Brackets

The component uses the following South African personal income tax brackets for the 2026/2027 tax year.

| Taxable Income | Tax Calculation |
|---|---|
| R0 to R245 100 | 18% of taxable income |
| R245 101 to R383 100 | R44 118 + 26% of income above R245 100 |
| R383 101 to R530 200 | R79 998 + 31% of income above R383 100 |
| R530 201 to R695 800 | R125 599 + 36% of income above R530 200 |
| R695 801 to R887 000 | R185 215 + 39% of income above R695 800 |
| R887 001 to R1 878 600 | R259 783 + 41% of income above R887 000 |
| Above R1 878 600 | R666 339 + 45% of income above R1 878 600 |

The calculation also applies the **primary rebate of R17 820** for taxpayers younger than 65.

### Calculation Formula

The general progressive tax calculation is:

```text
Gross Tax =
    Base Tax for Bracket
    + (Taxable Income - Bracket Lower Threshold) x Marginal Rate

Estimated Tax = MAX(0, Gross Tax - Primary Rebate)

After-Tax Income = Tax-Year Earnings - Estimated Tax

Effective Tax Rate =
    (Estimated Tax / Tax-Year Earnings) x 100
```

When tax-year earnings are zero, the effective tax rate is treated as zero to avoid division by zero.

### Example Calculation

A freelancer with R300 000 in tax-year earnings falls within the 26% marginal tax bracket.

```text
Tax-Year Earnings: R300 000.00

Gross Tax:
R44 118 + (R300 000 - R245 100) x 26%

= R44 118 + R14 274
= R58 392

Primary Rebate:
R17 820

Estimated Income Tax:
R58 392 - R17 820
= R40 572

Estimated After-Tax Income:
R300 000 - R40 572
= R259 428

Effective Tax Rate:
(R40 572 / R300 000) x 100
= 13.52%
```

This example was also verified through the running application using a confirmed test transaction of R300 000.

### Tax Estimation Limitations

The calculation is intended for educational and financial planning purposes only.

It assumes that the freelancer is younger than 65 and that the income recorded by the platform represents the income being assessed.

It does not account for:

- Income earned outside HustleHub+.
- Business expenses or allowable deductions.
- Additional tax rebates or medical tax credits.
- Individual taxpayer circumstances.
- Other adjustments that may apply under South African tax legislation.

The dashboard includes a disclaimer explaining that the calculation is an estimate and not an official South African Revenue Service (SARS) assessment.

---

## Member 1.3 Backend Income and Tax Integration

The Part 3 functionality extends the existing freelancer income processing implemented during Part 2.

Income information is calculated using transaction records rather than requiring freelancers to enter their earnings manually.

The existing endpoint is:

`GET /api/income`

The endpoint is protected using the application's existing JWT authentication and freelancer role restrictions.

The implementation uses the following principles:

- **Authenticated ownership:** Income information is associated with the freelancer identified by the verified JWT.
- **Confirmed transactions:** Only confirmed transactions contribute to income totals.
- **Tax-year filtering:** Transactions are evaluated according to their recorded dates to calculate tax-year earnings.
- **Consistent financial calculations:** Tax estimates are derived from recorded income rather than independently entered values.
- **Controlled API responses:** Financial information is returned through the existing backend API structure.
- **Existing transaction preservation:** Historical income remains associated with transaction records even when the original gig is deleted.

The backend provides the financial information required by the React dashboard, including earnings and tax estimation values.

This approach reuses the existing application architecture and avoids introducing an unnecessary separate financial database.

---

## Member 1.4 React Income and Tax Dashboard

The existing React income page was enhanced to present financial information in a structured and visually appealing format.

The dashboard is accessible through the freelancer workspace at:

`/income`

### Income Summary

The first section displays three summary cards:

| Card | Description |
|---|---|
| Total Income | Total income from confirmed transactions |
| Confirmed Bookings | Number of confirmed transactions contributing to income |
| Average per Booking | Average income generated per confirmed booking |

These figures provide freelancers with a quick overview of their marketplace earnings.

### Tax-Year Financial Overview

A separate section displays financial information for the 2026/2027 tax year.

| Card | Description |
|---|---|
| Tax-Year Earnings | Income recorded during the selected tax year |
| Estimated Income Tax | Approximate tax calculated using progressive tax brackets |
| After-Tax Estimate | Earnings remaining after estimated tax |
| Effective Tax Rate | Estimated tax expressed as a percentage of earnings |

The cards use consistent spacing, typography and visual styling to distinguish important financial values.

Colour accents help differentiate estimated tax from after-tax income.

### Tax Calculation Details

An additional information panel displays:

- Marginal tax rate.
- Primary tax rebate.
- Number of confirmed tax-year transactions.
- Tax estimation disclaimer.

This allows freelancers to understand the figures presented in the dashboard without needing to inspect the underlying calculations.

---

## Member 1.5 Financial Visualisations

Two charts were integrated into the dashboard using the Recharts library.

These visualisations help freelancers interpret their financial information more easily than through numerical summaries alone.

### Monthly Earnings Bar Chart

The Monthly Earnings chart displays confirmed income grouped by month for the selected tax year.

Its purpose is to help freelancers identify when income was generated and compare earnings between months.

The chart includes:

- Monthly income values.
- A chronological tax-year timeline.
- Currency-formatted income values.
- A responsive layout.

Months without confirmed income remain part of the displayed tax-year period.

### Income vs Estimated Tax Doughnut Chart

The second visualisation displays the relationship between estimated tax and after-tax income.

The chart separates tax-year earnings into:

- **After-Tax Income:** Estimated earnings remaining after tax.
- **Estimated Tax:** Approximate income tax calculated for the tax year.

This provides a visual representation of how much of the freelancer's recorded earnings may be allocated towards income tax.

The chart uses contrasting colours and a legend to distinguish the two values.

### Chart Implementation

Recharts was installed as a frontend dependency and integrated into the React income page.

The charts use financial data from the application's existing income processing rather than relying on hard-coded demonstration values.

---

## Member 1.6 Dashboard Styling and Responsiveness

The dashboard styling was improved to provide a more professional and consistent user interface.

The enhancements include:

- Consistent financial summary cards.
- Improved typography and currency formatting.
- Responsive grid layouts.
- Styled navigation buttons.
- Distinct visual accents for tax-related information.
- Improved tax calculation details.
- Responsive chart containers.
- Improved transaction history table.
- Consistent spacing, borders and shadows.
- Layout adjustments for smaller screens.

Currency values are displayed using South African Rand formatting.

For example:

```text
R300 000,00
R40 572,00
R259 428,00
```

The financial dashboard retains the existing application colour scheme while introducing visual distinctions between income, tax and after-tax values.

---

## Member 1.7 Transaction History

The existing income transaction table remains available below the financial overview and charts.

The table displays:

| Field | Description |
|---|---|
| Date | Date of the recorded transaction |
| Gig | Name and category of the booked service |
| Booking | Associated booking identifier |
| Status | Transaction confirmation status |
| Amount | Recorded transaction amount |

The transaction history provides supporting information for the financial totals displayed above it.

The existing handling of deleted gigs is preserved so that historical transactions remain visible even if their original service listing is no longer available.

The dashboard also retains loading, empty and error states to provide feedback when income information cannot be retrieved.

---

## Member 1.8 Security Considerations

The Part 3 financial dashboard builds on the authentication and authorisation controls implemented in the earlier project stages.

The financial functionality follows these security principles:

### Authentication and Authorisation

The income endpoint requires a valid JWT and is restricted to authenticated freelancers.

Clients and unauthenticated users cannot access protected freelancer income information.

### Financial Data Ownership

Income is associated with the authenticated freelancer rather than accepting an arbitrary freelancer identifier from the frontend.

This reduces the risk of one freelancer requesting another freelancer's financial information.

### Server-Side Financial Calculations

Tax estimation is derived from transaction data processed by the backend.

The frontend displays the calculated information rather than independently determining the freelancer's recorded earnings.

### Data Integrity

Income totals are based on confirmed transaction records generated through the application's booking process.

The financial dashboard therefore uses existing application data instead of allowing users to manually modify recorded transaction amounts.

### Controlled Error Handling

The income functionality continues to use the application's existing error-handling mechanisms.

API errors are displayed through controlled frontend messages without intentionally exposing sensitive server implementation details.

These controls support the defence-in-depth security approach established during Part 1 and Part 2.

---

## Member 1.9 Testing and Verification

The Part 3 implementation was tested to verify financial calculations, dashboard behaviour and compatibility with the existing application.

### Backend Testing

Backend tests were used to verify the tax calculation logic and its integration with freelancer income processing.

The successful test run reported:

```text
19 tests passed
0 tests failed
```

The backend testing covered the tax calculation functionality and income-related controller behaviour.

### Frontend Automated Testing

The React frontend was tested using Vitest and React Testing Library.

The final successful test run reported:

```text
Test Files  10 passed (10)
Tests       63 passed (63)
```

The tests cover the existing application functionality, including authentication, navigation, gig management, bookings and income page behaviour.

The income page tests were updated to remain compatible with the enhanced dashboard and its financial formatting.

### ESLint Verification

Frontend static analysis was performed using ESLint.

Command:

```powershell
cd frontend
npm.cmd run lint
```

The final run completed successfully with no reported lint errors.

An existing React state-management lint issue in the gig form was also corrected during frontend verification.

### Production Build Verification

The frontend production build was verified using:

```powershell
cd frontend
npm.cmd run build
```

The build completed successfully using Vite.

The build reported an advisory warning about a JavaScript bundle exceeding the recommended chunk size. This warning did not prevent the production build from completing.

### Manual Integration Testing

The income and tax dashboard was also tested through the running application.

A confirmed transaction of R300 000 was used to verify the displayed values.

| Financial Value | Observed Result |
|---|---|
| Total Income | R300 000,00 |
| Confirmed Bookings | 1 |
| Tax-Year Earnings | R300 000,00 |
| Estimated Income Tax | R40 572,00 |
| After-Tax Estimate | R259 428,00 |
| Effective Tax Rate | 13.52% |
| Marginal Tax Rate | 26% |
| Primary Rebate | R17 820,00 |

The dashboard successfully displayed the financial summary cards, monthly earnings chart, tax breakdown chart, calculation details and transaction history.

These results demonstrate that the tax calculation is integrated with the existing transaction-based income system.

---

## Member 1.10 Main Implementation Files

The following files contain the main Part 3 Member 1 implementation and related frontend changes.

| File | Responsibility |
|---|---|
| `controllers/incomeController.js` | Freelancer income processing and tax integration |
| `routes/incomeRoutes.js` | Protected freelancer income endpoint |
| `frontend/src/pages/IncomePage.jsx` | Enhanced income and tax dashboard with charts |
| `frontend/src/pages/IncomePage.css` | Dashboard layout, cards, charts and responsive styling |
| `frontend/src/pages/IncomePage.test.jsx` | Income dashboard automated tests |
| `frontend/src/components/GigForm.jsx` | React state-management lint correction |
| `frontend/package.json` | Recharts dependency and frontend scripts |
| `frontend/package-lock.json` | Frontend dependency lockfile |

The implementation also includes backend tax calculation logic and its associated automated tests.

---

## Member 1.11 Running and Verifying the Dashboard

The existing application setup instructions are provided in Part 2, Member 2.7.

For Part 3 verification:

1. Start MongoDB.
2. Start the Express backend.
3. Start the React frontend.
4. Register or log in as a freelancer.
5. Ensure that at least one confirmed booking transaction exists for the freelancer.
6. Open **My Gigs**.
7. Select **View Income**.
8. Verify the income summary, tax calculations, charts and transaction history.

### Frontend Verification Commands

From the `frontend` directory:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

All three checks completed successfully during Member 1's final local verification.

---

## Member 1.12 Contribution Summary

The Part 3 Member 1 contribution extends HustleHub+ from basic freelancer income tracking into a more comprehensive financial dashboard.

The implementation provides an approximate South African income tax calculation, financial summaries, monthly earnings visualisations, estimated tax comparisons and improved transaction reporting.

The functionality was integrated with the existing authentication, transaction and income systems and verified through automated tests, static analysis, production build checks and manual integration testing.

This contribution satisfies the Part 3 requirement for a tax estimation component with clearly explained calculation logic and a structured, visually appealing freelancer income and tax interface.

---

# Part 3 - CI/CD Pipeline and Static Code Analysis

**Team Member:** Ophec Funis  
**Student Number:** ST10089492  
**Responsibility:** The GitHub Actions pipeline, static code analysis, dependency and secret scanning, and the pipeline evidence.

## Pipeline Overview

Part 3 adds a continuous integration pipeline using GitHub Actions. Every push to the repository and every pull request into `part3/main` runs the same set of checks automatically. If any check fails, the run fails and the failure is shown on the commit or pull request.

The pipeline installs the dependencies, runs the backend and frontend tests, builds the frontend, audits the dependencies, scans the history for secrets and analyses the source code for security problems. A complete run takes about 80 seconds.

| Job | What it does | The job fails when |
|---|---|---|
| Backend unit and API tests | Runs the 19 unit tests and the Newman collection against a MongoDB container | A test or an assertion fails |
| Frontend lint, tests and build | Runs ESLint, the 63 Vitest tests and the production build | Lint, a test or the build fails |
| Dependency audit | Audits the production dependencies of the backend and the frontend | A high or critical advisory is found |
| Secret scan | Scans the commits of the push or pull request with gitleaks | A secret is found |
| CodeQL static analysis | Analyses the source code with the security-extended queries | The analysis reports any result |
| Pipeline gate | Waits for every job above | Any job above did not succeed |

The backend has no separate build step. It is started from the installed packages during the Newman run, which confirms that it starts and serves requests. The frontend is built with `npm run build` and the output is kept as an artifact for each run.

Building and starting the containers is outside this section. It can be added to the pipeline as a further job when the Docker files are merged.

## Workflow Configuration

The pipeline is defined in `.github/workflows/ci.yml`. The CodeQL settings are in `.github/codeql/codeql-config.yml`.

- **Triggers:** Pushes to any branch, pull requests into `part3/main` and manual runs from the Actions tab.
- **Permissions:** The workflow token is read-only by default. Only the CodeQL job can publish results to code scanning, and only the secret scan job can read pull request details.
- **Pinned actions:** Every action is pinned to a full commit SHA, with the version in a comment. A tag that is moved later cannot change the code that the pipeline runs.
- **Credentials:** The checkout step does not keep the token in the local git configuration. No secrets are stored for the pipeline.
- **Concurrency:** A new push to a branch cancels the earlier run of that branch. Runs on `part3/main` are never cancelled.
- **Node.js:** All jobs use Node.js 22, with the npm cache keyed on the lock files.
- **Time limits:** Every job except the final gate has a time limit so that a stalled job cannot run indefinitely.
- **Reports:** Test results and audit reports are saved as artifacts on every run, including failed runs. The CodeQL results are saved whenever the analysis completes.

## Backend Checks

The backend job starts a MongoDB 7 container as a service so that the API tests use a real database.

1. Installs the backend dependencies with `npm ci`.
2. Runs the unit tests with the Node.js test runner. There are 19 tests for the tax calculation and the income controller. The results are written to the console and to a JUnit file.
3. Installs the Newman runner in the `postman` folder.
4. Runs the Newman collection with `npm test` in the `postman` folder. The runner starts the API with a separate test database and removes the database afterwards.

A run makes 96 requests and checks 283 assertions. The collection includes the security requests described in Part 2 (security headers, CORS, malformed and oversized requests, operator injection, script content in a gig and the rate limits), so these checks run on every push.

The runner trusts the project's local HTTPS certificate instead of disabling certificate verification. This change was made after the static analysis reported disabled certificate validation in the runner, as described in Static Analysis Results and Fixes.

The Newman summary is added to the job summary of the run. The unit test results and `postman/reports/` are saved in the `backend-test-reports` artifact.

## Frontend Checks

The frontend job runs in the `frontend` directory.

1. Installs the dependencies with `npm ci`.
2. Runs ESLint with `npm run lint`.
3. Runs the 63 Vitest tests in 10 test files with `npm test`.
4. Builds the production bundle with `npm run build`.

The production build is saved as the `frontend-build` artifact for seven days.

## Security Checks

In addition to the security requests in the Newman collection, the pipeline runs three automated security checks.

| Check | Looks for | Tool |
|---|---|---|
| Dependency audit | Known vulnerabilities in the production dependencies | `npm audit` |
| Secret scan | Passwords, keys and tokens committed to the repository | gitleaks |
| Static code analysis | Insecure code patterns such as injection and unsafe network or file handling | CodeQL |

### Dependency Audit

`npm audit --omit=dev --audit-level=high` runs for the backend and for the frontend. The job fails if a high or critical advisory affects a package that the running application uses.

A full audit that also includes the development tools is saved as the `audit-reports` artifact, and a summary table is added to the job summary. Development tools are reported but do not fail the job, because they are not part of the running application.

### Secret Scan

gitleaks scans the commits that are part of each push or pull request. The full history is checked out so that the scanner can read every commit in that range. A scan of the complete commit history with the gitleaks command line tool, run when the pipeline was set up, found no secrets. The `.env` file and the `certs` folder are not committed.

## Static Code Analysis

Static code analysis is performed with CodeQL, the analysis engine that GitHub provides for code scanning. CodeQL builds a database that represents the source code and runs queries against it. The queries follow data from where it enters, such as a request body, to where it is used, such as a database query, to find insecure patterns.

- **Language:** JavaScript, using the `javascript-typescript` analysis. This covers the Express API, the React frontend and the test runner.
- **Queries:** The `security-extended` query suite. It includes the default security queries and additional queries for less common problems. In total 103 queries are run.
- **Configuration:** `.github/codeql/codeql-config.yml`.
- **Results:** The results are saved as a SARIF file in the `codeql-results` artifact of each run and are published to the **Security** tab of the repository under **Code scanning**.
- **Gate:** The job counts the results in the SARIF file and fails if there is any. The job summary lists the rule, the file, the line and the security severity of each result.

The CodeQL action publishes results but does not fail the job when it finds something. The count in the job is therefore what makes the pipeline fail. The results are also saved as an artifact so that the gate does not depend on publishing to code scanning.

## Static Analysis Results and Fixes

The first analysis of the repository reported five results. All five have been fixed. The latest analysis of `part3/main` reports no results and the Security tab shows no open alerts.

| Rule | Location | Severity | What was reported | Fix |
|---|---|---|---|---|
| `js/incomplete-multi-character-sanitization` | `validators/gigValidation.js` | 7.8 | A single pass of the tag removal pattern can leave pieces of text that join into a new tag | Tag removal repeats until the text no longer changes, and any remaining angle brackets are removed |
| `js/disabling-certificate-validation` | `postman/runNewman.js` | 7.5 | The test runner disabled certificate verification when it checked that the API had started | The runner trusts the local certificate and detects the start of the API from its start-up message instead of making an HTTPS request |
| `js/sql-injection` | `controllers/bookingController.js` | 8.8 | The gig id from the request body is used in a database query | The id must be a string before it is validated and used |
| `js/sql-injection` | `controllers/gigController.js` | 8.8 | The gig update is built from values in the request body | The update is built from typed values: text, numbers and a boolean |
| `js/file-system-race` | `ensureSetup.js` | 7.7 | The `.env` file is checked and created in two separate steps | The file is created in a single step that fails if it already exists |

Existing controls limited the practical risk of each result. The gig and booking inputs were already validated, the sanitiser already removed any angle bracket that was left over, and the other two results affect only local setup and test tooling. CodeQL reports these patterns because the safety depends on a check elsewhere rather than being visible where the value is used. Each fix makes the code safe at the point of use, so it no longer depends on that check.

The behaviour of the application did not change. The 19 unit tests, the 283 Newman assertions and the 63 frontend tests pass before and after the fixes.

## Dependency Findings and Fixes

The dependency audit reported advisories in all three package folders.

| Package folder | Advisories before (all / production) | Advisories after (all / production) |
|---|---|---|
| Backend (repository root) | 3 / 3 | 0 / 0 |
| Frontend | 9 / 1 | 0 / 0 |
| Newman runner (`postman`) | 20 / 0 | 9 / 0 |

The following changes were made:

- **Backend:** `body-parser` was updated from 2.3.0 to 2.4.0 (denial of service with a compressed request body), `ip-address` from 10.7.3 to 10.7.6 and `qs` from 6.16.0 to 6.17.1. These are updates within the version ranges that were already allowed.
- **Frontend:** The production advisory was in `follow-redirects`, which was updated from 1.16.1 to 1.16.2. The remaining advisories were in development tools. `vitest`, `eslint`, `undici` and `zod` were updated to patched releases, and an `overrides` entry in `frontend/package.json` sets `minimatch` to 11.0.5 for ESLint. Lint, the 63 tests and the production build were run again after the change.
- **Newman runner:** `overrides` entries in `postman/package.json` set patched versions of `flatted`, `handlebars`, `ip-address`, `jose`, `lodash`, `node-forge`, `qs` and `underscore`. This removed the critical advisory. Newman passed all 283 assertions after the change.

The remaining advisories in the Newman runner come from `@faker-js/faker`, `csv-parse` and `uuid`. The audit offers no compatible fix for them. Its only suggestion is to downgrade Newman to version 4.6.1. These packages are development tools only. They are not installed in production, and `npm audit --omit=dev` reports nothing for the `postman` folder. The runner only calls the API on localhost with the collection stored in the repository, and it reads no CSV data files or external templates. The risk is therefore accepted, and the full audit continues to report it on every run.

## Pipeline Failure Behaviour

The pipeline is designed so that a problem cannot pass unnoticed. Each step stops with a failure code when its check fails, the job then fails, and the Pipeline gate job fails when any job before it did not succeed. The Pipeline gate is a single check name that can be set as a required check in the branch protection rules of `part3/main`, so that a failing run blocks a merge.

| Run | Commit | Result | What it shows |
|---|---|---|---|
| [42371021229](https://github.com/Raghav-10458336/INSY7314-POE-Part-1/actions/runs/42371021229) | `ee08ac8` | Passed | The first run of the pipeline. The CodeQL gate read the wrong field of the SARIF file, so it passed although five results were reported. The gate was corrected afterwards. |
| [42372024314](https://github.com/Raghav-10458336/INSY7314-POE-Part-1/actions/runs/42372024314) | `b9f7748` | Failed | With the gate corrected, CodeQL reported the three results that were still open and the Pipeline gate failed. The other four jobs passed. |
| [42372546491](https://github.com/Raghav-10458336/INSY7314-POE-Part-1/actions/runs/42372546491) | `bb5d2ba` | Passed | All three results were fixed and CodeQL reported no results. |
| [42373520579](https://github.com/Raghav-10458336/INSY7314-POE-Part-1/actions/runs/42373520579) | `279f135` | Passed | The run on `part3/main` after the pipeline pull request was merged. |

The failed run remains in the Actions history as evidence that the pipeline fails when a check does not pass.

## Pipeline Evidence

The following evidence is included with the Part 3 submission.

| Evidence | Location |
|---|---|
| Pipeline definition | `.github/workflows/ci.yml` |
| CodeQL configuration | `.github/codeql/codeql-config.yml` |
| Pipeline screenshots | `screenshots/ci/` |
| Pipeline run extracts | `reports/pipeline/pipeline-runs.txt` |
| Static analysis results | `reports/static-analysis/` |
| Pipeline runs, passed and failed | https://github.com/Raghav-10458336/INSY7314-POE-Part-1/actions |
| Static analysis results on GitHub | https://github.com/Raghav-10458336/INSY7314-POE-Part-1/security/code-scanning and the `codeql-results` artifact of each run |
| Pull request that added the pipeline | https://github.com/Raghav-10458336/INSY7314-POE-Part-1/pull/13 |
| Test and Newman reports | The `backend-test-reports` artifact of each run and `postman/reports/` |
| Audit reports | The `audit-reports` artifact of each run |

The Security tab and the artifacts of a run can only be opened by a signed-in user with access to the repository. The static analysis results and the log lines that show each check result are therefore also stored in the repository, in `reports/static-analysis/` and `reports/pipeline/`.

The screenshots in `screenshots/ci/` show the following.

| Screenshot | Shows |
|---|---|
| `01-failed-run.png` | The failed run on `part3/ci-pipeline`. CodeQL static analysis and the Pipeline gate failed and the other four jobs passed |
| `02-passed-run-part3-main.png` | The passed run on `part3/main` after the pull request was merged, with all six jobs and their times |
| `03-checks-passed-part3-main.png` | The six successful checks on the latest commit of `part3/main` |
| `04-repository-part3-main.png` | The repository on `part3/main` with the merge of pull request 13, 96 commits and the passing status |
| `05-branch-check-status.png` | The branches page with the check status of `part3/main` (6 of 6) and `part3/ci-pipeline` (13 of 13) |
| `06-pull-request-13-checks.png` | The checks of pull request 13 with all six jobs passed |

## Main Implementation Files

The following files contain the main pipeline and static analysis implementation.

| File | Responsibility |
|---|---|
| `.github/workflows/ci.yml` | The CI pipeline |
| `.github/codeql/codeql-config.yml` | CodeQL query suite |
| `package.json` | The `test:unit` script for the backend unit tests |
| `postman/runNewman.js` | Starts the API with a test database and runs the collection, trusting the local certificate |
| `postman/package.json` | Overrides for patched versions of the Newman dependencies |
| `frontend/package.json` | Override for the patched `minimatch` release |
| `package-lock.json`, `frontend/package-lock.json`, `postman/package-lock.json` | Updated dependency versions |
| `validators/gigValidation.js` | Tag removal repeated until the text is stable |
| `controllers/bookingController.js` | String check on the gig id |
| `controllers/gigController.js` | Gig update built from typed values |
| `ensureSetup.js` | `.env` file created in a single step |

## Running the Checks Locally

The pipeline commands can be run on a local computer. MongoDB must be running for the Newman tests.

From the repository root run:

```powershell
npm.cmd ci
npm.cmd run test:unit
npm.cmd run test:api
```

From the `frontend` directory run:

```powershell
npm.cmd ci
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

The dependency audit is run with the following command in the repository root and in the `frontend` directory:

```powershell
npm.cmd audit --omit=dev --audit-level=high
```

CodeQL and gitleaks run in the pipeline. Their results are available from the Actions tab and the Security tab.

On macOS or Linux, use `npm` in place of `npm.cmd`.

## Contribution Summary

The pipeline adds automated testing, building and security checks to every push and pull request in the repository. It runs the backend unit tests, the Newman API tests and the frontend tests, builds the frontend, audits the dependencies, scans the history for secrets and analyses the source code with CodeQL.

The static analysis found five results, which were fixed without changing the behaviour of the application. The dependency audit now reports no advisories for the backend and the frontend and none for the production dependencies of any package folder.

This contribution satisfies the Part 3 requirement for a GitHub Actions pipeline that runs automatically, installs the dependencies, runs the backend and frontend tests, builds the frontend and fails when a test or check does not pass. It also satisfies the requirement for static code analysis in the pipeline, with the results and an explanation of what they indicate.

---

# Part 3 - Member 3: Docker Containerisation and Logging

## Docker Containerisation

The complete HustleHub+ application can now run as three coordinated Docker services: a React/Nginx frontend, Node.js/Express backend and MongoDB database.

The backend image is defined by the root `Dockerfile`. The frontend uses a separate multi-stage `frontend/Dockerfile`, where Vite builds the production React bundle and Nginx serves the generated static files.

`docker-compose.yml` configures:

- `frontend` - React production build served by Nginx.
- `backend` - Express HTTPS API.
- `mongo` - MongoDB database.
- `hustlehub_network` - dedicated bridge network for container communication.
- `hustlehub_mongo_data` - persistent MongoDB storage.
- `hustlehub_backend_logs` - persistent structured backend logs.
- Health checks and dependency ordering so the backend waits for MongoDB and the frontend waits for the backend.
- Environment variables for the JWT secret, MongoDB connection and optional Better Stack integration.

The application is started from the repository root using:

```powershell
docker compose up --build -d
```

Container status can be verified using:

```powershell
docker compose ps
```

The containerised frontend is available at `http://localhost:5173` and the backend health endpoint at `https://localhost:5000/health`.

## Persistent Storage

MongoDB stores its database files in the named `hustlehub_mongo_data` volume. This allows user, gig, booking and transaction data to survive normal container recreation.

Backend JSON log files are stored in the `hustlehub_backend_logs` named volume so operational evidence is not lost when the backend container is replaced.

## Structured Application Logging

Member 3 adds a structured JSON logging service in `services/logger.js` and HTTP request logging middleware in `middleware/requestLogger.js`.

The application records the following operational/security events:

- HTTP requests
- Successful login attempts
- Failed login attempts
- Booking creation
- Transaction creation
- Transaction failures
- Booking rollback failures
- API errors
- Server startup and startup failures

Logs are written to the console and to persistent files under `/app/logs` inside the backend container.

## Sensitive Data Protection in Logs

Logging was designed so operational visibility does not expose authentication secrets or personal credentials.

The application does not log request bodies. Passwords, JWTs, authorization headers, cookies, database connection strings, JWT secrets and monitoring tokens are redacted when encountered. Login email addresses and IP addresses are hashed before logging. Booking/transaction logging records identifiers and statuses rather than payment amounts.

The `.env` file and runtime `.log` files are excluded from Git.

## Better Stack Monitoring Integration

The logging service includes optional Better Stack forwarding. When `BETTERSTACK_SOURCE_TOKEN` and `BETTERSTACK_INGESTING_HOST` are supplied through environment variables, the same sanitized structured events are forwarded to Better Stack while local console/file logging continues to operate.

No Better Stack credentials are stored in the repository. The values must be supplied in the local `.env` file or deployment environment.

Example variables are provided in `.env.docker.example`.

## Logging Security Tests

`tests/logger.test.js` verifies that secret fields are redacted and values selected for privacy-preserving correlation are hashed rather than written in their original form.

Run the tests using:

```powershell
node --test tests/logger.test.js
```

## Member 3 Evidence

Detailed Docker verification steps, Better Stack setup instructions and the required screenshot checklist are provided in:

```text
MEMBER3_DOCKER_LOGGING.md
```

The main Member 3 implementation files are:

```text
Dockerfile
.dockerignore
docker-compose.yml
.env.docker.example
frontend/Dockerfile
frontend/.dockerignore
frontend/nginx.conf
services/logger.js
middleware/requestLogger.js
controllers/authController.js
controllers/bookingController.js
middleware/errorHandler.js
tests/logger.test.js
MEMBER3_DOCKER_LOGGING.md
```
