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
  
 const { 
  messages, 
  addMessage, 
  isLoading, 
  loadHistory, 
  fullHistory, 
  loadHistoryById,
  createNewChat,   
  currentSessionId,
  selectedModel,
  setSelectedModel
} = useChatStore();

  useEffect(() => {
    loadHistory();
  }, []);

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
  // Agrupamos el historial por session_id para mostrar solo un botón por charla
const chatSessions = fullHistory.reduce((acc: any[], current: any) => {
  const x = acc.find(item => item.session_id === current.session_id);
  if (!x) {
    // Si no existe esta sesión en nuestro acumulador, la añadimos
    return acc.concat([current]);
  } else {
    return acc;
  }
}, []);

return (
  <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
{/* --- SIDEBAR --- */}
<aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 overflow-hidden`}>
  <div className="p-4 border-b border-gray-800 flex items-center gap-3">
    <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
      IA
    </div>
    <span className="font-bold text-lg overflow-hidden whitespace-nowrap text-gray-100">
      Historial
    </span>
  </div>

  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
    {/* Model Selector */}
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
        Modelo IA
      </label>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-sky-500"
      >
        <option value="phi3">Phi-3</option>
        <option value="llama2:7b">Llama 2 7B</option>
        <option value="mistral">Mistral</option>
        <option value="codellama">Code Llama</option>
      </select>
    </div>

    {/* New conversation */}
    <button 
      onClick={() => createNewChat()} 
      className="w-full text-left p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-sm font-medium hover:bg-gray-700 hover:border-sky-500/50 transition-all mb-4 text-sky-400 flex items-center gap-2 group"
    >
      <span className="text-xl group-hover:scale-125 transition-transform">+</span> 
      Nueva Conversación
    </button>
    
    <div className="px-3 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
      Recientes
    </div>
    
    {/* history mapping */}
    {chatSessions.length > 0 ? (
      chatSessions.map((chat: any, index: number) => (
        <div 
          key={chat.id || chat.session_id || `session-${index}`} 
          onClick={() => loadHistoryById(chat.session_id)} 
          className={`group p-3 text-sm rounded-xl cursor-pointer transition-all border border-transparent flex flex-col gap-0.5
            ${currentSessionId === chat.session_id 
              ? 'bg-sky-500/20 text-white border-sky-500/30' 
              : 'text-gray-400 hover:bg-sky-500/10 hover:text-white hover:border-sky-500/20'}`}
        >
          <p className="truncate font-medium pr-2">{chat.question}</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-600 group-hover:text-sky-400/70 transition-colors">
              {chat.created_at ? new Date(chat.created_at).toLocaleDateString() : 'Reciente'}
            </span>
            <span className="text-[10px] opacity-0 group-hover:opacity-100 text-sky-500 transition-opacity">
              Ver chat →
            </span>
          </div>
        </div>
      ))
    ) : (
      <div className="p-4 text-xs text-gray-600 text-center italic">
        there is no history yet...
      </div>
    )}
  </div>

  {/*  Log Out */}
  <div className="p-4 border-t border-gray-800 bg-gray-900/50">
    <button 
      onClick={handleLogOut}
      className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium group"
    >
      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span className="overflow-hidden whitespace-nowrap">Cerrar Sesión</span>
    </button>
  </div>
</aside>
    {/* --- Principal content --- */}
    <main className="flex-1 flex flex-col relative min-w-0">
      
      {/* Header */}
      <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-md">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle Sidebar"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-400">Model:</span>
          <span className="text-sm font-bold text-sky-400">Phi-3 (Ollama)</span>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        {messages.length === 0 && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
             <div className="text-6xl mb-4">💬</div>
             <p className="text-xl font-medium">Inicia una conversación</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="max-w-3xl mx-auto space-y-6">
              <div className="flex justify-end">
                <div className="bg-sky-600 px-4 py-2 rounded-2xl rounded-tr-none max-w-[85%] shadow-lg text-white">
                  {m.question}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-sky-400">IA</div>
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
             <div className="space-y-2 flex-1">
               <div className="h-4 bg-gray-800 rounded w-1/4"></div>
               <div className="h-10 bg-gray-800 rounded-2xl w-3/4"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Flotante */}
      <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
        <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl flex items-center p-2 shadow-2xl focus-within:border-sky-500/50 transition-colors">
           <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-sky-400 transition-colors"
            title="Subir archivo"
           >
             {uploading ? (
               <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
             ) : (
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
               </svg>
             )}
           </button>
           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
           />
           <input 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
             placeholder="Escribe un mensaje..."
             className="flex-1 bg-transparent border-none outline-none font-medium px-2 text-white placeholder:text-gray-500"
           />
           <button 
             onClick={handleSend}
             disabled={!input.trim() || isLoading}
             className="bg-sky-500 p-2 rounded-xl hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:hover:bg-sky-500 disabled:shadow-none"
           >
             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
           </button>
        </div>
      </div>
    </main>
  </div>
)}