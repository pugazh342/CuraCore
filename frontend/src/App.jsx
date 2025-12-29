import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { 
  MessageSquare, 
  Users, 
  LayoutDashboard, 
  Stethoscope, 
  Home, 
  LogIn, 
  User as UserIcon,
  Activity,
  LogOut
} from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PatientDashboard from "./pages/PatientDashboard";
import ChatInterface from "./components/patient/ChatInterface";
import DoctorSearch from "./pages/DoctorSearch";
import DoctorDashboard from "./pages/DoctorDashboard";

// --- 🔒 PROTECTED ROUTE COMPONENT ---
// This acts as a security guard. If you aren't logged in, it kicks you to /login.
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />; // Kick out if role doesn't match
  }

  return children;
};

// --- SIDEBAR COMPONENT ---
function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

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
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 text-primary px-2">
        <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-blue-200">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">CuraCore</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        <NavItem to="/" icon={Home} label="Home" />
        
        {/* 🔒 STRICT CHECK: Only show Patient Links if ROLE is PATIENT */}
        {user?.role === 'patient' && (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-3">
              Patient View
            </div>
            <NavItem to="/patient-dashboard" icon={LayoutDashboard} label="My Dashboard" />
            <NavItem to="/chat" icon={MessageSquare} label="Start AI Triage" />
            <NavItem to="/doctors" icon={Users} label="Find Doctors" />
          </>
        )}

        {/* 🔒 STRICT CHECK: Only show Doctor Links if ROLE is DOCTOR */}
        {user?.role === 'doctor' && (
          <>
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-3">
               Doctor View
             </div>
             <NavItem to="/doctor-dashboard" icon={Activity} label="Doctor Console" />
          </>
        )}
      </nav>

      {/* User / Login Section */}
      <div className="pt-6 border-t border-gray-100">
        {user ? (
          <div className="space-y-3">
            <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer group">
              <div className="relative">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random`} 
                  alt="User" 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-gray-800 truncate">{user.full_name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
            </Link>
            <button 
              onClick={logout} 
              className="w-full flex items-center justify-center gap-2 p-2 text-red-500 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-3 p-3 bg-blue-50 text-primary rounded-xl font-semibold justify-center hover:bg-blue-100 transition-colors">
            <LogIn size={18} /> 
            <span>Log In</span>
          </Link>
        )}
      </div>
    </div>
  );
}

// --- MAIN APP ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-50 font-sans">
          <Sidebar />
          
          <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
            <Routes>
              {/* Public Routes (Accessible by everyone) */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* 🔒 Protected User Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* 🔒 Protected Patient Routes */}
              <Route path="/patient-dashboard" element={
                <ProtectedRoute allowedRole="patient">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <PatientDashboard />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/chat" element={
                <ProtectedRoute allowedRole="patient">
                  <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-gray-900">AI Triage Assessment</h1>
                      <p className="text-gray-500 mt-2">Describe symptoms clearly for the AI protocol.</p>
                    </div>
                    <ChatInterface />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/doctors" element={
                 <ProtectedRoute allowedRole="patient">
                   <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)] animate-in fade-in duration-500">
                     <DoctorSearch />
                   </div>
                 </ProtectedRoute>
              } />

              {/* 🔒 Protected Doctor Routes */}
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute allowedRole="doctor">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <DoctorDashboard />
                  </div>
                </ProtectedRoute>
              } />
              
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;