-- ============================================================================
-- PROJECT ITHACA: OFFICIAL SEED QUESTIONS
-- ============================================================================

-- Clean up any existing questions
TRUNCATE TABLE team_progress, team_inventory, questions RESTART IDENTITY CASCADE;

-- ----------------------------------------------------------------------------
-- PRE-ROUND MCQs (sequence_number = 0)
-- ----------------------------------------------------------------------------

-- Island 1 Pre-Round: Athena's Scroll
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'PRE_ROUND', 'MCQ', 
'The path to Athena''s Scroll is sealed!

As Odysseus approaches the temple, the Oracle of Athena reveals a vision of the modern world. A mysterious company has become one of the most powerful forces behind the current AI revolution, supplying the computing hardware that powers many of today''s advanced AI systems.

The Oracle gives you four names. Choose the company whose rise has been most closely associated with the AI-chip boom and which currently holds the world''s highest market capitalization.', 
NULL, 
'["AMD", "NVIDIA", "Microsoft", "Apple"]', 
'NVIDIA', 0, 0, 1, 0);

-- Island 2 Pre-Round: Cyclops' Eye (Reward item)
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'PRE_ROUND', 'MCQ', 
'Story line: Hiding & Escape
Odysseus''s men escape unnoticed underneath the sheep because Polyphemus only feels their backs. In civil engineering, a lintel beam above a doorway lets people walk safely underneath it because:

A) There is no load above the lintel.
B) The lintel transfers the wall''s load sideways into the columns/side walls, keeping the doorway space clear.
C) The lintel absorbs the load internally until it eventually collapses.
D) The lintel is structurally disconnected from the wall.', 
NULL, 
'["There is no load above the lintel.", "The lintel transfers the wall''s load sideways into the columns/side walls, keeping the doorway space clear.", "The lintel absorbs the load internally until it eventually collapses.", "The lintel is structurally disconnected from the wall."]', 
'The lintel transfers the wall''s load sideways into the columns/side walls, keeping the doorway space clear.', 0, 0, 2, 0);

-- Island 3 Pre-Round: Hermes' Sandals (Includes Hidden Trap: C (+3 years penalty))
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'PRE_ROUND', 'MCQ', 
'Odysseus'' ship enters the deepest waters of Siren''s Island. The Sirens'' song begins interfering with the ship''s electronic navigation system.
The navigation unit contains a 5 V supply, an LED with a forward voltage of 2 V, and a 150 Ω current-limiting resistor connected in series with the LED.
The system is operating normally, and the current through the LED is approximately:', 
NULL, 
'["10 mA", "20 mA", "33 mA", "50 mA"]', 
'20 mA', 
'33 mA', 0, 0, 3, 0);

-- Island 4 Pre-Round: The Blessing (Circe''s Trial / Oracle of Troy)
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'PRE_ROUND', 'MCQ', 
'As Odysseus nears Circe''s realm, the Sorceress challenges him with a trial of logic. Which Greek god gifted Odysseus the magical herb Moly to protect him from enchantments?', 
NULL, 
'["Zeus", "Hermes", "Apollo", "Ares"]', 
'Hermes', 0, 0, 3, 0);


-- ----------------------------------------------------------------------------
-- ISLAND 1: LOTUS ISLAND (Reward: -0.5, Penalty: +2.0)
-- ----------------------------------------------------------------------------

-- Base Question 1 (MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'MCQ', 
'Odysseus has just entered Lotus Island.

The island seems peaceful, but the Lotus flowers have a strange effect: they distort what appears obvious to the traveller.
As Odysseus walks through the island, he discovers an ancient inscription beside a glowing Lotus. The inscription contains a small C program.

Zeus warns him: “Do not trust what the code appears to say. Determine what it actually does.”

What will be the output of the following program?

int lotus = 10;

if (lotus = 5)
    printf("YES");
else
    printf("NO");', 
'There is no mistake in the syntax', 
'["Error", "NO", "YES", "No output"]', 
'YES', 0.5, 2.0, 1, 1);

