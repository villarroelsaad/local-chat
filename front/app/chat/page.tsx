"use client";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/userAuthStore";
import { uploadDocument } from "@/app/services/files"
import { logOut } from "@/app/services/logOut";
import { Chat } from "./chat";
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

    useEffect(() => {
      loadHistory();
    }, [])
  

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
        <Chat />
    </div>
  );
}