-- ============================================================================
-- PROJECT ITHACA: DATABASE SEED SCRIPT (From Questions.md)
-- ============================================================================

TRUNCATE TABLE team_progress, team_inventory, questions RESTART IDENTITY CASCADE;

-- ============================================================================
-- PRE-ROUND REWARD QUESTIONS (sequence_number = 0)
-- ============================================================================

-- -- Island 1 Pre-Round: Athena's Scroll (Stack LIFO Simulation)
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

-- Island 2: Cyclops Island Pre-Round (Reward: Cyclops Eye)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'PRE_ROUND', 'NON_MCQ', 
'Story line: "Nobody" trick
Odysseus names himself "Nobody," so when Polyphemus screams for help, his cry carries no valid identity and other Cyclopes ignore it.

In a communication / electrical system, what happens to an incoming request packet that arrives with a missing or unverified Source ID / authorization signal? (Type what the receiving system does):', 
'Consider standard security verification in communication networks when the sender cannot be identified.', 
'Rejected', 0, 0, 1, 0);

-- Island 3: Sirens Island Pre-Round (Reward: Hermes'' Sandals / Trap: +1.0 year)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'PRE_ROUND', 'NON_MCQ', 
'I''m a two-digit number. My tens digit is three times my units digit, and if you subtract 18 from me, my digits reverse. What number am I?', 
'Subtracting 18 and getting the digits to reverse relates to how far apart the two digits are — swapping digits changes the value by 9 times the difference between the digits.', 
'31', '93', 0, 0, 2, 0);

-- Island 4: Witch''s Island Pre-Round (Reward: The Blessing / 10x10 Snake & Cyclops Grid)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'PRE_ROUND', 'NON_MCQ', 
'Odysseus is trapped inside Cyclops''s island. He must travel from S (Start), in the top-left corner, to the Temple (T), in the bottom-right corner, using the 10×10 grid below. Two long walls of snakes cut across the island — each has only one narrow gap, and the gaps are not aligned with each other.

Movement Rules:
• Odysseus can move Up, Down, Left, or Right only (no diagonals).
• SN — Snake — BLOCKED. This cell cannot be entered.
• SEA — costs 2 moves to enter (instead of 1).
• CY — Cyclops — after entering this cell, Odysseus must move one more step in the same direction before he is allowed to turn.
• T — Temple — the destination.
• Every normal (blank) cell costs 1 move to enter.

Tasks:
1. Find the minimum-cost route from S to T.
2. Write the route using directions (U / D / L / R).
3. Calculate its total cost.', 
'Trace the optimal path avoiding the snake walls while factoring in the double-move penalty of SEA terrain.', 
'31', 0, 0, 3, 0);


-- ============================================================================
-- ISLAND 1: LOTUS ISLAND (Reward: -0.25, Penalty: +1.0)
-- 4 Default Main Trials + 10 Penalty Trials (Logic-First Algorithmic Riddles)
-- ============================================================================

-- Base Question 1: Two Pointers Cycle / Step Count
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
'6', 0.25, 1.0, 1, 1);

-- Base Question 2: The Logic Switch Matrix
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'As Odysseus travels deeper into Lotus Island, he discovers an ancient chamber containing four enchanted lamps marked A, B, C, and D.
An inscription describes how the lamps respond to a switch S:
• A is ON when switch S is pressed.
• B is ON when S is NOT pressed.
• C is ON only when both A and B are ON.
• D is ON when exactly one of A or C is ON.

If switch S is pressed, which lamps will be ON? (e.g. Lamp1 and Lamp2):', 
'Evaluate lamp by lamp when switch S is pressed:
1. S is pressed -> check state of A and B.
2. Check if C turns ON based on A and B.
3. Determine if D turns ON based on A and C.', 
'A and D', 0.25, 1.0, 1, 2);

-- Base Question 3: Anti-lock Braking System
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'While travelling across Lotus Island, Odysseus encounters a steep and slippery path. A sudden obstacle forces the chariot to brake sharply.
A safety system automatically modulates brake pressure to prevent the wheels from locking up, allowing the driver to maintain steering control.

Identify this 3-letter safety system:', 
'It is a 3-letter acronym for an automated vehicle braking safety system.', 
'ABS', 0.25, 1.0, 1, 3);

