import { signToken } from '@/lib/jwt';
import GoogleUser from '@/lib/models/GoogleUser';
import connectDB from '@/lib/mongodb';
import { OAuth2Client } from 'google-auth-library';
import { NextRequest, NextResponse } from 'next/server';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: 'Google credential is required' },
        { status: 400 }
      );
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid Google token' },
        { status: 401 }
      );
    }

    const { sub: googleId, name, email, picture, email_verified, locale } = payload;

    if (!email_verified) {
      return NextResponse.json(
        { error: 'Google email not verified' },
        { status: 401 }
      );
    }

    // Check if user already exists
    let user = await GoogleUser.findOne({ googleId });

    if (user) {
      // Update existing user's information
      user.name = name || user.name;
      user.email = email || user.email;
      user.avatar = picture || user.avatar;
      user.locale = locale || user.locale;
      await user.save();
    } else {
      // Create new Google user
      user = new GoogleUser({
        googleId,
        name: name || 'Google User',
        email: email!,
        avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=667eea&color=fff`,
        verified: email_verified || false,
        locale: locale || 'en',
      });
      await user.save();
    }

    // Generate JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      type: 'google'
    });

    // Return user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      verified: user.verified,
      type: 'google',
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      message: 'Google authentication successful',
      user: userData,
      token,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Google auth error:', error);
    
    if (error.message?.includes('Token verification failed')) {
      return NextResponse.json(
        { error: 'Invalid Google token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 