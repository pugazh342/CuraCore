import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  MessageSquare, 
  Users, 
  LayoutDashboard, 
  Stethoscope, 
  Home, 
  LogIn, 
  User as UserIcon 
} from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";

// --- IMPORT PAGES ---
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ChatInterface from "./components/patient/ChatInterface";
import DoctorSearch from "./pages/DoctorSearch";
import DoctorDashboard from "./pages/DoctorDashboard";

// --- SIDEBAR COMPONENT ---
function Sidebar() {
  const location = useLocation();
  const { user } = useAuth(); // Get current logged-in user
  const isActive = (path) => location.pathname === path;

  // Helper for Navigation Links
  const NavItem = ({ to, icon: Icon, label }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
        isActive(to) 
          ? "bg-primary text-white shadow-md shadow-blue-200" 
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={20} className={isActive(to) ? "animate-pulse" : "group-hover:scale-110 transition-transform"} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* --- LOGO --- */}
      <div className="flex items-center gap-3 mb-10 text-primary px-2">
        <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-blue-200">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">CuraCore</span>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="space-y-2 flex-1">
        <NavItem to="/" icon={Home} label="Home" />
        
        {/* Links for Patients (or Guests) */}
        {(!user || user.role === 'patient') && (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-3">
              Patient View
            </div>
            <NavItem to="/chat" icon={MessageSquare} label="AI Consultation" />
            <NavItem to="/doctors" icon={Users} label="Find Doctors" />
          </>
        )}

        {/* Links for Doctors Only */}
        {user?.role === 'doctor' && (
          <>
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-3">
               Doctor View
             </div>
             <NavItem to="/doctor-dashboard" icon={LayoutDashboard} label="Dashboard" />
          </>
        )}
      </nav>

      {/* --- USER PROFILE / LOGIN --- */}
      <div className="pt-6 border-t border-gray-100">
        {user ? (
          // If Logged In: Show Profile Stub
          <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer group">
             <div className="relative">
               <img 
                 src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random`} 
                 alt="User" 
                 className="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:border-blue-200 transition-colors"
               />
               <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
             </div>
             <div className="overflow-hidden">
               <div className="text-sm font-bold text-gray-800 truncate">{user.full_name}</div>
               <div className="text-xs text-gray-500 capitalize flex items-center gap-1">
                 <UserIcon size={10} /> {user.role}
               </div>
             </div>
          </Link>
        ) : (
          // If Logged Out: Show Login Button
          <Link to="/login" className="flex items-center gap-3 p-3 bg-blue-50 text-primary rounded-xl font-semibold justify-center hover:bg-blue-100 transition-colors">
            <LogIn size={18} /> 
            <span>Log In</span>
          </Link>
        )}
      </div>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <AuthProvider> {/* 1. Wrap entire app in Auth Context */}
      <Router>
        <div className="flex min-h-screen bg-gray-50 font-sans">
          
          <Sidebar />
          
          {/* Main Content Area */}
          <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes (Logic handled inside pages or Sidebar visibility) */}
              <Route path="/profile" element={<Profile />} />
              
              {/* Patient Features */}
              <Route path="/chat" element={
                <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">AI Health Assistant</h1>
                    <p className="text-gray-500 mt-2">Describe your symptoms to get preliminary advice and automated summaries.</p>
                  </div>
                  <ChatInterface />
                </div>
              } />
              
              <Route path="/doctors" element={
                 <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)] animate-in fade-in duration-500">
                   <DoctorSearch />
                 </div>
              } />

              {/* Doctor Features */}
              <Route path="/doctor-dashboard" element={
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <DoctorDashboard />
                </div>
              } />
              
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;