import mongoose from 'mongoose';

export interface IUser {
  username: string;
  score: number;
  currentLevel: number;
  completedLevels: number[];
}

const UserSchema = new mongoose.Schema<IUser>({
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
  }
});

// Model zaten varsa onu kullan, yoksa yeni model oluştur
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User; 