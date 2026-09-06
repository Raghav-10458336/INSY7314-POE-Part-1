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
