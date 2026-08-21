-- ============================================================================
-- PROJECT ITHACA: DATABASE SEED SCRIPT (From Questions.md)
-- ============================================================================

TRUNCATE TABLE team_progress, team_inventory, questions RESTART IDENTITY CASCADE;

-- ============================================================================
-- PRE-ROUND REWARD QUESTIONS (sequence_number = 0)
-- ============================================================================

-- Island 1: Lotus Island Pre-Round MCQ (Reward: Athena's Scroll)
INSERT INTO questions (island_id, type, format, question_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'PRE_ROUND', 'MCQ', 
'The path to Athena''s Scroll is sealed!

As Odysseus approaches the temple, the Oracle of Athena reveals a vision of the modern world. A mysterious company has become one of the most powerful forces behind the current AI revolution, supplying the computing hardware that powers many of today''s advanced AI systems.

The Oracle gives you four names. Choose the company whose rise has been most closely associated with the AI-chip boom and which currently holds the world''s highest market capitalization.', 
'["AMD", "NVIDIA", "Microsoft", "Apple"]', 'NVIDIA', 0, 0, 1, 0);

-- Island 2: Cyclops Island Pre-Round MCQ (Reward: Cyclops Eye)
INSERT INTO questions (island_id, type, format, question_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'PRE_ROUND', 'MCQ', 
'Odysseus''s men escape unnoticed underneath the sheep because Polyphemus only feels their backs. In civil engineering, a lintel beam above a doorway lets people walk safely underneath it because:

a) There is no load above the lintel.
b) The lintel transfers the wall''s load sideways into the columns/side walls, keeping the doorway space clear.
c) The lintel absorbs the load internally until it eventually collapses.
d) The lintel is structurally disconnected from the wall.', 
'["There is no load above the lintel", "The lintel transfers the wall''s load sideways into the columns/side walls, keeping the doorway space clear", "The lintel absorbs the load internally until it eventually collapses", "The lintel is structurally disconnected from the wall"]', 
'The lintel transfers the wall''s load sideways into the columns/side walls, keeping the doorway space clear', 0, 0, 1, 0);

-- Island 3: Sirens Island Pre-Round MCQ (Reward: Hermes'' Sandals / Trap: +3 years)
INSERT INTO questions (island_id, type, format, question_text, options, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'PRE_ROUND', 'MCQ', 
'I''m a two-digit number. My tens digit is three times my units digit, and if you subtract 18 from me, my digits reverse. What number am I?', 
'["62", "31", "93", "41"]', '31', '93', 0, 0, 2, 0);

-- Island 4: Witch''s Island Pre-Round (Reward: The Blessing / 10x10 Snake & Cyclops Grid)
INSERT INTO questions (island_id, type, format, question_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
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
3. Calculate its total cost.', '31', 0, 0, 3, 0);


-- ============================================================================
-- ISLAND 1: LOTUS ISLAND (Reward: -0.5, Penalty: +2.0)
-- 4 Default Main Trials + 10 Penalty Trials
-- ============================================================================

-- Main Question 1: C Assignment in Condition
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
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
'There is no mistake in the syntax. Notice whether the condition is an assignment (=) or equality check (==).', 'YES', 0.5, 2.0, 1, 1);

-- Main Question 2: Enchanted Logic Lamps
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'MCQ', 
'As Odysseus travels deeper into Lotus Island, he discovers an ancient chamber containing four enchanted lamps marked A, B, C, and D.
An inscription describes how the lamps respond to a switch S:
• A is ON when switch S is pressed.
• B is ON when S is NOT pressed.
• C is ON only when both A and B are ON.
• D is ON when exactly one of A or C is ON.

If switch S is pressed, which lamps will be ON?', 
'C can never turn ON because S cannot be pressed and NOT pressed at the same time.', 
'["A and B", "B and D", "A and D", "C and D"]', 'A and D', 0.5, 2.0, 1, 2);

-- Main Question 3: Pre & Post Increment Inscription
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'After a wrong turn on Lotus Island, Odysseus encounters an inscription where the number of petals changes every time it is used.
What will the inscription display?

int petals = 5;
printf("%d ", petals++);
printf("%d", ++petals);', 
'Post-increment (petals++): use value then increment. Pre-increment (++petals): increment first, then use value.', 
'5 7', 0.5, 2.0, 1, 3);

-- Main Question 4: Number Pattern Matrix
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'Odysseus reaches a fork in the island''s path. A navigation console flashes four number combinations, but the final value in the last row is missing. Solve the pattern to determine the number required by the console:

