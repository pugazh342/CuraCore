import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import { Lock, Mail } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      login(data); // Save to context
      alert(`Welcome back, ${data.full_name}!`);
      
      // Redirect based on role
      if (data.role === "doctor") navigate("/doctor-dashboard");
      else navigate("/");
      
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/signup" className="text-primary font-semibold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}