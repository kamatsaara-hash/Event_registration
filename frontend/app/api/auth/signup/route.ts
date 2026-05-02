import { NextRequest, NextResponse } from 'next/server';

// Mock user storage (in production, use a real database)
const users: Map<string, {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  password: string;
  emailVerified: boolean;
  createdAt: Date;
}> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, college, password } = body;

    // Validation
    if (!fullName || !email || !phone || !college || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.has(email)) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user (in production, hash password and use real DB)
    const userId = `user_${Date.now()}`;
    const user = {
      id: userId,
      fullName,
      email,
      phone,
      college,
      password, // In production: hash with bcrypt
      emailVerified: false,
      createdAt: new Date(),
    };

    users.set(email, user);

    // Generate mock token
    const token = Buffer.from(JSON.stringify({ userId, email })).toString('base64');

    // Return success response
    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: userId,
        fullName,
        email,
        phone,
        college,
        emailVerified: false,
      },
      token,
    });
  } catch (error) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
