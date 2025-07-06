import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user with this token that hasn't expired
    const user = await User.findOne({
      emailVerificationToken: token,
      tokenExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +tokenExpires');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user verification status
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.tokenExpires = undefined;
    await user.save();

    // Return user data without JWT token - user needs to login manually
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      type: 'regular',
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      message: 'Email verified successfully! Please login to continue.',
      user: userData,
      verified: true,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for email verification links
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with this token that hasn't expired
    const user = await User.findOne({
      emailVerificationToken: token,
      tokenExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +tokenExpires');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified', verified: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Token is valid', 
        verified: false,
        user: {
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Email verification check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 