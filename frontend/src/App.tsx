import "./App.css";
import AppRouter from "./router";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { TimerProvider } from "@/context/TimerContext";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  return (
    <TooltipProvider>
      <TimerProvider>
        <NotificationsProvider>
          <AppRouter />
        </NotificationsProvider>
      </TimerProvider>
    </TooltipProvider>
  );
}
