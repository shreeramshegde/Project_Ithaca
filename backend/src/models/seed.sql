-- ============================================================================
-- PROJECT ITHACA: DATABASE SEED SCRIPT (From Questions.md)
-- ============================================================================

TRUNCATE TABLE team_progress, team_inventory, questions RESTART IDENTITY CASCADE;

-- ============================================================================
-- PRE-ROUND REWARD QUESTIONS (sequence_number = 0)
-- ============================================================================

-- Island 1 Pre-Round: Athena's Scroll (Stack LIFO Simulation)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'PRE_ROUND', 'NON_MCQ', 
'The path to Athena''s Scroll is sealed!

As Odysseus approaches Athena''s temple, the Oracle places 4 memory stones into a vertical urn in this exact order:

1. Troy
2. Storm
3. Lotus
4. Ithaca

The urn follows the Law of the Stack: only the topmost stone can ever be removed at a time. Odysseus removes 2 stones from the top, inserts a new stone labeled "Hope", and then removes 1 more stone.

Which stone did he remove last? (Format: Stone Name):', 
'Track the stack from bottom to top. Identify which stones remain after popping two, what sits on top after pushing "Hope", and what is subsequently popped.', 
'Hope', 0, 0, 1, 0);

-- Island 2: Cyclops Island Pre-Round (Reward: Cyclops Eye)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'PRE_ROUND', 'NON_MCQ', 
'Story line: "Nobody" trick
Odysseus names himself "Nobody," so when Polyphemus screams for help, his cry carries no valid identity and other Cyclopes ignore it.

In a communication / electrical system, what happens to an incoming request packet that arrives with a missing or unverified Source ID / authorization signal? (Format: Single action verb, e.g. Accepted / Rejected / Ignored):', 
'Consider standard security verification in communication networks when the sender cannot be identified.', 
'Rejected', 0, 0, 1, 0);

-- Island 3: Sirens Island Pre-Round (Reward: Hermes'' Sandals / Trap: +1.0 year)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'PRE_ROUND', 'NON_MCQ', 
'I''m a two-digit number. My tens digit is three times my units digit, and if you subtract 18 from me, my digits reverse. What number am I? (Format: Two-digit integer):', 
'Let the number be 10t + u with t = 3u. Set up the equation (10t + u) - 18 = 10u + t and solve for u.', 
'31', '93', 0, 0, 2, 0);

-- Island 4: The Scylla Island Pre-Round (Reward: The Blessing / 10x10 Snake & Cyclops Grid)
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
3. Calculate its total cost (Format: Total integer cost):', 
'Trace the optimal path avoiding the snake walls while factoring in the double-move penalty of SEA terrain.', 
'31', 0, 0, 3, 0);


-- ============================================================================
-- ISLAND 1: LOTUS ISLAND (Reward: -0.25, Penalty: +1.0)
-- 4 Default Main Trials + Extra Penalty Trials (From Questions_Island1.md)
-- ============================================================================

-- Base Question 1: Two Pointers Stepping Stones
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus has just entered Lotus Island.
Odysseus steps upon 6 circular stepping stones labeled 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> (loops back to 1).

Two scouts start at stone 1 simultaneously:
• Scout A takes 1 step at a time (1 -> 2 -> 3...)
• Scout B takes 2 steps at a time (1 -> 3 -> 5...)

After how many total moves will both scouts land on the EXACT SAME stone simultaneously? (Format: Single integer number):', 
'Scout A moves at speed 1 step/move and Scout B at 2 steps/move on a modular cycle of length 6. Find when (1 + k) mod 6 = (1 + 2k) mod 6 for k > 0.', 
'6', 0.25, 1.0, 1, 1);

-- Base Question 2: The Logic Switch Mechanism & Enchanted Lamps
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus enters the chamber revealed beyond the stepping stones.
Inside, he finds four enchanted lamps, marked A, B, C and D, connected to an ancient switch mechanism.

An inscription on the chamber wall explains:
• A is ON when switch S is pressed.
• B is ON when S is NOT pressed.
• C is ON only when both A and B are ON.
• D is ON when exactly one of A or C is ON.

A second inscription suddenly appears:
"The chamber responds only to the one who dares to activate the switch."
Odysseus presses S.
Which lamps will be ON? (Format: List of active lamps separated by ''and'', e.g. A and B):', 
'Evaluate each lamp sequentially with S active: determine the binary state of A and B first, then use those states to resolve C, and finally evaluate the exclusive condition for D.', 
'A and D', 0.25, 1.0, 1, 2);

-- Base Question 3: Damaged Binary Search Mechanism (Interactive Code Editor)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus enters the navigation chamber. The chamber appears to have once controlled the paths through Lotus Island. At its centre is an ancient console containing a corrupted program designed to search for a location inside the island.

