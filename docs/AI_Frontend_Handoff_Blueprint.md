# 🤖 AI Frontend Handoff Blueprint: Project Ithaca

> **ATTENTION AI AGENT (ANTIGRAVITY / GEMINI 3.1 PRO):** 
> You are reading the absolute master blueprint for the frontend architecture of "Project Ithaca", a time-travel themed tech treasure hunt. This document contains the exact rules, constraints, API contracts, database ENUMS, validation schemas, and edge cases dictated by the backend. **Do not make assumptions. Follow these instructions exactly to build the React frontend.**

---

## 1. Core Architecture & Authentication
- **The Premise:** Teams start with exactly `20.00` "years". Their goal is to navigate 4 islands and reach exactly `0.00` years. Correct answers subtract years; wrong answers add penalty years.
- **No Login System:** Teams register once at the venue via `POST /api/auth/register` (providing `team_name` and `auth_code`). 
- **JWT Storage & Routing Flow:** 
  1. The app MUST start on a Registration/Welcome Screen.
  2. Upon successful registration, store the returned JWT securely in `localStorage`. 
  3. **SESSION PERSISTENCE (CRITICAL):** Because the JWT is in `localStorage`, it survives tab closures and browser restarts! There is no need for actual HTTP cookies. If the user accidentally closes the tab and reopens the site, your React app MUST check `localStorage` on mount. If the token is there, automatically bypass the registration screen and fetch the game state. They should never have to re-register.
  4. Only AFTER the token is saved should you redirect the user to the main Game Dashboard route.
  5. The JWT must be attached as a Bearer token in the `Authorization` header for EVERY subsequent request.
- **HUD Synchronization:** The main Game Dashboard must call `GET /api/game/state` on mount to populate the Heads-Up Display (HUD) showing `remaining_years`, `standard_hints_left` (starts at 3), and active inventory. Almost every game endpoint returns updated team stats. You must sync the React Context/State HUD with this fresh data after every API call.

---

## 2. Dynamic Question Fetching
**ENDPOINT:** `GET /api/game/questions`

You must NEVER hardcode question UUIDs. When a team arrives at an island, fetch this endpoint. The backend intelligently sorts the questions into a perfect array using a secure database `sequence_number`. 

**The Array Structure Guarantee:**
- `array[0]` is **ALWAYS** the `PRE_ROUND` question.
- `array[1...N]` are the `MAIN` questions, safely ordered.

---

## 3. The Island Flows (CRITICAL UI DIFFERENCES)

### 🔴 Phase A: The Pre-Round (All Islands)
When a team lands on an island, they must FIRST solve `array[0]` (The Pre-Round GK MCQ). 
- Use `POST /api/game/submit-pre-round`.
- **Success:** They earn a specific reward item (e.g., `CYCLOPS_EYE`) added to their inventory.
- **Failure:** They receive a time penalty. On Island 3, there is a "hidden wrong answer" trap that gives a massive +2.00 year penalty if triggered. 
- *Once the Pre-Round is answered (right or wrong), unlock Phase B.*

### 🔵 Phase B: Island 1 - The "Candy Crush" Map
Island 1 is **NON-SEQUENTIAL**. Teams can choose the order they answer the base questions.
- **The Array:** `array[1]` through `array[4]` are the 4 Base Questions. `array[5]` through `array[10]` are the 6 Extra Penalty Questions.
- **The UI:** Render a map with 4 clickable nodes representing the Base Questions. Keep the Penalty questions completely hidden.
- **The Penalty Mechanic:** If a team answers a Base Question incorrectly, the backend penalizes them. The frontend MUST force them to retry that same Base Question until they get it right. ADDITIONALLY, because they failed, the frontend must "unlock" `array[5]` and draw a 5th node on the map. If they fail again, unlock `array[6]`, etc. They cannot leave Island 1 until all unlocked nodes are answered correctly.

### 🟣 Phase C: Islands 2, 3, and 4 - The Sequential Flow
These islands are **STRICTLY SEQUENTIAL**.
- **The UI:** Do not show a map of all questions. Maintain a local state `currentQuestionIndex = 1`. 
- Only render `array[currentQuestionIndex]`.
- When they answer correctly, the backend returns `is_correct: true`. ONLY THEN should you increment `currentQuestionIndex` to show the next question.

