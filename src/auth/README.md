# Auth-Service
This Service takes care about authenticating the user.

## Endpoints
| Endpoint     | Type | Auth? | Description                                           |
|--------------|------|-------|-------------------------------------------------------|
| `/login`     | POST |       | Returns a JWT if authentication is successful.        |
| `/register`  | POST |       | Validates and creates a new user record.              |
| `/get-token` | GET  | 🔒     | Returns user information if available and authorized. |

## Environment Variables
```
DB_HOST=""
DB_USERNAME=""
DB_PASSWORD=""
DB_DEFAULT=""

JWT_SECRET=""
PORT=0
```