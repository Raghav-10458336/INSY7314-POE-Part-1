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

---

---

# 8. Part 2 - Member 1: Project Setup and Gig Management

## 8.1 MongoDB Integration

For Part 2, the backend was extended from the Part 1 secure foundation to use MongoDB through Mongoose.

The MongoDB connection is configured in:

```text
config/db.js
```

The MongoDB connection string is stored in the `.env` file using the `MONGO_URI` environment variable.

When the Node.js server starts, the application connects to MongoDB before marketplace functionality is used.

This provides persistent storage for marketplace data such as freelancer gigs.

The MongoDB Atlas database used during development is not hard-coded into the project. Sensitive database credentials remain inside the local `.env` configuration and are excluded from GitHub.

---

## 8.2 Gig Model

A Mongoose `Gig` model was created in:

```text
models/Gig.js
```

Each gig stores the following information:

- Title
- Description
- Category
- Price
- Delivery time in days
- Freelancer owner ID
- Active status
- Creation timestamp
- Last updated timestamp

The freelancer owner ID is not accepted from the browser when a gig is created.

Instead, the owner is taken directly from the authenticated JWT:

```javascript
freelancer: req.user.id
```

This prevents a freelancer from creating a gig while pretending to be another user.

---

## 8.3 Gig Management API