-- Base Question 4: Factorial Number Sequence
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus finds an ancient mathematical sequence carved into a Lotus tablet:

1,  2,  6,  24,  120,  ?

What is the next number in this sequence?', 
'Look at the multiplication pattern between consecutive terms (factorial series).', 
'720', 0.25, 1.0, 1, 4);

-- ----------------------------------------------------------------------------
-- ISLAND 1: EXTRA PENALTY QUESTIONS (Spawned on wrong answers)
-- ----------------------------------------------------------------------------

INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'What will the inscription display for this C snippet?

int petals = 5;
printf("%d ", petals++);
printf("%d", ++petals);', 
'Distinguish between post-increment (use current value, then increment) and pre-increment (increment first, then use value). Separate the two numbers by a space.', 
'5 7', 0.0, 1.0, 1, 5),

(1, 'MAIN', 'NON_MCQ', 
'Convert the 4-bit binary signal 1010 into decimal:', 
'Calculate the sum of powers of 2 for each binary digit from left to right.', 
'10', 0.0, 1.0, 1, 6),

(1, 'MAIN', 'NON_MCQ', 
'Find the missing number in this pattern:
2    5    12
3    7    ?
4    9    40
5   11    60', 
'Analyze how the numbers in each row relate mathematically across columns.', 
'24', 0.0, 1.0, 1, 7),

(1, 'MAIN', 'NON_MCQ', 
'What integer will be displayed?
int a = 5;
printf("%d", a > 2 && a < 10);', 
'Evaluate the logical AND expression. In C, a true condition outputs an integer representation.', 
'1', 0.0, 1.0, 1, 8),

(1, 'MAIN', 'NON_MCQ', 
'If A = 1 and B = 1, what is the binary output of an XOR logic gate (A XOR B)?', 
'An XOR (Exclusive OR) gate outputs 1 only when inputs differ.', 
'0', 0.0, 1.0, 1, 9),

(1, 'MAIN', 'NON_MCQ', 
'Solve the pattern to determine the missing number:
2    3    7
4    5    21
6    7    43
8    9    ?', 
'Analyze the mathematical operation applied to the first two columns to produce the third column.', 
'73', 0.0, 1.0, 1, 10),

(1, 'MAIN', 'NON_MCQ', 
'What type of error is caused by this loop?
int petal = 1;
while(petal <= 5) {
    printf("%d ", petal);
}', 
'Notice if the loop condition variable ever changes or increments.', 
'logical error', 0.0, 1.0, 1, 11),

(1, 'MAIN', 'NON_MCQ', 
'"I store electrical energy in an electrostatic field between two plates. My capacity is measured in Farads."
Who am I?', 
'It is a passive electronic component starting with C whose capacitance is measured in Farads.', 
'Capacitor', 0.0, 1.0, 1, 12),

(1, 'MAIN', 'NON_MCQ', 
'What will the console display for this ASCII code?
char petal = ''B'';
printf("%c %d", petal + 2, petal + 2);', 
'Find the character corresponding to (ASCII of ''B'' + 2) and its numerical decimal value.', 
'D 68', 0.0, 1.0, 1, 13),

(1, 'MAIN', 'NON_MCQ', 
'Find the missing coordinate in this matrix:
3    5    18
4    7    32
6    9    60
8   11    ?', 
'Look at how the second number relates to the first number in each row.', 
'99', 0.0, 1.0, 1, 14);


-- ============================================================================
-- ISLAND 2: CYCLOPS ISLAND (Reward: -0.5, Penalty: +0.75)
-- From Questions_Island2.md (Polyphemus Counting, Echoing XOR, Sheep Logic Circuit)
-- ============================================================================

-- Main Question 1: Polyphemus Counting Ritual & Reverse Caesar Shift
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'Trapped in the cave, Odysseus overhears Polyphemus muttering a counting ritual before he speaks his final warning. Trace the ritual below to find its number — then use that number to unshift the warning and read what the Cyclops truly said.

total = 0
for i in range(1, 10):
    if i % 3 == 0:
        total += i
    else:
        total -= 1
print(total)

