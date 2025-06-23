import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import GoogleUser from '@/lib/models/GoogleUser';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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

    let user;
    let userData;

    // Get user based on type
    if (payload.type === 'google') {
      user = await GoogleUser.findById(payload.userId);
      if (user) {
        userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          verified: user.verified,
          type: 'google',
          createdAt: user.createdAt,
        };
      }
    } else {
      user = await User.findById(payload.userId);
      if (user) {
        userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          type: 'regular',
          createdAt: user.createdAt,
        };
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: userData,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 