import "./App.css";
import AppRouter from "./router";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { TimerProvider } from "@/context/TimerContext";

export default function App() {
  return (
    <TimerProvider>
      <NotificationsProvider>
        <AppRouter />
      </NotificationsProvider>
    </TimerProvider>
  );
}
