export interface Word {
  id: string;
  word: string;
  category: "animals" | "cars";
  difficulty: 1 | 2 | 3;
  imageUrl: string;
  audioUrl?: string;
  hint?: string;
}

export interface GameProgress {
  userId: string;
  completedWords: string[];
  accuracy: Record<string, number>;
  level: number;
  badges: string[];
  lastPlayed: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  isChild: boolean;
  parentId?: string;
  avatarUrl?: string;
  progress?: GameProgress;
}

export interface Challenge {
  id: string;
  wordIds: string[];
  createdBy: string;
  assignedTo: string[];
  completed: boolean;
  createdAt: Date;
}
