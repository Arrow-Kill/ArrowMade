import { AuthenticatedRequest, withAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/db/mongodb';
import Chat from '@/lib/models/Chat';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.NEXT_PUBLIC_DEEP_AI_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'VisionChat AI',
  },
});

interface RouteParams {
  chatId: string;
}

// Function to generate chat title using AI analysis
const generateChatTitleWithAI = async (conversationMessages: Array<{role: string, content: string}>): Promise<string> => {
  try {
    // Take only user messages for title generation
    const userMessages = conversationMessages
      .filter(msg => msg.role === 'user')
      .slice(0, 2) // Only first 2 user messages
      .map(msg => msg.content)
      .join('\n\n');

    if (!userMessages.trim()) {
      return 'New Conversation';
    }

    // Create a concise prompt for title generation
    const titlePrompt = [
      {
        role: 'system' as const,
        content: `You are a helpful assistant that creates concise, descriptive titles for conversations. 
        
        Rules:
        - Generate a short, descriptive title (2-6 words max)
        - Focus on the main topic or question
        - Be specific but concise
        - Don't include generic words like "chat", "conversation", "question"
        - Use title case
        - If it's a coding question, mention the language/technology
        - If it's a general question, capture the essence
        
        Examples:
        - "How to center a div in CSS" → "CSS Div Centering"
        - "What is machine learning?" → "Machine Learning Basics"
        - "Recipe for chocolate cake" → "Chocolate Cake Recipe"
        - "Debug Python error" → "Python Debugging Help"
        
        Respond with ONLY the title, nothing else.`
      },
      {
        role: 'user' as const,
        content: `Generate a title for this conversation:\n\n${userMessages}`
      }
    ];

    const titleCompletion = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini', // Use cheaper model for title generation
      messages: titlePrompt,
      max_tokens: 20,
      temperature: 0.3,
      stream: false,
    });

    const generatedTitle = titleCompletion.choices[0]?.message?.content?.trim();
    
    if (generatedTitle && generatedTitle.length > 0 && generatedTitle.length <= 60) {
      return generatedTitle;
    } else {
      // Fallback to simple extraction if AI fails
      return generateSimpleTitle(userMessages);
    }
    
  } catch (error) {
    console.error('Error generating AI title:', error);
    // Fallback to simple title generation
    return generateSimpleTitle(conversationMessages[0]?.content || 'New Conversation');
  }
};

// Fallback function for simple title generation
const generateSimpleTitle = (firstMessage: string): string => {
  let title = firstMessage.trim();
  
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  
  title = title.replace(/\s+/g, ' ');
  
  if (title.length < 3 || title.toLowerCase().includes('hello') && title.length < 10) {
    title = 'New Conversation';
  }
  
  return title;
};

// POST - Regenerate chat title using AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      await connectDB();
      const resolvedParams = await params;

      // Check if API key is configured
      if (!process.env.NEXT_PUBLIC_DEEP_AI_KEY) {
        return NextResponse.json(
          { error: 'AI service not configured' },
          { status: 500 }
        );
      }

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

      if (chat.messages.length === 0) {
        return NextResponse.json(
          { error: 'Cannot generate title for empty chat' },
          { status: 400 }
        );
      }

      // Generate new title using AI
      const newTitle = await generateChatTitleWithAI(chat.messages);

      // Update the chat title
      const updatedChat = await Chat.findOneAndUpdate(
        {
          chatId: resolvedParams.chatId,
          userId: req.user!.id,
          userType: req.user!.type
        },
        { title: newTitle },
        { new: true }
      );

      return NextResponse.json({
        chatId: updatedChat!.chatId,
        title: updatedChat!.title,
        updatedAt: updatedChat!.updatedAt
      });

    } catch (error: any) {
      console.error('Regenerate title error:', error);
      
      // Handle specific AI API errors
      if (error.code === 'insufficient_quota') {
        return NextResponse.json(
          { error: 'AI service quota exceeded' },
          { status: 429 }
        );
      }

      if (error.code === 'invalid_api_key') {
        return NextResponse.json(
          { error: 'AI service configuration error' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to regenerate chat title' },
        { status: 500 }
      );
    }
  });
} 