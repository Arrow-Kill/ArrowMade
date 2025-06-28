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

export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      await connectDB();
      
      // Parse the request body
      const body = await request.json();
      const { messages, chatId } = body;

      // Validate the messages
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json(
          { error: 'Messages array is required and cannot be empty' },
          { status: 400 }
        );
      }

      // Validate chatId
      if (!chatId) {
        return NextResponse.json(
          { error: 'Chat ID is required' },
          { status: 400 }
        );
      }

      // Check if API key is configured
      if (!process.env.NEXT_PUBLIC_DEEP_AI_KEY) {
        return NextResponse.json(
          { error: 'API key not configured' },
          { status: 500 }
        );
      }

      // Find the chat and verify ownership
      const chat = await Chat.findOne({
        chatId: chatId,
        userId: req.user!.id,
        userType: req.user!.type
      });

      if (!chat) {
        return NextResponse.json(
          { error: 'Chat not found or access denied' },
          { status: 404 }
        );
      }

      // Function to generate chat title from first message
      const generateChatTitle = (firstMessage: string): string => {
        // Remove extra whitespace and limit length
        let title = firstMessage.trim();
        
        // If message is too long, take first part and add ellipsis
        if (title.length > 50) {
          title = title.substring(0, 47) + '...';
        }
        
        // Remove line breaks and extra spaces
        title = title.replace(/\s+/g, ' ');
        
        // If title is too short or generic, provide a default
        if (title.length < 3 || title.toLowerCase().includes('hello') && title.length < 10) {
          title = 'New Conversation';
        }
        
        return title;
      };

      // Create a ReadableStream for the streaming response
      const stream = new ReadableStream({
        async start(controller) {
          let assistantResponse = '';
          
          try {
            // Call OpenRouter API with streaming enabled
            const completion = await openai.chat.completions.create({
              model: 'openai/gpt-4o',
              messages: messages,
              max_tokens: 1000,
              temperature: 0.7,
              stream: true,
            });

            // Process the stream
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content;
              
              if (content) {
                assistantResponse += content;
                
                // Send the chunk as Server-Sent Event
                const sseData = `data: ${JSON.stringify({ 
                  type: 'content', 
                  content: content 
                })}\n\n`;
                
                controller.enqueue(new TextEncoder().encode(sseData));
              }
              
              // Check if the stream is done
              if (chunk.choices[0]?.finish_reason) {
                // Save the conversation to the database
                try {
                  const userMessage = messages[messages.length - 1];
                  
                  // Check if this is the first or second user message to update title
                  const isFirstOrSecondMessage = chat.messages.length <= 2;
                  let updateQuery: any = {
                    $push: {
                      messages: {
                        $each: [
                          {
                            role: 'user',
                            content: userMessage.content,
                            timestamp: new Date()
                          },
                          {
                            role: 'assistant',
                            content: assistantResponse,
                            timestamp: new Date()
                          }
                        ]
                      }
                    }
                  };

                  // Update title if this is one of the first messages
                  if (isFirstOrSecondMessage && (chat.title === 'New Chat' || chat.title.startsWith('New'))) {
                    const newTitle = generateChatTitle(userMessage.content);
                    updateQuery.$set = { title: newTitle };
                  }
                  
                  await Chat.findOneAndUpdate(
                    {
                      chatId: chatId,
                      userId: req.user!.id,
                      userType: req.user!.type
                    },
                    updateQuery
                  );
                } catch (saveError) {
                  console.error('Error saving chat messages:', saveError);
                }

                const sseData = `data: ${JSON.stringify({ 
                  type: 'done',
                  finish_reason: chunk.choices[0].finish_reason
                })}\n\n`;
                
                controller.enqueue(new TextEncoder().encode(sseData));
                break;
              }
            }
          } catch (error: any) {
            console.error('Streaming error:', error);
            
            // Send error through the stream
            const errorData = `data: ${JSON.stringify({ 
              type: 'error', 
              error: error.message || 'An error occurred during streaming'
            })}\n\n`;
            
            controller.enqueue(new TextEncoder().encode(errorData));
          } finally {
            controller.close();
          }
        },
      });

      // Return the streaming response
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrowkill.com' : '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      });

    } catch (error: any) {
      console.error('Chat API Error:', error);

      // Handle different types of errors
      if (error.code === 'insufficient_quota') {
        return NextResponse.json(
          { error: 'API quota exceeded. Please check your billing.' },
          { status: 429 }
        );
      }

      if (error.code === 'invalid_api_key') {
        return NextResponse.json(
          { error: 'Invalid API key configuration.' },
          { status: 401 }
        );
      }

      if (error.code === 'model_not_found') {
        return NextResponse.json(
          { error: 'AI model not available.' },
          { status: 404 }
        );
      }

      // Generic error response
      return NextResponse.json(
        { 
          error: error.message || 'An unexpected error occurred',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }
  });
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrowkill.com' : '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send messages.' },
    { status: 405 }
  );
} 