-- Base Question 2 (MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'MCQ', 
'As Odysseus travels deeper into Lotus Island, he discovers an ancient chamber containing four enchanted lamps marked A, B, C, and D.
An inscription describes how the lamps respond to a switch S:
• A is ON when switch S is pressed.
• B is ON when S is NOT pressed.
• C is ON only when both A and B are ON.
• D is ON when exactly one of A or C is ON.

If switch S is pressed, which lamps will be ON?', 
'C can never turn ON', 
'["A and B", "B and D", "A and D", "C and D"]', 
'A and D', 0.5, 2.0, 1, 2);

-- Base Question 3 (NON_MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'While travelling across Lotus Island, Odysseus encounters a steep and slippery path. A sudden obstacle forces the vehicle to brake sharply.
A safety system automatically prevents the wheels from locking up during hard braking, helping the driver maintain steering control.

Identify the system (Acronym or Full Name):', 
'3 words and starts with A (or 3-letter acronym)', 
'ABS', 0.5, 2.0, 1, 3);

-- Base Question 4 (MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'MCQ', 
'As Odysseus explores Lotus Island, he finds an ancient sequence carved into a stone tablet. Each number follows a hidden rule.

Complete the sequence to uncover the next inscription:

1, 2, 6, 24, 120, ?', 
'Each number is multiplied by the next consecutive integer', 
'["240", "360", "600", "720"]', 
'720', 0.5, 2.0, 1, 4);

-- ----------------------------------------------------------------------------
-- ISLAND 1: EXTRA PENALTY QUESTIONS (Unlocked upon wrong answers)
-- ----------------------------------------------------------------------------

-- Penalty Question 1
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'After a wrong turn on Lotus Island, Odysseus encounters an inscription where the number of petals changes every time it is used.
What will the inscription display?

int petals = 5;
printf("%d ", petals++);
printf("%d", ++petals);', 
'Pre-increment -> First increase, then use', 
'5 7', 0.0, 2.0, 1, 5);

-- Penalty Question 2
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'A glowing inscription appears on a stone tablet. Four symbols are arranged in the form of a digital signal:
1010
The inscription asks Odysseus to convert the signal into the decimal number system.
What number should be entered to continue the journey?', 
'Use 2^n', 
'10', 0.0, 2.0, 1, 6);

-- Penalty Question 3
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'A sequence is carved into an ancient Lotus tablet. One of its values has faded away. Find the missing number:
2    5    12
3    7    ?
4    9    40
5   11    60', 
'Pattern -> P × Q + R', 
'24', 0.0, 2.0, 1, 7);

-- Penalty Question 4
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'As Odysseus continues his journey through Lotus Island, a communication device suddenly activates and displays the following code.
What will be displayed?

int a = 5;
printf("%d", a > 2 && a < 10);', 
'Remember how C represents true and false (1 or 0)', 
'1', 0.0, 2.0, 1, 8);

-- Penalty Question 5
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'As Odysseus continues his journey through Lotus Island, he encounters a Lotus gate controlled by a logic circuit.
If A = 1 and B = 1, and the gate is an XOR function, what is the output Y?', 
'XOR expression -> A''B + AB''', 
'0', 0.0, 2.0, 1, 9);

-- Penalty Question 6
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus reaches a fork in the island''s path. A navigation console flashes four number combinations, but the final value in the last row is missing. Solve the pattern to determine the number required by the console:
2    3    7
4    5    21
6    7    43
8    9    ?', 
'Formula: (b)^2 + a = c', 
'73', 0.0, 2.0, 1, 10);

-- Penalty Question 7
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Night falls as Odysseus takes a narrow path through Lotus Island. A counter begins running on a small device beside the trail. What type of issue will occur when the following program is executed?

int petal = 1;

