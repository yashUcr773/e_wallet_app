# DigitalDime

## Functionality

- **E-wallet App**
- **Signin:** Allows users to sign in to their accounts.
- **Signup:** Enables users to create new accounts with a randomly assigned amount between 1 and 10,000.
- **Search Users:** Provides a feature to search for other users.
- **Send Money to Users:** Allows users to transfer money to other users.
- **Update User Details:** Enables users to update their account information.
- **Authentication and Session Management using JWT:** Utilizes JSON Web Tokens for authentication and managing user sessions.
- **Persistent Login:** Stores access tokens in memory and refresh tokens in HttpOnly cookies.
- **Automatic Access Token Renewal:** Refreshes the access token automatically upon expiry.
- **Configurable Token Lifetimes:** Allows configuration of access and refresh token lifetimes, defaulting to 1 day and 7 days, respectively.

## Tech Stack

### Frontend:
- Built with React, Recoil for state management, and Tailwind CSS for styling.
- Hosted on Vercel at [app.digitaldime.win](https://app.digitaldime.win).

### Backend:
- Developed using Express.js and Node.js, with MongoDB for data storage.
- Hosted on Vercel at [www.digitaldime.win](https://www.digitaldime.win).
- Domain provider: Cloudflare.

## Running Locally

- clone the `repo`
- cd `repo`
- cd backend
- npm i
- cd ../frontend
- npm i
- npm run start:both
- backend runs on `localhost:3000`
- frontend runs on `localhost:5173`

# Environment Variables

Ensure to add the following environment variables in a `.env` file within the `backend` directory:

- `MONGO_CONNECTION_STRING`: MongoDB connection string.
- `ENV`: Set to `development`.
- `ACCESS_TOKEN_SECRET`: Secret key for generating access tokens.
- `REFRESH_TOKEN_SECRET`: Secret key for generating refresh tokens.
- `ACCESS_TOKEN_EXPIRY`: Expiry duration for access tokens (default: 1 hour).
- `REFRESH_TOKEN_EXPIRY`: Expiry duration for refresh tokens (default: 2 days).
- `PORT`: Port number for the backend server (default: 3000).

Generate secure access token using `require('crypto').randomBytes(64).toString('hex')` in any Node environment.

## Attribution

- Tailwind styles inspired from [Flowbite](https://flowbite.com/).