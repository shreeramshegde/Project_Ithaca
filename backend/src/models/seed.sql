-- ============================================================================
-- PROJECT ITHACA: OFFICIAL MYTHOLOGICAL DSA & LOGIC SEED
-- ============================================================================

-- Clean up any existing questions
TRUNCATE TABLE team_progress, team_inventory, questions RESTART IDENTITY CASCADE;

-- ----------------------------------------------------------------------------
-- PRE-ROUND RITUALS (sequence_number = 0)
-- ----------------------------------------------------------------------------

-- Island 1 Pre-Round: Athena's Scroll
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'PRE_ROUND', 'NON_MCQ', 
'The path to Athena''s Scroll is sealed!

As Odysseus approaches Athena''s temple, the Oracle presents a riddle of ancient memory:
"I am a linear data structure of sacred memories. The first memory placed upon my altar is the very last memory Odysseus can retrieve when the lotus trance fades. I follow the law of LIFO."

Name this fundamental Data Structure (single word):', 
'LIFO -> Last In, First Out', 
'Stack', 0, 0, 1, 0);

-- Island 2 Pre-Round: Cyclops' Eye
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'PRE_ROUND', 'NON_MCQ', 
'Story line: The Blinded Giant & Graph Traversal
To navigate the pitch-black caverns of Polyphemus, Odysseus must explore every connected corridor level by level, layer by layer from his current position, ensuring he finds the nearest exit first before exploring deeper into danger.

Which foundational graph/tree traversal algorithm explores vertices layer by layer (level-order)? Name the algorithm or its 3-letter acronym:', 
'Breadth First Search (BFS)', 
'BFS', 0, 0, 2, 0);

-- Island 3 Pre-Round: Hermes' Sandals (Includes Hidden Trap)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'PRE_ROUND', 'NON_MCQ', 
'Story line: The Hypnotic Signal Frequency
The Sirens broadcast a rhythmic electrical pulse with a period T = 250 microseconds (250 μs).
Odysseus must tune the ship''s audio dampener to the exact harmonic frequency in Kilohertz (kHz) to cancel the song.

Calculate the exact frequency in kHz (type only the number, e.g. 4):', 
'Frequency = 1 / Period (1 / 0.000250 s)', 
'4', 
'250', 0, 0, 3, 0);

-- Island 4 Pre-Round: The Blessing (Circe's Trial)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'PRE_ROUND', 'NON_MCQ', 
'As Odysseus enters Circe''s palace, the Sorceress challenges him with an optimization enigma:
"To find the shortest safe sailing route between Troy and all Greek city-states across weighted sea routes with non-negative delays, which legendary greedy graph algorithm must your navigator execute?"', 
'Named after Dutch computer scientist Edsger W. ...', 
'Dijkstra', 0, 0, 3, 0);


-- ----------------------------------------------------------------------------
-- ISLAND 1: LOTUS ISLAND (Reward: -0.5, Penalty: +2.0)
-- ----------------------------------------------------------------------------

-- Base Question 1: The Fast and Slow Pointers (Cycle Detection)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus steps upon an enchanted shoreline where stepping stones form a Singly Linked List.
Suddenly, a stone points back to an earlier stone, creating an infinite circular trap.
Odysseus sends a runner moving 2 steps at a time and a scout moving 1 step at a time. When they meet, the circular loop is proven.

What is the common name of this cycle-detection algorithm? (e.g. Tortoise and Hare / Floyd''s Cycle):', 
'Tortoise and Hare algorithm or Floyd', 
'Floyd', 0.5, 2.0, 1, 1);

-- Base Question 2: The Logic Switch Matrix
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'As Odysseus travels deeper into Lotus Island, he discovers an ancient chamber containing four enchanted lamps marked A, B, C, and D.
An inscription describes how the lamps respond to a switch S:
• A is ON when switch S is pressed.
• B is ON when S is NOT pressed.
• C is ON only when both A and B are ON.
• D is ON when exactly one of A or C is ON.

If switch S is pressed, which lamps will be ON? (Type the lamp letters, e.g. A and D):', 
'C can never turn ON because A and B are mutually exclusive. Check A and D.', 
'A and D', 0.5, 2.0, 1, 2);

-- Base Question 3: Anti-lock Braking System
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'While travelling across Lotus Island, Odysseus encounters a steep and slippery path. A sudden obstacle forces the chariot to brake sharply.
A safety system automatically modulates brake pressure to prevent the wheels from locking up, allowing the driver to maintain steering control.

