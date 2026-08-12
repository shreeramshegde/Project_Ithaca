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

### 2.2 `team_members` Table
Stores individual participants for Witch's Island sit-out mechanic.
- `id` (UUID, Primary Key)
- `team_id` (UUID, Foreign Key)
- `name` (String)
- `is_sitting_out` (Boolean) - Default: false

### 2.3 `questions` Table
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

### 2.4 `team_progress` Table
Tracks exactly which questions the team has answered, mostly for non-sequential islands and audit logs.
- `id` (UUID, Primary Key)
- `team_id` (UUID, Foreign Key)
- `question_id` (UUID, Foreign Key)
- `status` (Enum: 'CORRECT', 'INCORRECT')
- `attempted_at` (Timestamp)

### 2.5 `team_inventory` Table
Stores active pre-round rewards for a team.
- `id` (UUID, Primary Key)
- `team_id` (UUID, Foreign Key)
- `reward_type` (Enum: 'ATHENAS_SCROLL', 'CYCLOPS_EYE', 'HERMES_SANDALS', 'THE_BLESSING')
- `is_used` (Boolean) - Default: false

## 3. Core API Endpoints

### 3.1 Authentication
- `POST /api/auth/login`
  - Validates `auth_code` and returns a JWT token for the team session.

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
    - If incorrect: Add `penalty_years`. Apply Island 1 specific penalty (skip question), or Island 4 penalty (flag a team member to sit out).
    - Checks completion of the island and progresses the team to the next island if criteria are met.

### 3.4 Utilities & Items
- `POST /api/game/use-hint`
  - Deducts 1 from `standard_hints_left` (if > 0) and returns a pre-defined hint for the requested question.
- `POST /api/game/use-reward`
  - Input: `reward_type`, `target_question_id`
  - Logic: Applies Cyclops Eye (returns 1 wrong option) or The Blessing (bypasses sit-out or deducts 3 years depending on team choice).

### 3.5 Admin & Leaderboard
- `GET /api/admin/leaderboard`
  - Returns ranking ordered by:
    1. `remaining_years` (ASC)
    2. `(end_time - start_time)` (ASC) - Tie Breaker 1
    3. `standard_hints_left` (DESC) - Tie Breaker 2
- `POST /api/admin/adjust-years`
  - Manual override for judges to add/deduct years in case of disputes.

## 4. Race Conditions & Concurrency
- Implement database transactions using Supabase/PostgreSQL row-level locking for answer submissions to ensure `remaining_years` is calculated accurately without partiality or data loss, especially during rapid consecutive submissions.
