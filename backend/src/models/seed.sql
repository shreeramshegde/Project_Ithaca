-- ============================================================================
-- PROJECT ITHACA: LOGIC-FIRST MYTHOLOGICAL ODYSSEY SEED
-- ============================================================================

-- Clean up any existing questions
TRUNCATE TABLE team_progress, team_inventory, questions RESTART IDENTITY CASCADE;

-- ----------------------------------------------------------------------------
-- PRE-ROUND RITUALS (sequence_number = 0)
-- ----------------------------------------------------------------------------

-- Island 1 Pre-Round: Athena's Scroll (Stack LIFO Simulation)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'PRE_ROUND', 'NON_MCQ', 
'The path to Athena''s Scroll is sealed!

As Odysseus approaches Athena''s temple, the Oracle places 4 memory stones into a vertical urn in this exact order:
1. Troy
2. Storm
3. Lotus
4. Ithaca

The urn follows the Law of the Stack: only the topmost stone can ever be removed at a time.
Odysseus removes 2 stones from the top, inserts a new stone labeled "Hope", and then removes 1 more stone.

Which stone did he remove last? (Type the exact name):', 
'Follow the stack order: The first 2 stones removed from top were Ithaca and Lotus. Think about what stone was placed right on top immediately after, before the final removal.', 
'Hope', 0, 0, 1, 0);

-- Island 2 Pre-Round: Cyclops' Eye (BFS / Layer Step Calculation)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'PRE_ROUND', 'NON_MCQ', 
'Story line: The Blinded Giant & Shortest Corridor Escape
To escape Polyphemus''s cave, Odysseus starts at Chamber 0.
The cave passages connect as follows:
• Chamber 0 leads to: Chamber 1 and Chamber 2 (1 step away)
• Chamber 1 leads to: Chamber 3 (2 steps away)
• Chamber 2 leads to: Chamber 3 and Chamber 4 (2 steps away)
• Chamber 4 leads to: The Exit Chamber (Chamber 5)

If Odysseus moves from chamber to connected chamber, what is the MINIMUM number of passage steps needed to go from Chamber 0 to Chamber 5 (Exit)? (Type only the integer number):', 
'Find the direct branch leading to Chamber 4, then count each step from 0 to 2, 2 to 4, and 4 to 5.', 
'3', 0, 0, 2, 0);

-- Island 3 Pre-Round: Hermes' Sandals (Signal Calculation with Trap)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'PRE_ROUND', 'NON_MCQ', 
'Story line: The Hypnotic Signal Frequency
The Sirens broadcast a continuous periodic wave with a cycle time period T = 0.25 ms (which is 0.00025 seconds).
Odysseus must tune the ship''s acoustic filter to the frequency f (in kHz), where f = 1 / T(in ms).

What is the exact frequency in kHz? (Type only the number):', 
'Calculate 1 divided by 0.25 ms. Remember that 0.25 is equivalent to 1/4.', 
'4', 
'0.25', 0, 0, 3, 0);

-- Island 4 Pre-Round: The Blessing (Shortest Route Weighted Path)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'PRE_ROUND', 'NON_MCQ', 
'Circe''s sea map displays 4 islands: Troy (T), Naxos (N), Delos (D), and Ithaca (I).
The travel delays between islands are:
• T -> N = 4 days
• T -> D = 2 days
• D -> N = 1 day
• N -> I = 5 days
• D -> I = 8 days

Odysseus starts at Troy (T) and must reach Ithaca (I).
What is the MINIMUM total travel days possible across the sea? (Type only the integer number):', 
'Check if going from T -> D -> N -> I is shorter than the direct routes T -> N -> I or T -> D -> I by summing their individual day delays.', 
'8', 0, 0, 3, 0);


-- ----------------------------------------------------------------------------
-- ISLAND 1: LOTUS ISLAND (Reward: -0.5, Penalty: +2.0)
-- ----------------------------------------------------------------------------

-- Base Question 1: Two Pointers Loop Step Count
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus steps upon 6 circular stepping stones labeled 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> (loops back to 1).
Two scouts start at stone 1 simultaneously:
• Scout A takes 1 step at a time (1 -> 2 -> 3...)
• Scout B takes 2 steps at a time (1 -> 3 -> 5...)

