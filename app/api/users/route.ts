import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      username,
      currentLevel: 1,
      completedLevels: [1], // Test için level 1'i tamamlanmış olarak işaretliyoruz
      levelInputs: []
    });

    await user.save();

    return NextResponse.json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Kullanıcı adı parametresi gerekli' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });
    return NextResponse.json({
      exists: !!user,
      user: user ? {
        username: user.username,
        score: user.score,
        currentLevel: user.currentLevel,
        completedLevels: user.completedLevels
      } : null
    });
  } catch (error) {
    console.error('User query error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı sorgulanırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 