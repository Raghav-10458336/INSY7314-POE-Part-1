# Member 4 - Validation, Testing, Demo & Submission

This document records the work completed for Member 4 of the INSY7314 POE Part 1 HustleHub+ project.

## 1. Validation implementation

Validation is implemented with `express-validator`, which is already included in the project dependencies.

### Registration validation

`POST /api/auth/register` checks that:

- `name` is present and between 2 and 50 characters.
- `email` is present and is a valid email address.
- `email` is normalised before the controller processes it.
- `password` is present and between 8 and 128 characters.
- `role` is present and is either `client` or `freelancer`.
- The role is converted to lower case before it reaches the controller.

The API intentionally does not allow a public registration request to create an `admin` user. This prevents privilege assignment through manipulated request data.

### Login validation

`POST /api/auth/login` checks that:

- `email` is present and valid.
- `password` is present.

### Validation error format

Invalid input receives HTTP `400 Bad Request` with a consistent JSON response:

```json
{
  "error": "validation failed",
  "details": [
    {
      "field": "email",
      "message": "email must be valid"
    }
  ]
}
```

Validation runs before the authentication controller, so invalid data is rejected before registration or login business logic executes.

## 2. Files added/updated

- Added `middleware/validation.js`
- Updated `routes/authRoutes.js` to apply validation to register and login
- Added `postman/HustleHub_API.postman_collection.json`
- Added this `MEMBER4_TESTING.md` testing and demonstration guide
- Added `screenshots/` as the recommended location for evidence screenshots

## 3. Postman test collection

Import:

`postman/HustleHub_API.postman_collection.json`

The collection contains the following tests in order:

1. Health check
2. Successful registration
3. Duplicate email registration
4. Successful login and JWT capture
5. Wrong password
6. Missing required registration fields
7. Invalid email
8. Invalid/unsafe role
9. Malformed JSON
10. Protected route with a valid JWT
11. Protected route without a JWT

The successful registration request automatically generates a unique email address and stores it as `{{testEmail}}`. The successful login request captures the returned JWT as `{{token}}` for the protected-route test.

## 4. How to run the API

1. The provided submission ZIP already includes a local `.env` file with a generated JWT secret. Do not show this file in screenshots or the demo video.
2. Install dependencies:

```bash
npm install
```

3. Start the API:

```bash
npm start
```

4. `npm start` automatically generates the local HTTPS certificate if it is missing.
5. Confirm the server reports:

`server running on https://localhost:5000`

Because the local server uses a self-signed certificate, Postman may reject it by default. In Postman, open **Settings > General** and switch **SSL certificate verification** off for the local demonstration if necessary.

## 5. Required evidence screenshots

Capture the Postman request and response for each of these scenarios and save the images in `screenshots/`:

- `01-health-check.png`
- `02-register-success.png`
- `03-duplicate-email.png`
- `04-login-success-jwt.png`
- `05-wrong-password.png`
- `06-missing-fields.png`
- `07-invalid-email.png`
- `08-invalid-role.png`
- `09-malformed-json.png`
- `10-protected-route-valid-jwt.png`
- `11-protected-route-no-jwt.png`

For every screenshot, make sure the following are visible where possible:

- HTTP method and endpoint
- Request body or Authorization header
- HTTP response status
- JSON response body

Do not expose the real `.env` file or `JWT_SECRET` in screenshots or the demo video.

## 6. Demo video script

A short demo can follow this order:

1. Show the project briefly and point out `middleware/validation.js`.
2. Start the API and show that it is running over `https://localhost:5000`.
3. In Postman, run the Health Check request.
4. Run Register - Happy Path and show the `201` response.
5. Run Register - Duplicate Email and show that the duplicate is rejected.
6. Run Register - Missing Fields or Invalid Email and show the `400` validation response.
7. Run Login - Happy Path and point out the JWT returned in the response.
8. Run Login - Wrong Password and show the `401` response.
9. Run Protected Route - Valid JWT and show the authenticated user payload.
10. Run Protected Route - Missing JWT and show the `401` response.
11. Briefly state that malformed JSON is also tested and that error responses do not expose stack traces.

## 7. Submission checklist

Before uploading the final project bundle:

- Confirm `.env` is not committed.
- Confirm the JWT secret is not present in any screenshot or source file.
- Confirm `node_modules/` is not included in Git.
- Confirm all Postman tests pass in the required order.
- Confirm screenshots are readable.
- Confirm the demo video shows registration, validation, login, the returned JWT, and a protected route.
- Confirm the architecture diagram and README are included by the integration/submission owner.
- Confirm all group branches have been merged and the final version runs from a clean checkout.
