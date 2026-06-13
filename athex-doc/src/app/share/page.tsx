"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ScrollArea } from "@/components/ui/scroll-area";

function SharedChatView() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Shared Transcript";
  const data = searchParams.get("data") || "";

  const [messages, setMessages] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!data) {
      setError("No shared transcript snapshot found in the link.");
      return;
    }

    try {
      // Decode URL safe Base64
      let base64 = data.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const json = new TextDecoder().decode(bytes);
      const compact = JSON.parse(json);
      
      if (!Array.isArray(compact)) {
        throw new Error("Invalid compact payload layout.");
      }

      const decoded = compact.map(([role, content]: [string, string], index: number) => ({
        id: index.toString(),
        role: role === 'u' ? 'user' : 'model',
        content
      }));

      setMessages(decoded);
    } catch (err) {
      console.error(err);
      setError("Failed to decode the shared conversation transcript. The URL might be incomplete or corrupted.");
    }
  }, [data]);

  const handleImportToWorkspace = () => {
    if (typeof window !== "undefined") {
      window.location.href = `/workspace?import=true&title=${encodeURIComponent(title)}&data=${data}`;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#2b2b2b] text-white">
      {/* Top Navbar */}
      <header className="h-[60px] border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#252525]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E26D5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
          </svg>
          <span className="font-serif text-[17px] text-[#ececec] font-medium tracking-tight">Athex.Doc</span>
          <span className="text-[10px] uppercase font-sans font-semibold bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-white/50">Shared Snapshot</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleImportToWorkspace}
            disabled={messages.length === 0}
            className="h-[32px] px-4 bg-[#E26D5A] hover:bg-[#d85c49] disabled:opacity-50 text-white rounded-lg text-[13px] font-sans font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Import to Workspace
          </button>
          <a 
            href="/workspace" 
            className="h-[32px] px-4 bg-[#383838] hover:bg-[#444] border border-white/5 rounded-lg text-[13px] font-sans font-medium text-white/90 transition-colors flex items-center justify-center shadow-sm"
          >
            Open Dashboard
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-start p-4 md:p-6 w-full">
        <div className="w-full max-w-[800px] flex flex-col h-full bg-[#2f2f2f]/40 border border-white/5 rounded-[24px] overflow-hidden shadow-2xl relative">
          
          {/* Header Info Panel */}
          <div className="px-6 py-4 border-b border-white/5 bg-[#252525]/30 flex flex-col gap-1 shrink-0">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#E26D5A]">Document / Subject Title</span>
            <h2 className="font-sans text-[15px] font-medium text-white/95 truncate">
              {title}
            </h2>
          </div>

          {/* Transcript Log list */}
          <ScrollArea className="flex-1 pr-1">
            <div className="px-6 py-6 flex flex-col gap-6">
              {error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4 font-sans">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 animate-pulse">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  </div>
                  <p className="text-[14px] text-white/80 font-medium max-w-[400px]">
                    {error}
                  </p>
                  <a 
                    href="/workspace" 
                    className="mt-6 px-5 py-2 bg-white text-[#2b2b2b] hover:bg-[#ececec] font-sans font-medium text-[13px] rounded-xl transition-colors shadow-sm"
                  >
                    Go to Workspace
                  </a>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-white/30 font-sans">
                  Loading chat transcript snapshot...
                </div>
              ) : (
                messages.map((message) => {
                  const isUser = message.role === "user";
                  if (isUser) {
                    return (
                      <div key={message.id} className="flex w-full justify-end">
                        <div className="max-w-[80%] bg-[#333333] text-[#ececec] px-5 py-3 rounded-[1.25rem] rounded-tr-[4px] font-sans text-[15.5px] leading-relaxed shadow-sm">
                          {message.content}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={message.id} className="flex w-full justify-start pr-4 md:pr-12">
                      <div className="flex gap-4 w-full">
                        {/* Static Premium Squircle Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-[#E26D5A]/10 border border-[#E26D5A]/30 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(226,109,90,0.12)]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E26D5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
                          </svg>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Markdown typography styled exact to active chat bubbles */}
                          <div className="font-sans text-[15.5px] text-[#ececec]/90 leading-[1.65] tracking-normal [&>p]:mb-4 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:mb-1.5 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol>li]:mb-1.5 [&>table]:w-full [&>table]:mb-4 [&_th]:border [&_th]:border-white/10 [&_th]:p-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-white/[0.02] [&_td]:border [&_td]:border-white/10 [&_td]:p-2.5 [&_td]:text-white/80 [&>pre]:bg-[#1b1b1b] [&>pre]:text-white/95 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:mb-4 [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-white/5 [&_code]:font-mono [&_code]:text-[13.5px] [&_code]:text-[#E26D5A] [&_code]:bg-[#E26D5A]/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:rounded-none [&>pre>code]:text-white/90">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}

export default function SharedChatPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-[#2b2b2b] text-white/40 font-sans">
        Initializing share client...
      </div>
    }>
      <SharedChatView />
    </React.Suspense>
  );
}
