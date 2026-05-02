import { NextRequest, NextResponse } from 'next/server';

// Mock users for demo (shared state - in production use a database)
const demoUsers = [
  {
    id: 'user_1',
    fullName: 'Demo User',
    email: 'demo@example.com',
    phone: '+1234567890',
    college: 'Demo University',
    password: 'demo123',
    emailVerified: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user (demo mode - accepts any credentials)
    const user = demoUsers.find(u => u.email === email);
    
    // For demo purposes, allow any login
    const mockUser = user || {
      id: `user_${Date.now()}`,
      fullName: email.split('@')[0],
      email,
      phone: '+1234567890',
      college: 'Demo University',
      emailVerified: true,
    };

    // Generate mock token
    const token = Buffer.from(JSON.stringify({ 
      userId: mockUser.id, 
      email: mockUser.email 
    })).toString('base64');

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: mockUser.id,
        fullName: mockUser.fullName,
        email: mockUser.email,
        phone: mockUser.phone,
        college: mockUser.college,
        emailVerified: mockUser.emailVerified,
      },
      token,
    });
  } catch (error) {
    console.error('[v0] Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
