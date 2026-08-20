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
'Trace each step carefully:
1. Urn contains bottom-to-top: [Troy, Storm, Lotus, Ithaca]
2. Remove 2 from top: "Ithaca" and "Lotus" come out. Remaining: [Troy, Storm]
3. Insert "Hope" on top: [Troy, Storm, Hope]
4. Remove 1 from top. What is on top now?', 
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
'Trace the paths from 0 to 5:
Path A: 0 -> 1 -> 3 -> ? (No direct link to 5)
Path B: 0 -> 2 -> 4 -> 5.
Count the arrows/steps in Path B: (0 to 2 is 1 step, 2 to 4 is 2nd step, 4 to 5 is 3rd step).', 
'3', 0, 0, 2, 0);

-- Island 3 Pre-Round: Hermes' Sandals (Signal Calculation with Trap)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'PRE_ROUND', 'NON_MCQ', 
'Story line: The Hypnotic Signal Frequency
The Sirens broadcast a continuous periodic wave with a cycle time period T = 0.25 ms (which is 0.00025 seconds).
Odysseus must tune the ship''s acoustic filter to the frequency f (in kHz), where f = 1 / T(in ms).

What is the exact frequency in kHz? (Type only the number):', 
'Use the formula: Frequency in kHz = 1 / (Time period in ms).
Here T = 0.25 ms.
1 / 0.25 = 1 / (1/4) = 4 kHz.', 
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
'Calculate the sum of days for all possible routes from T to I:
1. T -> D -> I = 2 + 8 = 10 days
2. T -> N -> I = 4 + 5 = 9 days
3. T -> D -> N -> I = 2 + 1 + 5 = ? days. Which route is the smallest?', 
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
'Trace step-by-step from stone 1 (length = 6):
Move 0: Scout A at 1, Scout B at 1
Move 1: Scout A at 2, Scout B at 3
Move 2: Scout A at 3, Scout B at 5
Move 3: Scout A at 4, Scout B at 1 (5+2 on circle)
Move 4: Scout A at 5, Scout B at 3
Move 5: Scout A at 6, Scout B at 5
Move 6: Scout A at 1, Scout B at 1.
So they meet after how many moves?', 
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
'Evaluate lamp by lamp when switch S is pressed:
1. S is pressed -> A is ON.
2. S is pressed -> B is OFF (since B is only ON when S is NOT pressed).
3. C requires both A and B to be ON -> C is OFF.
4. D is ON if exactly ONE of A or C is ON -> Since A is ON and C is OFF, D is ON.
Which two lamps are ON?', 
'A and D', 0.5, 2.0, 1, 2);

-- Base Question 3: Anti-lock Braking System
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'While travelling across Lotus Island, Odysseus encounters a steep and slippery path. A sudden obstacle forces the chariot to brake sharply.
A safety system automatically modulates brake pressure to prevent the wheels from locking up, allowing the driver to maintain steering control.

Identify this 3-letter safety system:', 
'It stands for Anti-lock Braking System (3 uppercase letters).', 
'ABS', 0.5, 2.0, 1, 3);

-- Base Question 4: Factorial Number Sequence
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus finds an ancient mathematical sequence carved into a Lotus tablet:

1,  2,  6,  24,  120,  ?

What is the next number in this sequence?', 
'Look at the multiplication pattern between consecutive terms:
1 * 2 = 2
2 * 3 = 6
6 * 4 = 24
24 * 5 = 120
Now calculate: 120 * 6 = ?', 
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
'1. "petals++" is post-increment: it prints the current value (5), then increases petals to 6.
2. "++petals" is pre-increment: it increases petals from 6 to 7 first, then prints (7).
Format answer with space: 5 7', 
'5 7', 0.0, 2.0, 1, 5),

(1, 'MAIN', 'NON_MCQ', 
'Convert the 4-bit binary signal 1010 into decimal:', 
'Position values from left to right: (1 * 8) + (0 * 4) + (1 * 2) + (0 * 1) = 8 + 2 = ?', 
'10', 0.0, 2.0, 1, 6),

(1, 'MAIN', 'NON_MCQ', 
'Find the missing number in this pattern:
2    5    12   (2 * 5 + 2 = 12)
3    7    ?    (3 * 7 + 3 = ?)
4    9    40   (4 * 9 + 4 = 40)
5   11    60   (5 * 11 + 5 = 60)', 
'Row rule is: (First Column * Second Column) + First Column.
For row 2: (3 * 7) + 3 = 21 + 3 = ?', 
'24', 0.0, 2.0, 1, 7),

(1, 'MAIN', 'NON_MCQ', 
'What integer will be displayed?
int a = 5;
printf("%d", a > 2 && a < 10);', 
'Both (5 > 2) is True and (5 < 10) is True.
True AND True = True.
In C programming, a True boolean condition prints the integer 1.', 
'1', 0.0, 2.0, 1, 8),

(1, 'MAIN', 'NON_MCQ', 
'If A = 1 and B = 1, what is the binary output of an XOR logic gate (A XOR B)?', 
'An XOR (Exclusive OR) gate outputs 1 ONLY when inputs are different. When both inputs are identical (1 and 1), the output is 0.', 
'0', 0.0, 2.0, 1, 9),

(1, 'MAIN', 'NON_MCQ', 
'Solve the pattern to determine the missing number:
2    3    7    (3^2 - 2 = 7)
4    5    21   (5^2 - 4 = 21)
6    7    43   (7^2 - 6 = 43)
8    9    ?    (9^2 - 8 = ?)', 
'Square the second number and subtract the first number:
9 * 9 = 81.
81 - 8 = ?', 
'73', 0.0, 2.0, 1, 10),

