import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  BarChart2,
  Settings,
  Users,
  CreditCard,
  Plus,
  Check,
  AlertCircle,
} from "lucide-react";
import { words } from "@/data/words";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function ParentDashboard() {
  const { currentUser, gameProgress, toggleParentMode, setCurrentUser } =
    useGame();
  const [activeTab, setActiveTab] = useState("progress");
  const [timeLimit, setTimeLimit] = useState(30);
  const [difficulty, setDifficulty] = useState("adaptive");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [childName, setChildName] = useState(
    currentUser?.name || "Young Learner",
  );
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  const [challengeWords, setChallengeWords] = useState<string[]>([]);
  const [challengeName, setChallengeName] = useState("");
  const [challenges, setChallenges] = useState<
    { name: string; words: string[] }[]
  >([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  // Initialize child name when user changes
  useEffect(() => {
    if (currentUser) {
      setChildName(currentUser.name || "Young Learner");
    }
  }, [currentUser]);

  const handleBackToChildMode = () => {
    toggleParentMode();
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    // For now, we'll just update the UI and show a success message
    setShowSuccessMessage("Settings saved successfully!");
    setTimeout(() => setShowSuccessMessage(""), 3000);

    // Update child name
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: childName,
      });
    }
  };

  const handleCreateChallenge = () => {
    if (challengeName && challengeWords.length > 0) {
      setChallenges([
        ...challenges,
        {
          name: challengeName,
          words: challengeWords,
        },
      ]);
      setShowChallengeDialog(false);
      setChallengeName("");
      setChallengeWords([]);
      setShowSuccessMessage("Challenge created successfully!");
      setTimeout(() => setShowSuccessMessage(""), 3000);
    }
  };

  const handleSubscribe = () => {
    // In a real app, this would process payment
    setShowSubscribeDialog(false);
    setShowSuccessMessage(`Subscribed to ${selectedPlan} plan successfully!`);
    setTimeout(() => setShowSuccessMessage(""), 3000);
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
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center shadow-md">
            <Check className="h-5 w-5 mr-2" />
            {showSuccessMessage}
          </div>
        )}

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
                <Button onClick={() => setShowChallengeDialog(true)}>
                  Create New Challenge
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assigned Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                {challenges.length > 0 ? (
                  <div className="space-y-4">
                    {challenges.map((challenge, index) => (
                      <div key={index} className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{challenge.name}</h3>
                          <Badge variant="outline">
                            {challenge.words.length} words
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {challenge.words.map((word, idx) => (
                            <Badge key={idx} variant="secondary">
                              {word}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No challenges assigned yet.
                  </p>
                )}
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
                          <Check className="h-4 w-4 text-green-500" />
                          All animals and cars
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Progress tracking
                        </li>
                      </ul>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedPlan("Basic");
                          setShowSubscribeDialog(true);
                        }}
                      >
                        Subscribe
                      </Button>
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
                          <Check className="h-4 w-4 text-green-500" />
                          Up to 3 child profiles
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          All categories
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Custom challenges
                        </li>
                      </ul>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedPlan("Family");
                          setShowSubscribeDialog(true);
                        }}
                      >
                        Subscribe
                      </Button>
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
                          <Check className="h-4 w-4 text-green-500" />
                          Unlimited profiles
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          All features
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Priority support
                        </li>
                      </ul>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedPlan("Premium");
                          setShowSubscribeDialog(true);
                        }}
                      >
                        Subscribe
                      </Button>
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
                    <Input
                      type="number"
                      className="w-16 h-10"
                      value={timeLimit}
                      onChange={(e) =>
                        setTimeLimit(parseInt(e.target.value) || 30)
                      }
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
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="adaptive">Adaptive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Sound Effects</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable game sounds
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sound-toggle"
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                    <Label htmlFor="sound-toggle">
                      {soundEnabled ? "On" : "Off"}
                    </Label>
                  </div>
                </div>

                <Button className="w-full mt-4" onClick={handleSaveSettings}>
                  Save Settings
                </Button>
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
                  <div className="flex-1">
                    <Input
                      type="text"
                      className="mb-2"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Child's name"
                    />
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <Button className="w-full" onClick={handleSaveSettings}>
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Subscribe Dialog */}
      <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to {selectedPlan} Plan</DialogTitle>
            <DialogDescription>
              Enter your payment details to subscribe to the {selectedPlan}{" "}
              plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-name">Name on Card</Label>
              <Input id="card-name" placeholder="John Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="4242 4242 4242 4242" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubscribeDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubscribe}>Subscribe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Challenge Creation Dialog */}
      <Dialog open={showChallengeDialog} onOpenChange={setShowChallengeDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Custom Challenge</DialogTitle>
            <DialogDescription>
              Select words to include in your custom challenge for your child.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="challenge-name">Challenge Name</Label>
              <Input
                id="challenge-name"
                placeholder="Animal Adventure"
                value={challengeName}
                onChange={(e) => setChallengeName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Words</Label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {words.map((word) => (
                    <div key={word.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={word.id}
                        checked={challengeWords.includes(word.word)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setChallengeWords([...challengeWords, word.word]);
                          } else {
                            setChallengeWords(
                              challengeWords.filter((w) => w !== word.word),
                            );
                          }
                        }}
                      />
                      <Label htmlFor={word.id} className="text-sm">
                        {word.word} ({word.category}, Level {word.difficulty})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowChallengeDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateChallenge}
              disabled={!challengeName || challengeWords.length === 0}
            >
              Create Challenge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
