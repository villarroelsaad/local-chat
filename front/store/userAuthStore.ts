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

interface ChatState {
  messages: { question: string; answer: string }[];
  isLoading: boolean;
  addMessage: (question: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (username: string) => set({ 
        user: username, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage', // LocalStorage key name
    } 
  )
);

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,

loadHistory: async () => {
  set({ isLoading: true });
  try {
    // No pasamos parámetros, el servidor sabe quiénes somos por la cookie
    const history = await getChatHistory(); 

    const formattedHistory = history.map((h: any) => ({
      question: h.question,
      answer: h.answer
    }));

    set({ messages: formattedHistory, isLoading: false });
  } catch (error) {
    console.error("Error:", error);
    set({ isLoading: false });
  }
},

  addMessage: async (question: string) => {
    set({ isLoading: true });
    try {
      const data = await sendMessageToAI(question);
      set((state) => ({
        messages: [...state.messages, { question, answer: data.reply }],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));