Identify this 3-letter safety system:', 
'Starts with A and has 3 letters', 
'ABS', 0.5, 2.0, 1, 3);

-- Base Question 4: Factorial Number Sequence
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus finds an ancient mathematical sequence carved into a Lotus tablet:

1,  2,  6,  24,  120,  ?

What is the next number in this sequence?', 
'Each number is multiplied by the next consecutive integer (5! = 120, next is 6!)', 
'720', 0.5, 2.0, 1, 4);

-- ----------------------------------------------------------------------------
-- ISLAND 1: EXTRA PENALTY QUESTIONS (Spawned on wrong answers)
-- ----------------------------------------------------------------------------

INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'After a wrong turn on Lotus Island, Odysseus encounters an inscription where the number of petals changes every time it is evaluated:

int petals = 5;
printf("%d ", petals++);
printf("%d", ++petals);

What exact output is printed? (e.g. 5 7):', 
'Post-increment prints then adds; pre-increment adds then prints.', 
'5 7', 0.0, 2.0, 1, 5),

(1, 'MAIN', 'NON_MCQ', 
'Four symbols appear on a tablet in digital signal form: 1010.
Convert this 4-bit binary value to decimal:', 
'8 + 0 + 2 + 0', 
'10', 0.0, 2.0, 1, 6),

(1, 'MAIN', 'NON_MCQ', 
'Find the missing number in this Lotus pattern:
2    5    12
3    7    ?
4    9    40
5   11    60', 
'Formula: P * Q + R', 
'24', 0.0, 2.0, 1, 7),

(1, 'MAIN', 'NON_MCQ', 
'What integer value will be printed by this C boolean condition?
int a = 5;
printf("%d", a > 2 && a < 10);', 
'In C, true evaluates to 1', 
'1', 0.0, 2.0, 1, 8),

(1, 'MAIN', 'NON_MCQ', 
'If A = 1 and B = 1, what is the output of an XOR logic gate (A XOR B)?', 
'XOR is true only when inputs are different', 
'0', 0.0, 2.0, 1, 9),

(1, 'MAIN', 'NON_MCQ', 
'Solve the pattern to determine the missing number:
2    3    7
4    5    21
6    7    43
8    9    ?', 
'Formula: (b)^2 + a = c (9^2 + 8)', 
'73', 0.0, 2.0, 1, 10),

(1, 'MAIN', 'NON_MCQ', 
'What type of error is caused by this loop?
int petal = 1;
while(petal <= 5) {
    printf("%d ", petal);
}', 
'The loop never increments petal, causing an infinite loop / logical error', 
'logical error', 0.0, 2.0, 1, 11),

(1, 'MAIN', 'NON_MCQ', 
'"I store electrical energy in an electrostatic field, not in chemical form. My capacity is measured in Farads."
Who am I?', 
'Electronic passive component', 
'Capacitor', 0.0, 2.0, 1, 12),

(1, 'MAIN', 'NON_MCQ', 
'What will the console display for this ASCII code?
char petal = ''B'';
printf("%c %d", petal + 2, petal + 2);', 
'ASCII of ''B'' is 66. ''B'' + 2 is ''D'' (68)', 
'D 68', 0.0, 2.0, 1, 13),

(1, 'MAIN', 'NON_MCQ', 
'Find the missing coordinate in this sequence:
3    5    18
4    7    32
6    9    60
8   11    ?', 
'Formula: b * (a + 1)', 
'99', 0.0, 2.0, 1, 14);


-- ----------------------------------------------------------------------------
-- ISLAND 2: CYCLOPS'' ISLAND (Reward: -1.0, Penalty: +1.5)
-- ----------------------------------------------------------------------------

-- Question 1: OSPF Link State Recalculation Riddle
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'A network connects 4 routers:
• R1 <-> R2: 10 Mbps (Cost = 10)
• R1 <-> R3: 100 Mbps (Cost = 1)
• R2 <-> R3: 20 Mbps (Cost = 5)
• R2 <-> R4: 50 Mbps (Cost = 2)
• R3 <-> R4: 10 Mbps (Cost = 10)

During packet transmission from R1 to R4, link R1-R3 fails, and then link R2-R4 fails.
What is the total OSPF metric cost of the final remaining route (R1 -> R2 -> R3 -> R4)? (Type only the number):', 
'Cost = Cost(R1-R2) + Cost(R2-R3) + Cost(R3-R4) = 10 + 5 + 10', 
'25', 
'15', 1.0, 1.5, 2, 1);

