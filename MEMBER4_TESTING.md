# Member 4 – Income, Testing and Demo (Part 2)

This document covers the Member 4 work for INSY7314 POE Part 2: freelancer income tracking, the Postman and Newman API tests, the React tests, the evidence files and the demo video.

## 1. Income tracking

`GET /api/income` returns the income of the freelancer who owns the token.

- Freelancers only. A client gets `403`, a request with no valid token gets `401`.
- The freelancer is always taken from the JWT. Query parameters such as `?freelancer=<id>` are ignored.
- Only confirmed transactions are counted.
- If a gig is deleted after it was booked, the transaction and the income stay and the row shows the gig as `null`.

Response:

```json
{
  "totalIncome": 370.5,
  "transactionCount": 2,
  "transactions": [
    {
      "_id": "...",
      "booking": "...",
      "gig": { "title": "Copy editing", "category": "Writing" },
      "amount": 120.5,
      "status": "confirmed",
      "createdAt": "2026-10-09T10:00:00.000Z"
    }
  ]
}
```

The React page is at `/income` and is opened with the View Income button on My Gigs.

Files: `controllers/incomeController.js`, `routes/incomeRoutes.js`, `frontend/src/api/incomeApi.js`, `frontend/src/pages/IncomePage.jsx`.

## 2. API tests (Postman and Newman)

The collection is `postman/HustleHub_API.postman_collection.json`.

| Folder | Requests | What it checks |
|---|---:|---|
| 00 Setup | 1 | health check, creates the unique emails for the run |
| 01 Auth | 16 | register, duplicate email, admin role refused, login, token contents, wrong password, validation, protected route with bad tokens |
| 02 Gigs | 23 | create, update, delete, validation, role checks, other freelancers cannot touch a gig, inactive gigs hidden, text such as & ' " and / stored as typed |
| 03 Bookings | 13 | booking creates a transaction, price cannot be set by the client, role checks, each side only sees its own bookings |
| 04 Income | 7 | totals match the bookings, other freelancers and clients are blocked, income kept after a gig is deleted |
| 05 Security | 9 | security headers, CORS, malformed JSON, oversized body, operator injection, script in a gig |
| 06 Rate limits | 3 | booking, login and registration each end in a 429 with a message and Retry-After |

Every request also runs two collection level checks: the response is JSON, and it does not contain internal details such as stack traces or password hashes.

### Run with Newman

MongoDB must be running. From the repository root:

```bash
npm install
npm run test:api
```

The script (`postman/runNewman.js`) installs Newman into `postman/`, starts the API on port 5055 against a separate test database, runs the collection and removes the test database again. It exits with code 0 only when every assertion passes.

Settings you can change with environment variables:

| Variable | Default |
|---|---|
| `TEST_PORT` | `5055` |
| `TEST_MONGO_URI` | `MONGO_URI` from `.env` with `_test` added to the database name, or `mongodb://127.0.0.1:27017/hustlehub_test` |

Reports are written to `postman/reports/`:

- `newman-cli.txt` is the console output
- `newman-junit.xml` is the same run as JUnit XML

### Run in the Postman app

1. Import the collection.
2. Settings, General, turn off SSL certificate verification (self signed certificate).
3. Start the API, then run the collection from the top.

Restart the API before every run. Registration is limited to 5 requests per hour and failed logins to 10 per 15 minutes, and the collection uses those limits up on purpose.

## 3. React tests

Vitest with React Testing Library. From the repository root:

```bash
cd frontend
npm install
npm test
```

`npm run test:watch` keeps the runner open while you edit.

| File | What it covers |
|---|---|
| `LoginPage.test.jsx` | form, submitted values, redirect by role, server and fallback errors, show/hide password, locked button |
| `RegisterPage.test.jsx` | role choice, mismatched passwords, 72 byte limit, server error, redirect with message |
| `ProtectedRoute.test.jsx` | loading state, redirect to login, 403 for the wrong role, allowed role |
| `GigCard.test.jsx`, `GigForm.test.jsx` | gig details, edit and delete callbacks, numeric payload, edit mode, cancel, busy state |
| `ClientHomePage.test.jsx` | gig list, empty and error states, details dialog, booking success and failure, bookings list, log out |
| `MyGigsPage.test.jsx` | gigs and bookings, create, validation details, delete with confirmation, 403 message, link to income |
| `IncomePage.test.jsx` | total, count and average, rows, deleted gig label, empty and error states, navigation |
| `api.test.js` | token header, session cleared on a 401 with a token, no reaction to a failed login |
| `AuthContext.test.jsx` | restoring a session, dropping a rejected token, login, logout |

