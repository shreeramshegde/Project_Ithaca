# Backend & Database PRD - Project Ithaca

## 1. Overview
The backend for Project Ithaca manages the core game logic, team states, journey time calculations, and tie-breaking mechanics. It is built using **Node.js with Express** and backed by **Supabase (PostgreSQL)** to ensure real-time reliability and transactional integrity.

## 2. Database Schema (PostgreSQL / Supabase)

### 2.1 `teams` Table
Stores the state and progress of the 10 participating teams.
- `id` (UUID, Primary Key)
- `team_name` (String, Unique)
- `auth_code` (String, Unique) - For team login
- `remaining_years` (Float) - Starts at 20.0
- `standard_hints_left` (Int) - Starts at 3
- `current_island` (Int) - 1 to 4
- `start_time` (Timestamp) - Used for Tie-Breaker 1
- `end_time` (Timestamp) - Set when Island 4 is completed
- `is_completed` (Boolean) - Default: false


### 2.2 `questions` Table
Stores island-specific and pre-round questions.
- `id` (UUID, Primary Key)
- `island_id` (Int)
- `type` (Enum: 'PRE_ROUND', 'MAIN')
- `format` (Enum: 'MCQ', 'NON_MCQ')
- `question_text` (Text)
- `options` (JSONB) - Null for non-MCQ
- `correct_answer` (String)
- `hidden_wrong_answer` (String, Nullable) - Used in Island 3
- `reward_years` (Float) - Positive value to subtract from journey
- `penalty_years` (Float) - Positive value to add to journey
- `difficulty_level` (Int)

### 2.3 `team_progress` Table
Tracks exactly which questions the team has answered, mostly for non-sequential islands and audit logs.
- `id` (UUID, Primary Key)
- `team_id` (UUID, Foreign Key)
- `question_id` (UUID, Foreign Key)
- `status` (Enum: 'CORRECT', 'INCORRECT')
- `attempted_at` (Timestamp)

### 2.4 `team_inventory` Table
Stores active pre-round rewards for a team.
- `id` (UUID, Primary Key)
- `team_id` (UUID, Foreign Key)
- `reward_type` (Enum: 'ATHENAS_SCROLL', 'CYCLOPS_EYE', 'HERMES_SANDALS', 'THE_BLESSING')
- `is_used` (Boolean) - Default: false

## 3. Core API Endpoints

### 3.1 Authentication & Registration
- `POST /api/auth/register`
  - Registers a new team. Validates the incoming payload (e.g. `team_name`, `auth_code`) using **Zod** schema (DTO equivalent) to ensure correct formats before database insertion.
- `POST /api/auth/login`
  - Validates `auth_code` via Zod DTO and returns a JWT token for the team session.

### 3.2 Game State Fetching
- `GET /api/game/state`
  - Returns: `remaining_years`, `current_island`, `standard_hints_left`, `inventory`, `current_question_set`.
  - Determines if the team is currently facing a pre-round question or main questions.

### 3.3 Submissions
- `POST /api/game/submit-pre-round`
  - Input: `question_id`, `selected_option`
  - Logic: If correct, adds the island-specific reward to `team_inventory`. If Island 3 and `selected_option` equals `hidden_wrong_answer`, applies extra penalty (+2 years).
- `POST /api/game/submit-answer`
  - Input: `question_id`, `answer_string`
  - Logic: 
    - Validates answer (case-insensitive for non-MCQ).
    - If correct: Deduct `reward_years`.
    - If incorrect: Add `penalty_years`. Apply Island 1 specific penalty (skip question). For Island 4 (Witch's Island), the digital penalty is just years; the sit-out mechanic is enforced physically by volunteers.
    - Checks completion of the island and progresses the team to the next island if criteria are met.

### 3.4 Utilities & Items
- `POST /api/game/use-hint`
  - Deducts 1 from `standard_hints_left` (if > 0) and returns a pre-defined hint for the requested question.
- `POST /api/game/use-reward`
  - Input: `reward_type`, `target_question_id`
  - Logic: Applies Cyclops Eye (returns 1 wrong option) or The Blessing (bypasses physical sit-out or deducts 3 years depending on team choice).

### 3.5 Admin & Leaderboard
- `GET /api/admin/leaderboard`
  - Returns ranking ordered by:
    1. `remaining_years` (ASC)
    2. `(end_time - start_time)` (ASC) - Tie Breaker 1
    3. `standard_hints_left` (DESC) - Tie Breaker 2
- `POST /api/admin/adjust-years`
  - Manual override for judges to add/deduct years in case of disputes.

## 4. Security, Concurrency & JWT Tokens
- **JWT Integrity**: Since the JWT token is cryptographically signed and linked to the specific team, teams cannot spoof or modify the payload to affect other teams' scores. If they attempt to modify the token, validation will fail.
- **Handling Multiple Tabs/Parallel Submissions**: While a team with technical knowledge might try to open multiple tabs to solve non-sequential questions in parallel, all score and progression updates are handled on the backend via transactional DB row-level locks.
  - E.g., if multiple answers are submitted simultaneously, the database transaction locks the `teams` row, processes the penalty/reward sequentially, and prevents race conditions (preventing multiple rewards for the same question).
- **Physical Enforcement**: For Island 4, since one laptop is used per team and volunteers are physically present, the "Witch Sit-Out Mechanic" doesn't need to be digitally tracked. The UI simply alerts the team to physically exclude a member, enforced by the volunteer.

## 5. Developer Setup & Testing (Docker & Swagger)
To mimic the deployment environment locally and make API testing seamless for all developers:
- **Docker & PostgreSQL**: The repository will include a `docker-compose.yml` to effortlessly spin up a local PostgreSQL container. This ensures everyone's local database behaves exactly like the production environment.
- **Swagger UI**: All API endpoints will be documented and testable via a Swagger UI endpoint (`/api-docs`). This allows frontend developers to see exactly what parameters and DTO formats are expected and interact with the backend APIs directly from the browser.

## 6. Project Folder Structure & Architecture
To maintain a clean and scalable codebase, the Node.js backend follows an MVC-like pattern. Here is the visual layout of our backend folder:

```text
backend/
├── src/
│   ├── config/          # DB connection, Swagger, environment config
│   ├── controllers/     # Core business logic (req, res handling)
│   ├── dto/             # Zod validation schemas
│   ├── middlewares/     # JWT auth, error handlers, logging
│   ├── models/          # Database schema and Postgres client queries
│   ├── routes/          # Express router (URL paths to controllers)
│   ├── utils/           # Helper functions (hashing, formatting)
│   ├── app.js           # Express app setup and middleware registration
│   └── server.js        # Network listener (app.listen)
├── .env                 # Environment variables (secret keys, DB url)
├── docker-compose.yml   # Docker setup for local PostgreSQL
├── Dockerfile           # Backend containerization rules
└── package.json         # Project dependencies and scripts
```

**Folder Responsibilities (Spring Boot Equivalencies):**
- **`routes/` & `controllers/`**: Equivalent to `@RestController` and `@RequestMapping`. Routes handle the paths; controllers handle the logic.
- **`models/`**: Equivalent to `@Entity` / Repositories. Where we define our data interaction.
- **`dto/`**: Equivalent to Java Records or POJOs with `@Valid`. Validates incoming JSON payloads.
- **`middlewares/`**: Equivalent to Spring Security filters or `HandlerInterceptor`. Runs before the controller to check tokens or handle errors.
- **`config/`**: Equivalent to `application.yml` or `@Configuration` classes.
