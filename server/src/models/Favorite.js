import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    storyId: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'Story' },
    mood: { type: String, default: '' },
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Favorite = mongoose.model('Favorite', FavoriteSchema);

