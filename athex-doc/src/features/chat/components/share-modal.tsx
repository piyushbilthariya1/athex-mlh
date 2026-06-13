"use client";

import * as React from "react";
import { Message } from "@/types/chat.types";
import { cn } from "@/utils/cn";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionName: string;
  messages: Message[];
}

export function ShareModal({ isOpen, onClose, sessionName, messages }: ShareModalProps) {
  const [copiedType, setCopiedType] = React.useState<"link" | "markdown" | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState("");

  React.useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      try {
        const compact = messages.map(m => [m.role === 'user' ? 'u' : 'm', m.content]);
        const json = JSON.stringify(compact);
        const utf8Bytes = new TextEncoder().encode(json);
        let binary = "";
        utf8Bytes.forEach((byte) => binary += String.fromCharCode(byte));
        const base64 = btoa(binary);
        const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        const shareUrl = `${window.location.origin}/share?title=${encodeURIComponent(sessionName)}&data=${urlSafeBase64}`;
        setPreviewUrl(shareUrl);
      } catch (err) {
        console.error("Failed to generate link preview", err);
      }
    }
  }, [isOpen, sessionName, messages]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (!previewUrl) return;
    navigator.clipboard.writeText(previewUrl);
    setCopiedType("link");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyMarkdown = () => {
    try {
      const markdown = `# ${sessionName}\n\n` + 
        messages.map(m => `### ${m.role === 'user' ? 'User' : 'Athex.Doc'}\n\n${m.content}`).join("\n\n");
      navigator.clipboard.writeText(markdown);
      setCopiedType("markdown");
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error("Failed to copy markdown", err);
    }
  };

  const handleDownloadJson = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ title: sessionName, messages }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `athex-chat-${sessionName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Failed to download JSON", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto animate-fade-in">
      <div className="bg-[#2b2b2b] border border-white/10 rounded-[24px] p-6 max-w-[480px] w-full mx-4 shadow-2xl flex flex-col relative animate-scale-up">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-white/80 cursor-pointer transition-colors p-1 rounded-full hover:bg-white/5"
          title="Close dialog"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h3 className="font-sans text-[18px] font-semibold text-white/95 mb-1.5 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E26D5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          Share Chat Session
        </h3>
        <p className="font-sans text-[13px] text-white/50 mb-5 leading-relaxed">
          Generate a read-only url containing a serialized snapshot of this conversation transcript, or export it to markdown format.
        </p>

        {/* Share Link Row */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-white/40">Shareable Web Link</label>
          <div className="flex gap-2 w-full">
            <div className="flex-1 bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-2.5 text-white/60 font-mono text-[12.5px] truncate select-all leading-normal flex items-center">
              {previewUrl || "Generating link..."}
            </div>
            <button
              onClick={handleCopyLink}
              disabled={!previewUrl}
              className={cn(
                "px-4 rounded-xl font-sans text-[13px] font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
                copiedType === "link"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-white text-[#2b2b2b] hover:bg-[#ececec] disabled:opacity-50"
              )}
            >
              {copiedType === "link" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Alternative Exports */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-white/40">Alternative Exports</label>
          <div className="grid grid-cols-2 gap-3 font-sans">
            <button
              onClick={handleCopyMarkdown}
              className={cn(
                "py-3 rounded-xl border flex items-center justify-center gap-2 text-[13px] font-medium transition-colors cursor-pointer",
                copiedType === "markdown"
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                  : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {copiedType === "markdown" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Copy Markdown
                </>
              )}
            </button>
            <button
              onClick={handleDownloadJson}
              className="py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white flex items-center justify-center gap-2 text-[13px] font-medium transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
