import {
  CHARACTER_BANK,
  DIALOGUE_SNIPPETS,
  EVENT_BANK,
  LOC_CHARACTER_BANK,
  TITLE_PREFIX,
} from './storyDatasets.js';

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalizeTitle(title) {
  return title.replace(/\s+/g, ' ').trim();
}

export function generateStory({ mood, location, seedKey }) {
  const seed = Array.from(`${seedKey || ''}|${mood}|${location}`).reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = mulberry32(seed);

  const character = pick(CHARACTER_BANK[mood] || CHARACTER_BANK.Happy, rng);
  const locationColor = pick(LOC_CHARACTER_BANK[location] || LOC_CHARACTER_BANK.Forest, rng);
  const event = pick(EVENT_BANK[mood] || EVENT_BANK.Happy, rng);

  const dialoguePool = DIALOGUE_SNIPPETS[mood] || DIALOGUE_SNIPPETS.default;
  const dialogueTemplate = pick(dialoguePool, rng);

  const title = normalizeTitle(`${pick(TITLE_PREFIX[mood] || TITLE_PREFIX.Happy, rng)} ${location} & ${locationColor}`);

  const openingByMood = {
    Happy: [
      `In the ${location}, ${character} found a path painted with giggles.`,
      `The ${location} hummed like a lullaby, and ${character} smiled as if the world remembered them.`,
    ],
    Sad: [
      `In the ${location}, ${character} noticed the quiet that sadness leaves behind.`,
      `The ${location} felt gentle and distant, like a memory learning to breathe again.`,
    ],
    Romantic: [
      `In the ${location}, ${character} held a secret close—warm as the first note of a love song.`,
      `The ${location} turned moon-bright for ${character}, as though the night wanted to witness romance.`,
    ],
    Horror: [
      `In the ${location}, ${character} heard the air change its mind.`,
      `The ${location} stayed still—too still—for ${character} to pretend nothing was wrong.`,
    ],
    Mystery: [
      `In the ${location}, ${character} spotted something that definitely wasn’t there yesterday.`,
      `The ${location} offered ${character} a puzzle wrapped in ordinary shadows.`,
    ],
    Fantasy: [
      `In the ${location}, ${character} brushed a rune that answered back in sparks.`,
      `The ${location} was full of magic that behaved only when someone dared to notice.`,
    ],
    'Sci-Fi': [
      `In the ${location}, ${character} watched the stars flicker like a screen waiting for input.`,
      `The ${location} crackled with signals, and ${character} listened like a musician.`,
    ],
    Adventure: [
      `In the ${location}, ${character} followed a trail that seemed to be leading back to bravery.`,
      `The ${location} called out—one heartbeat, one step at a time—until ${character} answered.`,
    ],
    Inspirational: [
      `In the ${location}, ${character} found a promise hidden in plain sight.`,
      `The ${location} taught ${character} that even small courage can be loud.`,
    ],
    Comedy: [
      `In the ${location}, ${character} tripped over fate and somehow made it laugh.`,
      `The ${location} was so full of nonsense that ${character} didn’t even mind getting involved.`,
    ],
  };

  const endingByMood = {
    Happy: [
      `And when the last sparkle faded, the ${location} felt friendlier than before—like it knew the way home.`,
      `By sunrise, ${character} had turned one ordinary moment into a joyful legend.`,
    ],
    Sad: [
      `Stillness lingered, but ${character} carried hope in their pockets, sealed with patience.`,
      `When the night ended, ${character} chose kindness—soft as a promise kept.`,
    ],
    Romantic: [
      `As the moment settled, love felt less like risk and more like a door opening.`,
      `And in that heartbeat of the ${location}, ${character} realized: fate can be tender.`,
    ],
    Horror: [
      `Then the silence snapped back—only ${character} wasn’t alone anymore.`,
      `The ${location} exhaled one last time, and ${character} learned what fear can’t erase.`,
    ],
    Mystery: [
      `The clue clicked into place, and the ${location} finally revealed why it had been watching.`,
      `When the answer arrived, it sounded like ${character} breathing out the truth.`,
    ],
    Fantasy: [
      `A spell took shape—beautiful, strange, and undeniably real—and the ${location} bowed politely.`,
      `When the magic finished singing, ${character} wore wonder like a cloak.`,
    ],
    'Sci-Fi': [
      `The signal resolved into something kind, and the ${location} warmed to the future.`,
      `At last, ${character} smiled—because the universe had replied.`,
    ],
    Adventure: [
      `The path kept going, but ${character} had already become the kind of person who follows it.`,
      `With every brave step, the ${location} turned from challenge into celebration.`,
    ],
    Inspirational: [
      `And just like that, ${character} learned the secret: progress is a story you tell yourself daily.`,
      `The ${location} glowed with quiet strength, long after the lesson ended.`,
    ],
    Comedy: [
      `Somehow, nobody was harmed—and everyone was confused in the funniest possible way.`,
      `In the end, ${character} declared the ${location} officially ridiculous—and proudly so.`,
    ],
  };

  const opening = pick(openingByMood[mood] || openingByMood.Happy, rng);
  const dialogue = dialogueTemplate
    .replaceAll('{character}', character)
    .replaceAll('{location}', location);

  const mid1 = `It began with ${event}, right when ${character} noticed ${locationColor} moving like a secret.`;
  const mid2 = `A small decision—made in a single breath—changed everything. ${dialogue}`;
  const mid3 = `Together, they stepped deeper into the ${location}, trusting the odd, beautiful logic of stories.`;
  const ending = pick(endingByMood[mood] || endingByMood.Happy, rng);

  const text = [opening, mid1, mid2, mid3, ending].join(' ');

  return { title, text, mood, location };
}

