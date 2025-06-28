import { AuthenticatedRequest, withAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/db/mongodb';
import Chat from '@/lib/models/Chat';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all chats for the authenticated user
export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      await connectDB();

      const chats = await Chat.find({
        userId: req.user!.id,
        userType: req.user!.type
      })
      .select('chatId title createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(50); // Limit to 50 most recent chats

      return NextResponse.json({
        chats: chats.map(chat => ({
          chatId: chat.chatId,
          title: chat.title,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        }))
      });

    } catch (error: any) {
      console.error('Get chats error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch chats' },
        { status: 500 }
      );
    }
  });
}

// POST - Create a new chat
export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      await connectDB();

      const { title } = await request.json();

      if (!title || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Chat title is required' },
          { status: 400 }
        );
      }

      const chatId = randomUUID(); // Generate a unique chat ID

      const newChat = new Chat({
        chatId,
        userId: req.user!.id,
        userType: req.user!.type,
        title: title.trim(),
        messages: []
      });

      await newChat.save();

      return NextResponse.json({
        chatId: newChat.chatId,
        title: newChat.title,
        createdAt: newChat.createdAt,
        updatedAt: newChat.updatedAt
      }, { status: 201 });

    } catch (error: any) {
      console.error('Create chat error:', error);
      return NextResponse.json(
        { error: 'Failed to create chat' },
        { status: 500 }
      );
    }
  });
} 