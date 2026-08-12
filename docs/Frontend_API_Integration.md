# Frontend API Integration Guide 🚀

Welcome Frontend Team! This document is designed to make connecting to the backend as easy as possible without all the database and backend jargon.

## 🚀 How to Run the Backend Locally

Before you can test the APIs in your React app, you need to spin up the local backend and database using Docker.

1. **Install Docker**: Make sure you have Docker Desktop installed on your laptop.
2. **Start the Servers**: Open your terminal, navigate to the `backend/` folder, and run:
   ```bash
   docker-compose up -d
   ```
   *This command downloads PostgreSQL, sets up our database tables, and starts the Node.js server in the background.*
3. **Test the APIs**: Open your browser and go to our interactive Swagger UI:
   👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**
4. **Connecting to the Database (Optional)**: If you want to look at the raw tables using a tool like DBeaver or pgAdmin, use these credentials:
   - **Host:** `localhost`
   - **Port:** `5433`
   - **Database:** `ithaca_db`
   - **Username:** `postgres`
   - **Password:** `postgres`

---

## 1. Team Registration

Use this endpoint when a team types in their Team Name and Auth Code at the registration desk.

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`

### What you need to send (JSON Body):
```json
{
  "team_name": "The Argonauts",
  "auth_code": "secretCode123"
}
```

### What you will receive on Success (201 Created):
```json
{
  "status": "success",
  "message": "Team registered successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "team_name": "The Argonauts",
    "remaining_years": "20.00",
    "standard_hints_left": 3,
    "current_island": 1
  }
}
```

### What happens on an Error (400 or 409):
If the team name or auth code is already taken, you will get a 409 Conflict:
```json
{
  "status": "error",
  "message": "Team name or Auth code already exists"
}
```
If they forget to type something or the code is too short, you will get a 400 Bad Request with validation details from our Zod schema.

---

## What's Next?
As we build out more endpoints for answering questions and using items (like Cyclops Eye), we will add them to this document! 

**Pro-tip for React:** 
Use `fetch` or `axios` to make this POST request. When you get the `data` back, store the `remaining_years` and `current_island` in your React Context or Redux store so you can show it on the Heads-Up Display!
