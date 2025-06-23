import { AuthenticatedRequest, withAuth } from '@/lib/auth-middleware';
import Chat from '@/lib/models/Chat';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  chatId: string;
}

// GET - Get a specific chat with messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      await connectDB();
      const resolvedParams = await params;

      const chat = await Chat.findOne({
        chatId: resolvedParams.chatId,
        userId: req.user!.id,
        userType: req.user!.type
      });

      if (!chat) {
        return NextResponse.json(
          { error: 'Chat not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        chatId: chat.chatId,
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      });

    } catch (error: any) {
      console.error('Get chat error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch chat' },
        { status: 500 }
      );
    }
  });
}

// PUT - Update chat title
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      await connectDB();
      const resolvedParams = await params;

      const { title } = await request.json();

      if (!title || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Chat title is required' },
          { status: 400 }
        );
      }

      const chat = await Chat.findOneAndUpdate(
        {
          chatId: resolvedParams.chatId,
          userId: req.user!.id,
          userType: req.user!.type
        },
        { title: title.trim() },
        { new: true }
      );

      if (!chat) {
        return NextResponse.json(
          { error: 'Chat not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        chatId: chat.chatId,
        title: chat.title,
        updatedAt: chat.updatedAt
      });

    } catch (error: any) {
      console.error('Update chat error:', error);
      return NextResponse.json(
        { error: 'Failed to update chat' },
        { status: 500 }
      );
    }
  });
}

// DELETE - Delete a chat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      await connectDB();
      const resolvedParams = await params;

      const chat = await Chat.findOneAndDelete({
        chatId: resolvedParams.chatId,
        userId: req.user!.id,
        userType: req.user!.type
      });

      if (!chat) {
        return NextResponse.json(
          { error: 'Chat not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'Chat deleted successfully'
      });

    } catch (error: any) {
      console.error('Delete chat error:', error);
      return NextResponse.json(
        { error: 'Failed to delete chat' },
        { status: 500 }
      );
    }
  });
} 