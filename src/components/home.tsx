import { GameProvider } from "@/context/GameContext";
import AppLayout from "@/components/game/AppLayout";
import UserMenu from "@/components/auth/UserMenu";

function Home() {
  return (
    <div className="w-screen h-screen">
      <GameProvider>
        <div className="absolute top-4 right-4 z-50">
          <UserMenu />
        </div>
        <AppLayout />
      </GameProvider>
    </div>
  );
}

export default Home;
