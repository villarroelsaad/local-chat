"use client";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/userAuthStore";
import { uploadDocument } from "@/app/services/files";
import { logOut } from "@/app/services/logOut";
import { useRouter } from "next/navigation";

export const Chat= () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Control para móviles
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, addMessage, isLoading, loadHistory } = useChatStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const currentMsg = input;
    setInput(""); 
    await addMessage(currentMsg);
  };
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
    if (confirm("¿Cerrar sesión?")) {
      try {
        await logOut();
        router.push("/login"); 
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0`}>
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold">IA</div>
          <span className="font-bold text-lg overflow-hidden whitespace-nowrap">Historial</span>
        </div>

        {/* Lista de conversaciones (Simulada con los mensajes actuales o sesiones) */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <button className="w-full text-left p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm font-medium hover:bg-gray-700 transition-colors">
            + Nueva Conversación
          </button>
          
          <div className="pt-4 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recientes
          </div>
          
          {/* mapear sesiones de chat reales */}
          <div className="p-3 text-sm text-gray-400 hover:bg-gray-800 rounded-lg cursor-pointer truncate">
             Pregunta sobre el PDF...
          </div>
          <div className="p-3 text-sm text-gray-400 hover:bg-gray-800 rounded-lg cursor-pointer truncate">
             Error de compilación en React...
          </div>
        </div>

        {/* Botón Log Out al final de la Sidebar */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogOut}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="overflow-hidden">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col relative min-w-0">
        
        {/* Header con botón para colapsar Sidebar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-md">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400">Modelo:</span>
            <span className="text-sm font-bold text-sky-400">Phi-3 (Ollama)</span>
          </div>
          <div className="w-8"></div> {/* Spacer */}
        </header>

        {/* Área de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          {messages.length === 0 && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
               <div className="text-6xl mb-4">💬</div>
               <p className="text-xl">Inicia una conversación</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-end">
                  <div className="bg-sky-600 px-4 py-2 rounded-2xl rounded-tr-none max-w-[85%] shadow-lg">
                    {m.question}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] shrink-0">IA</div>
                  <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-2xl rounded-tl-none max-w-[85%] text-gray-200">
                    {m.answer}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="max-w-3xl mx-auto flex gap-4 animate-pulse">
               <div className="w-8 h-8 rounded-lg bg-gray-800 shrink-0"></div>
               <div className="h-10 w-32 bg-gray-800 rounded-2xl"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Flotante */}
        <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
          <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl flex items-center p-2 shadow-2xl">
             <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-sky-400 transition-colors"
             >
               {uploading ? "..." : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
             </button>
             <input
              type="file" ref={fileInputRef} onChange={(e) => {handleFileChange(e)}} className="hidden"
             />
             <input 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && handleSend()}
               placeholder="Escribe un mensaje..."
               className="flex-1 bg-transparent border-none outline-none font-semibold px-2"
             />
             <button 
               onClick={handleSend}
               className="bg-sky-500 p-2 rounded-xl hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
          </div>
        </div>

      </main>
    </div>
  );
}