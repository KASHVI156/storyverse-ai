// Predefined datasets for Story Verse AI.
// No external AI services; all story text is generated locally.

export const MOODS = [
  'Happy',
  'Sad',
  'Romantic',
  'Horror',
  'Mystery',
  'Fantasy',
  'Sci-Fi',
  'Adventure',
  'Inspirational',
  'Comedy',
];

export const LOCATIONS = [
  'Forest',
  'Castle',
  'Space Station',
  'Beach',
  'School',
  'Haunted House',
  'Ancient Temple',
  'Futuristic City',
  'Village',
  'Mountain',
];

export const CHARACTER_BANK = {
  Happy: ['Sunny', 'Captain Giggles', 'Luna the Lively', 'Professor Wink', 'Bubbles'],
  Sad: ['Mossy', 'Eira the Quiet', 'Old Lantern', 'Rin the Rainwalker', 'Wistful Otter'],
  Romantic: ['Roseheart', 'Theo the Tender', 'Seraphine', 'Atlas & Ivy', "Cupid’s Courier"],
  Horror: ['Whispering Warden', 'Count Creaken', 'Nyx the Unblinking', 'Hollow Choir', 'The Jittering Doll'],
  Mystery: ['Detective Quill', 'Mara the Sleuth', 'Cipher Fox', 'Professor Paradox', 'The Unsealed Note'],
  Fantasy: ['Mage Maribel', 'Dragonscale', 'Rune Rider', 'Faerie Tilda', 'King of Storms'],
  'Sci-Fi': ['Dr. Nova Kline', 'Captain Byte', 'Zeta Zapper', 'Archivist Venn', 'Circuit Seraph'],
  Adventure: ['Trailbreaker Zara', 'Rogue Compass', 'Wander-Wolf', 'Echo Scout', 'The Sky-Kite'],
  Inspirational: ['Coach Aurora', 'Hopekeeper Juno', 'Brave Sprout', 'Mentor Atlas', 'Sky Scribe'],
  Comedy: ['Sir Snickers', 'Noodle McNonsense', 'Gigglebot 9000', 'Professor Banana', 'Mayor Mayhem'],
};

export const LOC_CHARACTER_BANK = {
  Forest: ['Ferns', 'Twig & Tally', 'The Moss King'],
  Castle: ['The Velvet Squire', 'Portrait of Past', 'Crown Guard'],
  'Space Station': ['Docking Dragon', 'Grav-Gray Gears', 'Star-Scribe Unit'],
  Beach: ['Seaglass Sailor', 'Shell Sorcerer', 'Tide Tumbler'],
  School: ['Ms. Marker', 'Quiz Wizard', 'Locker Legend'],
  'Haunted House': ['Rattleknock', 'Candle Ghost', 'Sighing Stair'],
  'Ancient Temple': ['Sand Archivist', 'Glyph Gardener', 'Echo Relic'],
  'Futuristic City': ['Neon Navigator', 'Skybridge Runner', 'Chrome Canary'],
  Village: ['Bramble Baker', 'Market Mender', 'Lantern Lady'],
  Mountain: ['Wind Cartographer', 'Cliffside Courier', 'Storm Shepherd'],
};

export const EVENT_BANK = {
  Happy: ['a confetti breeze', 'a surprise parade', 'a friendly sparkle', 'a warm cup of starlight'],
  Sad: ['a lone tearful drizzle', 'a silent goodbye', 'a drifting memory', 'a quiet corner of courage'],
  Romantic: ['a letter that glowed', 'a moonlit dance', 'a borrowed umbrella of fate', 'two hearts synced by starlight'],
  Horror: ['a shadow that blinked', 'a door that breathed', 'whispers under the floorboards', 'a grin in the dark'],
  Mystery: ['a clue in plain sight', 'a locked box with a pulse', 'a map drawn in ink that moved', 'a question that refused to be solved'],
  Fantasy: ['a rune waking up', "a dragon's tea time", 'a wand choosing its owner', 'a spell that sang'],
  'Sci-Fi': ['a glitch with manners', 'a message from tomorrow', 'a hologram with opinions', 'a ship that purrs'],
  Adventure: ['a daring leap', 'a secret trail', 'a storm-sized challenge', 'a treasure that giggled'],
  Inspirational: ['a promise spoken to the sky', 'a small act that echoed', 'a sunrise vow', 'a brave choice reborn'],
  Comedy: ['a banana-shaped comet', 'an accidental prank war', 'a robot who told jokes', 'a mispronounced spell'],
};

export const DIALOGUE_SNIPPETS = {
  default: [
    '“Don’t worry,” said the {character}, “magic has a sense of timing.”',
    '“We only need one clue,” whispered {character}.',
    '“Adventure is just fear wearing a hat,” joked {character}.',
  ],
  Horror: [
    '“Shh… it can hear footsteps,” warned {character}.',
    '“I saw your silhouette move first,” breathed {character}.',
  ],
  Romantic: [
    '“If this is fate, let it kiss back,” murmured {character}.',
    '“Hold my hand—our story’s already turning pages,” said {character}.',
  ],
  Mystery: [
    '“Every answer leaves a footprint,” noted {character}.',
    '“The truth is hiding where nobody thinks to look,” said {character}.',
  ],
};

export const TITLE_PREFIX = {
  Happy: ['Sunshine', 'Joyful', 'Bright'],
  Sad: ['Quiet', 'Tender', 'Moonlit'],
  Romantic: ['Hearts', 'Kisslight', 'Love-Struck'],
  Horror: ['Midnight', 'Creaking', 'Grin-in-the-Dark'],
  Mystery: ['Hidden', 'Vanishing', 'Question-mark'],
  Fantasy: ['Enchanted', 'Rune', 'Spellbound'],
  'Sci-Fi': ['Neo', 'Quantum', 'Star-Stamped'],
  Adventure: ['Trail', 'Brave', 'Skyward'],
  Inspirational: ['Hope', 'Brave', 'Rise'],
  Comedy: ['Goofy', 'Giggle', 'Oopsie'],
};

