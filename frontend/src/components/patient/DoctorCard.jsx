import { MapPin, Stethoscope, GraduationCap, Clock } from "lucide-react";

export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col gap-4">
      {/* Top Section: Image & Info */}
      <div className="flex gap-4">
        <img
          src={doctor.image_url || `https://ui-avatars.com/api/?name=${doctor.full_name}`}
          alt={doctor.full_name}
          className="w-20 h-20 rounded-xl object-cover bg-gray-100"
        />
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{doctor.full_name}</h3>
          <div className="flex items-center gap-1 text-primary font-medium text-sm">
            <Stethoscope size={14} />
            {doctor.specialization}
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
            <GraduationCap size={12} />
            {doctor.qualification}
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
            <Clock size={12} />
            {doctor.experience_years} years exp
          </div>
        </div>
      </div>

      {/* Middle: Location & Fee */}
      <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1 text-gray-500">
          <MapPin size={14} />
          {doctor.location}
        </div>
        <div className="font-bold text-gray-900">
          ₹{doctor.consultation_fee}
        </div>
      </div>

      {/* Bottom: Action Button */}
      <button
        onClick={() => onBook(doctor)}
        className="w-full bg-blue-50 text-blue-600 font-semibold py-2 rounded-xl hover:bg-blue-100 transition-colors"
      >
        Book Appointment
      </button>
    </div>
  );
}