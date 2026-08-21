-- Pre-Round MCQs (sequence_number = 0)
INSERT INTO questions (island_id, type, format, question_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'PRE_ROUND', 'MCQ', 'What is the capital of Greece?', '["Athens", "Sparta", "Troy", "Thebes"]', 'Athens', 0, 0, 1, 0),
(2, 'PRE_ROUND', 'MCQ', 'Who wrote the Odyssey?', '["Homer", "Socrates", "Plato", "Aristotle"]', 'Homer', 0, 0, 1, 0);

-- Island 3 Pre-Round MCQ has a hidden trap!
INSERT INTO questions (island_id, type, format, question_text, options, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'PRE_ROUND', 'MCQ', 'Which sea surrounds Greece?', '["Mediterranean", "Red Sea", "Black Sea", "Caspian Sea"]', 'Mediterranean', 'Red Sea', 0, 0, 2, 0);

-- Island 4 Pre-Round
INSERT INTO questions (island_id, type, format, question_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'PRE_ROUND', 'NON_MCQ', 'Odysseus is trapped inside Cyclops''s island. He must travel from S (Start), in the top-left corner, to the Temple (T), in the bottom-right corner, using the 10×10 grid below. Two long walls of snakes cut across the island — each has only one narrow gap, and the gaps are not aligned with each other.

Movement rules:
• Odysseus can move Up, Down, Left, or Right only (no diagonals).
• SN — Snake — BLOCKED. This cell cannot be entered.
• SEA — costs 2 moves to enter instead of 1.
• CY — Cyclops — after entering this cell, Odysseus must move one more step in the same direction before he is allowed to turn.
• T — Temple — the destination.
• Every normal (blank) cell costs 1 move to enter.

Tasks:
1. Find the minimum-cost route from S to T.
2. Write the route using directions (U / D / L / R).
3. Calculate its total cost.', '31', 0, 0, 3, 0);

-- Island 1: Lotus Island (Reward: -0.5, Penalty: +2.0)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'NON_MCQ', 'What is 2 + 2?', 'It is an even number', '4', 0.5, 2.0, 1, 1),
(1, 'MAIN', 'NON_MCQ', 'What is the color of the sky?', 'Look up during the day', 'blue', 0.5, 2.0, 1, 2);

INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'MCQ', 'Which planet is known as the Red Planet?', 'It is named after the Roman god of war', '["Earth", "Mars", "Jupiter", "Venus"]', 'Mars', 0.5, 2.0, 1, 3),
(1, 'MAIN', 'MCQ', 'What is the boiling point of water in Celsius?', 'It is a multiple of 10', '["50", "90", "100", "120"]', '100', 0.5, 2.0, 1, 4);

-- Island 1: Extra Penalty Questions (Reward: 0.0, Penalty: +2.0)
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(1, 'MAIN', 'MCQ', 'What is the largest ocean?', 'Starts with P', '["Atlantic", "Indian", "Pacific", "Arctic"]', 'Pacific', 0.0, 2.0, 1, 10),
(1, 'MAIN', 'MCQ', 'How many sides does a hexagon have?', 'Rhymes with mix', '["5", "6", "7", "8"]', '6', 0.0, 2.0, 1, 11),
(1, 'MAIN', 'MCQ', 'What is the freezing point of water in Celsius?', 'Zero', '["0", "32", "10", "100"]', '0', 0.0, 2.0, 1, 12),
(1, 'MAIN', 'MCQ', 'Which is the fastest land animal?', 'Spotted cat', '["Lion", "Cheetah", "Leopard", "Tiger"]', 'Cheetah', 0.0, 2.0, 1, 13),
(1, 'MAIN', 'MCQ', 'What is the primary language spoken in Brazil?', 'Not Spanish', '["Spanish", "Portuguese", "English", "French"]', 'Portuguese', 0.0, 2.0, 1, 14),
(1, 'MAIN', 'MCQ', 'Which element has the symbol O?', 'We breathe it', '["Gold", "Oxygen", "Osmium", "Oganesson"]', 'Oxygen', 0.0, 2.0, 1, 15);

-- Island 2: Cyclops Island (Reward: -1.0, Penalty: +1.5)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'NON_MCQ', 'What is the capital of France?', 'It has the Eiffel Tower', 'Paris', 1.0, 1.5, 2, 1),
(2, 'MAIN', 'NON_MCQ', 'What is 5 * 5?', 'Quarter of a hundred', '25', 1.0, 1.5, 2, 2);

INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(2, 'MAIN', 'MCQ', 'Which gas is most abundant in the atmosphere?', 'It starts with N', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 'Nitrogen', 1.0, 1.5, 2, 3),
(2, 'MAIN', 'MCQ', 'What is the largest mammal?', 'It lives in the ocean', '["Elephant", "Blue Whale", "Giraffe", "Orca"]', 'Blue Whale', 1.0, 1.5, 2, 4);

-- Island 3: Sirens Island (Reward: -1.5, Penalty: +1.0)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(3, 'MAIN', 'NON_MCQ', 'Who painted the Mona Lisa?', 'Italian polymath, starts with L', 'Leonardo da Vinci', 1.5, 1.0, 3, 1),
(3, 'MAIN', 'NON_MCQ', 'What is the chemical symbol for Gold?', 'Starts with A', 'Au', 1.5, 1.0, 3, 2),
(3, 'MAIN', 'NON_MCQ', 'How many continents are there?', 'Less than 10', '7', 1.5, 1.0, 3, 3);

-- Island 4: Witch's Island (Reward: -2.0, Penalty: +0.5)
-- Main Question 1: The Witch's Escape Code (Decision Tree)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 'The Witch has hidden Odysseus'' final escape code inside a Decision Tree. The tree has been broken into rules, and the ships approaching the island must be classified as SAFE or DANGER.

Reconstruct the correct decision tree using the Witch''s rules. Pass each of the eight ships (A through H) through the tree to determine whether each ship reaches SAFE or DANGER. Discard the hidden numbers belonging to DANGER ships. Read the remaining hidden numbers in ship order (A → H) to form the final escape code.

Final Clue: "Only those who find the safe waters may carry the key."', 'The tree has only one path that survives every decision.', '729586', 2.0, 0.5, 4, 1);

-- Main Question 2: Circe's Enchanted Domain (Simulated Terminal)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level, sequence_number) VALUES
(4, 'MAIN', 'NON_MCQ', 'You have landed on the island of Aeaea, but a terrible spell has been cast! The witch Circe has transformed your crew into swine and locked their true forms inside enchanted archives scattered across her domain.

The god Hermes has granted you a vision of the island''s structure and the divine commands (unzip, tar, unrar) needed to break her magic. Navigate the island in the interactive terminal, unseal the three spell fragments from hidden archives, and speak the final incantation using Hermes''s formula:
[Fragment 1]_[Fragment 2]_[Fragment 3]', 'Folders look empty? Use ls -a to reveal hidden files that start with a dot.', 'MOLY_SWINE_OATH', 2.0, 0.5, 4, 2);
