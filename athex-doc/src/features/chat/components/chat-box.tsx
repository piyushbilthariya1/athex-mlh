"use client";

import * as React from "react";
import { useChatStore } from "../store/use-chat-store";
import { MessageBubble } from "./message-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface ChatBoxProps {
  documentBase64?: string | null;
  mimeType?: string | null;
}

const MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Default model, optimized for speed and accuracy" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", description: "Advanced reasoning and complex analysis" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "High context window legacy model" }
];

export function ChatBox({ documentBase64, mimeType }: ChatBoxProps) {
  const { 
    isGenerating, 
    error, 
    setGenerating, 
    setError, 
    addMessage, 
    updateLastMessage, 
    sessions, 
    activeSessionId
  } = useChatStore();
  
  const activeSession = activeSessionId ? sessions[activeSessionId] : null;
  const messages = activeSession?.messages || [];
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  // Model Selector State
  const [selectedModel, setSelectedModel] = React.useState("gemini-2.5-flash");
  const [isModelMenuOpen, setIsModelMenuOpen] = React.useState(false);
  const modelMenuRef = React.useRef<HTMLDivElement>(null);

  // Textarea Auto-sizing
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Voice Input State
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  // Close menus when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
        setIsModelMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Textarea Auto-resize Effect
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Speech Recognition Setup
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            setInput((prev) => prev + (prev.endsWith(" ") || !prev ? "" : " ") + finalTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Auto-submit initial onboarding query if present
  React.useEffect(() => {
    if (activeSessionId && messages.length === 0) {
      const initialQuery = sessionStorage.getItem(`initial_query_${activeSessionId}`);
      if (initialQuery) {
        sessionStorage.removeItem(`initial_query_${activeSessionId}`);
        triggerAutoSubmit(initialQuery);
      }
    }
  }, [activeSessionId, messages.length]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const triggerAutoSubmit = async (queryText: string) => {
    if (isGenerating) return;
    setInput("");
    setError(null);
    
    addMessage({ id: Date.now().toString(), role: "user", content: queryText });
    addMessage({ id: (Date.now() + 1).toString(), role: "model", content: "" });
    setGenerating(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: queryText, 
          base64: documentBase64 || "",
          mimeType: mimeType || "",
          model: selectedModel
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        updateLastMessage(text);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    
    // Stop recording if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    
    addMessage({ id: Date.now().toString(), role: "user", content: userMessage });
    addMessage({ id: (Date.now() + 1).toString(), role: "model", content: "" });
    
    setGenerating(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMessage, 
          base64: documentBase64 || "",
          mimeType: mimeType || "",
          model: selectedModel
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch analysis.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        updateLastMessage(text);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-transparent max-w-[800px] mx-auto pb-4 relative">
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="p-[var(--spacing-lg)] md:px-8 py-4 flex flex-col gap-6 min-h-full pb-10">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-white/40 font-sans">
              Ask a question about your uploaded document to begin analysis.
            </div>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
        </div>
      </ScrollArea>
      
      <div className="px-4 shrink-0 flex flex-col items-center justify-end w-full">
        <div className="w-full bg-[#2f2f2f] rounded-[24px] px-2 py-2 flex flex-col shadow-xl border border-white/5 relative mb-2">
          {error && <p className="text-[#E26D5A] text-[13px] mb-2 font-medium px-2">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-start pl-2">
              <textarea 
                ref={textareaRef}
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Write a message..." 
                disabled={isGenerating}
                className="w-full bg-transparent text-[#ececec] placeholder:text-[#8a8a8a] resize-none outline-none px-2 pt-[14px] pb-2 text-[16px] min-h-[56px] max-h-[200px] font-sans scrollbar-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <div className="flex justify-between items-center px-2 pb-1 mt-1">
              <div></div>
              <div className="flex items-center gap-2">
                {/* Model Selector Dropdown */}
                <div className="relative" ref={modelMenuRef}>
                  <div 
                    onClick={() => !isGenerating && setIsModelMenuOpen(!isModelMenuOpen)}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 text-[13px] text-[#8a8a8a] hover:text-white/80 transition-colors font-sans cursor-pointer select-none rounded-md hover:bg-white/5",
                      isGenerating && "pointer-events-none opacity-50"
                    )}
                  >
                    {MODELS.find(m => m.id === selectedModel)?.name || "Gemini 2.5 Flash"}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                  
                  {isModelMenuOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-[280px] bg-[#333333] border border-white/5 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-3 py-1.5 text-[11px] font-sans font-semibold text-white/40 uppercase tracking-wider">
                        Select Model
                      </div>
                      {MODELS.map((model) => (
                        <button
                          key={model.id}
                          type="button"
                          className={cn(
                            "w-full text-left px-3 py-2.5 text-[13px] font-sans transition-colors flex flex-col hover:bg-white/5",
                            selectedModel === model.id ? "text-white" : "text-white/60"
                          )}
                          onClick={() => {
                            setSelectedModel(model.id);
                            setIsModelMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center justify-between w-full font-medium">
                            <span>{model.name}</span>
                            {selectedModel === model.id && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E26D5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            )}
                          </div>
                          <div className="text-[11px] text-white/40 mt-0.5 leading-relaxed">
                            {model.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice Input Button */}
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={toggleListening}
                  disabled={isGenerating}
                  className={cn(
                    "rounded-full w-8 h-8 p-0 transition-colors flex items-center justify-center",
                    isListening 
                      ? "text-[#E26D5A] bg-[#E26D5A]/10 border border-[#E26D5A]/30 hover:bg-[#E26D5A]/20 hover:text-[#E26D5A] animate-pulse" 
                      : "text-[#8a8a8a] hover:bg-white/5 hover:text-white"
                  )}
                  title={isListening ? "Stop voice transcription" : "Voice message input"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                </Button>

                {/* Send Button */}
                {input.trim() && !isGenerating ? (
                  <Button 
                    type="submit" 
                    className="rounded-full w-8 h-8 p-0 bg-white text-[#2b2b2b] hover:bg-[#ececec] transition-colors ml-1 flex items-center justify-center shrink-0 shadow-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                  </Button>
                ) : null}
              </div>
            </div>
          </form>
        </div>
        <p className="text-[12px] text-[#8a8a8a] font-sans mb-1">
          Athex is AI and can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
}