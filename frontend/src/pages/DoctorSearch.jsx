import { useEffect, useState } from "react";
import { Search, Loader2, CalendarCheck } from "lucide-react";
import { getDoctors, createAppointment } from "../services/api"; // Import createAppointment
import DoctorCard from "../components/patient/DoctorCard";

export default function DoctorSearch() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // Filter logic
  const filteredDoctors = doctors.filter(doc =>
    doc.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- NEW: Handle Booking Logic ---
  const handleBook = async (doctor) => {
    // Simple prompt to get reason (in a real app, use a Modal)
    const symptoms = prompt(`Reason for visiting Dr. ${doctor.full_name}?`, "General Consultation");
    
    if (!symptoms) return; // User cancelled

    try {
      await createAppointment(doctor.id, symptoms);
      alert(`✅ Appointment booked with Dr. ${doctor.full_name}! Go to the Doctor Dashboard to see it.`);
    } catch (error) {
      alert("❌ Booking failed. Is the backend running?");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header & Search */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarCheck className="text-primary" size={24} />
          Find a Specialist
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm w-64 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4 px-1">
          {filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onBook={handleBook} // Pass the real function now
            />
          ))}
          
          {filteredDoctors.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              No doctors found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}