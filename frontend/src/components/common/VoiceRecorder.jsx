import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { transcribeAudio } from "../../services/api";

export default function VoiceRecorder({ onTranscriptionComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        
        try {
          // Send to backend Whisper service
          const result = await transcribeAudio(audioBlob);
          if (result.text) {
            onTranscriptionComplete(result.text);
          }
        } catch (error) {
          console.error("Transcription failed:", error);
          alert("Could not transcribe audio. Is the backend running?");
        } finally {
          setIsProcessing(false);
          // Stop all audio tracks to release microphone
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to use this feature.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className={`p-3 rounded-xl transition-all duration-200 ${
        isRecording
          ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
          : isProcessing
          ? "bg-gray-100 text-gray-400"
          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
      }`}
      title={isRecording ? "Stop Recording" : "Speak Symptoms"}
    >
      {isProcessing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isRecording ? (
        <Square className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}