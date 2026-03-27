import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendMessageToAI } from '@/app/services/ia_message';
import { getChatHistory } from '@/app/services/chatHistory';

interface AuthState {
  user: string | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

// 1. INTERFAZ COMPLETA (Debe coincidir EXACTAMENTE con el store)
interface ChatState {
  messages: { question: string; answer: string }[];
  fullHistory: any[];
  currentSessionId: string | null; // <--- FALTABA AQUÍ
  isLoading: boolean;
  
  addMessage: (question: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  loadHistoryById: (sessionId: string) => Promise<void>; // <--- AHORA RECIBE EL ID (string)
  loadSidebar: () => Promise<void>;
  createNewChat: () => void; // <--- FALTABA AQUÍ
  setMessages: (messages: { question: string; answer: string }[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (username: string) => set({ user: username, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' } 
  )
);

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  fullHistory: [],
  currentSessionId: null, 
  isLoading: false,

  setMessages: (messages) => set({ messages }),

  createNewChat: () => {
    set({ messages: [], currentSessionId: null });
  },

  loadHistory: async () => {
    set({ isLoading: true });
    try {
      const history = await getChatHistory();
      set({ fullHistory: history, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addMessage: async (question: string) => {
    set({ isLoading: true });
    const sessionId = get().currentSessionId || `sess_${Date.now()}`;

    try {
      const data = await sendMessageToAI(question, sessionId);
      
      set((state) => ({
        messages: [...state.messages, { question, answer: data.reply }],
        currentSessionId: sessionId,
        isLoading: false
      }));

      get().loadSidebar(); 
    } catch (error) {
      console.error("Error al enviar:", error);
      set({ isLoading: false });
    }
  },

  loadHistoryById: async (sessionId: string) => {
    set({ isLoading: true, currentSessionId: sessionId });
    try {
      // Importante: Si fullHistory está vacío, lo cargamos primero
      if (get().fullHistory.length === 0) {
        await get().loadSidebar();
      }
      
      const { fullHistory } = get();
      const conversation = fullHistory.filter((h: any) => h.session_id === sessionId);
      
      set({ messages: conversation, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  loadSidebar: async () => {
    try {
      const data = await getChatHistory();
      set({ fullHistory: data });
    } catch (error) {
      console.error("Error cargando sidebar:", error);
    }
  },
}));