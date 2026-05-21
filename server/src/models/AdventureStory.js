import mongoose from 'mongoose';

// Stores interactive choice progression metadata (autosave)
const AdventureStorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    mood: { type: String, required: true },
    location: { type: String, required: true },
    stages: {
      type: [
        {
          stageIndex: Number,
          choiceIndex: Number,
          excerpt: String,
        }
      ],
      default: [],
    },
    completed: { type: Boolean, default: false },
    finalStoryId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

export const AdventureStory = mongoose.model('AdventureStory', AdventureStorySchema);

