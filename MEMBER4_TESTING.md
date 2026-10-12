# Member 4 - Income, Testing and Demo (Part 2)

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
|---|---|---|
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

- `01-register.png` registration form for a freelancer
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