The warning, scrambled, reads: QEOMBQ
Each letter of the warning was shifted forward in the alphabet by the ritual''s number. Shift each letter back by that same amount to reveal the true word. What does Polyphemus really say?', 
'Walk i = 1 to 9. Divisible by 3: add to total; otherwise subtract 1. Total shift = 12. Shift QEOMBQ backward by 12 letters in the alphabet.', 
'ESCAPE', 0.5, 0.75, 2, 1);

-- Main Question 2: The Echoing Cave (Binary XOR Secret)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'The Echoing Cave:
Deep in the cave, every shout comes back changed. Odysseus discovers the echo works by a strange rule: it compares his number to a secret cave-number, digit by digit, in binary — where matching digits become 0 and differing digits become 1 (XOR).

He tests it twice:
• He shouts 5, the echo replies 9.
• He shouts 9, the echo replies 5.

What is the cave''s secret number? And what will the echo reply if Odysseus shouts 15?', 
'Write 5 and 9 in 4-bit binary, find the XOR pattern to deduce the cave''s secret number, then calculate the response for shout 15.', 
'12, 3', 0.5, 0.75, 2, 2);

-- Main Question 3: Hiding, Escape & Logic Circuit Decode
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'Odysseus and his men are trying to escape Polyphemus''s cave by hiding under the sheep.
For each sheep, Polyphemus performs a logical check using three inputs:
• A = Touch feels like a normal sheep''s back
• B = Bleat matches a real sheep
• C = Weight/gait matches a real sheep

His circuit works as follows:
P = A XOR B
Q = NAND(P, C)
Y = Q XOR B (Y = 1 means passes undetected; Y = 0 raises suspicion)

The result carries forward to the next sheep:
A(next) = Y
B(next) = A
C(next) = B

For the first sheep: A = 1, B = 0, C = 1.
Three sheep pass through the cave in sequence.

After determining the output for all three sheep, decode the following message by shifting each letter 3 positions backward in the alphabet:
Q  R  E  R  G  B

What is the decoded hidden message?', 
'Trace Sheep 1 (Y=0), Sheep 2 (Y=0), Sheep 3 (Y=1, passes). Then shift Q R E R G B backward by 3: Q->N, R->O, E->B, R->O, G->D, B->Y.', 
'NOBODY', 0.5, 0.75, 2, 3);


-- ============================================================================
-- ISLAND 3: SIRENS'' ISLAND (Reward: -0.75, Penalty: +0.5)
-- Full 6 Non-MCQ Questions (From Questions_Island3.md)
-- ============================================================================

-- Question 1: Warning Bell Voltage Divider (Electrical Circuits)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'As the ship drifts closer to the island, the crew''s minds begin to blur under the first faint notes of the Sirens'' song, so Odysseus rigs a small warning bell to trip before anyone can be fully entranced. He builds a simple voltage divider off the ship''s 12 V battery, running a 4 kΩ resistor (R1) in series with a 2 kΩ resistor (R2), and taps the bell''s trigger wire across R2.

In one word (a single number, in volts), what voltage appears across R2 — the exact point that will sound the alarm while there''s still time to plug the crew''s ears?', 
'This is a series voltage divider — the voltage across any resistor is the supply voltage multiplied by that resistor''s share of the total resistance: Vout = Vsupply * (R2 / (R1 + R2)).', 
'4V', 0.75, 0.5, 3, 1);

-- Question 2: Music Player Recently Played (Data Structures)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'You are building a music player''s "Recently Played" list (maximum 50 songs). When a new song is played, it should appear at the top, and the oldest song should be removed if the list is full.

Which linear data structure is best suited to efficiently insert at the front and remove from the rear?', 
'Think about which end of the list each operation touches: new songs enter at one end, old songs exit from the opposite end. You need a double-ended structure.', 
'Deque', 0.75, 0.5, 3, 2);

-- Question 3: Harmonics & Beat Frequency (Physics / Acoustics)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'As the ship draws nearer, the Sirens'' voices blend together in the air, each singing at a pitch just slightly off from the others, creating an eerie pulsing throb meant to lull the crew into a trance. Odysseus notices two of the loudest voices ring out at 440 Hz and 446 Hz, and realises that counting the throbs per second in the combined sound could tell his men how close they''re getting without looking toward the island.

