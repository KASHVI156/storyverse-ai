import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, minlength: 5, maxlength: 2000 },
  },
  { timestamps: true }
);

export const Contact = mongoose.model('Contact', ContactSchema);

