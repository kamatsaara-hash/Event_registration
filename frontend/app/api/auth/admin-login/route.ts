import { NextRequest, NextResponse } from 'next/server';

// Demo admin credentials
const DEMO_ADMIN = {
  email: 'admin@example.com',
  password: 'admin123',
};

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

    // For demo, accept demo credentials or any admin login
    const isValidAdmin = email === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
    
    // Allow demo access
    if (!isValidAdmin && password !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid admin credentials. Use admin@example.com / admin123' },
        { status: 401 }
      );
    }

    // Generate admin token
    const token = Buffer.from(JSON.stringify({ 
      userId: 'admin_1', 
      email,
      role: 'admin' 
    })).toString('base64');

    return NextResponse.json({
      message: 'Admin login successful',
      user: {
        id: 'admin_1',
        fullName: 'Administrator',
        email,
        role: 'admin',
      },
      token,
    });
  } catch (error) {
    console.error('[v0] Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
