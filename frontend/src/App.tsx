import "./App.css";
import AppRouter from "./router";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { TimerProvider } from "@/context/TimerContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WorkspaceProvider>
          <TimerProvider>
            <NotificationsProvider>
              <AppRouter />
              <Toaster richColors position="bottom-right" />
            </NotificationsProvider>
          </TimerProvider>
        </WorkspaceProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