2    3    7
4    5    21
6    7    43
8    9    ?', 
'Look at the relationship: (second_number)^2 + first_number = third_number. Notice: 3^2 - 2 = 7, 5^2 - 4 = 21, 7^2 - 6 = 43, 9^2 - 8 = 73.', 
'73', 0.5, 2.0, 1, 4);

-- Island 1: Extra Penalty Inscriptions (sequence_number 10 to 19)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 
'While travelling across Lotus Island, Odysseus encounters a steep and slippery path. A sudden obstacle forces the vehicle to brake sharply.
A safety system automatically prevents the wheels from locking up during hard braking, helping the driver maintain steering control.

Identify the system abbreviation (3 letters, starts with A):', 
'3 letter acronym, Anti-lock Braking System.', 'ABS', 0.0, 2.0, 1, 10),

(1, 'MAIN', 'NON_MCQ', 
'A glowing inscription appears on a stone tablet. Four symbols are arranged in the form of a digital signal:
1010
The inscription asks Odysseus to convert the binary signal into the decimal number system. What number should be entered?', 
'Convert binary 1010 to decimal: (1*8) + (0*4) + (1*2) + (0*1).', '10', 0.0, 2.0, 1, 11),

(1, 'MAIN', 'NON_MCQ', 
'A sequence is carved into an ancient Lotus tablet. One of its values has faded away. Find the missing number:
2    5    12
3    7    ?
4    9    40
5   11    60', 
'Notice the pattern: (Row * Col) + Col... For row 1: 2*5 + 2 = 12. For row 3: 4*9 + 4 = 40. For row 4: 5*11 + 5 = 60.', '24', 0.0, 2.0, 1, 12),

(1, 'MAIN', 'NON_MCQ', 
'As Odysseus continues his journey through Lotus Island, a communication device suddenly activates and displays the following code:
int a = 5;
printf("%d", a > 2 && a < 10);
What will be displayed?', 
'In C, a true logical expression evaluates to 1, while false evaluates to 0.', '1', 0.0, 2.0, 1, 13),

(1, 'MAIN', 'NON_MCQ', 
'As Odysseus continues his journey through Lotus Island, he encounters a Lotus logic gate circuit.
If inputs A = 1 and B = 1 are passed into an XOR gate followed by an inversion (XNOR), what is output Y?', 
'XNOR of (1, 1): 1 XOR 1 is 0; inverted gives 1.', '1', 0.0, 2.0, 1, 14),

(1, 'MAIN', 'NON_MCQ', 
'As Odysseus explores Lotus Island, he finds an ancient sequence carved into a stone tablet:
1, 2, 6, 24, 120, ?
Complete the sequence to uncover the next inscription value:', 
'Each number is multiplied by the next consecutive integer (factorial series: 120 * 6).', '720', 0.0, 2.0, 1, 15),

(1, 'MAIN', 'NON_MCQ', 
'Night falls as Odysseus takes a narrow path through Lotus Island. A counter begins running on a small device beside the trail:
int petal = 1;
while(petal <= 5)
{
    printf("%d ", petal);
}
What type of error will happen when this program is executed? (Type error type, e.g. Logical error or Infinite loop):', 
'The loop counter petal is never incremented, causing an infinite loop / logical error.', 'Logical error', 0.0, 2.0, 1, 16),

(1, 'MAIN', 'NON_MCQ', 
'As Odysseus crosses a dark stretch of Lotus Island, a component inside a device releases the electrical energy it had stored in an electric field earlier, allowing the circuit to continue functioning.
"I store energy in an electrostatic field, not chemical form. My SI unit is the Farad. Who am I?"', 
'Electronic passive component whose capacitance is measured in Farads.', 'Capacitor', 0.0, 2.0, 1, 17),

(1, 'MAIN', 'NON_MCQ', 
'Odysseus reaches a clearing where a strange device displays a character shift:
char petal = ''B'';
printf("%c %d", petal + 2, petal + 2);
What will the device display? (e.g. D 68):', 
'ASCII of ''B'' is 66. ''B'' + 2 is ''D'' (character) and 68 (decimal).', 'D 68', 0.0, 2.0, 1, 18),

(1, 'MAIN', 'NON_MCQ', 
'Odysseus reaches a crossroads where a navigation console displays a pattern of numbers:
3    5    18
4    7    32
6    9    60
8   11    ?
Find the missing number:', 
'Formula: (First + 1) * Second... 3*5 + 3 = 18; 4*7 + 4 = 32; 6*9 + 6 = 60; 8*11 + 8 = 96.', '96', 0.0, 2.0, 1, 19);


