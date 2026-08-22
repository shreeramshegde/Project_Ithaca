/**
 * Project Ithaca — Cinematic Story Timeline
 *
 * Defines the sequential video list, scene titles, and bottom narrative captions
 * synchronized with the exact footage timestamps.
 */

export const STORY_VIDEOS = [
  {
    id: 'troy',
    index: 0,
    title: 'THE FALL OF TROY',
    src: '/assets/story/story-01-troy.mp4',
    duration: 10.0,
  },
  {
    id: 'journey',
    index: 1,
    title: 'THE JOURNEY HOME',
    src: '/assets/story/story-02-journey.mp4',
    duration: 10.0,
  },
  {
    id: 'storm',
    index: 2,
    title: 'THE STORM',
    src: '/assets/story/story-03-storm.mp4',
    duration: 10.0,
  },
  {
    id: 'trials',
    index: 3,
    title: 'THE FOUR TRIALS',
    src: '/assets/story/story-04-trials.mp4',
    duration: 10.0,
  },
  {
    id: 'final',
    index: 4,
    title: 'PROJECT ITHACA',
    src: '/assets/story/story-05-final.mp4',
    duration: 10.0,
  },
];

export const STORY_TIMELINE = [
  // ==========================================
  // VIDEO 1: The Trojan War & The Fall of Troy
  // ==========================================
  {
    videoIndex: 0,
    start: 0.0,
    end: 5.2,
    title: 'THE FALL OF TROY',
    caption: 'After ten long years of war, the great city of Troy had fallen.',
  },
  {
    videoIndex: 0,
    start: 5.2,
    end: 10.0,
    title: "THE KING'S CALL",
    caption: 'Victory was won, but the true journey was only beginning.',
  },

  // ==========================================
  // VIDEO 2: Fleet Departs on Moonlit Waters
  // ==========================================
  {
    videoIndex: 1,
    start: 0.0,
    end: 5.0,
    title: 'THE JOURNEY HOME',
    caption: 'Odysseus commanded the fleet toward home — to the shores of Ithaca.',
  },
  {
    videoIndex: 1,
    start: 5.0,
    end: 10.0,
    title: 'THE OPEN AEGEAN',
    caption: 'Yet the gods of the sea held other plans for the weary crew.',
  },

  // ==========================================
  // VIDEO 3: The Tempest on Dark Seas
  // ==========================================
  {
    videoIndex: 2,
    start: 0.0,
    end: 4.5,
    title: 'THE STORM',
    caption: 'A furious tempest shattered the fleet and swept them into unknown waters.',
  },
  {
    videoIndex: 2,
    start: 4.5,
    end: 10.0,
    title: 'THE FORBIDDEN SEAS',
    caption: 'Four perilous trials now stood between Odysseus and his kingdom.',
  },

  // ==========================================
  // VIDEO 4: The Four Island Trials (2.5s each)
  // ==========================================
  {
    videoIndex: 3,
    start: 0.0,
    end: 2.5,
    title: 'THE LOTUS',
    caption: 'Beautiful waters hide dangerous temptation and sweet oblivion.',
  },
  {
    videoIndex: 3,
    start: 2.5,
    end: 5.0,
    title: 'THE CYCLOPS',
    caption: 'Beyond the deep stone darkness, a ruthless eye watches.',
  },
  {
    videoIndex: 3,
    start: 5.0,
    end: 7.5,
    title: 'THE SIRENS',
    caption: 'Not every enchanting melody leads the voyager home.',
  },
  {
    videoIndex: 3,
    start: 7.5,
    end: 10.0,
    title: 'THE WITCH',
    caption: 'Ancient spells demand a reckoning before the curse is broken.',
  },

  // ==========================================
  // VIDEO 5: Title Reveal & Odyssey Call
  // ==========================================
  {
    videoIndex: 4,
    start: 0.0,
    end: 4.0,
    title: 'PROJECT ITHACA',
    caption: 'Every trial demands knowledge, courage, and precision.',
  },
  {
    videoIndex: 4,
    start: 4.0,
    end: 7.2,
    title: 'THE TECH ODYSSEY',
    caption: 'Four trials. One journey home. The voyage is now yours.',
  },
  {
    videoIndex: 4,
    start: 7.2,
    end: 10.0,
    title: 'YOUR ODYSSEY BEGINS',
    caption: 'Step forward and begin your quest to reach Ithaca.',
  },
];
