# Frontend PRD - Project Ithaca

## 1. Overview
The frontend for Project Ithaca is built with **React.js**. It delivers an immersive, mythology-themed web interface for participating teams, handling live journey-time updates, question navigation, and the dynamic rules unique to each of the 4 islands.

## 2. Design & Thematic Guidelines
- **Theme**: Greek Mythology / Odyssey inspired. Dark, cinematic aesthetic.
- **Visuals**: Deep ocean blues, stone/marble textures, gold accents.
- **Typography**: Legible, modern sans-serif for reading code/questions, and a stylized display font for headings (e.g., "Lotus Island", "Return to Ithaca").
- **Animations**: Micro-animations for submitting answers, countdown/deduction of "years", and subtle transitions between islands to give a sense of travel.
- **Target Device**: Optimized primarily for laptops (as required by offline event constraints), though fluidly responsive.

## 3. Core Pages & Views

### 3.1 Login / Registration Desk
- Simple, high-contrast screen.
- Field to enter the unique Team Code.
- On successful login, the team's initial state (20 Years) is initialized and they enter the pre-game lobby.

### 3.2 Main Navigation & HUD (Heads-Up Display)
Present continuously at the top or side of the screen during gameplay.
- **Global Timer / Years Counter**: Prominent display of "XX Years Remaining". Animates green when years are deducted, red when years are added.
- **Hints Tracker**: Shows "Standard Hints: X/3".
- **Inventory/Rewards**: Icons showing currently held rewards (Athena's Scroll, Cyclops Eye, etc.) which can be clicked to activate.

### 3.3 The Island Journey (Dynamic Router)
The UI adapts based on the current island the team is on:

#### Pre-Round Overlay
- Before entering the main island, an overlay or modal appears with the GK MCQ.
- Submitting the answer triggers an animation awarding the specific item (or revealing the hidden penalty for Island 3).

#### Island 1: Lotus Island
- **Layout**: Grid of 4 question cards.
- **Interaction**: Non-sequential. Teams click a card to open the question.
- **Mechanic Display**: If an answer is wrong, a visual penalty is shown (+2 years) and the question becomes locked/progresses.

#### Island 2: Cyclop's Island
- **Layout**: Vertical timeline or sequential list.
- **Interaction**: Sequential. Question 2 is visually padlocked until Question 1 is answered correctly.
- **Item Usage**: If the team uses the "Cyclops Eye", an animation visually shatters/removes one incorrect MCQ option.

#### Island 3: Sirens Island
- **Layout**: 3 distinct, non-sequential question portals.
- **Interaction**: Non-MCQ text input fields. 

#### Island 4: Witch's Island
- **Layout**: Darker, higher-stakes visual theme.
- **Witch Mechanic UI**: If an answer is wrong, a modal appears alerting the team that a member must sit out the next question. Since the event is supervised, this is handled physically by the volunteers rather than digitally tracked.

### 3.4 Live Leaderboard
- Used primarily by organizers on a projector, but accessible via a specific route (e.g., `/leaderboard`).
- **Data Display**: Ranks teams by Lowest Journey Duration.
- **Tie-Breaker Visuals**: If two teams have the same years, display the time taken or hints used to justify the ranking.
- **Auto-Refresh**: Polls the backend every 10 seconds or listens via WebSockets/Supabase real-time subscriptions.

### 3.5 Admin Control Panel
- Route: `/admin` (Password protected).
- Allows organizers to view live status of all 10 teams.
- "Adjust Score" button to manually add/deduct years in case of disputes.
- "Start Event" toggle to unlock Island 1 for all teams simultaneously.

## 4. State Management
- Utilize React Context API or Redux (if complex enough) to hold the current team state (years, items, current island).
- Ensure that refreshing the page does not lose the team's local progress (sync state with the backend on mount).
- Handle backend errors gracefully (e.g., if the user tries to submit an answer twice rapidly, disable the submit button and show a loading spinner).
