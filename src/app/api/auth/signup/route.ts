import connectDB from '@/lib/db/mongodb';
import { createVerificationUrl, generateVerificationToken, sendVerificationEmail } from '@/lib/email-service';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      // If user exists and is already verified, return error
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: 'User with this email already exists and is verified' },
          { status: 409 }
        );
      }
      
      // If user exists but is not verified, allow re-signup (update info and resend verification)
      const verificationToken = generateVerificationToken();
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      // Update existing user with new info and new verification token
      existingUser.name = name.trim();
      existingUser.password = password; // This will be hashed by the pre-save hook
      existingUser.emailVerificationToken = verificationToken;
      existingUser.tokenExpires = tokenExpires;
      
      await existingUser.save();
      
      // Send verification email
      const verificationUrl = createVerificationUrl(verificationToken);
      const emailSent = await sendVerificationEmail({
        to: existingUser.email,
        name: existingUser.name,
        verificationUrl
      });

      if (!emailSent) {
        return NextResponse.json(
          { error: 'Failed to send verification email' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Account updated. Please check your email to verify your account before logging in.',
        emailSent: true,
        requiresVerification: true
      }, { status: 200 });
    }

    // Create new user
    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      tokenExpires: tokenExpires,
    });

    await user.save();

    // Send verification email
    const verificationUrl = createVerificationUrl(verificationToken);
    const emailSent = await sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'User created but failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Account created successfully! Please check your email to verify your account before logging in.',
      emailSent: true,
      requiresVerification: true
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 