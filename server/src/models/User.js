import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema(
  {
    darkMode: { type: Boolean, default: false },
  },
  { _id: false }
);

const PreferencesSchema = new mongoose.Schema(
  {
    theme: { type: ThemeSchema, default: () => ({}) },
    lastMood: { type: String, default: 'Happy' },
    lastLocation: { type: String, default: 'Forest' },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 40 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    preferences: { type: PreferencesSchema, default: () => ({}) },
    favoriteMood: { type: String, default: '' },
    favoriteLocation: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    avatarPublicId: { type: String, default: '' },
    avatarStorage: { type: String, enum: ['local', 'cloudinary', ''], default: '' },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);

