export interface BaseQuestion {
  question: string;
  task: string;
  hints: string[];
}

export interface TestQuestion extends BaseQuestion {
  difficulty: 'Kolay' | 'Orta' | 'Zor';
}

export interface LevelQuestion extends BaseQuestion {
  level: number;
} 