import mongoose from 'mongoose';

export interface IGoogleUser extends mongoose.Document {
  googleId: string;
  name: string;
  email: string;
  avatar: string;
  verified: boolean;
  locale?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GoogleUserSchema = new mongoose.Schema<IGoogleUser>({
  googleId: {
    type: String,
    required: [true, 'Google ID is required'],
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  avatar: {
    type: String,
    required: [true, 'Avatar is required']
  },
  verified: {
    type: Boolean,
    default: true // Google accounts are pre-verified
  },
  locale: {
    type: String,
    default: 'en'
  }
}, {
  timestamps: true,
  collection: 'googleusers' // Different collection name
});

// Create indexes for better performance
GoogleUserSchema.index({ googleId: 1 });
GoogleUserSchema.index({ email: 1 });

// Prevent re-compilation during development
export default mongoose.models.GoogleUser || mongoose.model<IGoogleUser>('GoogleUser', GoogleUserSchema); 