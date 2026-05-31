import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { login } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();
  const { refreshWorkspaces } = useWorkspace();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login({ email: formData.email, password: formData.password });
      saveAuth(data.token, data.user);
      await refreshWorkspaces();
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Outside Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-900">HyperFlow</h1>
          <p className="text-gray-800 mt-1">Welcome back! Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-1">Sign In</h2>
          <p className="text-sm text-gray-700 text-center mb-6">
            Enter your credentials to access your workspace
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="mt-1 w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full cursor-pointer">
              <LogIn size={18} />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/registration" className="text-blue-600 hover:underline font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
