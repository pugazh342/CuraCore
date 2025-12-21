import { Link } from "react-router-dom";
import { MessageSquare, ShieldCheck, Stethoscope, ArrowRight, Activity, Cpu } from "lucide-react";

export default function Landing() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* --- HERO SECTION --- */}
      <div className="relative bg-white rounded-3xl p-10 shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            System Online & Secure
          </div>
          
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            The Intelligent, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Offline Health Grid.</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            CuraCore connects you to advanced AI medical analysis and top specialists—all running locally on your device for 100% privacy. No internet required for the brain.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link 
              to="/chat" 
              className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Start AI Consultation <ArrowRight size={20} />
            </Link>
            <Link 
              to="/doctors" 
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Find Specialists
            </Link>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-blue-50 to-white opacity-50 hidden md:block"></div>
        <Stethoscope className="absolute -right-10 -bottom-10 text-blue-50 w-96 h-96 opacity-50 rotate-12" />
      </div>

      {/* --- FEATURES GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={Cpu}
          title="Local AI Brain"
          desc="Powered by Llama 3 & Gemma. Your health data is processed on your GPU, never sent to the cloud."
        />
        <FeatureCard 
          icon={ShieldCheck}
          title="Privacy First"
          desc="Zero tracking. Zero data leaks. What you tell CuraCore stays on this machine."
        />
        <FeatureCard 
          icon={Activity}
          title="Doctor Integration"
          desc="Seamlessly book appointments. Doctors see AI-generated summaries, not raw chat logs."
        />
      </div>

      {/* --- STATS SECTION --- */}
      <div className="bg-gray-900 text-white rounded-3xl p-10 flex flex-col md:flex-row justify-around items-center gap-8 shadow-xl">
        <Stat number="100%" label="Offline Capable" />
        <div className="w-px h-12 bg-gray-700 hidden md:block"></div>
        <Stat number="0.2s" label="Latency Response" />
        <div className="w-px h-12 bg-gray-700 hidden md:block"></div>
        <Stat number="AES-256" label="Local Encryption" />
      </div>

    </div>
  );
}

// Helper Components
function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-1">{number}</div>
      <div className="text-gray-400 text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
}