After how many total moves will both scouts land on the EXACT SAME stone simultaneously? (Type only the integer number):', 
'Track the position of Scout A (moving +1 mod 6) and Scout B (moving +2 mod 6) until their positions match.', 
'6', 0.5, 2.0, 1, 1);

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
'When S is pressed, A is active and B is inactive. Use that to check whether C can turn on, and finally check the condition for D.', 
'A and D', 0.5, 2.0, 1, 2);

-- Base Question 3: Anti-lock Braking System
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'While travelling across Lotus Island, Odysseus encounters a steep and slippery path. A sudden obstacle forces the chariot to brake sharply.
A safety system automatically modulates brake pressure to prevent the wheels from locking up, allowing the driver to maintain steering control.

Identify this 3-letter safety system:', 
'A 3-letter acronym for the automotive braking system that prevents wheel lockup during emergency stops.', 
'ABS', 0.5, 2.0, 1, 3);

-- Base Question 4: Factorial Number Sequence
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus finds an ancient mathematical sequence carved into a Lotus tablet:

1,  2,  6,  24,  120,  ?

What is the next number in this sequence?', 
'Each term multiplies by an increasing integer: x2, x3, x4, x5... Multiply 120 by the next multiplier in the sequence.', 
'720', 0.5, 2.0, 1, 4);

-- ----------------------------------------------------------------------------
-- ISLAND 1: EXTRA PENALTY QUESTIONS (Spawned on wrong answers)
-- ----------------------------------------------------------------------------

INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'What will the inscription display for this C snippet?

int petals = 5;
printf("%d ", petals++);
printf("%d", ++petals);', 
'Recall the difference between post-increment (use original value, then add 1) and pre-increment (add 1 first, then use value).', 
'5 7', 0.0, 2.0, 1, 5),

(1, 'MAIN', 'NON_MCQ', 
'Convert the 4-bit binary signal 1010 into decimal:', 
'Binary place values for 4 bits from left to right are 8, 4, 2, 1. Add the active bit weights together.', 
'10', 0.0, 2.0, 1, 6),

(1, 'MAIN', 'NON_MCQ', 
'Find the missing number in this pattern:
2    5    12
3    7    ?
4    9    40
5   11    60', 
'Notice that each row combines column 1 and column 2: multiply them and add column 1.', 
'24', 0.0, 2.0, 1, 7),

(1, 'MAIN', 'NON_MCQ', 
'What integer will be displayed?
int a = 5;
printf("%d", a > 2 && a < 10);', 
'Evaluate whether 5 is greater than 2 and less than 10, and recall how C represents a true boolean as an integer.', 
'1', 0.0, 2.0, 1, 8),

(1, 'MAIN', 'NON_MCQ', 
'If A = 1 and B = 1, what is the binary output of an XOR logic gate (A XOR B)?', 
'XOR produces 1 only when the two inputs are strictly different.', 
'0', 0.0, 2.0, 1, 9),

(1, 'MAIN', 'NON_MCQ', 
'Solve the pattern to determine the missing number:
2    3    7
4    5    21
6    7    43
8    9    ?', 
'Square the second number in the pair and subtract the first number.', 
'73', 0.0, 2.0, 1, 10),

(1, 'MAIN', 'NON_MCQ', 
'What type of error is caused by this loop?
int petal = 1;
while(petal <= 5) {
    printf("%d ", petal);
}', 
'Consider whether the loop condition can ever become false if the variable never increments.', 
'logical error', 0.0, 2.0, 1, 11),

(1, 'MAIN', 'NON_MCQ', 
'"I store electrical energy in an electrostatic field between two plates. My capacity is measured in Farads."
Who am I?', 
'The passive electronic component that stores charge in electric fields, commonly paired with resistors in timing circuits.', 
'Capacitor', 0.0, 2.0, 1, 12),

(1, 'MAIN', 'NON_MCQ', 
'What will the console display for this ASCII code?
char petal = ''B'';
printf("%c %d", petal + 2, petal + 2);', 
'Find the character 2 positions after ''B'' in the alphabet, and its corresponding ASCII decimal value (ASCII ''B'' is 66).', 
'D 68', 0.0, 2.0, 1, 13),

(1, 'MAIN', 'NON_MCQ', 
'Find the missing coordinate:
3    5    18
4    7    32
6    9    60
8   11    ?', 
'Multiply the second column by (first column + 1).', 
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
What is the total OSPF metric cost of the final remaining route (R1 -> R2 -> R3 -> R4)? (Type only the integer number):', 
'Trace the remaining route hop-by-hop: find the cost of R1-R2, add the cost of R2-R3, and add the cost of R3-R4.', 
'25', 
'15', 1.0, 1.5, 2, 1);