---

## 4. Submitting Answers & Verification
**ENDPOINT:** `POST /api/game/submit-answer`

- **Payload:** `{ "question_id": "uuid", "answer_string": "user input" }`
- **Non-MCQ Handling:** For text-based inputs, the backend automatically handles `.toLowerCase()` and uses a Regex to collapse double-spaces into single spaces (`/\s+/g`). You do not need to over-engineer frontend text sanitization.
- **Result:** If `is_correct: false`, display the penalty message returned by the backend, shake the UI (error animation), and leave the question on screen. If `is_correct: true`, show a success animation and progress the flow.
- **CRITICAL UI DIRECTIVE (NO REFRESHING):** You MUST NOT use `window.location.reload()` or require the user to refresh the page. React must be reactive! Immediately after `submit-answer` resolves (whether correct or incorrect), you MUST silently re-fetch `GET /api/game/questions` and `GET /api/game/state` in the background and update your React State. This ensures the UI instantly reveals newly unlocked penalty nodes or displays green "completed" checkmarks without a page refresh.

---

## 5. Hints & Rewards
- **Hints (`POST /api/game/use-hint`):** Teams have exactly 3 standard hints for the *entire* game. Pass the `question_id`. Show a warning modal before consumption ("Are you sure? You only have X hints left!").
- **Rewards (`POST /api/game/use-reward`):** 
  - **Expiration:** Rewards earned on an island are ONLY valid for that specific island. If a team tries to use `ATHENAS_SCROLL` on Island 2, the backend will reject it. 
  - **Types:**
    - `ATHENAS_SCROLL` (Island 1): Gives a free hint without deducting standard hints. Requires `target_question_id`.
    - `CYCLOPS_EYE` (Island 2): Eliminates one wrong MCQ option. Requires `target_question_id`.
    - `HERMES_SANDALS` (Island 3): Instantly deducts 2.00 years. Does NOT require a target question.
    - `THE_BLESSING` (Island 4): Instantly deducts 3.00 years. Does NOT require a target question.

---

## 6. Island Progression & Endgame
**ENDPOINT:** `POST /api/game/next-island`

When a team successfully answers all required main questions (and any unlocked penalty questions) for the current island, render a prominent **"Sail to Next Island"** button.
- Clicking this triggers the endpoint, which updates their `current_island` on the backend.
- **Endgame Trigger:** If they click this after completing Island 4, the backend will automatically set `is_completed: true` and freeze their `end_time`. The frontend should immediately redirect them to a glorious "Victory / Journey Completed" screen displaying their final `remaining_years` and total time taken. 

---

## 7. Developer UX/UI Directives for the AI
1. **No Placeholders:** Generate a premium, production-ready UI. Use harmonious color palettes (deep ocean blues, mythical golds).
2. **Animations:** Use micro-animations (Framer Motion or CSS transitions) for revealing questions, showing penalty red-flashes, and reward usage.
3. **Responsive:** Must be flawlessly responsive. Teams may be using mobile phones while running around the venue.
4. **State Management & Reactivity:** Abstract the API calls into custom React hooks (e.g., `useGameData()`) so the UI components remain clean. You MUST use a tool like **React Query (@tanstack/react-query)** or rigorous `useEffect` dependencies to invalidate and re-fetch queries after mutations. NEVER require a page refresh to show UI updates.
5. **Do not hardcode backend logic:** The backend dictates penalties, rewards, and correctness. The frontend is a beautiful, dumb presenter of the backend's truth.

---

## 8. Database ENUMs Reference
You will encounter these strictly-typed strings in the API payloads. Ensure your frontend logic maps exactly to these strings (they are case-sensitive).

- **Question `type`:** 
  - `'PRE_ROUND'`: The initial GK MCQ on an island.
  - `'MAIN'`: Core game questions.
- **Question `format`:** 
  - `'MCQ'`: Render 4 buttons/options.
  - `'NON_MCQ'`: Render a text input field.
