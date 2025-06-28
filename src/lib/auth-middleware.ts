import { NextRequest, NextResponse } from 'next/server';
import connectDB from './db/mongodb';
import { getTokenFromRequest, verifyToken } from './jwt';
import GoogleUser from './models/GoogleUser';
import User from './models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    name: string;
    email: string;
    type: 'regular' | 'google';
  };
}

export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<Response>
): Promise<Response> {
  try {
    await connectDB();

    // Get token from request
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user based on type
    let user;
    if (payload.type === 'google') {
      user = await GoogleUser.findById(payload.userId);
    } else {
      user = await User.findById(payload.userId);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Add user to request
    (request as AuthenticatedRequest).user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      type: payload.type,
    };

    // Call the handler with authenticated request
    return handler(request as AuthenticatedRequest);

  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 