import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { username, currentLevel, score, completedLevel } = await req.json();

    const updateData: { currentLevel?: number; score?: number; $push?: { completedLevels: number } } = {};
    if (currentLevel) updateData.currentLevel = currentLevel;
    if (score !== undefined) updateData.score = score;
    
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    if (completedLevel && !user.completedLevels.includes(completedLevel)) {
      updateData.$push = { completedLevels: completedLevel };
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 