-- Question 2: Boulder Mechanics Projectile Range
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'Polyphemus hurls a massive boulder at Odysseus''s ship with velocity v = 20 m/s at angle 30° (g = 10 m/s²).
Using the horizontal projectile range formula R = (v² * sin(2θ)) / g, calculate the approximate range in meters (e.g. 34.6):', 
'R = (400 * sin(60°)) / 10 = 40 * 0.866', 
'34.6', 1.0, 1.5, 2, 2);

-- Question 3: Caesar Cipher Broadcast
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'Odysseus broadcasts an encrypted distress name with a Caesar shift of 3:

Q  R  E  R  G  B

Shift each letter 3 steps backward in the alphabet to reveal his trick alias:', 
'Q - 3 = N, R - 3 = O, E - 3 = B ...', 
'NOBODY', 1.0, 1.5, 2, 3);


-- ----------------------------------------------------------------------------
-- ISLAND 3: SIRENS'' ISLAND (Reward: -1.5, Penalty: +1.0)
-- ----------------------------------------------------------------------------

-- Question 1: Signal Frequency & Cycles
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'A periodic signal from the Sirens has a period T = 250 μs (0.25 ms).
Calculate its frequency in kHz, and how many complete cycles occur during a 2 ms duration.
Format answer as: 4kHz, 8 cycles', 
'Frequency = 1 / 0.25ms = 4kHz. Cycles = 4kHz * 2ms = 8 cycles.', 
'4kHz, 8 cycles', 1.5, 1.0, 3, 1);

-- Question 2: Hardware Breadboard Debugging
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'At the Sirens warning station, the ESP32 circuit is miswired. The LEDs fail to turn on because ground reference is broken.
To which breadboard rail must the GND pin of the ESP32 be connected? (Type negative rail or positive rail):', 
'GND connects to negative / ground rail', 
'negative rail', 1.5, 1.0, 3, 2);

-- Question 3: Binary ASCII Distress Signal
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'The Sirens broadcast the following 8-bit binary stream on repeat:
01000001   01001001   01000100

Convert each binary byte to decimal and decode the 3-letter uppercase ASCII word:', 
'65 = A, 73 = I, 68 = D', 
'AID', 1.5, 1.0, 3, 3);


-- ----------------------------------------------------------------------------
-- ISLAND 4: WITCH''S ISLAND (Reward: -2.0, Penalty: +0.5)
-- ----------------------------------------------------------------------------

-- Question 1: Ship Captains Constraint Logic
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'Odysseus’ Four Ships:
Four ships: A, B, C, D cross checkpoints in positions 1st, 2nd, 3rd, 4th with captains Ajax, Odysseus, Perseus, Theseus.
Clues:
• Odysseus’ ship crosses immediately before Ship C.
• Ship A crosses after Theseus’ ship but before Perseus’ ship.
• Ship B is not 1st or 4th.
• Ajax’s ship crosses exactly two positions after Ship D.
• Ship C is not commanded by Perseus.
• Theseus’ ship crosses before Ship D.
• Ship A is not commanded by Odysseus.

What is the exact order of the ships from 1st to 4th (Format as: D-A-B-C):', 
'Use "two positions after" to fix Ship D (1st) and Ajax (3rd).', 
'D-A-B-C', 2.0, 0.5, 4, 1);

-- Question 2: Operating System Deadlock Escape Code
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'Odysseus'' ship control system has frozen in circular deadlock:
P1 -> R2 -> P2 -> R3 -> P3 -> R4 -> P4 -> R1 -> P1.
Resources: R1 (Sensor), R2 (GPS), R3 (Comms), R4 (Engine Controller).

Captain''s Log Rule:
1. Terminate the process holding R4 first (which is P3).
2. The 1st digit of the escape code is the terminated process number (3).
3. The 2nd digit is the count of processes that remain blocked immediately after termination before released resources are reused.

What is the 2-digit escape code? (e.g. 33):', 
'Terminated process = 3. Remaining blocked processes = 3 (P1, P2, P4).', 
'33', 2.0, 0.5, 4, 2);

-- Question 3: ADC & Arduino Temperature Calculation
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'The Witch''s chamber temperature sensor operates on 5V with a 10-bit ADC (range 0–1023).
Formula: Voltage = ADC * (5.0 / 1023.0).
If the sensor produces an output voltage of 3.2 V, what integer ADC value is computed by the Arduino? (e.g. 655):', 
'ADC = (3.2 * 1023) / 5.0 = 654.72 -> 655', 
'655', 2.0, 0.5, 4, 3);