The following gig endpoints were implemented:

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/gigs` | Public | View active gigs |
| GET | `/api/gigs/my` | Freelancer | View the authenticated freelancer's gigs |
| POST | `/api/gigs` | Freelancer | Create a new gig |
| PUT | `/api/gigs/:id` | Freelancer + Owner | Update an owned gig |
| DELETE | `/api/gigs/:id` | Freelancer + Owner | Delete an owned gig |

The public gig endpoint provides marketplace data that can later be used by the client browsing and booking functionality developed elsewhere in Part 2.

---

## 8.4 Freelancer Role Protection

Protected gig-management routes use the existing JWT authentication middleware from Part 1.

After authentication, the decoded JWT is made available as:

```javascript
req.user
```

The JWT contains the user's:

```text
id
role
```

Gig-management routes additionally use role middleware so that only accounts with the `freelancer` role may create, update or delete gigs.

For example:

```javascript
authenticateToken,
authorizeRoles('freelancer')
```

A user without the required role receives a controlled `403 Forbidden` response.

---

## 8.5 Gig Ownership Protection

A major security requirement for gig management is ensuring that one freelancer cannot modify another freelancer's data.

The backend enforces ownership when updating and deleting gigs.

The database query checks both:

```text
Gig ID
AND
Authenticated Freelancer ID
```

For example:

```javascript
{
    _id: req.params.id,
    freelancer: req.user.id
}
```

Therefore, knowing another gig's MongoDB ID is not sufficient to update or delete it.

If Freelancer B attempts to update or delete a gig belonging to Freelancer A, the request is rejected with a controlled response:

```json
{
    "error": "gig not found or access denied"
}
```

This ownership check is performed in the backend rather than relying on frontend restrictions.

---

## 8.6 Gig Input Validation

Gig requests are validated using `express-validator`.

Validation rules are applied to:

- Title
- Description
- Category
- Price
- Delivery days
- Active status

Examples of validation rules include:

- Gig title must be between 3 and 80 characters.
- Description must be between 10 and 1000 characters.
- Price may not be negative.
- Delivery days must be between 1 and 365.
- Active status must contain a valid Boolean value.

Invalid input is rejected before the request reaches the gig controller.

This provides server-side validation even if browser-based validation is bypassed.

---

## 8.7 React Gig Management Interface

A React frontend was added in:

```text
frontend/
```

The freelancer-facing **My Gigs** interface allows an authenticated freelancer to:

- View their own gigs
- Create a new gig
- Edit an existing gig
- Delete a gig
- View a gig's category
- View pricing
- View delivery time
- View whether the gig is active
- Receive success messages
- Receive controlled error messages

The main Member 1 React files include:

```text
frontend/src/api/api.js
frontend/src/components/GigForm.jsx
frontend/src/components/GigCard.jsx
frontend/src/pages/MyGigsPage.jsx
frontend/src/App.jsx
frontend/src/index.css
```

---

## 8.8 Frontend API Integration

Axios is used to communicate with the Node.js/Express backend.

The API helper is configured in:

```text
frontend/src/api/api.js
```

For protected requests, the frontend reads the JWT token from browser local storage and sends it using the HTTP `Authorization` header:

```text
Authorization: Bearer <token>
```

This allows the backend authentication middleware to identify the logged-in user before allowing access to protected routes.

---

## 8.9 Create Gig Flow

When a freelancer creates a gig:

1. The freelancer enters the gig information in the React form.
2. The frontend submits the request to:

```text
POST /api/gigs
```

3. The JWT is supplied in the Authorization header.
4. Authentication middleware verifies the token.
5. Role middleware verifies that the user is a freelancer.
6. Gig input validation is applied.
7. The backend assigns the authenticated user's ID as the gig owner.
8. The gig is stored in MongoDB.
9. A success response is returned.
10. The React interface refreshes the freelancer's gig list.

---

## 8.10 Update Gig Flow

A freelancer can edit an existing gig by selecting the **Edit** button in the My Gigs interface.

The React form is populated using the existing gig information.

After the changes are submitted, the frontend sends:

```text
PUT /api/gigs/:id
```

The backend only updates the record where both the gig ID and authenticated freelancer ID match.

After a successful update, the My Gigs interface reloads the updated data.

---

## 8.11 Delete Gig Flow

A freelancer can remove an owned gig using the **Delete** button.

The user is asked to confirm the action before the API request is sent.

The frontend sends:

```text
DELETE /api/gigs/:id
```

The backend verifies ownership before deleting the gig.

After successful deletion, the gig list automatically refreshes.

---

## 8.12 Member 1 Security Testing

The gig-management functionality was manually tested using multiple freelancer accounts.

The following scenarios were confirmed:

- Freelancer A successfully created a gig.
- Freelancer A successfully viewed their own gigs.
- Freelancer A successfully updated their own gig.
- Freelancer A successfully deleted their own gig.
- Freelancer B was unable to update Freelancer A's gig.
- Freelancer B was unable to delete Freelancer A's gig.
- Freelancer A's gig remained unchanged after Freelancer B's failed requests.
- Public users were able to view active gigs.
- Protected gig-management routes required a valid JWT.
- Invalid or expired authentication tokens were rejected.
- Gig ownership was enforced by the backend.
- Gig data persisted in MongoDB.

Example ownership-protection response:

```json
{
    "error": "gig not found or access denied"
}
```

---

## 8.13 Frontend Functional Testing

The React My Gigs interface was tested through the browser.

The following functionality was confirmed:

- Existing gigs load successfully.
- Creating a gig immediately adds it to the listings.
- Editing a gig updates the displayed information.
- Deleting a gig removes it from the listings.
- Successful operations display confirmation messages.
- Unauthenticated access displays an authentication error.
- The interface correctly communicates with the HTTPS backend API.

---

## 8.14 Running Part 2

### Backend

From the project root:

```bash
npm install
node server.js
```

The backend runs at:

```text
https://localhost:5000
```

A locally generated self-signed SSL certificate is used during development.

The health endpoint can be accessed at:

```text
https://localhost:5000/health
```

### Frontend

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The React frontend runs at:

```text
http://localhost:5173
```

---

## 8.15 Member 1 Part 2 File Structure

The main files added or updated for the Member 1 contribution are:

```text
config/db.js
models/Gig.js
controllers/gigController.js
middleware/roleMiddleware.js
routes/gigRoutes.js
validators/gigValidation.js
server.js

frontend/src/api/api.js
frontend/src/components/GigForm.jsx
frontend/src/components/GigCard.jsx
frontend/src/pages/MyGigsPage.jsx
frontend/src/App.jsx
frontend/src/index.css
```

---

## 8.16 Member 1 Part 2 Summary

The Member 1 contribution extends the Part 1 authentication foundation into the marketplace layer of HustleHub+.

The completed contribution includes:

- MongoDB integration
- Mongoose gig model
- Freelancer gig CRUD functionality
- JWT-protected gig-management routes
- Freelancer role restrictions
- Backend ownership enforcement
- Input validation
- Public gig browsing endpoint
- React My Gigs management interface
- Authenticated frontend API requests
- Create, edit and delete functionality
- Ownership security testing
- End-to-end frontend and backend testing

This provides the foundation required for the booking, transaction and income functionality developed by the remaining Part 2 team members.
