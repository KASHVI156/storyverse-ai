import dotenv from 'dotenv';
import { connectMongo } from '../lib/mongo.js';
import { Story } from '../models/Story.js';
import { User } from '../models/User.js';
import { AdventureStory } from '../models/AdventureStory.js';
import { Contact } from '../models/Contact.js';
import { Favorite } from '../models/Favorite.js';
import { hashPassword } from '../services/password.service.js';

dotenv.config();

const seedUserEmail = process.env.SEED_USER_EMAIL || 'demo@storyverse.ai';

async function main() {
  await connectMongo();

  await Promise.all([
    Story.deleteMany({}),
    AdventureStory.deleteMany({}),
    Contact.deleteMany({}),
    Favorite.deleteMany({}),
    User.deleteMany({ email: seedUserEmail }),
  ]);

  const demoUser = await User.create({
    username: 'DemoUser',
    email: seedUserEmail,
    passwordHash: await hashPassword(process.env.SEED_USER_PASSWORD || 'demo1234'),
    preferences: { theme: { darkMode: false }, lastMood: 'Happy', lastLocation: 'Forest' },
  });

  // Seed a few example stories (so history UI has something)
  const examples = [
    {
      userId: demoUser._id,
      title: 'Sunshine Forest & Ferns',
      mood: 'Happy',
      location: 'Forest',
      text: 'In the Forest, Sunny found a path painted with giggles. It began with a friendly sparkle, right when Sunny noticed Ferns moving like a secret. “Don’t worry,” said the Sunny, “magic has a sense of timing.” Together, they stepped deeper into the Forest, trusting the odd, beautiful logic of stories. By sunrise, Sunny had turned one ordinary moment into a joyful legend.',
      isAdventure: false,
    },
    {
      userId: demoUser._id,
      title: 'Midnight Haunted House & Candle Ghost',
      mood: 'Horror',
      location: 'Haunted House',
      text: 'In the Haunted House, Whispering Warden heard the air change its mind. It began with a shadow that blinked, right when Whispering Warden noticed Candle Ghost moving like a secret. “Shh… it can hear footsteps,” warned Whispering Warden. Together, they stepped deeper into the Haunted House, trusting the odd, beautiful logic of stories. The Haunted House exhaled one last time, and Whispering Warden learned what fear can’t erase.',
      isAdventure: false,
    },
  ];

  await Story.insertMany(examples);

  console.log('Seed complete');
  console.log('Demo login:', { email: seedUserEmail, password: process.env.SEED_USER_PASSWORD || 'demo1234' });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