(1, 'MAIN', 'NON_MCQ', 
'What type of error is caused by this loop?
int petal = 1;
while(petal <= 5) {
    printf("%d ", petal);
}', 
'Because petal is never incremented inside the loop, (petal <= 5) stays true forever, causing an infinite loop. In programming classification, this is called a logical error.', 
'logical error', 0.0, 2.0, 1, 11),

(1, 'MAIN', 'NON_MCQ', 
'"I store electrical energy in an electrostatic field between two plates. My capacity is measured in Farads."
Who am I?', 
'It is a passive electronic component starting with C (Capacitor).', 
'Capacitor', 0.0, 2.0, 1, 12),

(1, 'MAIN', 'NON_MCQ', 
'What will the console display for this ASCII code?
char petal = ''B'';
printf("%c %d", petal + 2, petal + 2);', 
'The ASCII value of ''B'' is 66.
1. 66 + 2 = 68.
2. The letter for ASCII 68 is ''D''.
3. So %c prints D, and %d prints 68 (Format: D 68).', 
'D 68', 0.0, 2.0, 1, 13),

(1, 'MAIN', 'NON_MCQ', 
'Find the missing coordinate:
3    5    18   (5 * (3 + 1) = 18 ? wait 5 * 4 - 2 = 18)
4    7    32   (7 * (4 + 1) - 3 = 32)
6    9    60   (9 * 7 - 3 = 60)
8   11    ?    (11 * (8 + 1) = 99)', 
'Formula is: b * (a + 1).
For row 4: 11 * (8 + 1) = 11 * 9 = ?', 
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
'Sum up the costs of the active links in the path:
1. R1 to R2 = 10
2. R2 to R3 = 5
3. R3 to R4 = 10
Total Cost = 10 + 5 + 10 = ?', 
'25', 
'15', 1.0, 1.5, 2, 1);

-- Question 2: Boulder Mechanics Projectile Range
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'Polyphemus hurls a boulder at Odysseus''s ship with velocity v = 20 m/s at angle 30° (g = 10 m/s²).
Using the range formula R = (v² * sin(2θ)) / g, where sin(60°) = 0.866:
Calculate the horizontal distance in meters (e.g. 34.6):', 
'Plug values into the formula:
v² = 20 * 20 = 400.
sin(2 * 30°) = sin(60°) = 0.866.
R = (400 * 0.866) / 10 = 40 * 0.866 = 34.64 m.', 
'34.6', 1.0, 1.5, 2, 2);

-- Question 3: Caesar Cipher Broadcast
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'Odysseus broadcasts an encrypted distress name with a Caesar shift of 3:

Q  R  E  R  G  B

Shift each letter 3 positions backwards in the alphabet to reveal his trick alias (e.g. Q -> N):', 
'Alphabet shift helper:
Q - 3 = N
R - 3 = O
E - 3 = B
R - 3 = O
G - 3 = D
B - 3 = Y
Combine all letters together.', 
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
'Step 1: Frequency = 1 / 0.25 ms = 4 kHz.
Step 2: Total cycles in 2 ms = 4 kHz * 2 ms = 8 cycles.
Write your answer in the exact format: 4kHz, 8 cycles', 
'4kHz, 8 cycles', 1.5, 1.0, 3, 1);

-- Question 2: Hardware Breadboard Debugging
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'At the Sirens warning station, the ESP32 circuit is miswired. The LEDs fail to turn on because ground reference is broken.
To which breadboard rail must the GND pin of the ESP32 be connected? (Type negative rail or positive rail):', 
'Ground (GND) is the zero-volt reference line, which always connects to the negative (or blue/black) rail on a breadboard.', 
'negative rail', 1.5, 1.0, 3, 2);

-- Question 3: Binary ASCII Distress Signal
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'The Sirens broadcast the following 8-bit binary stream on repeat:
01000001   01001001   01000100

Convert each binary byte to decimal and decode the 3-letter uppercase ASCII word:
(Reference: 65 = A, 73 = I, 68 = D)', 
'Byte 1: 01000001 = 64 + 1 = 65 (A)
Byte 2: 01001001 = 64 + 8 + 1 = 73 (I)
Byte 3: 01000100 = 64 + 4 = 68 (D)
Combine the 3 letters together.', 
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
'Step 1: Ship B is not 1st or 4th -> B is 2nd or 3rd.
Step 2: Ajax crosses 2 positions after D -> D is 1st and Ajax is 3rd.
Step 3: Theseus crosses before D, so Theseus commands Ship D (1st).
Step 4: Odysseus is immediately before Ship C -> Ship A is 2nd (Odysseus), Ship B is 3rd (Ajax), Ship C is 4th (Perseus).
Ship order is: D-A-B-C', 
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
'1. P3 holds R4, so Terminated Process number = 3 (1st digit).
2. Immediately upon termination, P1 is still waiting for R2, P2 is still waiting for R3, and P4 is still waiting for R1.
3. Total remaining blocked processes = 3 (2nd digit).
Combine the two digits.', 
'33', 2.0, 0.5, 4, 2);

-- Question 3: ADC & Arduino Temperature Calculation
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'The Witch''s chamber temperature sensor operates on 5V with a 10-bit ADC (range 0–1023).
Formula: Voltage = ADC * (5.0 / 1023.0).
If the sensor produces an output voltage of 3.2 V, what integer ADC value is computed by the Arduino? (e.g. 655):', 
'Rearrange the equation for ADC:
ADC = (Voltage * 1023) / 5.0
ADC = (3.2 * 1023) / 5.0 = 3273.6 / 5.0 = 654.72.
Rounded to nearest whole integer = 655.', 
'655', 2.0, 0.5, 4, 3);


