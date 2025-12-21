import { useEffect, useState } from "react";
import { CheckCircle, Clock, User, FileText, RefreshCw } from "lucide-react";
import { getDoctorQueue, completeAppointment } from "../services/api";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hardcoded: Simulate logging in as "Dr. Sarah" (ID: 1)
  // In a real app, you would get this from a login context
  const DOCTOR_ID = 1; 

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await getDoctorQueue(DOCTOR_ID);
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch queue", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleComplete = async (id) => {
    try {
      await completeAppointment(id);
      // Optimistically remove from list or refresh
      fetchQueue(); 
    } catch (error) {
      alert("Error marking appointment as complete");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dr. Sarah's Dashboard</h1>
          <p className="text-gray-500 mt-1">Today's Queue • <span className="font-semibold text-primary">{appointments.length} Patients Waiting</span></p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchQueue}
            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
            title="Refresh List"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium text-sm">
            Cardiology Dept
          </div>
        </div>
      </div>

      {/* Queue Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading && appointments.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Loading queue...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
            <p className="text-gray-500">No patients in queue. Time for a break. ☕</p>
          </div>
        ) : (
          appointments.map((appt) => (
            <div key={appt.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md">
              
              {/* Left: Patient Info */}
              <div className="md:w-1/4 md:border-r border-gray-100 md:pr-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Patient #{appt.patient_id}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-orange-600 font-medium bg-orange-50 px-2.5 py-1 rounded-full w-fit mt-1">
                      <Clock size={12} /> Waiting
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 pl-1">
                  Booked: {new Date(appt.appointment_date).toLocaleDateString()}
                </div>
              </div>

              {/* Middle: AI Summary (The Magic) */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wide">
                  <FileText size={16} /> AI Pre-Screening Summary
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 rounded-2xl border border-blue-100 text-sm text-gray-700 leading-relaxed shadow-sm">
                  {appt.ai_summary ? (
                    appt.ai_summary
                  ) : (
                    <span className="text-gray-400 italic">Processing medical summary...</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 flex gap-2">
                  <span className="font-semibold">Original Complaint:</span> 
                  <span className="italic">"{appt.symptoms}"</span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center md:pl-4 justify-end">
                <button
                  onClick={() => handleComplete(appt.id)}
                  className="group bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-sm hover:shadow-emerald-200"
                >
                  <CheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Mark Done</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}