while(petal <= 5)
{
    printf("%d ", petal);
}', 
'It is an infinite loop issue / logical error', 
'logical error', 0.0, 2.0, 1, 11);

-- Penalty Question 8
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'As Odysseus crosses a dark stretch of Lotus Island, a small device beside the path suddenly loses power. A component inside it releases the energy it had stored earlier, allowing the circuit to continue functioning.

"I store energy in an electric field, not in a chemical form. I release it when the circuit needs it."
Who am I?', 
'Its SI unit is the Farad', 
'Capacitor', 0.0, 2.0, 1, 12);

-- Penalty Question 9
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus reaches a clearing where a strange device displays a single letter. As he interacts with it, the letter is shifted according to its character value.
What will the device display?

char petal = ''B'';
printf("%c %d", petal + 2, petal + 2);', 
'ASCII value of ''B'' is 66', 
'D 68', 0.0, 2.0, 1, 13);

-- Penalty Question 10
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus reaches a crossroads where a navigation console displays a pattern of numbers. Find the missing number:
3    5    18
4    7    32
6    9    60
8   11    ?', 
'Formula: b × (a + 1) = x', 
'99', 0.0, 2.0, 1, 14);


-- ----------------------------------------------------------------------------
-- ISLAND 2: CYCLOPS'' ISLAND (Reward: -1.0, Penalty: +1.5)
-- ----------------------------------------------------------------------------

-- Question 1: OSPF Routing (MCQ with Trap)
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'MCQ', 
'A company''s network has 4 routers (R1, R2, R3, R4) connected as follows:
• R1 ↔ R2: 10 Mbps
• R1 ↔ R3: 100 Mbps
• R2 ↔ R3: 20 Mbps
• R2 ↔ R4: 50 Mbps
• R3 ↔ R4: 10 Mbps

The network uses OSPF, where: OSPF Cost = 100 / Bandwidth (Mbps)
A packet must travel from R1 to R4.

During transmission:
1. The R1–R3 link fails.
2. OSPF recalculates the shortest path.
3. Before the packet reaches R4, the R2–R4 link also fails.
4. OSPF recalculates again.
5. The packet cannot visit the same router more than once.

What route will the packet ultimately take from R1 to R4, and what is the total OSPF cost after the second failure?', 
'Convert each bandwidth into an OSPF cost using Cost = 100 / Bandwidth, then calculate path after failures.', 
'["R1 -> R2 -> R3 -> R4, cost = 25", "R1 -> R2 -> R3 -> R4, cost = 15", "R1 -> R3 -> R2 -> R4, cost = 16", "No valid route exists"]', 
'R1 -> R2 -> R3 -> R4, cost = 25', 
'R1 -> R2 -> R3 -> R4, cost = 15', 1.0, 1.5, 2, 1);

-- Question 2: Boulder Mechanics (MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'MCQ', 
'Story line: Taunting from the ship.
Polyphemus hurls a boulder at Odysseus''s ship as he taunts him from the water.
Given launch velocity = 20 m/s at 30°, and g = 10 m/s², the horizontal range of the boulder is approximately:
(Use R = (v² * sin(2θ)) / g)', 
'sin(60°) ≈ 0.866', 
'["17.3 m", "34.6 m", "40.0 m", "20.0 m"]', 
'34.6 m', 1.0, 1.5, 2, 2);

-- Question 3: Caesar Cipher Message (NON_MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'Task: Decode the message broadcast by Odysseus by shifting each letter backward by 3:

Q R E R G B
(Shift used = 3)', 
'Shift each character 3 steps back in the alphabet (e.g. Q - 3 = N)', 
'NOBODY', 1.0, 1.5, 2, 3);


-- ----------------------------------------------------------------------------
-- ISLAND 3: SIRENS'' ISLAND (Reward: -1.5, Penalty: +1.0)
-- ----------------------------------------------------------------------------

