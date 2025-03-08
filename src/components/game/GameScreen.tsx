import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import WordCard from "@/components/game/WordCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trophy } from "lucide-react";

interface GameScreenProps {
  onBack: () => void;
}

export default function GameScreen(
  { onBack }: GameScreenProps = { onBack: () => {} },
) {
  const {
    currentUser,
    gameProgress,
    updateProgress,
    getNextWord,
    setCurrentWord,
    currentWord,
  } = useGame();

  const [category, setCategory] = useState<"animals" | "cars">("animals");
  const [challengeType, setChallengeType] = useState<
    "multiple-choice" | "letter-by-letter"
  >("multiple-choice");
  const [showReward, setShowReward] = useState(false);
  const [streak, setStreak] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);

  // Load a word when the component mounts or category changes
  useEffect(() => {
    loadNextWord();
  }, [category]);

  // Update local state when game progress changes
  useEffect(() => {
    if (gameProgress) {
      setWordsCompleted(gameProgress.completedWords.length);
    }
  }, [gameProgress]);

  const loadNextWord = () => {
    const nextWord = getNextWord(category);
    if (nextWord) {
      setCurrentWord(nextWord);
      setShowReward(false);
    }
  };

  const handleWordComplete = (isCorrect: boolean) => {
    if (!currentWord) return;

    updateProgress(currentWord.id, isCorrect);

    if (isCorrect) {
      setStreak(streak + 1);
      setShowReward(true);

      // After showing reward, load next word
      setTimeout(() => {
        loadNextWord();
      }, 3000);
    } else {
      setStreak(0);
      // Give another chance with the same word
      setTimeout(() => {
        // For multiple choice, load a new word
        if (challengeType === "multiple-choice") {
          loadNextWord();
        } else {
          // For letter-by-letter, keep the same word but reset the UI
          setShowReward(false);
        }
      }, 2000);
    }
  };

  const toggleChallengeType = () => {
    setChallengeType(
      challengeType === "multiple-choice"
        ? "letter-by-letter"
        : "multiple-choice",
    );
  };

  // Calculate progress percentage
  const progressPercentage = gameProgress
    ? Math.min(100, (gameProgress.completedWords.length / 55) * 100)
    : 0;

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">Streak: {streak}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm">{wordsCompleted}/55 words</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Tabs
        defaultValue={category}
        className="mb-6"
        onValueChange={(value) => setCategory(value as "animals" | "cars")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="animals">Animals</TabsTrigger>
          <TabsTrigger value="cars">Cars</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-6">
        <Button
          variant="outline"
          onClick={toggleChallengeType}
          className="w-full"
        >
          Mode:{" "}
          {challengeType === "multiple-choice" ? "Multiple Choice" : "Spell It"}
        </Button>
      </div>

      {showReward ? (
        <Card className="p-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <h2 className="text-2xl font-bold mb-4">Great Job! 🎉</h2>
          <div className="text-6xl mb-4">🏆</div>
          <p className="mb-4">You spelled "{currentWord?.word}" correctly!</p>
          <p className="text-xl font-bold mb-2">Streak: {streak}</p>
          {streak % 5 === 0 && streak > 0 && (
            <div className="mt-4">
              <div className="text-4xl mb-2">🌟</div>
              <p className="font-bold">Achievement Unlocked!</p>
              <p>{streak} words in a row!</p>
            </div>
          )}
        </Card>
      ) : currentWord ? (
        <WordCard
          word={currentWord}
          onComplete={handleWordComplete}
          challengeType={challengeType}
        />
      ) : (
        <div className="text-center p-8">
          <p>No words available. Please try another category.</p>
        </div>
      )}
    </div>
  );
}
