import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BarChart2,
  Settings,
  Users,
  CreditCard,
  Plus,
} from "lucide-react";
import { words } from "@/data/words";

export default function ParentDashboard() {
  const { currentUser, gameProgress, toggleParentMode } = useGame();
  const [activeTab, setActiveTab] = useState("progress");

  const handleBackToChildMode = () => {
    toggleParentMode();
  };

  // Calculate category progress
  const getCategoryProgress = (category: "animals" | "cars") => {
    if (!gameProgress) return { completed: 0, total: 0, percentage: 0 };

    const wordsInCategory = words.filter((word) => word.category === category);
    const completedInCategory = gameProgress.completedWords.filter((id) =>
      id.startsWith(category),
    ).length;

    return {
      completed: completedInCategory,
      total: wordsInCategory.length,
      percentage: Math.round(
        (completedInCategory / wordsInCategory.length) * 100,
      ),
    };
  };

  const animalProgress = getCategoryProgress("animals");
  const carProgress = getCategoryProgress("cars");

  // Calculate difficulty progress
  const getDifficultyProgress = (difficulty: 1 | 2 | 3) => {
    if (!gameProgress) return { completed: 0, total: 0, percentage: 0 };

    const wordsInDifficulty = words.filter(
      (word) => word.difficulty === difficulty,
    );
    const completedInDifficulty = wordsInDifficulty.filter((word) =>
      gameProgress.completedWords.includes(word.id),
    ).length;

    return {
      completed: completedInDifficulty,
      total: wordsInDifficulty.length,
      percentage: Math.round(
        (completedInDifficulty / wordsInDifficulty.length) * 100,
      ),
    };
  };

  const easyProgress = getDifficultyProgress(1);
  const mediumProgress = getDifficultyProgress(2);
  const hardProgress = getDifficultyProgress(3);

  // Calculate time spent (mock data for demo)
  const timeSpentData = [
    { day: "Mon", minutes: 15 },
    { day: "Tue", minutes: 20 },
    { day: "Wed", minutes: 10 },
    { day: "Thu", minutes: 25 },
    { day: "Fri", minutes: 15 },
    { day: "Sat", minutes: 30 },
    { day: "Sun", minutes: 20 },
  ];

  const maxMinutes = Math.max(...timeSpentData.map((d) => d.minutes));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBackToChildMode}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Child Mode
            </Button>
            <h1 className="text-2xl font-bold">Parent Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <Users className="h-3 w-3 mr-1" />
              Parent Account
            </Badge>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="progress">
              <BarChart2 className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <Plus className="h-4 w-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Words Learned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {gameProgress?.completedWords.length || 0}
                  </div>
                  <p className="text-muted-foreground">
                    out of {words.length} total words
                  </p>
                  <Progress
                    value={
                      gameProgress
                        ? (gameProgress.completedWords.length / words.length) *
                          100
                        : 0
                    }
                    className="h-2 mt-4"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {gameProgress &&
                    Object.keys(gameProgress.accuracy).length > 0
                      ? Math.round(
                          Object.values(gameProgress.accuracy).reduce(
                            (sum, acc) => sum + acc,
                            0,
                          ) / Object.values(gameProgress.accuracy).length,
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-muted-foreground">
                    across all completed words
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Current Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {gameProgress?.level || 1}
                  </div>
                  <p className="text-muted-foreground">
                    {gameProgress?.level === 3
                      ? "Advanced"
                      : gameProgress?.level === 2
                        ? "Intermediate"
                        : "Beginner"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Animals</span>
                      <span>
                        {animalProgress.completed}/{animalProgress.total}
                      </span>
                    </div>
                    <Progress
                      value={animalProgress.percentage}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Cars</span>
                      <span>
                        {carProgress.completed}/{carProgress.total}
                      </span>
                    </div>
                    <Progress value={carProgress.percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Difficulty Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Easy</span>
                      <span>
                        {easyProgress.completed}/{easyProgress.total}
                      </span>
                    </div>
                    <Progress value={easyProgress.percentage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Medium</span>
                      <span>
                        {mediumProgress.completed}/{mediumProgress.total}
                      </span>
                    </div>
                    <Progress
                      value={mediumProgress.percentage}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Hard</span>
                      <span>
                        {hardProgress.completed}/{hardProgress.total}
                      </span>
                    </div>
                    <Progress value={hardProgress.percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Time Spent Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-end justify-between">
                  {timeSpentData.map((day, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-12 bg-primary rounded-t-md"
                        style={{
                          height: `${(day.minutes / maxMinutes) * 180}px`,
                        }}
                      ></div>
                      <div className="mt-2 text-sm">{day.day}</div>
                      <div className="text-xs text-muted-foreground">
                        {day.minutes} min
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Create a personalized learning challenge for your child.
                </p>
                <Button>Create New Challenge</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assigned Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No challenges assigned yet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md mb-4">
                  <Badge>Free Plan</Badge>
                  <p className="mt-2">
                    Access to basic features and limited words.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-primary">
                    <CardHeader className="bg-primary/10">
                      <CardTitle className="text-center">Basic</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-center mb-4">
                        <span className="text-3xl font-bold">$4.99</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          All animals and cars
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Progress tracking
                        </li>
                      </ul>
                      <Button className="w-full">Subscribe</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary">
                    <CardHeader className="bg-primary/10">
                      <CardTitle className="text-center">Family</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-center mb-4">
                        <span className="text-3xl font-bold">$9.99</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Up to 3 child profiles
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          All categories
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Custom challenges
                        </li>
                      </ul>
                      <Button className="w-full">Subscribe</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary">
                    <CardHeader className="bg-primary/10">
                      <CardTitle className="text-center">Premium</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-center mb-4">
                        <span className="text-3xl font-bold">$14.99</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Unlimited profiles
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          All features
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Priority support
                        </li>
                      </ul>
                      <Button className="w-full">Subscribe</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parental Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Daily Time Limit</h3>
                    <p className="text-sm text-muted-foreground">
                      Limit how long your child can play each day
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-16 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue={30}
                      min={5}
                      max={120}
                    />
                    <span>minutes</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Difficulty Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjust the game difficulty
                    </p>
                  </div>
                  <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                    <option selected>Adaptive</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Sound Effects</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable game sounds
                    </p>
                  </div>
                  <div className="flex h-6 items-center">
                    <input
                      id="sound-toggle"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                  </div>
                </div>

                <Button className="w-full mt-4">Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Child Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        currentUser?.avatarUrl ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=child"
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mb-2"
                      defaultValue={currentUser?.name || "Young Learner"}
                      placeholder="Child's name"
                    />
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <Button className="w-full">Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
