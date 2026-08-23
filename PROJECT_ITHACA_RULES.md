# 🏛️ PROJECT ITHACA: OFFICIAL EVENT RULES & ISLAND GUIDE

---

## 🧭 1. CORE TOURNAMENT MECHANICS

* **Starting Condition:** Every crew begins the journey with **`10.0 Remaining Voyage Years`**.
* **Objective:** Return home to Ithaca with the **lowest remaining years** (shortest odyssey).
* **Question Format:** **100% Non-MCQ / Subjective Input**. All questions require numerical, algorithmic, or exact keyword answers.
* **Synonym & Format Normalization:** The backend server normalizes case, whitespace, units (e.g. `4V`, `4 volts`, `4`), and common synonyms automatically.
* **Oracle Hints:** Each team receives **3 standard hints** for the entire tournament. Hints are sealed during Pre-Round rituals and can only be invoked on Main Trials.
* **Progression:**
  * **Island 1:** Non-sequential (crews can solve base trials in any order).
  * **Islands 2, 3, and 4:** Strict sequential progression (must solve previous trials to unlock the next).

---

## 🌺 2. ISLAND 1: LOTUS ISLAND
> *"A deceptive shoreline where choices feel easy, but wrong paths spawn endless extra trials."*

* **Structure:** **1 Pre-Round Ritual + 4 Base Trials + 10 Penalty Inscriptions**.
* **Scoring Rules:**
  * **Correct Answer:** **`-0.25 years`** deducted from voyage.
  * **Incorrect Answer:** **`+1.0 year`** added to voyage + **1 extra penalty question spawns**.
* **Pre-Round Artifact:** 📜 **Athena's Scroll**
  * **Challenge:** Memory stone urn stack simulation (Answer: `Hope`).
  * **Artifact Power:** Can be invoked on any main trial to reveal Athena's divine clue **without consuming one of your 3 standard Oracle hints**.

---

## 👁️ 3. ISLAND 2: CYCLOPS' ISLAND
> *"Polyphemus' torchlit caverns where brute force fails and logic prevails."*

* **Structure:** **1 Pre-Round Ritual + 3 Sequential Main Trials**.
* **Scoring Rules:**
  * **Correct Answer:** **`-0.5 years`** deducted from voyage.
  * **Standard Incorrect Penalty:** **`+0.75 years`** added to voyage.
* **Pre-Round Artifact:** 👁 **Cyclops' Eye**
  * **Challenge:** Communication system with unverified source ID (Answer: `Rejected`).
  * **Artifact Power (Continuous Protection):** Once earned, the Cyclops' Eye grants passive protection across **every single question on Island 2**. It **halves the incorrect answer penalty from `+0.75y` → `+0.375 years`** per wrong answer. Correct answer deductions remain full `-0.5 years`.
* **Main Trials:**
  1. **Trial 1:** Polyphemus Counting Ritual & Reverse Caesar Shift (Answer: `ESCAPE`).
  2. **Trial 2:** The Echoing Cave XOR Secret (Answer: `12, 3`).
  3. **Trial 3:** Sheep Logic Circuit & Shift Decode (Answer: `NOBODY`).

---

## 🌊 4. ISLAND 3: SIRENS' ISLAND
> *"Enchanting voices across dark water where mathematical precision cuts through illusion."*

* **Structure:** **1 Pre-Round Ritual + 6 Sequential Harmonic Trials**.
* **Scoring Rules:**
  * **Correct Answer:** **`-0.75 years`** deducted from voyage.
  * **Incorrect Answer:** **`+0.5 years`** added to voyage.
  * **Hidden Trap Penalty:** Selecting the trap answer `93` on the Pre-Round triggers an additional `+1.0 year` penalty.
* **Pre-Round Artifact:** 🪽 **Hermes' Sandals**
  * **Challenge:** Two-digit reversal subtraction riddle (Answer: `31`).
  * **Artifact Power:** Fleet-footed talisman that bypasses time warps, instantly deducting **`-1.0 year`** from the voyage when invoked.
* **The 6 Main Trials:**
  1. **Trial 1 (Voltage Divider):** 12V series circuit across 4kΩ and 2kΩ (Answer: `4V`).
  2. **Trial 2 (Data Structures):** 50-song Recently Played list (Answer: `Deque`).
  3. **Trial 3 (Acoustics):** Beat frequency of 440 Hz & 446 Hz (Answer: `6 Hz`).
  4. **Trial 4 (Number Series):** 3, 6, 11, 18, 27, ? odd difference series (Answer: `38`).
  5. **Trial 5 (Conical Geometry):** Cone radius with CSA = 550 cm², slant height = 25 cm (Answer: `7 cm`).
  6. **Trial 6 (Rock Carving Diagram):** Six-chamber honeycomb puzzle diagram opposite 8 ($8^2 + 2$) (Answer: `66`).

---

## ⚡ 5. ISLAND 4: THE SCYLLA ISLAND
> *"Crashing reefs, six-headed terrors, and Circe's transmuting archives before Ithaca is reached."*

* **Structure:** **1 Pre-Round Grid + 2 Interactive Main Stages + 6x6 Transmutation Ward**.
* **Scoring Rules:**
  * **Correct Answer:** **`-1.0 year`** deducted from voyage.
  * **Incorrect Answer:** **`+0.25 years`** added to voyage + **Sit-Out Penalty** (one crew member must physically sit out the stage).
* **Pre-Round Artifact:** ✨ **The Blessing**
  * **Challenge:** 10×10 Snake & Cyclops Grid pathfinding (Answer: `31`).
  * **Artifact Power:** Divine grace that shields the crew and instantly deducts **`-1.5 years`** from the voyage when invoked.
* **Stage Flow:**
  1. **Stage 1 (Decision Tree):** Reconstruct the Witch's Decision Tree to classify 8 ships (A → H) and synthesize the 6-digit safe escape code (`729586`).
  2. **Interlude (Transmutation Ward):** Solve the interactive 6×6 Runic Sudoku to brew the counter-potion and free transformed crew members.
  3. **Stage 2 (Circe's Terminal):** Authenticated Linux terminal to search hidden dot-files (`.spell_alpha.zip`, etc.) and decompress archives (`unzip`, `tar`, `unrar`) to synthesize the master incantation (`MOLY_SWINE_OATH`).

---

## 🏆 6. WINNER & LEADERBOARD DETERMINATION

* **Destination:** **Ithaca** (Reached after completing Island 4).
* **Ranking Hierarchy:**
  1. **Primary Metric (Lowest `remaining_years`):** Team with the lowest remaining years ranks highest.
  2. **Completion Priority (`is_completed = true`):** Teams reaching Ithaca rank above teams stranded on earlier islands.
  3. **Tie-Breaker 1 (Shortest Real-World Duration):** If years are tied, the team with the shortest elapsed time (`end_time - start_time`) ranks higher.
  4. **Tie-Breaker 2 (Most Hints Remaining):** If still tied, the team with the most unused Oracle hints (`standard_hints_left DESC`) wins.