To save the output as evidence (Command Prompt, run from `frontend/`):

```bat
set NO_COLOR=1
npm test -- --reporter=verbose > reports\vitest-verbose.txt
```

## 4. Screenshots for the submission

Save these in `screenshots/` and keep the `.env` file out of every shot.

- `01-register.png` registration form completed
- `02-login-error.png` login with an error message
- `03-create-gig.png` freelancer creating a gig
- `04-my-gigs.png` freelancer gig list
- `05-browse-gigs.png` client browsing gigs
- `06-booking-confirmed.png` booking confirmation with the transaction id
- `07-client-bookings.png` client booking list
- `08-freelancer-bookings.png` freelancer bookings with transaction details
- `09-income.png` income page
- `10-validation-error.png` invalid input handled on a form
- `11-access-denied.png` freelancer opening the client page
- `14-github-commits.png` GitHub repository with commits and contributors
- `15-readme-part2.png` README Part 2 overview and endpoint table
- `16-mongodb-transaction.png` transaction records in MongoDB
- `17-login-page.png` sign in page
- `18-register-page.png` registration page
- `19-account-created.png` account created confirmation
- `20-newman-run.png` Newman summary table
- `21-newman-rate-limits.png` Newman rate limit folder
- `22-frontend-tests.png` Vitest summary

## 5. Demo video

One take, about five minutes.

1. Show the repository and start the API and the frontend.
2. Register a freelancer, then log in.
3. Create a gig and show it in My Gigs. Edit it once.
4. Log out, register a client, log in.
5. Browse gigs, open the details and book one. Point out the booking and transaction ids.
6. Open My Bookings and show the booking and its transaction status.
7. Log out, log in as the freelancer and show the booking under Client Bookings.
8. Open View Income and show the total.
9. Briefly show a refused action (the client page as a freelancer) and a validation message.
10. Run `npm run test:api` and `npm test` in the frontend and show both finishing green.

## 6. Submission checklist

- `.env` and `certs/` are not committed
- `npm run test:api` passes from a clean checkout and `postman/reports/` is committed
- `npm test` passes in `frontend/`
- screenshots are readable and named as above
- README has the income, testing and run instructions
- video link is added to the README and to the ARC submission
- everyone's branches are merged and the final version runs from a clean checkout

---

# Member 4 – Security Features, Testing and Final Review (Part 3) - ST10438099

**Student number:** ST10438099

This section covers my additional security work for INSY7314 POE Part 3. My focus was on improving account security, checking that the existing security controls continued to work, and recording the testing and evidence for the final submission.

## 7. Additional security features

For Part 3, I implemented two additional security features. These build on the security controls already included in Part 2.

### 7.1 Account-based login lockout

I added an account-based lockout mechanism to reduce the risk of repeated password-guessing attempts against a user account.

The system records consecutive failed login attempts for each account. After five consecutive incorrect passwords, the account is locked for 15 minutes. While the lockout is active, the user cannot log in, even if the correct password is entered. Once the lockout period has expired, the user can try again. A successful login resets the failed-attempt counter and clears the lockout information.

The failed-attempt count and lockout expiry are stored in the user record in MongoDB. This means the lockout information is not limited to the current server session.

The feature was added to the existing authentication process rather than creating a separate login system.

### 7.2 Password change and JWT session invalidation

I also implemented session invalidation when a user changes their password. This is important because changing a password should prevent previously issued authentication tokens from continuing to provide access.

Each user record now has a `tokenVersion` value. When a user successfully changes their password, the value is incremented. The authentication middleware checks the version stored in the database against the version included in the JWT.

If a token was issued before the password change, its version no longer matches the current database value and the request is rejected. The user must log in again using the new password to receive a valid token.

This provides an additional layer of protection if a user's previous token has been exposed or is still active on another device.

### 7.3 Implementation files

The following files were updated for these features:

| File | Changes |
|---|---|
| `models/User.js` | Added `failedLoginAttempts`, `lockUntil` and `tokenVersion` fields to the user schema. |
| `controllers/authController.js` | Added failed-login tracking, the 15-minute lockout, successful-login reset and password-change handling. |
| `middleware/authMiddleware.js` | Added JWT token-version verification against the user's current database record. |
| `middleware/validation.js` | Added validation for the password-change request. |
| `routes/authRoutes.js` | Added the protected password-change route. |

The new features are separate from the security controls already implemented in Part 2. The existing JWT authentication, role-based access control, input validation, sanitisation, rate limiting, Helmet security headers, Content Security Policy, CORS restrictions and ownership checks remain part of the application.

## 8. Part 3 testing

I tested the updated backend using the existing Postman and Newman collection. The purpose was to check that the new authentication changes did not break the existing API functionality or weaken the security controls already in place.

### 8.1 Newman test results

I ran the API test suite locally using:

```bash
npm test
```

The test run completed with the following results:

| Test measure | Result |
|---|---:|
| Requests | 96 |
| Test scripts | 144 |
| Pre-request scripts | 4 |
| Assertions | 283 |
| Failed tests | 0 |

The run completed without failed assertions. The authentication tests included incorrect-password responses and the account lockout response. The lockout test reached a `423 Locked` response after repeated failed login attempts.

The existing tests also continued to pass for registration, authentication, gigs, bookings, income, input validation, security headers, CORS, injection attempts and rate limiting.

### 8.2 Automated workflow

After correcting the login failure-handling issue, I pushed the updated implementation to the Part 3 branch. The GitHub Actions workflow completed successfully.

The successful workflow provided an additional check that the updated code passed the configured automated checks, including the backend API tests and the other repository checks.

### 8.3 Additional manual verification

The automated Newman run confirms that the lockout response is reached. However, it does not by itself prove every part of the 15-minute expiry and password-change session invalidation process. These behaviours should also be checked manually before the final demonstration.

The following checks are used for that verification:

**Account lockout and expiry**

1. Log in using an existing account and enter an incorrect password five times.
2. Confirm that the account receives a `423 Locked` response after the fifth consecutive failed attempt.
3. Attempt to log in again while the lockout is active and confirm that access is still refused.
4. Wait for the 15-minute lockout period to expire.
5. Log in using the correct password and confirm that access is restored.

**Successful-login reset**

1. Enter an incorrect password four times.
2. Log in successfully using the correct password.
3. Enter an incorrect password four more times.
4. Confirm that these attempts do not immediately trigger a lockout.
5. Confirm that the fifth consecutive failed attempt after the successful login triggers the lockout.

**Password change and existing sessions**

1. Log in to the same account in two separate sessions and retain both authentication tokens.
2. Use one session to submit a password change through `PATCH /api/auth/change-password`.
3. Use the second session's old token to access a protected endpoint such as `/api/auth/me`.
4. Confirm that the old token is rejected with `401`.
5. Log in again using the new password and confirm that the new session can access protected endpoints.
6. Confirm that the previous password can no longer be used to log in.

Manual test results should be recorded alongside the relevant screenshots or other evidence once these checks have been completed.

## 9. Security review

As part of my Part 3 responsibilities, I reviewed the application's existing security controls as well as the two additional features.

| Security area | Review |
|---|---|
| Authentication | Protected routes require a valid JWT. The token version is also checked against the database. |
| Password security | Passwords are hashed before being stored. Password changes require the current password to be verified. |
| Repeated login attempts | Five consecutive failed attempts trigger a 15-minute account lockout. |
| Session management | Changing a password increments the token version, invalidating previously issued tokens. |
| Role-based access | Routes check the authenticated user's role before allowing access to restricted functionality. |
| Input validation | Request data is validated before being processed. |
| Injection protection | The existing tests check for MongoDB operator injection and unsafe input. |
| Cross-site scripting | The existing security tests check script content in gig data, alongside the application's sanitisation and browser security controls. |
| Rate limiting | Existing rate limits help reduce repeated requests to sensitive endpoints. |
| Security headers and CORS | Helmet, Content Security Policy and the configured CORS allowlist remain in place. |
| Error handling | Unexpected errors are handled without returning stack traces or other internal details to the client. |
| Resource ownership | Users are restricted to resources they are authorised to access. |