Restore the binary search mechanism directly inside the interactive code editor below. Correct the recursive search traversal boundaries and submit the repaired program to open the path.', 
'When the target item is greater than the middle element in binary search, narrow the search range to the right subarray by shifting the lower boundary (mid + 1). Conversely, when searching left, adjust the upper boundary (mid - 1).', 
'return Search(a, mid+1, last, item);', 0.25, 1.0, 1, 3);

-- Base Question 4: Missing Logic Gate
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus reaches the final security gate shown on the navigation console.
The gate is controlled by an ancient logic circuit.
Unfortunately, one gate in the circuit has been destroyed. The remaining connections are still active, but the system cannot determine the final output.

![Logic Circuit Diagram](/assets/lotus/image3.png)

Given Boolean expression:
F1 = A + B D'' + B'' C + B'' D

Identify the missing logic gate (?):', 
'Examine how signal A and the output of the first AND gate (B'' C) must combine at node T3 so that the final output gate can produce all required sum terms.', 
'OR', 0.25, 1.0, 1, 4);

-- ----------------------------------------------------------------------------
-- ISLAND 1: PENALTY QUESTIONS (10 Total Penalty Inscriptions)
-- ----------------------------------------------------------------------------

-- Penalty Question 1: Assignment in if-statement
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'A mysterious voice whispers:
"Decode the truth hidden in the code, and the lotus shall reveal its secret."
Find the output to unlock a special hint for the next challenges:

int lotus = 10;
if (lotus = 5)
    printf("YES");
else
    printf("NO");

(Format: Exact printed output):', 
'In C, the single "=" operator performs assignment rather than comparison. Recall how non-zero integer expression values evaluate in conditional tests.', 
'YES', 0.0, 1.0, 1, 5);

-- Penalty Question 2: Navigation Pattern
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus reaches a fork in the island''s path. A navigation console flashes four number combinations, but the final value in the last row is missing. Solve the pattern to determine the number required by the console:

2    3     7
4    5    21
6    7    43
8    9     ?

(Format: Single integer number):', 
'Analyze the algebraic relationship between the first column (a), second column (b), and third column (c). Notice how powers of the middle term relate to the result.', 
'73', 0.0, 1.0, 1, 6);

-- Penalty Question 3: Corrupted Palindrome Program (Interactive Code Editor)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'The navigation console directs Odysseus to the island''s next checkpoint.
A digital lock blocks his path, displaying a corrupted palindrome verification program.

Correct the three corrupted lines inside the while loop directly in the interactive code editor below, test run the verification, and submit the repaired program to unlock the checkpoint.', 
'Inspect all operations inside the while loop: extract the units digit with modulo (%) 10, accumulate into the reverse sum (rev * 10 + left), and reduce the number using integer division (/ 10).', 
'left = number % 10;', 0.0, 1.0, 1, 7);

-- Penalty Question 4: Chariot Brake Safety System
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'While travelling across Lotus Island, Odysseus encounters a steep and slippery path. A sudden obstacle forces the chariot to brake sharply.

A safety system automatically modulates brake pressure to prevent the wheels from locking up, allowing the driver to maintain steering control.

Identify this 3-letter safety system (Format: 3-letter acronym):', 
'Think of the standard automotive safety acronym designed to prevent wheel lockup during emergency deceleration.', 
'ABS', 0.0, 1.0, 1, 8);

-- Penalty Question 5: Sequence Tablet Pattern
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'A sequence is carved into an ancient Lotus tablet. One of its values has faded away. Find the missing number:

2     5    12
3     7     ?
4     9    40
5    11    60

(Format: Single integer number):', 
'Observe how the product of the first two numbers in each row compares with the third value.', 
'24', 0.0, 1.0, 1, 9);

-- Penalty Question 6: C Relational & Logical Expression
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'As Odysseus continues his journey through Lotus Island, a communication device suddenly activates and displays the following code:

int a = 5;
printf("%d", a > 2 && a < 10);

What will be displayed? (Format: Single integer):', 
'Evaluate both relational comparisons: (5 > 2) and (5 < 10). In C, what integer represents a true logical expression?', 
'1', 0.0, 1.0, 1, 10);

-- Penalty Question 7: XOR-NOT Gate Circuit
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'As Odysseus continues his journey through Lotus Island, he encounters a Lotus gate controlled by the following circuit:

![XOR NOT Circuit](/assets/lotus/image6.png)

If A = 1 and B = 1, what is Y? (Format: Binary 0 or 1):', 
'First find the output of the XOR gate when both inputs are identical (1 and 1), then invert that intermediate result with the NOT gate.', 
'1', 0.0, 1.0, 1, 11);

