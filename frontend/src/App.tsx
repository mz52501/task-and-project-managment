import "./App.css";
import AppRouter from "./router";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { TimerProvider } from "@/context/TimerContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <TooltipProvider>
      <TimerProvider>
        <NotificationsProvider>
          <AppRouter />
          <Toaster richColors position="bottom-right" />
        </NotificationsProvider>
      </TimerProvider>
    </TooltipProvider>
  );
}
