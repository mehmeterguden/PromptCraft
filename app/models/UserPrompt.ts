import mongoose from 'mongoose';

export interface IUserPrompt {
  username: string;
  level: number;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserPromptSchema = new mongoose.Schema<IUserPrompt>({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    trim: true,
  },
  level: {
    type: Number,
    required: [true, 'Level number is required']
  },
  prompt: {
    type: String,
    required: [true, 'Prompt text is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for username and level to ensure uniqueness
UserPromptSchema.index({ username: 1, level: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
UserPromptSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const UserPrompt = mongoose.models.UserPrompt || mongoose.model<IUserPrompt>('UserPrompt', UserPromptSchema);
export default UserPrompt; 