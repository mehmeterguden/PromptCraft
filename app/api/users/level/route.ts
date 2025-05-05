import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { username, newLevel } = body;

    if (!username || !newLevel) {
      return NextResponse.json(
        { error: 'Username and newLevel are required' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul ve seviyesini güncelle
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Seviyeyi güncelle
    user.currentLevel = newLevel;
    
    // Tamamlanan seviyeleri güncelle
    if (!user.completedLevels.includes(newLevel - 1)) {
      user.completedLevels.push(newLevel - 1);
    }

    // Değişiklikleri kaydet
    await user.save();

    return NextResponse.json({
      message: 'User level updated successfully',
      user: {
        username: user.username,
        currentLevel: user.currentLevel,
        score: user.score,
        completedLevels: user.completedLevels
      }
    });
  } catch (error) {
    console.error('Error updating user level:', error);
    return NextResponse.json(
      { error: 'Failed to update user level' },
      { status: 500 }
    );
  }
} 