import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Word, GameProgress, UserProfile } from "@/types/game";
import { words } from "@/data/words";

interface GameContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  gameProgress: GameProgress | null;
  updateProgress: (wordId: string, isCorrect: boolean) => void;
  currentWord: Word | null;
  setCurrentWord: (word: Word | null) => void;
  getNextWord: (
    category: "animals" | "cars",
    difficulty?: number,
  ) => Word | null;
  checkAnswer: (answer: string) => boolean;
  isParentMode: boolean;
  toggleParentMode: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isParentMode, setIsParentMode] = useState(false);

  // Initialize with demo user and progress
  useEffect(() => {
    const demoUser: UserProfile = {
      id: "demo-child",
      name: "Demo Child",
      isChild: true,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-child",
    };

    const demoProgress: GameProgress = {
      userId: demoUser.id,
      completedWords: [],
      accuracy: {},
      level: 1,
      badges: [],
      lastPlayed: new Date(),
    };

    setCurrentUser(demoUser);
    setGameProgress(demoProgress);

    // Load from localStorage if available
    const savedProgress = localStorage.getItem("gameProgress");
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        parsed.lastPlayed = new Date(parsed.lastPlayed);
        setGameProgress(parsed);
      } catch (e) {
        console.error("Failed to parse saved progress", e);
      }
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    if (gameProgress) {
      localStorage.setItem("gameProgress", JSON.stringify(gameProgress));
    }
  }, [gameProgress]);

  const updateProgress = (wordId: string, isCorrect: boolean) => {
    if (!gameProgress || !currentUser) return;

    const newProgress = { ...gameProgress };

    // Update completed words if correct
    if (isCorrect && !newProgress.completedWords.includes(wordId)) {
      newProgress.completedWords.push(wordId);
    }

    // Update accuracy
    if (!newProgress.accuracy[wordId]) {
      newProgress.accuracy[wordId] = isCorrect ? 100 : 0;
    } else {
      // Calculate new accuracy (average of attempts)
      const currentAccuracy = newProgress.accuracy[wordId];
      const attempts =
        newProgress.completedWords.filter((id) => id === wordId).length + 1;
      newProgress.accuracy[wordId] =
        (currentAccuracy * (attempts - 1) + (isCorrect ? 100 : 0)) / attempts;
    }

    // Update level based on completed words
    const totalCompleted = newProgress.completedWords.length;
    if (totalCompleted >= 10) {
      newProgress.level = 3;
    } else if (totalCompleted >= 5) {
      newProgress.level = 2;
    } else {
      newProgress.level = 1;
    }

    // Update last played
    newProgress.lastPlayed = new Date();

    // Check for badges
    if (totalCompleted >= 5 && !newProgress.badges.includes("beginner")) {
      newProgress.badges.push("beginner");
    }
    if (totalCompleted >= 10 && !newProgress.badges.includes("intermediate")) {
      newProgress.badges.push("intermediate");
    }
    if (totalCompleted >= 15 && !newProgress.badges.includes("advanced")) {
      newProgress.badges.push("advanced");
    }

    setGameProgress(newProgress);
  };

  const getNextWord = (
    category: "animals" | "cars",
    difficulty?: number,
  ): Word | null => {
    if (!gameProgress) return null;

    // Filter words by category and difficulty (if provided)
    let availableWords = words.filter((word) => word.category === category);
    if (difficulty) {
      availableWords = availableWords.filter(
        (word) => word.difficulty === difficulty,
      );
    } else {
      // Use current level as difficulty
      availableWords = availableWords.filter(
        (word) => word.difficulty <= gameProgress.level,
      );
    }

    // Prioritize words that haven't been completed yet
    const uncompletedWords = availableWords.filter(
      (word) => !gameProgress.completedWords.includes(word.id),
    );

    if (uncompletedWords.length > 0) {
      // Return a random uncompleted word
      const randomIndex = Math.floor(Math.random() * uncompletedWords.length);
      return uncompletedWords[randomIndex];
    } else if (availableWords.length > 0) {
      // If all words have been completed, return a random word
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      return availableWords[randomIndex];
    }

    return null;
  };

  const checkAnswer = (answer: string): boolean => {
    if (!currentWord) return false;
    return answer.toLowerCase() === currentWord.word.toLowerCase();
  };

  const toggleParentMode = () => {
    setIsParentMode(!isParentMode);
  };

  return (
    <GameContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        gameProgress,
        updateProgress,
        currentWord,
        setCurrentWord,
        getNextWord,
        checkAnswer,
        isParentMode,
        toggleParentMode,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