- **Question `reward_type`:** 
  - `'ATHENAS_SCROLL'`
  - `'CYCLOPS_EYE'`
  - `'HERMES_SANDALS'`
  - `'THE_BLESSING'`
- **Answer `status`:** 
  - `'CORRECT'`
  - `'INCORRECT'`

---

## 9. EXHAUSTIVE API REFERENCE (Frontend Usage)

Below is the strict API contract. The backend uses `zod` for validation. Any request that violates these schemas will instantly receive a `400 Bad Request`.

### 🟢 1. Register Team
Use this to register a team and get the JWT.
- **URL:** `POST /api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body Validation:** 
  - `team_name`: String (Min 3, Max 100 characters)
  - `auth_code`: String (Min 4, Max 100 characters)
- **Success (201 Created):**
  ```json
  {
    "status": "success",
    "message": "Team registered successfully",
    "token": "eyJhbGciOi...",
    "data": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "team_name": "The Argonauts",
      "remaining_years": "20.00",
      "standard_hints_left": 3,
      "current_island": 1
    }
  }
  ```
- **Error (409 Conflict):**
  ```json
  {
    "status": "error",
    "message": "Team name or Auth code already exists"
  }
  ```

### 🟢 2. Fetch Game State
Use this on page reload/refresh to populate the HUD.
- **URL:** `GET /api/game/state`
- **Headers:** `Authorization: Bearer <token>`
- **Success (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "team": {
        "remaining_years": "20.00",
        "current_island": 1,
        "standard_hints_left": 3,
        "is_completed": false
      },
      "inventory": [
        {
          "id": "abc...",
          "reward_type": "ATHENAS_SCROLL",
          "is_used": false
        }
      ]
    }
  }
  ```

### 🟢 3. Fetch Questions
Use this when a team arrives at an island to fetch the securely-sorted questions array. Answers are hidden.
- **URL:** `GET /api/game/questions`
- **Headers:** `Authorization: Bearer <token>`
- **Success (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "island": 1,
      "questions": [
        {
          "id": "uuid-string-here",
          "type": "MAIN",
          "format": "MCQ",
          "question_text": "What is 2 + 2?",
          "options": ["1", "2", "3", "4"],
          "reward_years": "0.50",
          "penalty_years": "2.00",
          "difficulty_level": 1,
          "sequence_number": 1,
          "progress_status": "CORRECT" // Can be "CORRECT", "INCORRECT", or null
        }
      ]
    }
  }
  ```

### 🟢 4. Submit Pre-Round Answer
Use this for `array[0]`.
- **URL:** `POST /api/game/submit-pre-round`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body Validation:**
  - `question_id`: Valid UUID string
  - `selected_option`: String (Min 1 character)
- **Success (200 OK - Correct):**
  ```json
  {
    "status": "success",
    "message": "Correct! You earned CYCLOPS_EYE",
    "is_correct": true,
    "reward": "CYCLOPS_EYE"
  }
  ```
- **Success (200 OK - Incorrect or Hidden Trap):**
  ```json
  {
    "status": "success",
    "message": "Hidden trap triggered! +2 years penalty applied.",
    "is_correct": false
  }
  ```
- **Error (400 Bad Request):** "Pre-round already completed"

### 🟢 5. Submit Main Answer
Use this for `array[1...N]`. The backend automatically applies penalties and row-level DB locks to prevent race conditions.
- **URL:** `POST /api/game/submit-answer`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body Validation:**
  - `question_id`: Valid UUID string
  - `answer_string`: String (Min 1 character)
- **Success (200 OK - Correct):**
  ```json
  {
    "status": "success",
    "message": "Correct answer!",
    "is_correct": true,
    "data": {
      "remaining_years": "19.50",
      "current_island": 1
    }
  }
  ```
- **Success (200 OK - Incorrect):**
  ```json
  {
    "status": "success",
    "message": "Incorrect answer. Penalty applied.",
    "is_correct": false,
    "data": {
      "remaining_years": "22.00",
      "current_island": 1
    }
  }
  ```
- **Error (400 Bad Request):** "Question already correctly answered"

### 🟢 6. Use Hint
Spend one of the 3 standard hints.
- **URL:** `POST /api/game/use-hint`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body Validation:**
  - `question_id`: Valid UUID string (Optional technically, but pass it to get the hint text)
- **Success (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Hint activated",
    "hint": "This is the hint text.",
    "hints_left": 2
  }
  ```
