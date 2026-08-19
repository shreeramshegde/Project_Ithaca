export const ISLANDS = [
  {
    id: 1,
    slug: 'lotus',
    name: 'Lotus Island',
    title: 'Sunlit Calm, Hidden Cost',
    blurb: 'A warm shoreline where choices feel easy and every answer still bends the voyage.',
    themeClass: 'lotus',
    pathLabel: 'Non-sequential expedition',
  },
  {
    id: 2,
    slug: 'cyclops',
    name: "Cyclop's Island",
    title: 'Stone, Fire, and a Watching Eye',
    blurb: 'Torchlit caverns and a harsher route where progress demands sequence and precision.',
    themeClass: 'cyclops',
    pathLabel: 'Sequential ascent',
  },
  {
    id: 3,
    slug: 'sirens',
    name: 'Sirens Island',
    title: 'Moonlit Voices on Black Water',
    blurb: 'Beautiful signals conceal danger here; move carefully and trust only the backend result.',
    themeClass: 'sirens',
    pathLabel: 'Three portal trials',
  },
  {
    id: 4,
    slug: 'witch',
    name: "Witch's Island",
    title: 'The Final Curse Before Home',
    blurb: 'Fog, ruin, and the last reckoning before Ithaca can finally be seen.',
    themeClass: 'witch',
    pathLabel: 'Final gauntlet',
  },
  {
    id: 5,
    slug: 'ithaca',
    name: "Ithaca",
    title: 'Home at Last',
    blurb: 'The journey ends here. The Odyssey is complete.',
    themeClass: 'ithaca',
    pathLabel: 'Journey Complete',
  }
];

export const REWARD_LABELS = {
  ATHENAS_SCROLL: "Athena's Scroll",
  CYCLOPS_EYE: 'Cyclops Eye',
  HERMES_SANDALS: "Hermes' Sandals",
  THE_BLESSING: 'The Blessing',
};

export function findIslandBySlug(slug) {
  return ISLANDS.find((island) => island.slug === slug);
}
