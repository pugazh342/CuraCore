import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { sendChatMessage } from "../../services/api";
import VoiceRecorder from "../common/VoiceRecorder";

export default function ChatInterface() {
  // Initial Welcome Message
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I'm CuraCore. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for auto-scrolling to the bottom
  const messagesEndRef = useRef(null);

  // Effect: Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle: Sending a message
  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input; // Store for API call
    setInput(""); // Clear input immediately for UX
    setIsLoading(true);

    try {
      // 2. Call Backend API (The Brain)
      const response = await sendChatMessage(currentInput);
      
      // 3. Add AI Message
      const aiMsg = { role: "ai", content: response.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev, 
        { role: "ai", content: "⚠️ Sorry, I'm having trouble connecting to my brain. Is the backend running?" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle: Voice Input Success
  const handleVoiceInput = (transcribedText) => {
    // Append transcribed text to existing input or set it
    setInput((prev) => (prev ? `${prev} ${transcribedText}` : transcribedText));
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* --- HEADER --- */}
      <div className="bg-primary p-4 text-white flex items-center gap-2 shadow-sm z-10">
        <div className="bg-white/20 p-2 rounded-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">CuraCore AI</h2>
          <div className="flex items-center gap-1.5 opacity-90">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium">Online • Llama-Powered</span>
          </div>
        </div>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" ? "bg-primary text-white" : "bg-emerald-600 text-white"
              }`}>
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-gray-500 text-sm font-medium">Analyzing medical database...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-end">
        {/* Voice Button */}
        <VoiceRecorder onTranscriptionComplete={handleVoiceInput} />

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type or speak your symptoms..."
            className="w-full p-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none min-h-[46px] max-h-[120px] shadow-sm text-sm"
            rows={1}
            disabled={isLoading}
            style={{ minHeight: '46px' }} // Start height
          />
          <div className="absolute right-2 bottom-2 text-[10px] text-gray-400">
            ↵ to send
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-primary hover:bg-secondary text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}