-- ============================================================================
-- ISLAND 2: CYCLOPS ISLAND (Reward: -1.0, Penalty: +1.5)
-- ============================================================================

-- Main Question 1: OSPF Link-State Routing & Dual Failure Calculation
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'MCQ', 
'A company''s network has 4 routers (R1, R2, R3, R4) connected as follows:
• R1 ↔ R2: 10 Mbps (Cost = 100/10 = 10)
• R1 ↔ R3: 100 Mbps (Cost = 100/100 = 1)
• R2 ↔ R3: 20 Mbps (Cost = 100/20 = 5)
• R2 ↔ R4: 50 Mbps (Cost = 100/50 = 2)
• R3 ↔ R4: 10 Mbps (Cost = 100/10 = 10)

The network uses OSPF where Cost = 100 / Bandwidth (Mbps). A packet travels from R1 to R4.
During transmission:
1. The R1–R3 link fails.
2. OSPF recalculates the shortest path.
3. Before the packet reaches R4, the R2–R4 link also fails.
4. OSPF recalculates again. (Routers cannot be visited more than once).

What route will the packet ultimately take from R1 to R4, and what is the total OSPF cost after the second failure?', 
'Convert each bandwidth into OSPF cost (10, 1, 5, 2, 10). After R1-R3 and R2-R4 fail, trace R1 -> R2 -> R3 -> R4 and sum the remaining link costs.', 
'["R1 -> R2 -> R3 -> R4, cost = 25", "R1 -> R2 -> R3 -> R4, cost = 15", "R1 -> R3 -> R2 -> R4, cost = 16", "No valid route exists"]', 
'R1 -> R2 -> R3 -> R4, cost = 25', 'R1 -> R2 -> R3 -> R4, cost = 15', 1.0, 1.5, 2, 1);

-- Main Question 2: Polyphemus Counting Ritual & Reverse Caesar Shift
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'Trapped in the cave, Odysseus overhears Polyphemus muttering a counting ritual:

total = 0
for i in range(1, 10):
    if i % 3 == 0:
        total += i
    else:
        total -= 1
print(total)

The Cyclops''s scrambled warning reads: QEOMBQ
Each letter was shifted forward in the alphabet by the ritual''s number. Shift each letter back by that same number to reveal what Polyphemus truly warned:', 
'Calculate loop total: for i=1..9, multiples of 3 are 3, 6, 9 (sum = 18). Non-multiples are 6 numbers (-6). Total shift = 18 - 6 = 12. Shift QEOMBQ backward by 12 letters.', 
'ESCAPE', 1.0, 1.5, 2, 2);

-- Main Question 3: The Echoing Cave (Binary XOR Secret)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 
'The Echoing Cave:
Deep in the cave, every shout comes back changed. Odysseus discovers the echo compares his number to a secret cave-number, digit by digit, using binary XOR.
Tests:
• When he shouts 5 (0101), the echo replies 9 (1001).
• When he shouts 9 (1001), the echo replies 5 (0101).

What is the cave''s secret number, and what will the echo reply if Odysseus shouts 15 (1111)? (Format answer as: secret = 12, reply = 3 or simply: 12, 3):', 
'Find secret: 5 XOR 9 = 0101 XOR 1001 = 1100 in binary = 12. Then compute 15 XOR 12 = 1111 XOR 1100 = 0011 = 3.', 
'12, 3', 1.0, 1.5, 2, 3);


-- ============================================================================
-- ISLAND 3: SIRENS'' ISLAND (Reward: -1.5, Penalty: +1.0)
-- ============================================================================

-- Main Question 1: Warning Bell Voltage Divider
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 
'As the ship drifts closer to the island, the Sirens'' song begins to blur the crew''s minds. Odysseus rigs a warning bell using a voltage divider off the ship''s 12 V battery:
A 4 kΩ resistor (R1) is in series with a 2 kΩ resistor (R2).
The bell''s trigger wire is tapped across R2.

In one word (a single number with unit, e.g. 4V), what voltage appears across R2 to sound the alarm?', 
'Formula: Vout = Vsupply * (R2 / (R1 + R2)) = 12 * (2k / (4k + 2k)).', 
'4V', 1.5, 1.0, 3, 1);

-- Main Question 2: Recently Played Music Buffer Data Structure
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'MCQ', 
'You are building a music player''s "Recently Played" playlist buffer (maximum 50 songs).
When a new song is played, it should appear at the top, and the oldest song should be removed from the bottom if the buffer is full.

