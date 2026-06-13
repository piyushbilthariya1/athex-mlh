import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { Message } from '@/types/chat.types';

const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export interface ChatSession {
  id: string;
  documentName: string;
  documentBase64: string;
  mimeType: string;
  messages: Message[];
  createdAt: number;
  isStarred?: boolean;
  projectId?: string | null;
}

interface ChatState {
  sessions: Record<string, ChatSession>;
  activeSessionId: string | null;
  isGenerating: boolean;
  error: string | null;
  projects: Record<string, { id: string, name: string }>;
  
  createSession: (docName: string, base64: string, mimeType: string) => string;
  importSession: (title: string, messages: Message[]) => string;
  switchSession: (id: string | null) => void;
  deleteSession: (id: string) => void;
  
  addMessage: (message: Message) => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  clearActiveSession: () => void;
  updateLastMessage: (content: string) => void;
  
  toggleStarSession: (id: string) => void;
  renameSession: (id: string, newName: string) => void;
  setSessionProject: (sessionId: string, projectId: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: {},
      activeSessionId: null,
      isGenerating: false,
      error: null,
      projects: {
        "1": { id: "1", name: "Engineering Documents" },
        "2": { id: "2", name: "Financial Audits" },
        "3": { id: "3", name: "Research Papers" }
      },
      
      createSession: (docName, base64, mimeType) => {
        const id = crypto.randomUUID();
        set((state) => ({
          sessions: {
            ...state.sessions,
            [id]: {
              id,
              documentName: docName,
              documentBase64: base64,
              mimeType,
              messages: [],
              createdAt: Date.now(),
            }
          },
          activeSessionId: id,
        }));
        return id;
      },
      
      importSession: (title, messages) => {
        const id = crypto.randomUUID();
        set((state) => ({
          sessions: {
            ...state.sessions,
            [id]: {
              id,
              documentName: title,
              documentBase64: "",
              mimeType: "",
              messages,
              createdAt: Date.now(),
            }
          },
          activeSessionId: id,
        }));
        return id;
      },
      
      switchSession: (id) => set({ activeSessionId: id }),
      
      deleteSession: (id) => set((state) => {
        const newSessions = { ...state.sessions };
        delete newSessions[id];
        return {
          sessions: newSessions,
          activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
        };
      }),

      addMessage: (message) => set((state) => {
        if (!state.activeSessionId) return state;
        const session = state.sessions[state.activeSessionId];
        return {
          sessions: {
            ...state.sessions,
            [state.activeSessionId]: {
              ...session,
              messages: [...session.messages, message]
            }
          }
        };
      }),
      
      setGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),
      
      clearActiveSession: () => set((state) => {
        if (!state.activeSessionId) return state;
        const session = state.sessions[state.activeSessionId];
        return {
          sessions: {
            ...state.sessions,
            [state.activeSessionId]: {
              ...session,
              messages: []
            }
          },
          error: null
        };
      }),
      
      updateLastMessage: (content) => set((state) => {
        if (!state.activeSessionId) return state;
        const session = state.sessions[state.activeSessionId];
        const newMessages = [...session.messages];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].content += content;
        }
        return {
          sessions: {
            ...state.sessions,
            [state.activeSessionId]: {
              ...session,
              messages: newMessages
            }
          }
        };
      }),
      
      toggleStarSession: (id) => set((state) => {
        const session = state.sessions[id];
        if (!session) return state;
        return {
          sessions: {
            ...state.sessions,
            [id]: {
              ...session,
              isStarred: !session.isStarred
            }
          }
        };
      }),
      
      renameSession: (id, newName) => set((state) => {
        const session = state.sessions[id];
        if (!session) return state;
        return {
          sessions: {
            ...state.sessions,
            [id]: {
              ...session,
              documentName: newName
            }
          }
        };
      }),
      
      setSessionProject: (sessionId, projectId) => set((state) => {
        const session = state.sessions[sessionId];
        if (!session) return state;
        return {
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              projectId
            }
          }
        };
      }),
    }),
    {
      name: 'athex-chat-idb',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ 
        sessions: state.sessions, 
        activeSessionId: state.activeSessionId,
        projects: state.projects 
      }),
    }
  )
);