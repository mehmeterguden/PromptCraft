import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { username } = await req.json();

    // Kullanıcı adı kontrolü
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı zaten kullanımda' },
        { status: 400 }
      );
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      username,
      score: 0,
      currentLevel: 1,
      completedLevels: []
    });

    // Kullanıcı bilgilerini döndür
    return NextResponse.json({
      username: user.username,
      score: user.score,
      currentLevel: user.currentLevel,
      completedLevels: user.completedLevels
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
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