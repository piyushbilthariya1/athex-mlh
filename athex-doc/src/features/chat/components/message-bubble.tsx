import * as React from "react";
import { cn } from "@/utils/cn";
import { Message } from "@/types/chat.types";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null);

  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadAloud = () => {
    if (typeof window === "undefined") return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      // Remove markdown markup elements for cleaner speech synthesis
      const cleanText = message.content.replace(/[*_#`~>-]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleFeedback = (type: "like" | "dislike") => {
    setFeedback((prev) => (prev === type ? null : type));
  };

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-6">
        <div className="max-w-[80%] bg-[#333333] text-[#ececec] px-5 py-3 rounded-[1.25rem] rounded-tr-[4px] font-sans text-[16px] leading-relaxed shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start mb-8 pr-4 md:pr-12 group">
      <div className="flex gap-4 w-full">
        {/* Animated Glowing Squircle Bot Avatar */}
        <div className="w-9 h-9 rounded-xl bg-[#E26D5A]/10 border border-[#E26D5A]/30 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(226,109,90,0.12)] relative overflow-hidden group-hover:border-[#E26D5A]/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#E26D5A]/0 to-[#E26D5A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E26D5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-500 group-hover:rotate-45">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Modern Premium Sans-Serif Typography */}
          <div className="font-sans text-[15.5px] text-[#ececec]/90 leading-[1.65] tracking-normal [&>p]:mb-4 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:mb-1.5 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol>li]:mb-1.5 [&>table]:w-full [&>table]:mb-4 [&_th]:border [&_th]:border-white/10 [&_th]:p-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-white/[0.02] [&_td]:border [&_td]:border-white/10 [&_td]:p-2.5 [&_td]:text-white/80 [&>pre]:bg-[#1b1b1b] [&>pre]:text-white/95 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:mb-4 [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-white/5 [&_code]:font-mono [&_code]:text-[13.5px] [&_code]:text-[#E26D5A] [&_code]:bg-[#E26D5A]/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:rounded-none [&>pre>code]:text-white/90">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Glassmorphic Floating Action Toolbar */}
          <div className="inline-flex items-center gap-0.5 mt-3 px-1 py-1 bg-[#252525]/90 backdrop-blur-md border border-white/[0.06] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 ease-out select-none">
            {/* Copy Button */}
            <button 
              onClick={handleCopy}
              className={cn(
                "p-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-150 cursor-pointer flex items-center justify-center relative",
                copied && "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15"
              )} 
              title={copied ? "Copied!" : "Copy message text"}
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              )}
            </button>
            
            {/* Read Aloud Button */}
            <button 
              onClick={handleReadAloud}
              className={cn(
                "p-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-150 cursor-pointer flex items-center justify-center relative",
                isPlaying && "text-[#E26D5A] bg-[#E26D5A]/10 hover:bg-[#E26D5A]/15"
              )} 
              title={isPlaying ? "Stop speech" : "Read aloud"}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <rect x="15" y="9" width="6" height="6" rx="1" fill="currentColor"></rect>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
              )}
            </button>

            {/* Like Feedback Button */}
            <button 
              onClick={() => handleFeedback("like")}
              className={cn(
                "p-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-150 cursor-pointer flex items-center justify-center relative",
                feedback === "like" && "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15"
              )} 
              title="Good response"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={feedback === "like" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            </button>

            {/* Dislike Feedback Button */}
            <button 
              onClick={() => handleFeedback("dislike")}
              className={cn(
                "p-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-150 cursor-pointer flex items-center justify-center relative",
                feedback === "dislike" && "text-rose-400 bg-rose-500/10 hover:bg-rose-500/15"
              )} 
              title="Bad response"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={feedback === "dislike" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}