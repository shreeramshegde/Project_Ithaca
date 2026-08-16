/**
 * PROJECT ITHACA: Question Repository
 * =========================================================================
 * You can easily replace, add, or customize the questions in this file.
 * The system automatically reads from here for the UI and offline engine.
 */

export const QUESTIONS_DATA = {
  // =========================================================================
  // ISLAND 1: LOTUS ISLAND (4 Questions: 2 MCQ, 2 Non-MCQ, Non-sequential)
  // Reward: Athena's Scroll (+1 hint in Island 1)
  // Scoring: Correct: -0.5 yr, Incorrect: +2.0 yr
  // =========================================================================
  1: {
    preRound: {
      id: 'lotus-pre-1',
      island_id: 1,
      type: 'PRE_ROUND',
      format: 'MCQ',
      label: 'Lotus Pre-Round Trial',
      question_text: 'In Homer\'s Odyssey, what plant caused Odysseus\' crew to forget their thoughts of home and desire only to stay forever?',
      options: [
        'A. Mandrake Root',
        'B. Lotus Flower',
        'C. Golden Apple of Discord',
        'D. Asphodel Blossom'
      ],
      correct_answer: 'B. Lotus Flower',
      reward: 'ATHENAS_SCROLL',
      reward_name: "Athena's Scroll",
      reward_desc: "Grants 1 extra free hint for Island 1 without consuming standard hints.",
      hint: 'The plant gave this very island its mythological name.'
    },
    questions: [
      {
        id: 'lotus-main-1',
        island_id: 1,
        sequence_number: 1,
        type: 'MAIN',
        format: 'MCQ',
        label: 'Trial I: The Memory Array',
        question_text: 'What will be the output of the following JavaScript snippet?\n\nconst arr = [10, 20, 30];\narr[10] = 50;\nconsole.log(arr.length);',
        options: [
          'A. 4',
          'B. 10',
          'C. 11',
          'D. undefined'
        ],
        correct_answer: 'C. 11',
        hint: 'In JavaScript, setting an index creates sparse slots and length becomes highest index + 1.',
        difficulty: 'Easy'
      },
      {
        id: 'lotus-main-2',
        island_id: 1,
        sequence_number: 2,
        type: 'MAIN',
        format: 'NON_MCQ',
        label: 'Trial II: The Binary River',
        question_text: 'What is the decimal equivalent of the 8-bit two\'s complement binary value: 11111010 ?',
        options: null,
        correct_answer: ['-6', '- 6'],
        hint: 'Invert the bits (00000101 = 5) and add 1, giving magnitude 6 with negative sign.',
        difficulty: 'Medium'
      },
      {
        id: 'lotus-main-3',
        island_id: 1,
        sequence_number: 3,
        type: 'MAIN',
        format: 'MCQ',
        label: 'Trial III: Logical Gates of Ogygia',
        question_text: 'Which digital logic gate produces an output of HIGH (1) if and only if an odd number of its inputs are HIGH (1)?',
        options: [
          'A. NAND',
          'B. XOR',
          'C. NOR',
          'D. XNOR'
        ],
        correct_answer: 'B. XOR',
        hint: 'This gate is also known as the exclusive OR or parity generator.',
        difficulty: 'Easy'
      },
      {
        id: 'lotus-main-4',
        island_id: 1,
        sequence_number: 4,
        type: 'MAIN',
        format: 'NON_MCQ',
        label: 'Trial IV: The Time Complexity',
        question_text: 'What is the average-case time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black Tree) containing N elements? (Format: O(log N) or O(log n))',
        options: null,
        correct_answer: ['O(log N)', 'O(log n)', 'O(logn)', 'O(logN)', 'log n', 'log N', 'O(lg N)'],
        hint: 'The height of a balanced BST with N elements is logarithmic with respect to N.',
        difficulty: 'Medium'
      }
    ],
    penaltyPool: [
      {
        id: 'lotus-penalty-1',
        island_id: 1,
        sequence_number: 10,
        type: 'PENALTY',
        format: 'MCQ',
        label: 'Penalty Trial I: The Labyrinth of Forgetfulness',
        question_text: 'Which HTTP status code signifies "404 Not Found" vs "401 Unauthorized" vs "403 Forbidden"? What is the exact code for "Forbidden"?',
        options: ['A. 401', 'B. 403', 'C. 404', 'D. 405'],
        correct_answer: 'B. 403',
        hint: '401 is Unauthenticated, 403 is Authenticated but Forbidden.',
        difficulty: 'Easy'
      },
      {
        id: 'lotus-penalty-2',
        island_id: 1,
        sequence_number: 11,
        type: 'PENALTY',
        format: 'NON_MCQ',
        label: 'Penalty Trial II: The Drifting Current',
        question_text: 'In C/C++, if an integer pointer `int *p = 1000;` (assuming sizeof(int)=4), what is the value of `p + 2` in decimal?',
        options: null,
        correct_answer: ['1008'],
        hint: 'Pointer arithmetic increments by the size of the underlying data type.',
        difficulty: 'Medium'
      }
    ]
  },

  // =========================================================================
  // ISLAND 2: CYCLOP'S ISLAND (4 Questions: 2 MCQ, 2 Non-MCQ, Sequential)
  // Reward: Cyclops Eye (Eliminates 1 incorrect MCQ option)
  // Scoring: Correct: -1.0 yr, Incorrect: +1.5 yr
  // =========================================================================
  2: {
    preRound: {
      id: 'cyclops-pre-1',
      island_id: 2,
      type: 'PRE_ROUND',
      format: 'MCQ',
      label: "Cyclop's Pre-Round Trial",
      question_text: 'What was the alias Odysseus gave to Polyphemus the Cyclops so that when Polyphemus called for help, he shouted that "______ is hurting me!"?',
      options: [
        'A. Telemachus',
        'B. Nobody (Outis)',
        'C. Sinbad',
        'D. Argus'
      ],
      correct_answer: 'B. Nobody (Outis)',
      reward: 'CYCLOPS_EYE',
      reward_name: "Cyclops Eye",
      reward_desc: "Allows eliminating one incorrect option from an MCQ in Island 2.",
      hint: 'The famous Greek pun "Outis" translates directly into English as...'
    },
    questions: [
      {
        id: 'cyclops-main-1',
        island_id: 2,
        sequence_number: 1,
        type: 'MAIN',
        format: 'MCQ',
        label: 'Step 1: The Cave Entrance',
        question_text: 'In networking, which OSI Layer is responsible for end-to-end reliability, flow control, and port addressing (e.g., TCP & UDP)?',
        options: [
          'A. Network Layer (Layer 3)',
          'B. Transport Layer (Layer 4)',
          'C. Data Link Layer (Layer 2)',
          'D. Session Layer (Layer 5)'
        ],
        correct_answer: 'B. Transport Layer (Layer 4)',
        wrong_to_eliminate: 'A. Network Layer (Layer 3)',
        hint: 'This layer operates right above the IP layer and manages port numbers.',
        difficulty: 'Easy'
      },
      {
        id: 'cyclops-main-2',
        island_id: 2,
        sequence_number: 2,
        type: 'MAIN',
        format: 'NON_MCQ',
        label: 'Step 2: Rolling the Boulder',
        question_text: 'In Python, what is the output of: `print(bool([]) == bool([0]))` ? (Answer: True or False)',
        options: null,
        correct_answer: ['False', 'false'],
        hint: 'An empty list `[]` is falsy (False), whereas a list containing `[0]` has length 1 and is truthy (True).',
        difficulty: 'Medium'
      },
      {
        id: 'cyclops-main-3',
        island_id: 2,
        sequence_number: 3,
        type: 'MAIN',
        format: 'MCQ',
        label: 'Step 3: The Blinding Torch',
        question_text: 'Which SQL clause is used to filter the groups created by a `GROUP BY` clause?',
        options: [
          'A. WHERE',
          'B. ORDER BY',
          'C. HAVING',
          'D. FILTER BY'
        ],
        correct_answer: 'C. HAVING',
        wrong_to_eliminate: 'D. FILTER BY',
        hint: 'WHERE filters rows before aggregation; this keyword filters aggregate groups.',
        difficulty: 'Medium'
      },
      {
        id: 'cyclops-main-4',
        island_id: 2,
        sequence_number: 4,
        type: 'MAIN',
        format: 'NON_MCQ',
        label: 'Step 4: Escaping Beneath the Rams',
        question_text: 'What data structure is used to implement Breadth-First Search (BFS) in a graph?',
        options: null,
        correct_answer: ['Queue', 'queue', 'FIFO Queue', 'fifo queue'],
        hint: 'BFS visits neighbors layer by layer using a First-In, First-Out structure.',
        difficulty: 'Medium'
      }
    ]
  },

  // =========================================================================
  // ISLAND 3: SIRENS ISLAND (3 Questions: All Non-MCQ, Non-sequential)
  // Reward: Hermes' Sandals (-2.0 yr) / Hidden Wrong Answer Trap (+2.0 yr)
  // Scoring: Correct: -1.5 yr, Incorrect: +1.0 yr, Trap: +3.0 yr
  // =========================================================================
  3: {
    preRound: {
      id: 'sirens-pre-1',
      island_id: 3,
      type: 'PRE_ROUND',
      format: 'MCQ',
      label: 'Sirens Pre-Round Trial',
      question_text: 'How did Odysseus protect his crew from hearing the enchanting, fatal songs of the Sirens as their ship sailed past?',
      options: [
        'A. Filled their ears with beeswax',
        'B. Bound their hands with golden chains',
        'C. Played loud battle drums on deck',
        'D. Cast an invisibility enchantment'
      ],
      correct_answer: 'A. Filled their ears with beeswax',
      hidden_wrong_answer: 'B. Bound their hands with golden chains', // TRAP (+2 years penalty)
      reward: 'HERMES_SANDALS',
      reward_name: "Hermes' Sandals",
      reward_desc: "Grants -2.0 years deduction immediately upon victory!",
      hint: 'Odysseus had his crew tie HIM to the mast, but blocked THEIR ears with something malleable.'
    },
    questions: [
      {
        id: 'sirens-main-1',
        island_id: 3,
        sequence_number: 1,
        type: 'MAIN',
        format: 'NON_MCQ',
        label: 'Arch of the First Song',
        question_text: 'In cryptography, what is the standard term for a single-use random number or string generated for authentication protocols to prevent replay attacks?',
        options: null,
        correct_answer: ['Nonce', 'nonce', 'NONCE', 'number used once'],
        hidden_wrong_answers: ['salt', 'Salt', 'IV', 'Initialization Vector'],
        hint: 'The term is a portmanteau/abbreviation of "(n)umber used (once)".',
        difficulty: 'Medium'
      },
      {
        id: 'sirens-main-2',
        island_id: 3,
        sequence_number: 2,
        type: 'MAIN',
        format: 'NON_MCQ',
        label: 'Arch of the Harmonic Signal',
        question_text: 'In microprocessor design, what register automatically holds the memory address of the NEXT instruction to be fetched and executed?',
        options: null,
        correct_answer: ['Program Counter', 'PC', 'program counter', 'Instruction Pointer', 'IP'],
        hidden_wrong_answers: ['Accumulator', 'Instruction Register', 'IR', 'MAR'],
        hint: 'Often abbreviated as PC (or IP on x86 architectures).',
        difficulty: 'Hard'
      },
      {
        id: 'sirens-main-3',
        island_id: 3,
        sequence_number: 3,
        type: 'MAIN',
        format: 'NON_MCQ',
        label: 'Arch of the Resonant Echo',
        question_text: 'What is the name of the algorithmic design paradigm where a problem is broken down into subproblems, the solutions are remembered (memoized or tabulated), and reused to avoid recomputation?',
        options: null,
        correct_answer: ['Dynamic Programming', 'dynamic programming', 'DP', 'Dynamic programming'],
        hidden_wrong_answers: ['Divide and Conquer', 'Greedy', 'Backtracking'],
        hint: 'Commonly abbreviated as DP; coined by Richard Bellman.',
        difficulty: 'Hard'
      }
    ]
  },

  // =========================================================================
  // ISLAND 4: WITCH'S ISLAND (CIRCE) (3 Questions, Highest Difficulty)
  // Reward: The Blessing (Bypass Sit-out OR -3.0 yr)
  // Scoring: Correct: -2.0 yr, Incorrect: +0.5 yr
  // Special: Witch Sit-out Mechanism on incorrect answers
  // =========================================================================
  4: {
    preRound: {
      id: 'witch-pre-1',
      island_id: 4,
      type: 'PRE_ROUND',
      format: 'MCQ',
      label: "Circe's Pre-Round Trial",
      question_text: 'Which mythical herb was gifted to Odysseus by Hermes to make him immune to the sorceress Circe\'s potion that turned men into beasts?',
      options: [
        'A. Moly (Holy White Blossom)',
        'B. Hemlock',
        'C. Ambrosia Vine',
        'D. Nectar of Olympus'
      ],
      correct_answer: 'A. Moly (Holy White Blossom)',
      reward: 'THE_BLESSING',
      reward_name: 'The Blessing',
      reward_desc: 'Allows team choice: (1) Bypass a Sit-out penalty immediately, or (2) Deduct 3.0 years from journey.',
      hint: 'A magical herb described as having a black root and white flower.'
    },
    questions: [
      {
        id: 'witch-main-1',
        island_id: 4,
        sequence_number: 1,
        type: 'MAIN',
        format: 'NON_MCQ',
        label: 'The Obsidian Altar',
        question_text: 'In operating systems, what is the term for a situation where two or more processes are unable to proceed because each is waiting for the other to release a shared resource? (4 Coffman conditions define it)',
        options: null,
        correct_answer: ['Deadlock', 'deadlock', 'DEADLOCK'],
        hint: 'Mutual exclusion, Hold and wait, No preemption, and Circular wait cause this.',
        difficulty: 'Hard'
      },
      {
        id: 'witch-main-2',
        island_id: 4,
        sequence_number: 2,
        type: 'MAIN',
        format: 'NON_MCQ',
        label: 'The Cauldron of Metamorphosis',
        question_text: 'In digital signal processing and communication systems, according to the Nyquist-Shannon Sampling Theorem, to perfectly reconstruct a signal with maximum frequency f_max, what is the minimum sampling rate (in terms of f_max)? (Format: 2*f_max or 2 f_max or 2f_max or 2f)',
        options: null,
        correct_answer: ['2*f_max', '2f_max', '2 f_max', '2*f', '2f', '2 * f_max', 'twice the maximum frequency', '2 * fm', '2fm'],
        hint: 'The sampling frequency f_s must be at least double the highest signal component frequency.',
        difficulty: 'Hard'
      },
      {
        id: 'witch-main-3',
        island_id: 4,
        sequence_number: 3,
        type: 'MAIN',
        format: 'NON_MCQ',
        label: 'The Sorceress\'s Final Gate',
        question_text: 'In computer architecture, what hazard occurs in pipelined processors when an instruction depends on the result of a previous instruction that has not yet completed execution in the pipeline?',
        options: null,
        correct_answer: ['Data Hazard', 'data hazard', 'Data hazard', 'RAW hazard', 'Read After Write hazard'],
        hint: 'Types include RAW (Read After Write), WAR, and WAW hazards.',
        difficulty: 'Extreme'
      }
    ]
  }
};

/**
 * Utility functions for question lookups
 */
export function getIslandQuestions(islandId) {
  return QUESTIONS_DATA[islandId] || null;
}

export function getAllQuestionsFlat() {
  const all = [];
  Object.values(QUESTIONS_DATA).forEach((island) => {
    if (island.preRound) all.push(island.preRound);
    if (island.questions) all.push(...island.questions);
    if (island.penaltyPool) all.push(...island.penaltyPool);
  });
  return all;
}
