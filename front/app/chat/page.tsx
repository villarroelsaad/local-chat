"use client";
import {  useRef, useEffect } from "react";
import { useChatStore } from "@/store/userAuthStore";

import { Chat } from "./chat";
export default function ChatWindow() {

  const { messages, isLoading, loadHistory } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);


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


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-black text-white">    
        <Chat />
    </div>
  );
}