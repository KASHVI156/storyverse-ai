import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    title: { type: String, required: true },
    mood: { type: String, required: true },
    location: { type: String, required: true },
    text: { type: String, required: true },
    isAdventure: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

export const Story = mongoose.model('Story', StorySchema);

