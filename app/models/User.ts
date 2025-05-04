import mongoose from 'mongoose';

const LevelInputSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true
  },
  userInput: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  feedback: {
    type: String,
    default: null
  },
  suggestions: {
    type: [String],
    default: []
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Kullanıcı adı zorunludur'],
    unique: true,
    trim: true,
    minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır'],
    match: [/^[a-zA-Z0-9]+$/, 'Kullanıcı adı sadece harf ve rakam içerebilir']
  },
  score: { 
    type: Number, 
    default: 0 
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  completedLevels: {
    type: [Number],
    default: []
  },
  levelInputs: {
    type: [LevelInputSchema],
    default: []
  }
});

// Yeni bir kullanıcı oluşturulduğunda levelInputs'u başlat
UserSchema.pre('save', function(next) {
  if (!this.levelInputs) {
    this.levelInputs = new mongoose.Types.DocumentArray([]);
  }
  next();
});

export interface IUser extends mongoose.Document {
  username: string;
  score: number;
  currentLevel: number;
  completedLevels: number[];
  levelInputs: Array<{
    level: number;
    userInput: string;
    score?: number;
    feedback?: string;
    suggestions?: string[];
  }>;
}

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User; 