import connectDB from '@/lib/db/mongodb';
import { createPasswordResetUrl, generateVerificationToken, sendPasswordResetEmail } from '@/lib/email-service';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent a password reset link.',
      }, { status: 200 });
    }

    // Check if user is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email address first before resetting your password.' },
        { status: 400 }
      );
    }

    // Generate password reset token
    const resetToken = generateVerificationToken();
    const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with reset token
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send password reset email
    const resetUrl = createPasswordResetUrl(resetToken);
    const emailSent = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Password reset email sent successfully! Please check your inbox.',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 