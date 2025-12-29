import axios from 'axios';

// Point to your FastAPI backend
// Ensure your backend is running on port 8001
const API_BASE_URL = 'http://127.0.0.1:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- API ENDPOINTS ---

// 1. DOCTORS: Get list of all doctors
export const getDoctors = async () => {
  const response = await api.get('/doctors/');
  return response.data;
};

// 2. CHAT: Send message to Llama 3 / Gemma
export const sendChatMessage = async (message) => {
  const response = await api.post('/chat/', { message });
  return response.data;
};

// 3. VOICE: Transcribe audio using Whisper
export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  // Name must match the backend parameter 'file'
  formData.append('file', audioBlob, 'voice.wav'); 
  
  const response = await api.post('/voice/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 4. APPOINTMENTS: Book a new appointment
export const createAppointment = async (doctorId, symptoms) => {
  // Hardcoded patient_id=1 for this demo (Pugazh Mani)
  const response = await api.post('/appointments/', {
    doctor_id: doctorId,
    patient_id: 1, 
    symptoms: symptoms
  });
  return response.data;
};

// 5. APPOINTMENTS: Get queue for a specific doctor
export const getDoctorQueue = async (doctorId) => {
  const response = await api.get(`/appointments/doctor/${doctorId}`);
  return response.data;
};

// 6. APPOINTMENTS: Mark appointment as done
export const completeAppointment = async (apptId) => {
  const response = await api.put(`/appointments/${apptId}/complete`);
  return response.data;
};

// 7. AUTH
export const signupUser = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/auth/profile/${userId}`);
  return response.data;
};

export const getPatientAppointments = async (patientId) => {
  const response = await api.get(`/appointments/patient/${patientId}`);
  return response.data;
};
export default api;