import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/api";
import { User, Activity, Shield } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (user?.user_id) {
      getUserProfile(user.user_id).then(setDetails);
    }
  }, [user]);

  if (!user) return <div className="p-10 text-center">Please Log In first.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary to-blue-400"></div>
        
        <div className="relative mt-12">
          <div className="w-24 h-24 mx-auto bg-white rounded-full p-2 shadow-md">
            <img 
              src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random`} 
              alt="Avatar" 
              className="w-full h-full rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">{user.full_name}</h1>
          <div className="flex justify-center gap-2 mt-2">
             <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
               {user.role}
             </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
          <div className="bg-gray-50 p-4 rounded-xl">
            <label className="text-xs text-gray-500 uppercase font-bold">Email</label>
            <div className="text-gray-800 font-medium">{user.email}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
             <label className="text-xs text-gray-500 uppercase font-bold">User ID</label>
             <div className="text-gray-800 font-medium">#{user.user_id}</div>
          </div>
        </div>

        {details && user.role === "patient" && (
           <div className="mt-4 bg-green-50 p-4 rounded-xl text-left border border-green-100">
             <h3 className="text-green-800 font-bold flex items-center gap-2 mb-2">
               <Activity size={18} /> Health Status
             </h3>
             <p className="text-sm text-green-700">
               Your basic health profile is active. No critical alerts found.
             </p>
           </div>
        )}

        <button 
          onClick={logout} 
          className="mt-8 text-red-500 hover:text-red-700 font-medium text-sm underline"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}