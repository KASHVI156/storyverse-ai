import { generateStory } from './storyComposer.js';
import { MOODS, LOCATIONS } from './storyDatasets.js';
import { expandToWordCount, countWords } from './wordUtils.js';

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

// Branching choice text is deterministic per run using seed.
const CHOICE_BANK = {
  Forest: [
    { prompt: 'You hear footsteps in the forest.', a: 'Follow the sound', b: 'Hide behind a tree' },
    { prompt: 'A lantern glow flickers between shadows.', a: 'Approach cautiously', b: 'Mark the path and wait' },
    { prompt: 'A raven drops a tiny key.', a: 'Pick it up immediately', b: 'Study it first' },
  ],
  Castle: [
    { prompt: 'A portrait whispers your name.', a: 'Answer politely', b: 'Turn away and listen more' },
    { prompt: 'The hallway keeps changing.', a: 'Take the shortest corridor', b: 'Follow the chandelier light' },
    { prompt: 'A locked door hums softly.', a: 'Try the keyhole', b: 'Search for a hidden switch' },
  ],
  'Space Station': [
    { prompt: 'A warning light blinks in zero gravity.', a: 'Repair the console', b: 'Report it to the captain' },
    { prompt: 'You find a drifting logbook.', a: 'Open and read it', b: 'Secure it first' },
    { prompt: 'Something pings—then vanishes.', a: 'Chase the signal', b: 'Map the area carefully' },
  ],
  Beach: [
    { prompt: 'The tide leaves a glowing footprint.', a: 'Follow the footprints', b: 'Bury a shell and wait' },
    { prompt: 'A message in a bottle appears warm.', a: 'Open it now', b: 'Take it to the shorekeeper' },
    { prompt: 'Clouds form a secret map.', a: 'Trace the route in the sand', b: 'Ask the wind for directions' },
  ],
  School: [
    { prompt: 'Your desk has a note from tomorrow.', a: 'Read it quietly', b: 'Show it to a friend' },
    { prompt: 'The classroom clock runs backward.', a: 'Catch a falling minute', b: 'Ignore it and focus' },
    { prompt: 'A locked drawer smells like chalk.', a: 'Pick the lock gently', b: 'Find the key in your bag' },
  ],
  'Haunted House': [
    { prompt: 'A staircase creaks without footsteps.', a: 'Climb slowly', b: 'Call out from the hall' },
    { prompt: 'A cold breeze spells a riddle.', a: 'Solve it aloud', b: 'Search room by room' },
    { prompt: 'The mirror shows a different you.', a: 'Step closer', b: 'Turn the mirror face-down' },
  ],
  'Ancient Temple': [
    { prompt: 'The altar accepts a whisper.', a: 'Speak your bravest hope', b: 'Hold your breath and wait' },
    { prompt: 'Runes rearrange when you blink.', a: 'Study the pattern', b: 'Press the middle rune' },
    { prompt: 'A sealed echo calls you.', a: 'Open the echo-vault', b: 'Follow the side passage' },
  ],
  'Futuristic City': [
    { prompt: 'Neon signs change when you look away.', a: 'Chase the meaning', b: 'Stay still and observe' },
    { prompt: 'A drone offers a deal mid-flight.', a: 'Accept the deal', b: 'Hack the drone for data' },
    { prompt: 'A sky-bridge appears and disappears.', a: 'Cross immediately', b: 'Wait for a safe signal' },
  ],
  Village: [
    { prompt: 'A baker offers bread shaped like a key.', a: 'Take it gratefully', b: 'Trade stories first' },
    { prompt: 'The well rings like a bell.', a: 'Lower a rope', b: 'Listen carefully to the echo' },
    { prompt: 'Lanterns point toward a hidden path.', a: 'Follow them', b: 'Write down the pattern' },
  ],
  Mountain: [
    { prompt: 'The wind carries a map fragment.', a: 'Catch it in your hands', b: 'Let it go and watch the trail' },
    { prompt: 'A cliff shows a safe-looking ledge.', a: 'Jump to it', b: 'Climb the longer way' },
    { prompt: 'A storm gate opens briefly.', a: 'Step through', b: 'Shield and wait for calm' },
  ],
};

const MOOD_FLAVOR = {
  Happy: ['like laughter in the air', 'with cheerful courage', 'as if the day wanted to smile back'],
  Sad: ['with gentle resilience', 'as quiet hope returns', 'like a soft blanket of resolve'],
  Romantic: ['with heartbeats in sync', 'as love glows around choices', 'like a kiss turned into direction'],
  Horror: ['with brave shivers', 'as shadows negotiate', 'with a fearless step into the unknown'],
  Mystery: ['with clues humming', 'as questions turn into answers', 'like the truth just breathed'],
  Fantasy: ['with rune-light wonder', 'as spells wink into place', 'like magic has a sense of timing'],
  'Sci-Fi': ['with futuristic logic', 'as signals become stories', 'like tomorrow is already talking'],
  Adventure: ['with unstoppable momentum', 'as courage becomes the compass', 'with trailblazing spirit'],
  Inspirational: ['with hope you can feel', 'as growth takes shape', 'with a promise that won’t quit'],
  Comedy: ['with absurd confidence', 'as mistakes become jokes', 'with a giggle-laced plan'],
};

