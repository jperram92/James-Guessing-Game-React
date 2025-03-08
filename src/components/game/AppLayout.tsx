import { useGame } from "@/context/GameContext";
import ChildHomeScreen from "@/components/game/ChildHomeScreen";
import ParentDashboard from "@/components/game/ParentDashboard";

export default function AppLayout() {
  const { isParentMode } = useGame();

  return isParentMode ? <ParentDashboard /> : <ChildHomeScreen />;
}
