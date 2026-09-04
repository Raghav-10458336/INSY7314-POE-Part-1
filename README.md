# INSY7314-POE-Part-1
# HustleHub+

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

