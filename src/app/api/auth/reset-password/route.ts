import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    user.password = password; // This will be hashed by the pre-save hook
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return NextResponse.json({
      message: 'Password reset successfully! You can now log in with your new password.',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests to verify reset token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Token is valid', 
        valid: true,
        user: {
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Reset password token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 