-- Penalty Question 8: Consecutive Product Sequence
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'As Odysseus explores Lotus Island, he finds an ancient sequence carved into a stone tablet. Each number follows a hidden rule:

1,  2,  6,  24,  120,  ?

Complete the sequence to uncover the next inscription (Format: Single integer number):', 
'Look at the multipliers between consecutive terms: 1*2=2, 2*3=6, 6*4=24, 24*5=120. Apply the next factor in the progression.', 
'720', 0.0, 1.0, 1, 12);

-- Penalty Question 9: Infinite While Loop Analysis
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Night falls as Odysseus takes a narrow path through Lotus Island. A counter begins running on a small device beside the trail. What will happen when the following program is executed?

int petal = 1;
while(petal <= 5) {
    printf("%d ", petal);
}

Predict the exact error classification (Format: Error type):', 
'The program compiles and runs without syntax issues, but the loop never terminates because the condition variable remains unchanged. Classify this type of software bug.', 
'Logical error', 0.0, 1.0, 1, 13);

-- Penalty Question 10: Energy Storage Component Riddle
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'As Odysseus crosses a dark stretch of Lotus Island, a small device beside the path suddenly loses power. A component inside it releases the energy it had stored earlier, allowing the circuit to continue functioning.

"I store energy, but not in a chemical form. I release it when the circuit needs it."
Who am I? (Format: Component name):', 
'Recall passive electrical components that store energy in an electric field rather than chemically, whose standard unit of measure is the Farad.', 
'Capacitor', 0.0, 1.0, 1, 14);


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
Each letter of the warning was shifted forward in the alphabet by the ritual''s number. Shift each letter back by that same amount to reveal the true word. What does Polyphemus really say? (Format: Single English word):', 
'Walk through i = 1 to 9 step-by-step: add numbers divisible by 3 (3, 6, 9) and subtract 1 for all other iterations. Use the resulting total shift to reverse-shift each letter in the alphabet.', 
'ESCAPE', 0.5, 0.75, 2, 1);

-- Main Question 2: The Echoing Cave (Binary XOR Secret)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'The Echoing Cave:
Deep in the cave, every shout comes back changed. Odysseus discovers the echo works by a strange rule: it compares his number to a secret cave-number, digit by digit, in binary — where matching digits become 0 and differing digits become 1 (XOR).

He tests it twice:
• He shouts 5, the echo replies 9.
• He shouts 9, the echo replies 5.

What is the cave''s secret number? And what will the echo reply if Odysseus shouts 15? (Format: [Secret Number], [Reply Number], e.g. 10, 4):', 
'Convert 5 and 9 to 4-bit binary. Since A XOR K = B implies K = A XOR B, compute 5 XOR 9 to find the cave''s key K. Then compute 15 XOR K in decimal.', 
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

After determining the output for all three sheep, decode the encrypted cave inscription:
Q  R  E  R  G  B

What is the decoded hidden message? (Format: Single English word):', 
'Simulate the feedback logic cycle for Sheep 1, Sheep 2, and Sheep 3 to check the pass condition. Use the shift key derived from Polyphemus''s ritual to decrypt the ciphertext word.', 
'NOBODY', 0.5, 0.75, 2, 3);


-- ============================================================================
-- ISLAND 3: SIRENS'' ISLAND (Reward: -0.75, Penalty: +0.5)
-- Full 6 Non-MCQ Questions (From Questions_Island3.md)
-- ============================================================================

-- Question 1: Warning Bell Voltage Divider (Electrical Circuits)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'As the ship drifts closer to the island, the crew''s minds begin to blur under the first faint notes of the Sirens'' song, so Odysseus rigs a small warning bell to trip before anyone can be fully entranced. He builds a simple voltage divider off the ship''s 12 V battery, running a 4 kΩ resistor (R1) in series with a 2 kΩ resistor (R2), and taps the bell''s trigger wire across R2.

In one word (a single number, in volts), what voltage appears across R2 — the exact point that will sound the alarm while there''s still time to plug the crew''s ears? (Format: Number with unit, e.g. 5V):', 
'Use the series voltage divider formula: Vout = Vsupply * (R2 / (R1 + R2)). Substitute the given resistor values and supply voltage.', 
'4V', 0.75, 0.5, 3, 1);

-- Question 2: Music Player Recently Played (Data Structures)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'You are building a music player''s "Recently Played" list (maximum 50 songs). When a new song is played, it should appear at the top, and the oldest song should be removed if the list is full.

Which linear data structure is best suited to efficiently insert at the front and remove from the rear? (Format: Data structure name):', 
'Consider standard linear data structures that provide O(1) time complexity for insertion at the head and deletion from the tail.', 
'Deque', 0.75, 0.5, 3, 2);

