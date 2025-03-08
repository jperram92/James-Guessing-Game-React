import { GameProvider } from "@/context/GameContext";
import AppLayout from "@/components/game/AppLayout";

function Home() {
  return (
    <div className="w-screen h-screen">
      <GameProvider>
        <AppLayout />
      </GameProvider>
    </div>
  );
}

export default Home;
