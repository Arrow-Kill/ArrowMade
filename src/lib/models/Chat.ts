import mongoose from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChat extends mongoose.Document {
  chatId: string;
  userId: string;
  userType: 'regular' | 'google';
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema = new mongoose.Schema<IChat>({
  chatId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  userType: {
    type: String,
    enum: ['regular', 'google'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  messages: [MessageSchema]
}, {
  timestamps: true
});

// Create compound index for efficient queries
ChatSchema.index({ userId: 1, userType: 1, updatedAt: -1 });

// Prevent re-compilation during development
export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema); 