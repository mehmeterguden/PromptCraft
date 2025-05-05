import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

interface LevelInput {
  level: number;
  userInput: string;
  evaluation?: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
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

// Prompt değerlendirme fonksiyonu
function evaluatePrompt(userInput: string) {
  // Burada gerçek bir AI değerlendirmesi yapılabilir
  // Şimdilik örnek bir değerlendirme döndürüyoruz
  const score = Math.floor(Math.random() * 41) + 60; // 60-100 arası rastgele puan
  
  const feedbacks = [
    "Prompt'unuz temel gereksinimleri karşılıyor ancak geliştirilebilir.",
    "İyi bir başlangıç! Daha spesifik yönergeler ekleyebilirsiniz.",
    "Prompt'unuz açık ve anlaşılır, ancak daha detaylı olabilir.",
    "Güzel bir prompt! Birkaç küçük iyileştirme ile mükemmel olabilir."
  ];

  const allSuggestions = [
    "Daha spesifik çıktı formatları tanımlayın",
    "Edge case'leri (sınır durumları) belirtin",
    "Kullanıcı etkileşimini daha detaylı açıklayın",
    "Hata durumlarını nasıl ele alacağınızı belirtin",
    "Prompt'a örnek kullanım senaryoları ekleyin",
    "Sistem kısıtlamalarını belirtin"
  ];

  // Rastgele 2-3 öneri seç
  const suggestionCount = Math.floor(Math.random() * 2) + 2;
  const shuffledSuggestions = [...allSuggestions].sort(() => Math.random() - 0.5);
  const suggestions = shuffledSuggestions.slice(0, suggestionCount);

  return {
    score,
    feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)],
    suggestions
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
    const { username, level, userInput } = body;

    console.log('Request body:', body);

    if (!username || !level || !userInput) {
      return NextResponse.json(
        { error: 'Username, level, and userInput are required' },
        { status: 400 }
      );
    }

    // Evaluate the prompt first
    const evaluation = evaluatePrompt(userInput);
    console.log('Evaluation result:', evaluation);

    const levelNumber = parseInt(level);

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
      (input: LevelInput) => input.level === levelNumber
    );

    // Yeni level input objesi - evaluation verilerini direkt içine yerleştiriyoruz
    const newLevelInput = {
      level: levelNumber,
      userInput: userInput,
      score: evaluation.score,
      feedback: evaluation.feedback,
      suggestions: evaluation.suggestions
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
    if (evaluation.score >= 70 && levelNumber === user.currentLevel) {
      user.currentLevel = levelNumber + 1;
      if (!user.completedLevels.includes(levelNumber)) {
        user.completedLevels.push(levelNumber);
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

// Delete user's prompt
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
    user.levelInputs = user.levelInputs.filter((input: LevelInput) => input.level !== parseInt(level));
    await user.save();

    return NextResponse.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
} 