export const ISLANDS = [
  {
    id: 1,
    slug: 'lotus',
    name: 'Lotus Island',
    title: 'Sunlit Calm, Hidden Cost',
    blurb: 'Crewmates forget to return home after eating lotus flowers. Every mistake delays the journey further.',
    themeClass: 'lotus',
    pathLabel: 'Non-sequential expedition (4 Questions)',
    questionCount: 4,
    isSequential: false,
    rewardName: "Athena's Scroll",
    rewardType: 'ATHENAS_SCROLL',
    rewardDescription: 'Grants one additional free hint during Island 1, separate from the 3 standard hints.',
    scoring: {
      correct: -0.5,
      incorrect: +2.0,
      note: 'Higher penalty reflects easier difficulty. Incorrect answers activate penalty questions up to Question 10.',
    },
  },
  {
    id: 2,
    slug: 'cyclops',
    name: "Cyclop's Island",
    title: 'Stone, Fire, and a Watching Eye',
    blurb: 'Crewmates must clear the heavy rocks blocked by Polyphemus the Cyclops in strict order.',
    themeClass: 'cyclops',
    pathLabel: 'Sequential ascent (4 Questions)',
    questionCount: 4,
    isSequential: true,
    rewardName: 'Cyclops Eye',
    rewardType: 'CYCLOPS_EYE',
    rewardDescription: 'Allows elimination of one incorrect option from an MCQ during Island 2.',
    scoring: {
      correct: -1.0,
      incorrect: +1.5,
      note: 'Strictly sequential: you must solve the active question before proceeding to the next.',
    },
  },
  {
    id: 3,
    slug: 'sirens',
    name: 'Sirens Island',
    title: 'Moonlit Voices on Black Water',
    blurb: 'Enchanting songs conceal perilous reefs. Deceptive signals carry severe time penalties.',
    themeClass: 'sirens',
    pathLabel: 'Three Portal Trials (3 Non-MCQ Questions)',
    questionCount: 3,
    isSequential: false,
    rewardName: "Hermes' Sandals",
    rewardType: 'HERMES_SANDALS',
    rewardDescription: "Reduces the team's remaining journey by 2.0 years immediately.",
    scoring: {
      correct: -1.5,
      incorrect: +1.0,
      trapPenalty: +2.0,
      mainTrapPenalty: +3.0,
      note: 'One pre-round MCQ option is secretly designated as the Hidden Wrong Answer (+2.0 years penalty).',
    },
  },
  {
    id: 4,
    slug: 'witch',
    name: "Witch's Island",
    title: "Circe's Gauntlet Before Home",
    blurb: 'The sorceress turns crewmates to swine. High stakes engineering puzzles before reaching Ithaca.',
    themeClass: 'witch',
    pathLabel: 'Final Gauntlet (3 Questions)',
    questionCount: 3,
    isSequential: false,
    rewardName: 'The Blessing',
    rewardType: 'THE_BLESSING',
    rewardDescription: 'Choice of: (1) Bypass a sit-out restriction immediately, or (2) Deduct 3.0 years from remaining journey.',
    scoring: {
      correct: -2.0,
      incorrect: +0.5,
      note: 'Witch Mechanism: On a wrong answer, one team member must physically sit out only the immediately following question.',
    },
  },
  {
    id: 5,
    slug: 'ithaca',
    name: 'Ithaca',
    title: 'The Homeland Reached',
    blurb: 'Odysseus has crossed the uncharted seas and returned to the shores of Ithaca.',
    themeClass: 'ithaca',
    pathLabel: 'Voyage Completed',
    questionCount: 0,
    isSequential: false,
    scoring: {
      correct: 0,
      incorrect: 0,
      note: 'Final voyage completion verified.',
    },
  },
];

export const REWARD_LABELS = {
  ATHENAS_SCROLL: "Athena's Scroll",
  CYCLOPS_EYE: 'Cyclops Eye',
  HERMES_SANDALS: "Hermes' Sandals",
  THE_BLESSING: 'The Blessing',
};

export const REWARD_DESCRIPTIONS = {
  ATHENAS_SCROLL: 'Grants +1 free hint for Island 1 without using your 3 standard hints.',
  CYCLOPS_EYE: 'Eliminates 1 wrong option in an MCQ on Island 2.',
  HERMES_SANDALS: 'Instant −2.0 years deducted from your journey time.',
  THE_BLESSING: 'Bypass a Witch sit-out penalty OR deduct −3.0 years from journey.',
};

export function findIslandBySlug(slug) {
  return ISLANDS.find((island) => island.slug === slug);
}

export function findIslandById(id) {
  return ISLANDS.find((island) => island.id === id);
}
