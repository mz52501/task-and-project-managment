import "./App.css";
import AppRouter from "./router";
import { NotificationsProvider } from "@/context/NotificationsContext";

export default function App() {
  return (
    <NotificationsProvider>
      <AppRouter />
    </NotificationsProvider>
  );
}