-- Question 2: Linux Shell Archive Extraction Challenge
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'Polyphemus''s ancient security terminal has locked the inner gate.
Odysseus must use the interactive terminal above to locate the archives directory, extract the secret zip archive (cyclops_escape.zip), and read the clearance text file within.

What is the secret clearance password inside the extracted file? (Paste or type the exact password):', 
'Use Linux commands in the terminal above:
1. Type "ls" or "cd archives" to inspect the directories.
2. Type "unzip cyclops_escape.zip" to extract the archive.
3. Type "cat clearance_password.txt" to view the password.', 
'NOBODY-CYCLOPS-42', 1.0, 1.5, 2, 2);

-- Question 3: Caesar Cipher Broadcast
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'Odysseus broadcasts an encrypted distress name with a Caesar shift of 3:

Q  R  E  R  G  B

Shift each letter 3 positions backwards in the alphabet to reveal his trick alias (e.g. Q -> N):', 
'Shift each letter 3 steps earlier in the alphabet (e.g., Q minus 3 positions is N, R minus 3 is O).', 
'NOBODY', 1.0, 1.5, 2, 3);


-- ----------------------------------------------------------------------------
-- ISLAND 3: SIRENS'' ISLAND (Reward: -1.5, Penalty: +1.0)
-- ----------------------------------------------------------------------------

-- Question 1: Signal Frequency & Cycles
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'A periodic wave from the Sirens has a period T = 250 μs (0.25 ms).
Calculate its frequency in kHz (Frequency = 1 / Period), and determine how many complete cycles occur in 2 ms (Cycles = Frequency * Time).
Format answer as: 4kHz, 8 cycles', 
'First find frequency in kHz by taking 1 / 0.25 ms. Then multiply that frequency by 2 ms to get the total cycle count.', 
'4kHz, 8 cycles', 1.5, 1.0, 3, 1);

-- Question 2: Hardware Breadboard Debugging
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'At the Sirens warning station, the ESP32 circuit is miswired. The LEDs fail to turn on because ground reference is broken.
To which breadboard rail must the GND pin of the ESP32 be connected? (Type negative rail or positive rail):', 
'GND (ground) corresponds to the 0V reference potential, typically marked by blue/black rails on standard breadboards.', 
'negative rail', 1.5, 1.0, 3, 2);

-- Question 3: Binary ASCII Distress Signal
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'The Sirens broadcast the following 8-bit binary stream on repeat:
01000001   01001001   01000100

Convert each binary byte to decimal and decode the 3-letter uppercase ASCII word:
(Reference: 65 = A, 73 = I, 68 = D)', 
'Convert each 8-bit binary number into decimal (add weights for 64, 8, 4, 1), and look up the uppercase letter for each value.', 
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
'Start with Ship B (must be 2nd or 3rd) and place Ship D with Ajax 2 spots behind. Then assign captains to each position.', 
'D-A-B-C', 2.0, 0.5, 4, 1);

-- Question 2: Operating System Deadlock Escape Code
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'Odysseus'' ship control system has frozen in circular deadlock:
P1 -> R2 -> P2 -> R3 -> P3 -> R4 -> P4 -> R1 -> P1.
Resources: R1 (Sensor), R2 (GPS), R3 (Comms), R4 (Engine Controller).

Captain''s Log Rule:
1. Terminate the process holding R4 first (which is P3).
2. The 1st digit of the escape code is the terminated process number.
3. The 2nd digit is the count of processes that remain blocked immediately after termination before released resources are reused.

What is the 2-digit escape code? (e.g. 33):', 
'Identify which process is holding R4 for the 1st digit. Then count how many other processes in the chain are still waiting on held resources.', 
'33', 2.0, 0.5, 4, 2);

-- Question 3: ADC & Arduino Temperature Calculation
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'The Witch''s chamber temperature sensor operates on 5V with a 10-bit ADC (range 0–1023).
Formula: Voltage = ADC * (5.0 / 1023.0).
If the sensor produces an output voltage of 3.2 V, what integer ADC value is computed by the Arduino? (e.g. 655):', 
'Rearrange the equation: ADC = (Voltage * 1023) / 5.0. Compute this using 3.2 V and round to the nearest whole integer.', 
'655', 2.0, 0.5, 4, 3);


