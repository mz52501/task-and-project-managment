import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Logout() {
  const { clearAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearAuth();
    navigate("/login", { replace: true });
  }, []);

  return null;
}
