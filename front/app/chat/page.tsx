"use client";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/userAuthStore";
import { uploadDocument } from "@/app/services/files"
import { logOut } from "@/app/services/logOut";

export default function ChatWindow() {

  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, addMessage, isLoading, loadHistory } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const currentMsg = input;
    setInput(""); 
    await addMessage(currentMsg);
  };
  const ChatWindow = () => {
    useEffect(() => {
      loadHistory();
    }, [])
  };
  ChatWindow()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Cada vez que el array de mensajes cambie, bajamos el scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); 

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadDocument(file);
      alert("Archivo subido correctamente");
    } catch (err) {
      alert("Error al subir el archivo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      alert("Sesión cerrada exitosamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-sky-500 to-sky-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>

          </div>
          <div className="flex-1 ">
            <h1 className="text-xl font-bold bg-linear-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent">
              Asistente IA
            </h1>
            <p className="text-sm text-gray-400">Phi-3 • Siempre disponible</p>
          </div>
          <div>
            <button onClick={() => handleLogOut()}
          className="p-1 rounded-lg font-bold text-white transition-all duration-200 shadow-lg bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 hover:scale-105 active:scale-95">
          Log out
        </button>
          </div>
        </div>

      </div>



      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl min-h-150 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-linear-to-r from-sky-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">💬</span>
                </div>
                <h2 className="text-2xl font-bold mb-2 bg-linear-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent">
                  ¡Hola! Soy tu asistente IA
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Estoy aquí para ayudarte con cualquier pregunta o tarea. ¿En qué puedo asistirte hoy?
                </p>
              </div>
            )}

            {messages.map((m: { question: string; answer: string }, i: number) => (
              <div key={i} className="space-y-6">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-linear-to-r from-cyan-600 to-sky-600 p-4 rounded-2xl rounded-br-md shadow-lg">
                    <p className="text-white">{m.question}</p>
                  </div>
                </div>

                {/* AI Message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-linear-to-r from-cyan-500 to-sky-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <div className="max-w-[70%] bg-gray-700/50 p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-600/30">
                    <p className="text-gray-100 leading-relaxed">{m.answer}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Animation */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-linear-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-600/30">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-700/50">
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full p-4 pr-12 rounded-xl bg-gray-700/50 border border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 outline-none text-white placeholder-gray-400"
                  placeholder="Escribe tu mensaje aquí..."
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              {/* Archivo */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".txt,.pdf,.docx"
              />
              <label htmlFor="file-upload" className="ml-2 cursor-pointer flex items-center px-3 py-2 bg-cyan-700 hover:bg-cyan-800 rounded-lg text-white text-sm transition-all duration-200 disabled:opacity-50">
                {uploading ? (
                  <span className="animate-pulse">Subiendo...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    Subir archivo
                  </>
                )}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Presiona Enter para enviar • Tu conversación es privada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}