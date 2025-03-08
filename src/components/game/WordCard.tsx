import { useState, useEffect } from "react";
import { Word } from "@/types/game";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Volume2 } from "lucide-react";

interface WordCardProps {
  word: Word;
  onComplete: (isCorrect: boolean) => void;
  challengeType: "multiple-choice" | "letter-by-letter";
}

export default function WordCard(
  { word, onComplete, challengeType }: WordCardProps = {
    word: {
      id: "demo-word",
      word: "cat",
      category: "animals",
      difficulty: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80",
      hint: "A small furry pet that meows",
    },
    onComplete: () => {},
    challengeType: "multiple-choice",
  },
) {
  const [userInput, setUserInput] = useState<string[]>(
    Array(word.word.length).fill(""),
  );
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [attempts, setAttempts] = useState(0);

  // Generate multiple choice options
  useEffect(() => {
    if (challengeType === "multiple-choice") {
      // Include the correct answer
      const allOptions = [word.word];

      // Add 3 random options
      const alphabet = "abcdefghijklmnopqrstuvwxyz";

      // Generate random words by shuffling the correct word
      while (allOptions.length < 4) {
        let randomWord = word.word
          .split("")
          .sort(() => Math.random() - 0.5)
          .join("");

        // If the shuffle resulted in the same word, change a character
        if (randomWord === word.word && word.word.length > 1) {
          const pos = Math.floor(Math.random() * word.word.length);
          const chars = randomWord.split("");
          chars[pos] = alphabet[Math.floor(Math.random() * alphabet.length)];
          randomWord = chars.join("");
        }

        if (!allOptions.includes(randomWord)) {
          allOptions.push(randomWord);
        }
      }

      // Shuffle the options
      setOptions(allOptions.sort(() => Math.random() - 0.5));
    }
  }, [word, challengeType]);

  const playAudio = () => {
    // In a real app, this would play the audio file
    // For now, we'll use the browser's speech synthesis
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLetterInput = (index: number, value: string) => {
    const newInput = [...userInput];
    newInput[index] = value.toLowerCase();
    setUserInput(newInput);

    // Auto-focus next input if this one is filled
    if (value && index < word.word.length - 1) {
      const nextInput = document.getElementById(`letter-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const checkLetterByLetter = () => {
    const userWord = userInput.join("");
    const correct = userWord.toLowerCase() === word.word.toLowerCase();
    setIsCorrect(correct);
    setAttempts(attempts + 1);

    if (correct || attempts >= 2) {
      setTimeout(() => {
        onComplete(correct);
      }, 1500);
    }
  };

  const checkMultipleChoice = (selected: string) => {
    setSelectedOption(selected);
    const correct = selected.toLowerCase() === word.word.toLowerCase();
    setIsCorrect(correct);

    setTimeout(() => {
      onComplete(correct);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge
            variant={word.category === "animals" ? "default" : "secondary"}
          >
            {word.category}
          </Badge>
          <Badge variant="outline">Level {word.difficulty}</Badge>
        </div>

        <div className="relative aspect-square mb-6 rounded-lg overflow-hidden">
          <img
            src={word.imageUrl}
            alt={word.word}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={playAudio}
            className="rounded-full"
          >
            <Volume2 className="h-4 w-4" />
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHint(!showHint)}
                  className="rounded-full"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{word.hint}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {showHint && (
          <div className="bg-muted p-3 rounded-md mb-4 text-sm">
            {word.hint}
          </div>
        )}

        {challengeType === "letter-by-letter" ? (
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {word.word.split("").map((letter, index) => (
                <input
                  key={index}
                  id={`letter-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={userInput[index]}
                  onChange={(e) => handleLetterInput(index, e.target.value)}
                  className={`w-12 h-12 text-center text-lg font-bold border-2 rounded-md ${isCorrect === null ? "border-input" : isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button
              onClick={checkLetterByLetter}
              className="w-full"
              disabled={userInput.some((letter) => !letter)}
            >
              Check Answer
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedOption === option
                    ? isCorrect
                      ? "success"
                      : "destructive"
                    : "outline"
                }
                className="h-12 text-lg font-medium"
                onClick={() => checkMultipleChoice(option)}
                disabled={!!selectedOption}
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        {isCorrect !== null && (
          <div
            className={`mt-4 p-3 rounded-md text-center font-medium ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {isCorrect
              ? "Correct! Great job! 🎉"
              : `Try again! The word is "${word.word}"`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