Which data structure is most optimal for O(1) insertion and deletion at both ends?', 
'A Double-Ended Queue allows fast insertion at the front and eviction from the rear.', 
'["Stack", "Queue", "Deque", "Hash Table + Doubly Linked List"]', 'Deque', 1.5, 1.0, 3, 2);

-- Main Question 3: Sirens Acoustic Beat Frequency
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'MCQ', 
'As the ship draws nearer, two of the Sirens'' loudest voices ring out at 440 Hz and 446 Hz.
Odysseus realises that counting the throbs per second in the combined sound reveals their proximity.

What beat frequency (rate of loudness modulation) will the crew hear from these two overlapping voices?', 
'Beat frequency is simply the absolute difference between the two frequencies: |f1 - f2|.', 
'["3 Hz", "6 Hz", "440 Hz", "446 Hz"]', '6 Hz', 1.5, 1.0, 3, 3);

-- Main Question 4: Castaway Rail Sequence
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'MCQ', 
'One sailor notices a sequence scratched into the ship''s rail by a castaway long before them:
3, 6, 11, 18, 27, ?

Certain that the next number marks how many heartbeats remain before they clear the rocks, what is the missing number in the sequence?', 
'Examine consecutive differences: 6-3=3, 11-6=5, 18-11=7, 27-18=9. Add the next odd integer (11) to 27.', 
'["34", "36", "38", "40"]', '38', 1.5, 1.0, 3, 4);

-- Main Question 5: Conical Voice Conch Geometry
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'MCQ', 
'Washed up on the black rocks lies a conch horn the Sirens used to throw their voices.
Its curved (lateral) surface area is 550 cm² and its slant height (l) is 25 cm.
Using π = 22/7, what is the radius (r) of the horn''s conical mouth?', 
'Curved surface area of cone = π * r * l. Rearrange to find r = CSA / (π * l).', 
'["6 cm", "7 cm", "8 cm", "9 cm"]', '7 cm', 1.5, 1.0, 3, 5);

-- Main Question 6: Six-Chambered Honeycomb Ring
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'MCQ', 
'Carved into the rock is a six-chambered honeycomb bearing numbers in ring order:
6, 8, 10, 38, ?, 102
Opposite pairs follow the rule: opposite = (number)^2 + 2 (since 6^2 + 2 = 38, and 10^2 + 2 = 102).

What number belongs in place of ''?'' opposite 8?', 
'Square the opposite number (8) and add 2: 8^2 + 2 = 64 + 2 = 66.', 
'["68", "56", "66", "75"]', '66', 1.5, 1.0, 3, 6);


-- ============================================================================
-- ISLAND 4: WITCH''S ISLAND (Reward: -2.0, Penalty: +0.5)
-- ============================================================================

-- Main Question 1: The Forbidden Decision Tree (8 Ships Classification)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'The Witch has hidden Odysseus'' final escape code inside a Decision Tree. The tree has been broken into rules, and the ships approaching the island must be classified as SAFE or DANGER.

Reconstruct the correct decision tree using the Witch''s rules. Pass each of the eight ships (A through H) through the tree to determine whether each ship reaches SAFE or DANGER. Discard the hidden numbers belonging to DANGER ships. Read the remaining hidden numbers in ship order (A → H) to form the final escape code.

Final Clue: "Only those who find the safe waters may carry the key."', 
'The tree has only one path that survives every decision: Ships B(7), C(2), D(9), E(5), G(8), H(6) are SAFE. Combine their digits.', 
'729586', 2.0, 0.5, 4, 1);

-- Main Question 2: Circe''s Enchanted Domain (Interactive Linux Shell Terminal)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 
'You have landed on the island of Aeaea, but a terrible spell has been cast! The witch Circe has transformed your crew into swine and locked their true forms inside enchanted archives scattered across her domain.

The god Hermes has granted you a vision of the island''s structure and the divine commands (unzip, tar, unrar) needed to break her magic. Navigate the island in the interactive terminal, unseal the three spell fragments from hidden archives, and speak the final incantation using Hermes''s formula:
[Fragment 1]_[Fragment 2]_[Fragment 3]', 
'Folders look empty? Use ls -a to reveal hidden files that start with a dot (.spell_alpha.zip in Potions_Lab, .spell_beta.tar.gz in Mud_Pits, .spell_gamma.rar in Stag_Clearing). Extract them and concatenate the words with underscores.', 
'MOLY_SWINE_OATH', 2.0, 0.5, 4, 2);
