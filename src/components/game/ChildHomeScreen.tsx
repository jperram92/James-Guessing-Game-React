import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, BookOpen, Settings } from "lucide-react";
import CategorySelection from "@/components/game/CategorySelection";
import GameScreen from "@/components/game/GameScreen";

export default function ChildHomeScreen() {
  const { currentUser, gameProgress, toggleParentMode } = useGame();
  const [gameMode, setGameMode] = useState<"home" | "category" | "game">(
    "home",
  );
  const [selectedCategory, setSelectedCategory] = useState<"animals" | "cars">(
    "animals",
  );

  const handleCategorySelect = (category: "animals" | "cars") => {
    setSelectedCategory(category);
    setGameMode("game");
  };

  const handleBackToHome = () => {
    setGameMode("home");
  };

  const handleParentModeToggle = () => {
    toggleParentMode();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      {gameMode === "game" ? (
        <GameScreen onBack={handleBackToHome} />
      ) : (
        <div className="container max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Word Wizard</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleParentModeToggle}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {gameMode === "home" && (
            <div className="space-y-8">
              <Card className="overflow-hidden border-none shadow-md bg-white">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <img
                        src={
                          currentUser?.avatarUrl ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=child"
                        }
                        alt="Avatar"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {currentUser?.name || "Young Learner"}
                      </h2>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span>Level {gameProgress?.level || 1}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {gameProgress?.completedWords.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Words Learned
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {gameProgress?.badges.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Badges
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {gameProgress
                          ? Object.values(gameProgress.accuracy).reduce(
                              (sum, acc) => sum + acc,
                              0,
                            ) /
                            (Object.values(gameProgress.accuracy).length || 1)
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Accuracy
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {gameProgress?.badges.includes("beginner") && (
                      <Badge variant="outline" className="bg-blue-50">
                        <Trophy className="h-3 w-3 mr-1 text-blue-500" />
                        Beginner
                      </Badge>
                    )}
                    {gameProgress?.badges.includes("intermediate") && (
                      <Badge variant="outline" className="bg-green-50">
                        <Trophy className="h-3 w-3 mr-1 text-green-500" />
                        Intermediate
                      </Badge>
                    )}
                    {gameProgress?.badges.includes("advanced") && (
                      <Badge variant="outline" className="bg-purple-50">
                        <Trophy className="h-3 w-3 mr-1 text-purple-500" />
                        Advanced
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-full shadow-lg"
                  onClick={() => setGameMode("category")}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Recent Words</h3>
                    <ul className="space-y-2">
                      {gameProgress?.completedWords
                        .slice(-3)
                        .map((wordId, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              ✓
                            </div>
                            <span>{wordId.split("-")[1]}</span>
                          </li>
                        )) || (
                        <li className="text-muted-foreground">
                          No words completed yet
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Daily Challenge
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Complete today's special challenge!
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => setGameMode("category")}
                    >
                      Start Challenge
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {gameMode === "category" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={handleBackToHome}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back
                </Button>
                <h2 className="text-2xl font-bold">Choose a Category</h2>
              </div>

              <CategorySelection onSelectCategory={handleCategorySelect} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
