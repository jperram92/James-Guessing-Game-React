import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";

interface CategorySelectionProps {
  onSelectCategory: (category: "animals" | "cars") => void;
}

export default function CategorySelection(
  { onSelectCategory }: CategorySelectionProps = { onSelectCategory: () => {} },
) {
  const { gameProgress } = useGame();

  // Calculate progress for each category
  const getProgress = (category: "animals" | "cars") => {
    if (!gameProgress) return 0;

    const totalWordsInCategory = category === "animals" ? 7 : 6; // Based on our data
    const completedInCategory = gameProgress.completedWords.filter((id) =>
      id.startsWith(category),
    ).length;

    return Math.round((completedInCategory / totalWordsInCategory) * 100);
  };

  const animalProgress = getProgress("animals");
  const carProgress = getProgress("cars");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => onSelectCategory("animals")}
      >
        <div className="aspect-video relative">
          <img
            src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80"
            alt="Animals"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-2xl font-bold text-white">Animals</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${animalProgress}%` }}
                ></div>
              </div>
              <span className="text-white text-sm">{animalProgress}%</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-muted-foreground mb-4">
            Learn to spell animal names from cats to elephants!
          </p>
          <Button
            className="w-full"
            onClick={() => onSelectCategory("animals")}
          >
            Play Animals
          </Button>
        </CardContent>
      </Card>

      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => onSelectCategory("cars")}
      >
        <div className="aspect-video relative">
          <img
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"
            alt="Cars"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-2xl font-bold text-white">Cars</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${carProgress}%` }}
                ></div>
              </div>
              <span className="text-white text-sm">{carProgress}%</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-muted-foreground mb-4">
            Learn to spell vehicle names from cars to motorcycles!
          </p>
          <Button className="w-full" onClick={() => onSelectCategory("cars")}>
            Play Cars
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