- **Error (400 Bad Request):** "No standard hints remaining"
- **Error (404 Not Found):** "No hint available for this question"

### 🟢 7. Use Reward
Trigger an item from the inventory. The backend verifies island validity and applies effects.
- **URL:** `POST /api/game/use-reward`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body Validation:**
  - `reward_type`: Enum string (must be exactly `ATHENAS_SCROLL`, `CYCLOPS_EYE`, `HERMES_SANDALS`, or `THE_BLESSING`)
  - `target_question_id`: Valid UUID string (Optional, required for Scroll/Eye)
- **Success (200 OK - Varies by item):**
  ```json
  {
    "status": "success",
    "hint": "Free hint text (Athena)",
    "eliminated_option": "Wrong option (Cyclops)",
    "message": "Reward applied successfully!"
  }
  ```
- **Error (400 Bad Request):** "Rewards expire! [Reward] is only valid during Island [X], but you are on Island [Y]."

### 🟢 8. Next Island
Progress the team when the current island's requirements are met.
- **URL:** `POST /api/game/next-island`
- **Headers:** `Authorization: Bearer <token>`
- **Success (200 OK - Standard):**
  ```json
  {
    "status": "success",
    "message": "Sailed to Island 2",
    "data": {
      "current_island": 2,
      "is_completed": false
    }
  }
  ```
- **Success (200 OK - Game Completed):**
  ```json
  {
    "status": "success",
    "message": "Congratulations! You have returned to Ithaca.",
    "data": {
      "current_island": 4,
      "is_completed": true
    }
  }
  ```
- **Error (400 Bad Request):** "Journey is already completed"

---

## 10. ADMIN API REFERENCE (For Projector / Dashboard)

The frontend team may also be building the Admin Dashboard or projector leaderboard. These endpoints require **Basic Auth**, NOT a Bearer token. 

*Headers for all Admin Endpoints:* `Authorization: Basic <base64_encoded_credentials>`

### 🔴 1. Get Leaderboard
Fetches the current standings, sorted by lowest remaining years, shortest duration, and most hints left.
- **URL:** `GET /api/admin/leaderboard`
- **Success (200 OK):**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "uuid-here",
        "team_name": "The Argonauts",
        "remaining_years": "14.50",
        "current_island": 4,
        "standard_hints_left": 2,
        "is_completed": true,
        "duration_seconds": 1245.5
      }
    ]
  }
  ```

### 🔴 2. Adjust Team Years Manually
Use this if an admin needs to manually add or subtract time due to a dispute.
- **URL:** `POST /api/admin/adjust-years`
- **Headers:** `Content-Type: application/json`
- **Body:** `{ "team_id": "uuid", "adjustment": -5.0 }`
- **Success (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Score adjusted successfully",
    "data": { "id": "uuid", "team_name": "The Argonauts", "remaining_years": "9.50" }
  }
  ```

### 🔴 3. Fetch All Raw Questions
Use this to populate an admin dashboard table.
- **URL:** `GET /api/admin/questions`
- **Success (200 OK):** JSON Array of all questions in the database, including the answers and hidden traps.

### 🔴 4. Add New Question
Use this to insert a new question on the fly without touching the database.
- **URL:** `POST /api/admin/questions`
- **Headers:** `Content-Type: application/json`
- **Body Validation (Zod):**
  - `island_id`: Number (1-4)
  - `type`: 'PRE_ROUND' | 'MAIN'
  - `format`: 'MCQ' | 'NON_MCQ'
  - `question_text`: String (min 5)
  - `correct_answer`: String (min 1)
  - `reward_years`: Number (min 0)
  - `penalty_years`: Number (min 0)
  - `sequence_number`: Number (min 0)
  - *Optional:* `hint_text`, `options` (Array of Strings), `hidden_wrong_answer`
- **Success (201 Created):** Returns the newly created question object.
