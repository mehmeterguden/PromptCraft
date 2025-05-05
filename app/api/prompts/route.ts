import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

interface LevelInput {
  level: number;
  userInput: string;
  score?: number;
  feedback?: string;
  suggestions?: string[];
}

interface LevelPrompt {
  level: number;
  prompt: string;
  evaluation?: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
}

// Get user's prompt for a specific level
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

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const levelInput = user.levelInputs.find((input: LevelInput) => input.level === parseInt(level));
    if (!levelInput) {
      return NextResponse.json(
        { message: 'No prompt found for this level' },
        { status: 404 }
      );
    }

    console.log('Found level input:', levelInput);
    return NextResponse.json({
      message: 'Prompt fetched successfully',
      levelInput: {
        level: parseInt(level),
        userInput: levelInput.userInput,
        score: levelInput.score || null,
        feedback: levelInput.feedback || null,
        suggestions: levelInput.suggestions || []
      }
    });
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
}

// Save or update user's prompt
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { username, level, userInput, score, feedback, suggestions } = body;

    console.log('Request body:', body);

    if (!username || !level || !userInput) {
      return NextResponse.json(
        { error: 'Username, level, and userInput are required' },
        { status: 400 }
      );
    }

    // Find the user first
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the index of existing level input
    const existingInputIndex = user.levelInputs.findIndex(
      (input: LevelInput) => input.level === level
    );

    // Yeni level input objesi
    const newLevelInput = {
      level,
      userInput,
      score,
      feedback,
      suggestions
    };

    if (existingInputIndex !== -1) {
      // Update existing level input
      user.levelInputs[existingInputIndex] = newLevelInput;
    } else {
      // Add new level input
      user.levelInputs.push(newLevelInput);
    }

    // Eğer kullanıcı 70 veya üzeri puan aldıysa ve bu seviye şu anki seviyesiyse
    // bir sonraki seviyeye geç
    let levelCompleted = false;
    if (score >= 70 && level === user.currentLevel) {
      user.currentLevel = level + 1;
      if (!user.completedLevels.includes(level)) {
        user.completedLevels.push(level);
      }
      levelCompleted = true;
    }

    // Save the changes
    await user.save();

    return NextResponse.json({
      message: existingInputIndex !== -1 ? 'Prompt updated successfully' : 'Prompt saved successfully',
      levelInput: newLevelInput,
      levelCompleted,
      newLevel: levelCompleted ? user.currentLevel : null
    });

  } catch (error) {
    console.error('Error saving prompt:', error);
    return NextResponse.json(
      { error: 'Failed to save prompt' },
      { status: 500 }
    );
  }
}

// Delete user's prompt for a specific level
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

    // Remove the level input
    user.levelInputs = user.levelInputs.filter(
      (input: LevelInput) => input.level !== parseInt(level)
    );

    await user.save();

    return NextResponse.json({
      message: 'Prompt deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
} 