-- Question 3: Harmonics & Beat Frequency (Physics / Acoustics)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'As the ship draws nearer, the Sirens'' voices blend together in the air, each singing at a pitch just slightly off from the others, creating an eerie pulsing throb meant to lull the crew into a trance. Odysseus notices two of the loudest voices ring out at 440 Hz and 446 Hz, and realises that counting the throbs per second in the combined sound could tell his men how close they''re getting without looking toward the island.

What beat frequency (in Hz) — the rate at which the loudness rises and falls — will the crew hear from these two overlapping voices? (Format: Value with unit, e.g. 10 Hz):', 
'The beat frequency produced by two interfering acoustic waves equals the absolute difference between their respective frequencies: f_beat = |f1 - f2|.', 
'6 Hz', 0.75, 0.5, 3, 3);

-- Question 4: Castaway Rail Sequence (Number Patterns)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'Half-mad with the Sirens'' droning refrain, one sailor notices the throbs Odysseus counted earlier aren''t random — they follow a count scratched into the ship''s rail by a castaway long before them:

3,  6,  11,  18,  27,  ?

Certain that the next number marks exactly how many heartbeats remain before they clear the rocks, the crew must find it fast. What is the missing number in the sequence? (Format: Single integer number):', 
'Examine the second-order differences by observing how the step gap between successive terms increases in an arithmetic progression of odd numbers.', 
'38', 0.75, 0.5, 3, 4);

-- Question 5: Conical Voice Conch Geometry (Mensuration)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'Washed up on the black rocks lies a conch-like horn the Sirens once used to throw their voices far out over the water. Odysseus measures it: its curved (lateral) surface area is 550 cm² and its slant height is 25 cm. To judge whether the horn is small enough to smash silently underfoot, he needs its radius.

Using π = 22/7, what is the radius (r) of the horn''s conical mouth (in cm)? (Format: Value with unit, e.g. 10 cm):', 
'Apply the conical lateral surface area relation CSA = π * r * l. Rearrange algebraically to isolate the radius r = CSA / (π * l).', 
'7 cm', 0.75, 0.5, 3, 5);

-- Question 6: Six-Chambered Honeycomb Ring (Figure & Opposite-Square Pattern)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'Carved into the rock above the Sirens'' nest is a strange six-chambered honeycomb, each chamber bearing a number. Legend says a sailor who finds the missing number and speaks it aloud will see through every illusion the Sirens cast for the rest of the voyage. Odysseus sketches the carving exactly as he sees it:

![Six-chambered Honeycomb Rock Carving](/assets/sirens/honeycomb_puzzle.png)

What number belongs in place of the ''?'' opposite 8? (Format: Single integer number):', 
'Examine the diametrically opposite chamber pairs across the ring. Compare each smaller number with the value across from it by testing a power relation with a constant offset.', 
'66', 0.75, 0.5, 3, 6);

-- ============================================================================
-- ISLAND 4: THE SCYLLA ISLAND (Reward: -1.0, Penalty: +0.25)
-- ============================================================================

-- Main Question 1: The Forbidden Decision Tree (8 Ships Classification)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'The Witch has hidden Odysseus'' final escape code inside a Decision Tree. The tree has been broken into rules, and the ships approaching the island must be classified as SAFE or DANGER.

Reconstruct the correct decision tree using the Witch''s rules. Pass each of the eight ships (A through H) through the tree to determine whether each ship reaches SAFE or DANGER. Discard the hidden numbers belonging to DANGER ships. Read the remaining hidden numbers in ship order (A → H) to form the final escape code.

Final Clue: "Only those who find the safe waters may carry the key." (Format: 6-digit numeric code):', 
'Rebuild the conditional branching hierarchy from root to leaves. Evaluate each ship''s attributes against the split conditions to isolate only the SAFE vessels.', 
'729586', 1.0, 0.25, 4, 1);

-- Main Question 2: Circe''s Enchanted Domain (Interactive Linux Shell Terminal)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'You have landed on the island of Aeaea, but a terrible spell has been cast! The witch Circe has transformed your crew into swine and locked their true forms inside enchanted archives scattered across her domain.

The god Hermes has granted you a vision of the island''s structure and the divine commands (unzip, tar, unrar) needed to break her magic. Navigate the island in the interactive terminal, unseal the three spell fragments from hidden archives, and speak the final incantation using Hermes''s formula:
[Fragment 1]_[Fragment 2]_[Fragment 3]', 
'Use terminal commands to navigate directories. Check for hidden archives starting with a dot, extract their contents using appropriate archive utilities, and concatenate the discovered words.', 
'MOLY_SWINE_OATH', 1.0, 0.25, 4, 2);
