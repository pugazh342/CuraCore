import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/api";
import { User, Mail, Lock } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "", role: "patient" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser(formData);
      alert("Account created! Please log in.");
      navigate("/login");
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.detail || "Check your details"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 justify-center mb-4">
            {["patient", "doctor"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFormData({...formData, role: r})}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                  formData.role === r ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 p-3 border border-gray-200 rounded-xl outline-none"
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 p-3 border border-gray-200 rounded-xl outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 p-3 border border-gray-200 rounded-xl outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account? <Link to="/login" className="text-primary font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
}