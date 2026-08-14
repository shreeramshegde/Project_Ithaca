-- Pre-Round MCQs
INSERT INTO questions (island_id, type, format, question_text, options, correct_answer, reward_years, penalty_years, difficulty_level) VALUES
(1, 'PRE_ROUND', 'MCQ', 'What is the capital of Greece?', '["Athens", "Sparta", "Troy", "Thebes"]', 'Athens', 0, 0, 1),
(2, 'PRE_ROUND', 'MCQ', 'Who wrote the Odyssey?', '["Homer", "Socrates", "Plato", "Aristotle"]', 'Homer', 0, 0, 1);

-- Island 3 Pre-Round MCQ has a hidden trap!
INSERT INTO questions (island_id, type, format, question_text, options, correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level) VALUES
(3, 'PRE_ROUND', 'MCQ', 'Which sea surrounds Greece?', '["Mediterranean", "Red Sea", "Black Sea", "Caspian Sea"]', 'Mediterranean', 'Red Sea', 0, 0, 2);

INSERT INTO questions (island_id, type, format, question_text, options, correct_answer, reward_years, penalty_years, difficulty_level) VALUES
(4, 'PRE_ROUND', 'MCQ', 'Which god rules the sea?', '["Zeus", "Hades", "Poseidon", "Apollo"]', 'Poseidon', 0, 0, 3);

-- Island 1: Lotus Island (Reward: -0.5, Penalty: +2.0)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level) VALUES
(1, 'MAIN', 'NON_MCQ', 'What is 2 + 2?', 'It is an even number', '4', 0.5, 2.0, 1),
(1, 'MAIN', 'NON_MCQ', 'What is the color of the sky?', 'Look up during the day', 'blue', 0.5, 2.0, 1);

INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level) VALUES
(1, 'MAIN', 'MCQ', 'Which planet is known as the Red Planet?', 'It is named after the Roman god of war', '["Earth", "Mars", "Jupiter", "Venus"]', 'Mars', 0.5, 2.0, 1),
(1, 'MAIN', 'MCQ', 'What is the boiling point of water in Celsius?', 'It is a multiple of 10', '["50", "90", "100", "120"]', '100', 0.5, 2.0, 1);

-- Island 1: Extra Penalty Questions (Reward: 0.0, Penalty: +2.0)
-- These are served by the frontend if a team makes a mistake on the base questions.
INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level) VALUES
(1, 'MAIN', 'MCQ', 'What is the largest ocean?', 'Starts with P', '["Atlantic", "Indian", "Pacific", "Arctic"]', 'Pacific', 0.0, 2.0, 1),
(1, 'MAIN', 'MCQ', 'How many sides does a hexagon have?', 'Rhymes with mix', '["5", "6", "7", "8"]', '6', 0.0, 2.0, 1),
(1, 'MAIN', 'MCQ', 'What is the freezing point of water in Celsius?', 'Zero', '["0", "32", "10", "100"]', '0', 0.0, 2.0, 1);

INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level) VALUES
(1, 'MAIN', 'MCQ', 'Which is the fastest land animal?', 'Spotted cat', '["Lion", "Cheetah", "Leopard", "Tiger"]', 'Cheetah', 0.0, 2.0, 1),
(1, 'MAIN', 'MCQ', 'What is the primary language spoken in Brazil?', 'Not Spanish', '["Spanish", "Portuguese", "English", "French"]', 'Portuguese', 0.0, 2.0, 1),
(1, 'MAIN', 'MCQ', 'Which element has the symbol O?', 'We breathe it', '["Gold", "Oxygen", "Osmium", "Oganesson"]', 'Oxygen', 0.0, 2.0, 1);

-- Island 2: Cyclops Island (Reward: -1.0, Penalty: +1.5)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level) VALUES
(2, 'MAIN', 'NON_MCQ', 'What is the capital of France?', 'It has the Eiffel Tower', 'Paris', 1.0, 1.5, 2),
(2, 'MAIN', 'NON_MCQ', 'What is 5 * 5?', 'Quarter of a hundred', '25', 1.0, 1.5, 2);

INSERT INTO questions (island_id, type, format, question_text, hint_text, options, correct_answer, reward_years, penalty_years, difficulty_level) VALUES
(2, 'MAIN', 'MCQ', 'Which gas is most abundant in the atmosphere?', 'It starts with N', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 'Nitrogen', 1.0, 1.5, 2),
(2, 'MAIN', 'MCQ', 'What is the largest mammal?', 'It lives in the ocean', '["Elephant", "Blue Whale", "Giraffe", "Orca"]', 'Blue Whale', 1.0, 1.5, 2);

-- Island 3: Sirens Island (Reward: -1.5, Penalty: +1.0)
-- 3 NON-MCQ questions
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level) VALUES
(3, 'MAIN', 'NON_MCQ', 'Who painted the Mona Lisa?', 'Italian polymath, starts with L', 'Leonardo da Vinci', 1.5, 1.0, 3),
(3, 'MAIN', 'NON_MCQ', 'What is the chemical symbol for Gold?', 'Starts with A', 'Au', 1.5, 1.0, 3),
(3, 'MAIN', 'NON_MCQ', 'How many continents are there?', 'Less than 10', '7', 1.5, 1.0, 3);

-- Island 4: Witchs Island (Reward: -2.0, Penalty: +0.5)
INSERT INTO questions (island_id, type, format, question_text, hint_text, correct_answer, reward_years, penalty_years, difficulty_level) VALUES
(4, 'MAIN', 'NON_MCQ', 'What is the square root of 144?', 'A dozen', '12', 2.0, 0.5, 4),
(4, 'MAIN', 'NON_MCQ', 'Who discovered gravity?', 'Apple fell on his head', 'Isaac Newton', 2.0, 0.5, 4),
(4, 'MAIN', 'NON_MCQ', 'What is the speed of light in vacuum (approx km/s)?', '3 followed by 5 zeros', '300000', 2.0, 0.5, 4);