function getSeed(mood, location, seedKey) {
  const base = `${seedKey || ''}|${mood}|${location}`;
  return Array.from(base).reduce((a, c) => a + c.charCodeAt(0), 0);
}

function assertValidInputs(mood, location) {
  if (!MOODS.includes(mood)) throw new Error('Invalid mood');
  if (!LOCATIONS.includes(location)) throw new Error('Invalid location');
}

function buildExcerpt({ mood, location, rng, stageIndex }) {
  const bank = CHOICE_BANK[location] || CHOICE_BANK.Forest;
  const stage = bank[stageIndex];
  const flavor = pick(MOOD_FLAVOR[mood] || MOOD_FLAVOR.Happy, rng);
  const excerpt = `In the ${location}, you feel the story shift ${flavor}. ${stage.prompt}`;
  return { excerpt, choices: [stage.a, stage.b] };
}

export function startAdventure({ mood, location, seedKey }) {
  assertValidInputs(mood, location);

  const stageCount = 3;
  const stageIndex = 0;
  const rng = mulberry32(getSeed(mood, location, seedKey));

  const { excerpt, choices } = buildExcerpt({ mood, location, rng, stageIndex });

  return {
    stageCount,
    stageIndex,
    excerpt,
    choices,
    seedKey: seedKey || `${Date.now()}`,
  };
}

function generateEnding({ mood, location, seedKey, stageIndex, choiceIndex, choiceText, rng }) {
  const signature = `stage${stageIndex}-choice${choiceIndex}`;
  const base = generateStory({ mood, location, seedKey: `${seedKey}|${signature}` });

  const choiceBlocks = [
    `Your decision, '${choiceText}', lingers like a key turning in the lock of fate.`,
    `The ${location} remembers every step you took, every breath you chose to believe.`,
    `Somewhere inside the story, ${mood} settles into the right shape—yours.`,
    `Even when the moment ends, the path continues in your voice.`,
    `A final hush arrives, and you realize the ending is only another beginning.`,
  ];

  const seedAwareExtras = pick(choiceBlocks, rng);
  const stitched = `${base.text} ${seedAwareExtras}`;

  // Expand/pad locally to target ~150 words.
  const target = 150;
  const finalText = expandToWordCount(stitched, choiceBlocks, target, rng);

  // Safety: hard truncate if expansion overshot.
  const finalWords = countWords(finalText);
  const hardMax = 155;
  if (finalWords > hardMax) {
    return finalText.split(/\s+/).slice(0, hardMax).join(' ');
  }
  return finalText;
}

export function continueAdventure({ mood, location, seedKey, stageIndex, choiceIndex }) {
  // stageIndex indicates current stage; choiceIndex selects the choice made.
  assertValidInputs(mood, location);

  const stageCount = 3;
  const bank = CHOICE_BANK[location] || CHOICE_BANK.Forest;

  const current = bank[stageIndex];
  const nextIndex = stageIndex + 1;

  const rng = mulberry32(getSeed(mood, location, seedKey));

  const choiceText = choiceIndex === 0 ? current.a : current.b;
  const excerpt = `You choose: ${choiceText}. The ${location} responds ${pick(MOOD_FLAVOR[mood] || MOOD_FLAVOR.Happy, rng)}. ` +
    (nextIndex < stageCount
      ? bank[nextIndex].prompt
      : 'A final moment arrives, bright and bold.');

  if (nextIndex >= stageCount) {
    const finalText = generateEnding({
      mood,
      location,
      seedKey,
      stageIndex,
      choiceIndex,
      choiceText,
      rng,
    });

    const base = generateStory({ mood, location, seedKey: `${seedKey}|ending-${stageIndex}-${choiceIndex}` });

    return {
      done: true,
      stageIndex: nextIndex,
      finalStory: {
        title: base.title,
        text: finalText,
        mood,
        location,
      },
    };
  }

  const nextStage = bank[nextIndex];
  return {
    done: false,
    stageIndex: nextIndex,
    excerpt,
    choices: [nextStage.a, nextStage.b],
  };
}

// Backwards-compatible name used by controllers.
export function advanceAdventure({ mood, location, seedKey, stageIndex, choiceIndex }) {
  return continueAdventure({ mood, location, seedKey, stageIndex, choiceIndex });
}

