import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { username, testScore, calculatedLevel } = await req.json();

    if (!username || calculatedLevel === undefined) {
      return NextResponse.json(
        { error: 'Username and calculated level are required' },
        { status: 400 }
      );
    }

    // Seviyeyi belirle (1'den küçükse 1, diğer durumlarda hesaplanan seviye)
    const finalLevel = calculatedLevel < 1 ? 1 : calculatedLevel;
    
    // Tamamlanan levelleri hesapla (mevcut seviyeden bir önceki seviyeye kadar)
    const completedLevels = Array.from(
      { length: finalLevel - 1 },
      (_, i) => i + 1
    );

    // Kullanıcıyı bul veya oluştur
    let user = await User.findOne({ username });
    
    if (!user) {
      // Yeni kullanıcı oluştur
      user = await User.create({
        username,
        score: testScore || 0,
        currentLevel: finalLevel,
        completedLevels
      });
    } else {
      // Mevcut kullanıcıyı güncelle
      user = await User.findOneAndUpdate(
        { username },
        {
          score: testScore || user.score,
          currentLevel: finalLevel,
          completedLevels
        },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        score: user.score,
        currentLevel: user.currentLevel,
        completedLevels: user.completedLevels
      }
    });
  } catch (error) {
    console.error('Test result processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process test result' },
      { status: 500 }
    );
  }
} 