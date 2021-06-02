import { Document, Schema, model, Model } from 'mongoose';
import crypto from 'crypto';

export interface ChatMessage {
  userId: string;
  role: number;
  nickname: string;
  profileImage: string;
  chat: Chat;
}

interface ChatDocument extends Document {
  id: string;
  timestamp: Date;
  server: string;
  userId: string;
  ip: string;
  role: number;
  nickname: string;
  profileImage: string;
  chat: Chat;
}

interface ChatModel extends Model<ChatDocument> {
  add(
    userId: string,
    ip: string,
    role: number,
    nickname: string,
    profileImage: string,
    chat: Chat
  ): Promise<ChatDocument>;
  load(): Promise<ChatMessage[]>;
  updateProfile(
    userId: string,
    nickname: string,
    profileImage: string,
    role: number
  ): Promise<void>;
}

const ChatSchema = new Schema<ChatDocument>({
  id: {
    type: String,
    unique: true,
    required: true,
    default: () => crypto.randomBytes(8).toString('hex'),
  },
  timestamp: { type: Date, required: true, default: () => new Date() },
  server: { type: String, required: true },
  userId: { type: String, required: true },
  ip: { type: String, required: true },
  role: { type: Number, required: true },
  nickname: { type: String, required: true },
  profileImage: { type: String, required: true },
  chat: { type: Object, required: true },
});

ChatSchema.static(
  'add',
  async (
    userId: string,
    ip: string,
    role: number,
    nickname: string,
    profileImage: string,
    chat: Chat
  ): Promise<ChatDocument> => {
    ip = ip || '#';
    const model = new ChatModel({
      userId,
      ip,
      role,
      nickname,
      profileImage,
      chat,
      server: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    });
    await model.save();
    return model;
  }
);

ChatSchema.static('load', async (): Promise<ChatMessage[]> => {
  const result: ChatMessage[] = [];
  const chats = await ChatModel.find().sort({ timestamp: -1 }).limit(500);
  for (const chat of chats) {
    if (process.env.NODE_ENV !== 'development' && chat.server === 'development') continue;
    result.push({
      userId: chat.userId,
      role: chat.role,
      nickname: chat.nickname,
      profileImage: chat.profileImage,
      chat: chat.chat,
    });
  }
  return result.reverse();
});

ChatSchema.static(
  'updateProfile',
  async (userId: string, nickname: string, profileImage: string, role: number) => {
    const chats = await ChatModel.find({ userId });
    for (const chat of chats) {
      chat.nickname = nickname;
      chat.profileImage = profileImage;
      chat.role = role;
      chat.save();
    }
  }
);

const ChatModel = model<ChatDocument, ChatModel>('chat', ChatSchema);
export default ChatModel;
