import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

interface LevelInput {
  level: number;
  userInput: string;
}

// Get user's input for a specific level
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    const level = searchParams.get('level');

    if (!username || !level) {
      return NextResponse.json(
        { error: 'Username and level are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const levelInput = user.levelInputs?.find(
      (input) => input.level === parseInt(level)
    );

    return NextResponse.json({ userInput: levelInput?.userInput || '' });
  } catch (error) {
    console.error('Error fetching level input:', error);
    return NextResponse.json(
      { error: 'Failed to fetch level input' },
      { status: 500 }
    );
  }
}

// Save or update user's input for a level
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/level-inputs called');
    await connectDB();
    console.log('Connected to MongoDB');
    
    const body = await request.json();
    console.log('Request body:', body);
    const { username, level, userInput } = body;

    if (!username || level === undefined || !userInput) {
      console.log('Missing required fields:', { username, level, userInput });
      return NextResponse.json(
        { error: 'Username, level, and userInput are required' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Mevcut input'u bul
    const existingInputIndex = user.levelInputs.findIndex(
      input => input.level === level
    );

    if (existingInputIndex !== -1) {
      // Mevcut input'u güncelle
      user.levelInputs[existingInputIndex].userInput = userInput;
    } else {
      // Yeni input ekle
      user.levelInputs.push({ level, userInput });
    }

    // Değişiklikleri kaydet
    await user.save();

    return NextResponse.json({ 
      message: 'Level input saved successfully',
      levelInputs: user.levelInputs 
    });
  } catch (error) {
    console.error('Error saving level input:', error);
    return NextResponse.json(
      { error: 'Failed to save level input' },
      { status: 500 }
    );
  }
}

// Delete user's input for a level
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    const level = searchParams.get('level');

    if (!username || !level) {
      return NextResponse.json(
        { error: 'Username and level are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // levelInputs dizisinden ilgili input'u kaldır
    user.levelInputs = user.levelInputs.filter(
      input => input.level !== parseInt(level)
    );

    // Değişiklikleri kaydet
    await user.save();

    return NextResponse.json({ 
      message: 'Level input deleted successfully',
      levelInputs: user.levelInputs
    });
  } catch (error) {
    console.error('Error deleting level input:', error);
    return NextResponse.json(
      { error: 'Failed to delete level input' },
      { status: 500 }
    );
  }
} 