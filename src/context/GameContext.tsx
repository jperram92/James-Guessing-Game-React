import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Word, GameProgress, UserProfile } from "@/types/game";
import { words } from "@/data/words";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

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
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isParentMode, setIsParentMode] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Initialize user and progress based on authentication
  useEffect(() => {
    const initializeUser = async () => {
      setIsLoadingProgress(true);

      if (user) {
        // Convert auth user to game user profile
        const gameUser: UserProfile = {
          id: user.id,
          name: user.name,
          isChild: !user.isParent,
          avatarUrl: user.avatarUrl,
        };

        setCurrentUser(gameUser);

        // Set parent mode based on user type
        if (user.isParent) {
          setIsParentMode(true);
        }

        // Load progress from database or localStorage
        try {
          if (supabase) {
            // Try to load from Supabase first
            const { data, error } = await supabase
              .from("game_progress")
              .select("*")
              .eq("user_id", user.id)
              .single();

            if (error && error.code !== "PGRST116") {
              // PGRST116 is "not found"
              console.error("Error fetching game progress:", error);
            }

            if (data) {
              // Convert database format to app format
              const progress: GameProgress = {
                userId: data.user_id,
                completedWords: data.completed_words,
                accuracy: data.accuracy,
                level: data.level,
                badges: data.badges,
                lastPlayed: new Date(data.last_played),
              };

              setGameProgress(progress);
            } else {
              // No progress in database, create new progress
              const newProgress: GameProgress = {
                userId: user.id,
                completedWords: [],
                accuracy: {},
                level: 1,
                badges: [],
                lastPlayed: new Date(),
              };

              setGameProgress(newProgress);
            }
          } else {
            // Fallback to localStorage
            const savedProgress = localStorage.getItem(
              `gameProgress_${user.id}`,
            );
            if (savedProgress) {
              const parsed = JSON.parse(savedProgress);
              parsed.lastPlayed = new Date(parsed.lastPlayed);
              setGameProgress(parsed);
            } else {
              // No saved progress, create new
              const newProgress: GameProgress = {
                userId: user.id,
                completedWords: [],
                accuracy: {},
                level: 1,
                badges: [],
                lastPlayed: new Date(),
              };

              setGameProgress(newProgress);
            }
          }
        } catch (e) {
          console.error("Failed to load game progress:", e);
          // Create default progress
          const newProgress: GameProgress = {
            userId: user.id,
            completedWords: [],
            accuracy: {},
            level: 1,
            badges: [],
            lastPlayed: new Date(),
          };

          setGameProgress(newProgress);
        }
      } else {
        // No authenticated user, use demo user
        const demoUser: UserProfile = {
          id: "demo-child",
          name: "Demo Child",
          isChild: true,
          avatarUrl:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-child",
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

        // Load demo progress from localStorage if available
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
      }

      setIsLoadingProgress(false);
    };

    initializeUser();
  }, [user]);

  // Save progress when it changes
  useEffect(() => {
    if (gameProgress && !isLoadingProgress) {
      const saveProgress = async () => {
        try {
          if (supabase && user) {
            // Save to Supabase
            const { error } = await supabase.from("game_progress").upsert(
              {
                user_id: gameProgress.userId,
                completed_words: gameProgress.completedWords,
                accuracy: gameProgress.accuracy,
                level: gameProgress.level,
                badges: gameProgress.badges,
                last_played: gameProgress.lastPlayed.toISOString(),
              },
              { onConflict: "user_id" },
            );

            if (error) {
              console.error("Error saving game progress:", error);
              // Fallback to localStorage
              localStorage.setItem(
                `gameProgress_${gameProgress.userId}`,
                JSON.stringify(gameProgress),
              );
            }
          } else {
            // Save to localStorage
            const storageKey = user
              ? `gameProgress_${user.id}`
              : "gameProgress";
            localStorage.setItem(storageKey, JSON.stringify(gameProgress));
          }
        } catch (e) {
          console.error("Failed to save game progress:", e);
          // Always try localStorage as fallback
          localStorage.setItem(
            `gameProgress_${gameProgress.userId}`,
            JSON.stringify(gameProgress),
          );
        }
      };

      saveProgress();
    }
  }, [gameProgress, isLoadingProgress, user]);

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