-- Question 1: Signal Frequency & Cycles (NON_MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'As Odysseus sails into the waters surrounding Siren''s Island, the ship''s communication system suddenly begins behaving abnormally.
A signal generator produces a periodic electrical signal. The technician records the time for one complete cycle as 250 μs, but reports its frequency as 250 kHz.
The ship''s engineer asks Odysseus to verify the measurement before the signal is used to control the navigation system.

Determine the actual frequency of the signal (in kHz), and how many complete cycles occur during 2 ms.
Format answer as: 4kHz, 8 cycles', 
'Frequency = 1 / Period. Number of cycles = Frequency × Time', 
'4kHz, 8 cycles', 1.5, 1.0, 3, 1);

-- Question 2: Hardware Breadboard Debugging (NON_MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'As Odysseus enters Siren''s Island, the Sirens'' song disrupts the ship''s warning system. At the control station, he discovers that the physical circuit has been tampered with.
The LED/resistor connections are incorrect, and the ESP32''s GND and 3V3 connections are connected to the wrong breadboard rails.

Which rail should the GND pin of the ESP32 be connected to in order to restore ground reference?', 
'GND of ESP32 should be connected to the negative/GND rail', 
'negative rail', 1.5, 1.0, 3, 2);

-- Question 3: Binary ASCII Distress Signal (NON_MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'Technical Puzzle: The Sirens broadcast the following 8-bit binary stream on repeat:
01000001  01001001  01000100

Decode the 3-letter ASCII word they are broadcasting:', 
'Convert each 8-bit byte into decimal, then find the corresponding ASCII uppercase letter.', 
'AID', 1.5, 1.0, 3, 3);


-- ----------------------------------------------------------------------------
-- ISLAND 4: WITCH''S ISLAND (Reward: -2.0, Penalty: +0.5)
-- ----------------------------------------------------------------------------

-- Question 1: Ship Captain Logic Puzzle (NON_MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'Odysseus’ Four Ships:
Four ships: A, B, C, D must cross four checkpoints in positions 1st, 2nd, 3rd, 4th.
Each ship has a different captain: Ajax, Odysseus, Perseus, Theseus.
Clues:
• Odysseus’ ship crosses immediately before Ship C.
• Ship A crosses after Theseus’ ship but before Perseus’ ship.
• Ship B is not 1st or 4th.
• Ajax’s ship crosses exactly two positions after Ship D.
• Ship C is not commanded by Perseus.
• Theseus’ ship crosses before Ship D.
• Ship A is not commanded by Odysseus.

What is the order of the ships from 1st to 4th (e.g., D-A-B-C)?', 
'Use the "two positions after" clue to place Ship D and Ajax.', 
'D-A-B-C', 2.0, 0.5, 4, 1);

-- Question 2: Deadlock Escape Code (NON_MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'Odysseus’ Frozen Navigation System:
Odysseus'' navigation system has crashed. Four processes are in deadlock:
P1 -> R2 -> P2 -> R3 -> P3 -> R4 -> P4 -> R1 -> P1.
Resources: R1 (Sensor), R2 (GPS), R3 (Comms), R4 (Engine).

Rules:
1. The process holding R4 is terminated first.
2. The first digit of the escape code is the terminated process number.
3. The second digit is the number of processes that remain blocked immediately after termination before resources are reused.

What is the 2-digit escape code?', 
'P3 holds R4. Check how many other processes are still waiting.', 
'33', 2.0, 0.5, 4, 2);

-- Question 3: ADC & Arduino Sensor (NON_MCQ)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'The Witch''s chamber temperature sensor operates on 5V and a 10-bit ADC (values 0–1023).
The temperature formula is: Voltage = ADC * (5.0 / 1023.0), Temperature = Voltage * 100.
If the sensor currently produces an output voltage of 3.2 V, what is the approximate integer ADC value calculated by the Arduino?', 
'ADC = (Voltage * 1023) / 5.0', 
'655', 2.0, 0.5, 4, 3);
