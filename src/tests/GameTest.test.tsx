import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * This component is used to test the game functionality.
 * It provides a simple interface to test various game features.
 */
export default function GameTest() {
  const {
    currentUser,
    gameProgress,
    updateProgress,
    getNextWord,
    currentWord,
    setCurrentWord,
    checkAnswer,
  } = useGame();

  const [testWord, setTestWord] = useState(null);
  const [testAnswer, setTestAnswer] = useState("");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Test getting a word
  const testGetWord = (category: "animals" | "cars", difficulty?: number) => {
    const word = getNextWord(category, difficulty);
    setTestWord(word);
    setTestResult({
      success: !!word,
      message: word
        ? `Successfully got word: ${word.word}`
        : "Failed to get word",
    });
  };

  // Test checking an answer
  const testCheckAnswer = () => {
    if (!currentWord) {
      setTestResult({
        success: false,
        message: "No current word set",
      });
      return;
    }

    const isCorrect = checkAnswer(testAnswer);
    setTestResult({
      success: isCorrect,
      message: isCorrect
        ? "Answer is correct!"
        : `Answer is incorrect. Correct answer is: ${currentWord.word}`,
    });
  };

  // Test updating progress
  const testUpdateProgress = (isCorrect: boolean) => {
    if (!currentWord) {
      setTestResult({
        success: false,
        message: "No current word set",
      });
      return;
    }

    updateProgress(currentWord.id, isCorrect);
    setTestResult({
      success: true,
      message: `Progress updated. Word ${isCorrect ? "completed" : "not completed"}.`,
    });
  };

  // Set current word for testing
  useEffect(() => {
    if (testWord) {
      setCurrentWord(testWord);
    }
  }, [testWord, setCurrentWord]);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Game Test Suite</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Current User:</h3>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(currentUser, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold">Game Progress:</h3>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(gameProgress, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold">Current Word:</h3>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(currentWord, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testResult ? (
              <div
                className={`p-4 rounded ${testResult.success ? "bg-green-100" : "bg-red-100"}`}
              >
                <h3 className="font-semibold mb-2">
                  {testResult.success ? "Success" : "Failure"}
                </h3>
                <p>{testResult.message}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Run a test to see results</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test: Get Word</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                className="p-3 bg-primary text-white rounded"
                onClick={() => testGetWord("animals")}
              >
                Get Animal Word
              </button>

              <button
                className="p-3 bg-primary text-white rounded"
                onClick={() => testGetWord("cars")}
              >
                Get Car Word
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                className="p-2 bg-secondary text-secondary-foreground rounded text-sm"
                onClick={() => testGetWord("animals", 1)}
              >
                Easy Animal
              </button>

              <button
                className="p-2 bg-secondary text-secondary-foreground rounded text-sm"
                onClick={() => testGetWord("animals", 2)}
              >
                Medium Animal
              </button>

              <button
                className="p-2 bg-secondary text-secondary-foreground rounded text-sm"
                onClick={() => testGetWord("animals", 3)}
              >
                Hard Animal
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test: Check Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={testAnswer}
                onChange={(e) => setTestAnswer(e.target.value)}
                placeholder="Enter answer"
                className="flex-1 p-2 border rounded"
              />

              <button
                className="p-3 bg-primary text-white rounded"
                onClick={testCheckAnswer}
              >
                Check Answer
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="p-3 bg-green-500 text-white rounded"
                onClick={() => testUpdateProgress(true)}
              >
                Update Progress (Correct)
              </button>

              <button
                className="p-3 bg-red-500 text-white rounded"
                onClick={() => testUpdateProgress(false)}
              >
                Update Progress (Incorrect)
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
