# 🤖 AI Frontend Handoff Blueprint: Project Ithaca

> **ATTENTION AI AGENT (ANTIGRAVITY / GEMINI 3.1 PRO):** 
> You are reading the ultimate master blueprint for the frontend architecture of "Project Ithaca", a time-travel themed tech treasure hunt. This document contains the exact rules, constraints, API contracts, and edge cases dictated by the backend. **Do not make assumptions. Follow these instructions exactly to build the React frontend.**

---

## 1. Core Architecture & Authentication
- **The Premise:** Teams start with exactly 20.00 "years". Their goal is to navigate 4 islands and reach exactly 0.00 years. Correct answers subtract years; wrong answers add penalty years.
- **No Login System:** Teams register once at the venue via `POST /api/auth/register` (providing `team_name` and `auth_code`). 
- **JWT Storage:** The registration endpoint returns a JWT. You MUST store this JWT in `localStorage`. There is no login screen for returning users. The JWT must be attached as a Bearer token in the `Authorization` header for EVERY subsequent request.
- **HUD Synchronization:** The UI must feature a Heads-Up Display (HUD) showing `remaining_years`, `standard_hints_left` (starts at 3), and active inventory. Almost every game endpoint returns updated team stats. You must sync the React Context/State HUD with this fresh data after every API call.

---

## 2. Dynamic Question Fetching
**ENDPOINT:** `GET /api/game/questions`

You must NEVER hardcode question UUIDs. When a team arrives at an island, fetch this endpoint. The backend intelligently sorts the questions into a perfect array. 

**The Array Structure Guarantee:**
- `array[0]` is **ALWAYS** the `PRE_ROUND` question.
- `array[1...N]` are the `MAIN` questions, sorted safely by sequence.

---

## 3. The Island Flows (CRITICAL UI DIFFERENCES)

### 🔴 Phase A: The Pre-Round (All Islands)
When a team lands on an island, they must FIRST solve `array[0]` (The Pre-Round GK MCQ). 
- Use `POST /api/game/submit-pre-round`.
- **Success:** They earn a specific reward item (e.g., Cyclops Eye) added to their inventory.
- **Failure:** They receive a time penalty. On Island 3, there is a "hidden wrong answer" trap that gives a massive +2 year penalty if triggered. 
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
- **Non-MCQ Handling:** For text-based inputs, the backend automatically handles `.toLowerCase()` and uses a Regex to collapse double-spaces into single spaces. You do not need to over-engineer frontend text sanitization.
- **Result:** If `is_correct: false`, display the penalty message returned by the backend, shake the UI (error animation), and leave the question on screen. If `is_correct: true`, show a success animation and progress the flow.

---

## 5. Hints & Rewards
- **Hints (`POST /api/game/use-hint`):** Teams have 3 standard hints for the *entire* game. Pass the `question_id`. Show a warning modal before consumption ("Are you sure? You only have X hints left!").
- **Rewards (`POST /api/game/use-reward`):** 
  - **Expiration:** Rewards earned on an island are ONLY valid for that specific island. If a team tries to use Athena's Scroll on Island 2, the backend will reject it. 
  - **Types:**
    - `ATHENAS_SCROLL` (Island 1): Gives a free hint without deducting standard hints. Requires `target_question_id`.
    - `CYCLOPS_EYE` (Island 2): Eliminates one wrong MCQ option. Requires `target_question_id`.
    - `HERMES_SANDALS` (Island 3): Instantly deducts 2 years. Does NOT require a target question.
    - `THE_BLESSING` (Island 4): Instantly deducts 3 years. Does NOT require a target question.

---

## 6. Island Progression & Endgame
**ENDPOINT:** `POST /api/game/next-island`

When a team successfully answers all required main questions (and any unlocked penalty questions) for the current island, render a prominent **"Sail to Next Island"** button.
- Clicking this triggers the endpoint, which updates their `current_island` on the backend.
- **Endgame Trigger:** If they click this after completing Island 4, the backend will automatically set `is_completed: true` and freeze their `end_time`. The frontend should redirect them to a glorious "Victory / Journey Completed" screen displaying their final `remaining_years` and total time taken. 

---

## 7. Developer UX/UI Directives for the AI
1. **No Placeholders:** Generate a premium, production-ready UI. Use harmonious color palettes (deep ocean blues, mythical golds).
2. **Animations:** Use micro-animations (Framer Motion or CSS transitions) for revealing questions, showing penalty red-flashes, and reward usage.
3. **Responsive:** Must be flawlessly responsive. Teams may be using mobile phones while running around the venue.
4. **State Management:** Abstract the API calls into custom React hooks (e.g., `useGameData()`) so the UI components remain clean. 
5. **Do not hardcode backend logic:** The backend dictates penalties, rewards, and correctness. The frontend is a beautiful, dumb presenter of the backend's truth.

---

## 8. Database ENUMs Reference
You will encounter these strings in the API payloads. Ensure your frontend logic maps exactly to these strings (they are case-sensitive).

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

## 9. Comprehensive API Reference (Frontend Usage)

### 🟢 `POST /api/auth/register`
Use this to register a team and get the JWT.
- **Body:** `{ "team_name": "String", "auth_code": "String" }`
- **Returns:** `{ "token": "JWT_STRING", "data": { "remaining_years": 20.00, ... } }`

### 🟢 `GET /api/game/state`
Use this on page reload/refresh to populate the HUD and check the team's current island.
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** `{ "data": { "team": { "remaining_years": 20, "current_island": 1, "standard_hints_left": 3, "is_completed": false }, "inventory": [ { "reward_type": "ATHENAS_SCROLL" } ] } }`

### 🟢 `GET /api/game/questions`
Use this when a team arrives at an island to fetch the questions.
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** JSON Array of Question Objects. Answers are hidden. Includes `id`, `type`, `format`, `question_text`, `options` (if MCQ), `reward_years`, `penalty_years`.

### 🟢 `POST /api/game/submit-pre-round`
Use this for `array[0]`.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "question_id": "uuid", "selected_option": "String" }`
- **Returns:** `{ "is_correct": true/false, "reward": "REWARD_TYPE" (if correct), "message": "String" }`

### 🟢 `POST /api/game/submit-answer`
Use this for `array[1...N]`.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "question_id": "uuid", "answer_string": "String" }`
- **Returns:** `{ "is_correct": true/false, "data": { "remaining_years": 19.5, "current_island": 1 }, "message": "String" }`

### 🟢 `POST /api/game/use-hint`
Use this to spend one of the 3 standard hints.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "question_id": "uuid" }`
- **Returns:** `{ "hint": "The hint text", "hints_left": 2 }`

### 🟢 `POST /api/game/use-reward`
Use this to trigger an item from the inventory.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "reward_type": "CYCLOPS_EYE", "target_question_id": "uuid" (optional based on type) }`
- **Returns:** Contains `hint` string (if Athena's Scroll) or `eliminated_option` string (if Cyclops Eye), or simply a success message (if Sandals/Blessing).

### 🟢 `POST /api/game/next-island`
Use this when all requirements for the island are complete.
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** `{ "data": { "current_island": 2, "is_completed": false } }`