What beat frequency (in Hz) — the rate at which the loudness rises and falls — will the crew hear from these two overlapping voices?', 
'Beat frequency depends on how far apart the two frequencies are: |f1 - f2|.', 
'6 Hz', 0.75, 0.5, 3, 3);

-- Question 4: Castaway Rail Sequence (Number Patterns)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'Half-mad with the Sirens'' droning refrain, one sailor notices the throbs Odysseus counted earlier aren''t random — they follow a count scratched into the ship''s rail by a castaway long before them:

3,  6,  11,  18,  27,  ?

Certain that the next number marks exactly how many heartbeats remain before they clear the rocks, the crew must find it fast. What is the missing number in the sequence?', 
'Look at the gaps between consecutive numbers: 6-3=3, 11-6=5, 18-11=7, 27-18=9. What is the next gap?', 
'38', 0.75, 0.5, 3, 4);

-- Question 5: Conical Voice Conch Geometry (Mensuration)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'Washed up on the black rocks lies a conch-like horn the Sirens once used to throw their voices far out over the water. Odysseus measures it: its curved (lateral) surface area is 550 cm² and its slant height is 25 cm. To judge whether the horn is small enough to smash silently underfoot, he needs its radius.

Using π = 22/7, what is the radius (r) of the horn''s conical mouth (in cm)?', 
'Curved surface area of a cone is CSA = π * r * l. Rearrange to find r = CSA / (π * l).', 
'7 cm', 0.75, 0.5, 3, 5);

-- Question 6: Six-Chambered Honeycomb Ring (Figure & Opposite-Square Pattern)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'Carved into the rock above the Sirens'' nest is a strange six-chambered honeycomb, each chamber bearing a number. Legend says a sailor who finds the missing number and speaks it aloud will see through every illusion the Sirens cast for the rest of the voyage. Odysseus sketches the carving exactly as he sees it:

![Six-chambered Honeycomb Rock Carving](/assets/sirens/honeycomb_puzzle.png)

What number belongs in place of the ''?'' opposite 8?', 
'Don''t read the six chambers straight around the ring — check pairs of numbers directly OPPOSITE each other across the centre. Try squaring one number in a pair and compare with the number sitting across from it.', 
'66', 0.75, 0.5, 3, 6);


-- ============================================================================
-- ISLAND 4: WITCH''S ISLAND (Reward: -1.0, Penalty: +0.25)
-- ============================================================================

-- Main Question 1: The Forbidden Decision Tree (8 Ships Classification)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'The Witch has hidden Odysseus'' final escape code inside a Decision Tree. The tree has been broken into rules, and the ships approaching the island must be classified as SAFE or DANGER.

Reconstruct the correct decision tree using the Witch''s rules. Pass each of the eight ships (A through H) through the tree to determine whether each ship reaches SAFE or DANGER. Discard the hidden numbers belonging to DANGER ships. Read the remaining hidden numbers in ship order (A → H) to form the final escape code.

Final Clue: "Only those who find the safe waters may carry the key."', 
'Trace each ship from A to H through the branch rules. Collect the hidden numerical digits only from the ships that reach SAFE.', 
'729586', 1.0, 0.25, 4, 1);

-- Main Question 2: Circe''s Enchanted Domain (Interactive Linux Shell Terminal)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'You have landed on the island of Aeaea, but a terrible spell has been cast! The witch Circe has transformed your crew into swine and locked their true forms inside enchanted archives scattered across her domain.

The god Hermes has granted you a vision of the island''s structure and the divine commands (unzip, tar, unrar) needed to break her magic. Navigate the island in the interactive terminal, unseal the three spell fragments from hidden archives, and speak the final incantation using Hermes''s formula:
[Fragment 1]_[Fragment 2]_[Fragment 3]', 
'Folders look empty? Use ls -a to reveal hidden files that start with a dot (.spell_alpha.zip in Potions_Lab, .spell_beta.tar.gz in Mud_Pits, .spell_gamma.rar in Stag_Clearing). Extract them and concatenate the words with underscores.', 
'MOLY_SWINE_OATH', 1.0, 0.25, 4, 2);
