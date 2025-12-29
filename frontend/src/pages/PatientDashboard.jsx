import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPatientAppointments } from "../services/api";
import { 
  Activity, 
  MessageSquare, 
  Calendar, 
  Clock, 
  FileText, 
  ChevronRight, 
  Heart,
  Thermometer
} from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_id) {
      getPatientAppointments(user.user_id)
        .then(setAppointments)
        .catch(err => console.error("Failed to load history", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- WELCOME HEADER --- */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hello, {user?.full_name || "Patient"} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome to your personal health command center.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-sm text-gray-400 uppercase font-bold tracking-wider">Current Status</div>
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            System Online
          </div>
        </div>
      </div>

      {/* --- VITALS SECTION (SmartCare+ Placeholder) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Action: Start Triage */}
        <Link to="/chat" className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all group relative overflow-hidden">
          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-1">Start AI Triage</h3>
            <p className="text-blue-100 text-sm mb-4">Check symptoms & get advice.</p>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm group-hover:bg-white group-hover:text-primary transition-colors">
              Start Now <ChevronRight size={16} />
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
        </Link>

        {/* Vital: Heart Rate */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-red-50 p-3 rounded-xl text-red-500">
              <Heart size={24} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase">Live (Mock)</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">72 <span className="text-sm font-normal text-gray-500">bpm</span></div>
            <div className="text-sm text-gray-500 mt-1">Heart Rate Normal</div>
          </div>
        </div>

        {/* Vital: Temperature */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-orange-50 p-3 rounded-xl text-orange-500">
              <Thermometer size={24} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase">Live (Mock)</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">98.6 <span className="text-sm font-normal text-gray-500">°F</span></div>
            <div className="text-sm text-gray-500 mt-1">Body Temp Normal</div>
          </div>
        </div>
      </div>

      {/* --- APPOINTMENT HISTORY --- */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <Calendar className="text-gray-400" size={20} />
            Recent Activity
          </h3>
          <Link to="/doctors" className="text-sm text-primary font-medium hover:underline">
            Book New +
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading history...</div>
          ) : appointments.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No medical history found. Start a triage chat or book a doctor.
            </div>
          ) : (
            appointments.map((appt) => (
              <div key={appt.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                
                {/* Info */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    appt.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {appt.status === 'completed' ? <FileText size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Dr. {appt.doctor?.full_name || "Specialist"}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1 max-w-md">"{appt.symptoms}"</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{new Date(appt.appointment_date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{appt.status}</span>
                    </div>
                  </div>
                </div>

                {/* AI Summary View (Optional) */}
                {appt.ai_summary && (
                   <div className="bg-gray-50 px-4 py-2 rounded-lg text-xs text-gray-600 max-w-xs border border-gray-200 italic hidden md:block">
                     AI Note: {appt.ai_summary.substring(0, 60)}...
                   </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}