"use client";

import * as React from "react";
import { FileDrop } from "@/features/upload/components/file-drop";
import { ChatBox } from "@/features/chat/components/chat-box";
import { DocumentData } from "@/hooks/use-document";
import { useChatStore } from "@/features/chat/store/use-chat-store";
import { useFileProcessor } from "@/features/upload/hooks/use-file-processor";
import { cn } from "@/utils/cn";
import { ShareModal } from "@/features/chat/components/share-modal";

export default function WorkspacePage() {
  const { 
    activeSessionId, 
    sessions, 
    createSession, 
    importSession,
    switchSession, 
    deleteSession,
    toggleStarSession,
    renameSession,
    setSessionProject,
    projects
  } = useChatStore();
  const activeSession = activeSessionId ? sessions[activeSessionId] : null;

  // Handle Session Import from shared links
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const isImport = urlParams.get("import") === "true";
      const importTitle = urlParams.get("title");
      const importData = urlParams.get("data");

      if (isImport && importTitle && importData) {
        try {
          // Decode URL safe Base64
          let base64 = importData.replace(/-/g, '+').replace(/_/g, '/');
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

          if (Array.isArray(compact)) {
            const importedMessages = compact.map(([role, content]: [string, string], index: number) => ({
              id: `${Date.now()}-${index}`,
              role: (role === 'u' ? 'user' : 'model') as "user" | "model",
              content
            }));

            // Atomically import and switch focus
            const newId = importSession(importTitle, importedMessages);
            switchSession(newId);

            // Clean up the URL parameters
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
        } catch (err) {
          console.error("Failed to parse and import shared session data", err);
        }
      }
    }
  }, [importSession, switchSession]);

  const [initialInput, setInitialInput] = React.useState("");

  // UI Modal/Dropdown states
  const [showProjectSubmenu, setShowProjectSubmenu] = React.useState(false);
  const [isRenameOpen, setIsRenameOpen] = React.useState(false);
  const [renameInput, setRenameInput] = React.useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [isShareOpen, setIsShareOpen] = React.useState(false);

  const handleProcessComplete = (data: DocumentData) => {
    const sessionId = createSession(data.file.name, data.base64, data.mimeType);
    if (initialInput.trim()) {
      sessionStorage.setItem(`initial_query_${sessionId}`, initialInput.trim());
    }
  };

  const handleSendGeneralChat = () => {
    if (!initialInput.trim()) return;
    const firstWords = initialInput.trim().split(" ").slice(0, 3).join(" ");
    const sessionTitle = `General Chat: ${firstWords}`;
    const sessionId = createSession(sessionTitle, "", "");
    sessionStorage.setItem(`initial_query_${sessionId}`, initialInput.trim());
    setInitialInput("");
  };

  const { 
    handleFileInput, 
    isProcessing,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useFileProcessor(handleProcessComplete);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const triggerUpload = () => fileInputRef.current?.click();

  const [isTitleMenuOpen, setIsTitleMenuOpen] = React.useState(false);
  const titleMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (titleMenuRef.current && !titleMenuRef.current.contains(event.target as Node)) {
        setIsTitleMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedSessions = Object.values(sessions).sort((a, b) => b.createdAt - a.createdAt);
  const totalQueries = sortedSessions.reduce((acc, session) => acc + session.messages.length, 0);

  // View for Active Sessions
  if (activeSession) {
    return (
      <div className="flex flex-col h-full w-full bg-[#2b2b2b] text-white relative">
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 h-[60px] flex items-center justify-start px-4 shrink-0 z-10 pointer-events-none">
          <div className="relative" ref={titleMenuRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors pointer-events-auto"
              onClick={() => {
                setIsTitleMenuOpen(!isTitleMenuOpen);
                setShowProjectSubmenu(false);
              }}
              title="Session options"
            >
              <div className="flex flex-col items-start select-none">
                {activeSession.projectId && projects[activeSession.projectId] && (
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-[#E26D5A] mb-0.5 leading-none">
                    {projects[activeSession.projectId].name}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[14px] font-medium text-white/90 truncate max-w-[400px]">
                    {activeSession.documentName}
                  </span>
                  {activeSession.isStarred && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#E2C044" stroke="#E2C044" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
            
            {/* Dropdown Menu */}
            {isTitleMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-[220px] bg-[#333333] border border-white/5 rounded-xl shadow-2xl py-2 z-50 pointer-events-auto">
                {!showProjectSubmenu ? (
                  <>
                    <button 
                      onClick={() => {
                        if (activeSessionId) {
                          toggleStarSession(activeSessionId);
                        }
                      }}
                      className="w-full text-left px-4 py-2.5 text-[14px] font-sans text-[#ececec] hover:bg-white/5 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill={activeSession.isStarred ? "#E2C044" : "none"} 
                          stroke={activeSession.isStarred ? "#E2C044" : "currentColor"} 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span>{activeSession.isStarred ? "Unstar" : "Star"}</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setRenameInput(activeSession.documentName);
                        setIsRenameOpen(true);
                        setIsTitleMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[14px] font-sans text-[#ececec] hover:bg-white/5 flex items-center gap-3 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      Rename
                    </button>
                    
                    <button 
                      onClick={() => setShowProjectSubmenu(true)}
                      className="w-full text-left px-4 py-2.5 text-[14px] font-sans text-[#ececec] hover:bg-white/5 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <span>Add to project</span>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                    
                    <div className="h-[1px] bg-white/10 my-2 mx-4" />
                    
                    <button 
                      className="w-full text-left px-4 py-2.5 text-[14px] font-sans text-[#E26D5A] hover:bg-[#E26D5A]/10 flex items-center gap-3 transition-colors"
                      onClick={() => {
                        setIsDeleteConfirmOpen(true);
                        setIsTitleMenuOpen(false);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowProjectSubmenu(false)}
                      className="w-full text-left px-4 py-1.5 text-[11px] font-sans text-white/40 hover:bg-white/5 flex items-center gap-2 transition-colors border-b border-white/5 mb-1"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      Back
                    </button>
                    {Object.values(projects).map((project) => (
                      <button 
                        key={project.id}
                        onClick={() => {
                          if (activeSessionId) {
                            setSessionProject(activeSessionId, project.id);
                          }
                          setIsTitleMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[13px] font-sans text-white/80 hover:bg-white/5 flex items-center justify-between transition-colors"
                      >
                        <span className="truncate max-w-[150px]">{project.name}</span>
                        {activeSession.projectId === project.id && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E26D5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        )}
                      </button>
                    ))}
                    {activeSession.projectId && (
                      <button 
                        onClick={() => {
                          if (activeSessionId) {
                            setSessionProject(activeSessionId, null);
                          }
                          setIsTitleMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 mt-1 text-[13px] font-sans text-[#E26D5A] hover:bg-[#E26D5A]/10 transition-colors border-t border-white/5 flex items-center gap-2"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        Remove from Project
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsShareOpen(true)}
            className="absolute right-4 h-[32px] px-4 bg-[#383838] hover:bg-[#444] border border-white/5 rounded-lg text-[13px] font-sans font-medium text-white/90 transition-colors pointer-events-auto shadow-sm cursor-pointer"
          >
            Share
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-h-0 flex flex-col w-full pt-[60px]">
          <ChatBox documentBase64={activeSession.documentBase64} mimeType={activeSession.mimeType} />
        </div>

        {/* Rename Modal Overlay */}
        {isRenameOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
            <div className="bg-[#2b2b2b] border border-white/10 rounded-[20px] p-6 max-w-[400px] w-full mx-4 shadow-2xl flex flex-col">
              <h3 className="font-sans text-[18px] font-semibold text-white/90 mb-2">Rename Chat Session</h3>
              <p className="font-sans text-[13px] text-white/50 mb-4">Enter a new display title for this document workspace.</p>
              <input 
                type="text" 
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                placeholder="Session Name"
                className="w-full bg-[#1e1e1e] border border-white/10 focus:border-[#E26D5A] rounded-xl px-4 py-2.5 text-white outline-none font-sans text-[14px] mb-6 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && renameInput.trim()) {
                    if (activeSessionId) {
                      renameSession(activeSessionId, renameInput.trim());
                    }
                    setIsRenameOpen(false);
                  }
                }}
              />
              <div className="flex justify-end gap-3 font-sans">
                <button 
                  onClick={() => setIsRenameOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 text-[13px] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!renameInput.trim()}
                  onClick={() => {
                    if (activeSessionId && renameInput.trim()) {
                      renameSession(activeSessionId, renameInput.trim());
                    }
                    setIsRenameOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-[#2b2b2b] hover:bg-[#ececec] font-medium text-[13px] transition-colors disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal Overlay */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
            <div className="bg-[#2b2b2b] border border-white/10 rounded-[20px] p-6 max-w-[400px] w-full mx-4 shadow-2xl flex flex-col">
              <h3 className="font-sans text-[18px] font-semibold text-white/90 mb-2">Delete Chat Session?</h3>
              <p className="font-sans text-[13px] text-white/50 mb-6">
                Are you sure you want to delete <span className="text-white font-medium">"{activeSession.documentName}"</span>? This will permanently erase the chat history.
              </p>
              <div className="flex justify-end gap-3 font-sans">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 text-[13px] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (activeSessionId) {
                      deleteSession(activeSessionId);
                    }
                    setIsDeleteConfirmOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E26D5A] hover:bg-[#d85c49] text-white font-medium text-[13px] transition-colors"
                >
                  Delete Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        <ShareModal 
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          sessionName={activeSession.documentName}
          messages={activeSession.messages}
        />
      </div>
    );
  }

  // Dashboard Home View for Empty State
  return (
    <div className="flex flex-col min-h-full items-center justify-center p-[var(--spacing-lg)] md:p-[var(--spacing-xl)] bg-[#2b2b2b] w-full relative">
      {/* Absolute top right elements mirroring the screenshot */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[12px] text-white/70 font-sans">
          Athex.Doc · <span className="text-white">Active</span>
        </div>
      </div>

      <div className="w-full max-w-[800px] flex flex-col items-center mt-[-10vh]">
        
        {/* Star Icon + Greeting */}
        <div className="flex items-center gap-4 mb-10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E26D5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
          </svg>
          <h1 className="font-serif text-[36px] tracking-[-0.5px] text-[#e8e6e3] font-medium">
            Back at it, Operator
          </h1>
        </div>

        {/* Central Input Box */}
        <div 
          className={cn(
            "w-full max-w-[720px] bg-[#2f2f2f] rounded-[24px] p-3 flex flex-col shadow-2xl border relative transition-all mb-2 z-10",
            isDragging ? "border-[#E26D5A] ring-1 ring-[#E26D5A]/50 bg-[#333]" : "border-white/5 hover:border-white/20"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Visual Dropzone Area */}
          <div 
            className="w-full bg-[#222222] rounded-[16px] border border-white/5 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#262626] transition-colors group mb-2"
            onClick={triggerUpload}
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/70" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <p className="text-[14px] font-sans text-white/80 font-medium tracking-wide">Upload a document</p>
            <p className="text-[12px] font-sans text-white/40 mt-1">Drag and drop or click to browse (PDF, TXT, CSV)</p>
          </div>

          {/* Ask Question Area */}
          <div className="flex flex-col px-2">
            <textarea 
              value={initialInput}
              onChange={(e) => setInitialInput(e.target.value)}
              placeholder="What do you want to know? Type a message..." 
              className="w-full bg-transparent text-[#ececec] placeholder:text-[#6a6a6a] resize-none outline-none pt-2 pb-2 text-[15px] min-h-[44px] font-sans"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendGeneralChat();
                }
              }}
            />
            <div className="flex justify-between items-center mt-2 pb-1">
              <div></div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={triggerUpload}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white rounded-full text-[13px] font-sans font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                  title="Upload a document to start analysis"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  Upload & Analyze
                </button>
                {initialInput.trim() && (
                  <button 
                    onClick={handleSendGeneralChat}
                    className="px-4 py-1.5 bg-white text-[#2b2b2b] rounded-full text-[13px] font-sans font-semibold hover:bg-[#ececec] transition-colors flex items-center gap-1.5 shadow-sm animate-fade-in"
                  >
                    Send
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {isProcessing && (
            <div className="absolute inset-0 bg-[#2f2f2f]/80 backdrop-blur-sm rounded-[24px] flex items-center justify-center z-20">
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-[#E26D5A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-[14px] font-sans font-medium text-white/90">Processing asset...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Pills */}
        <div className="flex flex-wrap gap-3 mt-8 justify-center z-20">
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".pdf,text/plain,text/markdown,text/csv,application/pdf"
          />
          <button onClick={triggerUpload} className="px-4 py-2 rounded-full border border-white/10 text-white/70 text-[13px] font-sans flex items-center gap-2 hover:bg-white/5 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            Parse Codebase
          </button>
          <button onClick={triggerUpload} className="px-4 py-2 rounded-full border border-white/10 text-white/70 text-[13px] font-sans flex items-center gap-2 hover:bg-white/5 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Extract Text
          </button>
          <button onClick={triggerUpload} className="px-4 py-2 rounded-full border border-white/10 text-white/70 text-[13px] font-sans flex items-center gap-2 hover:bg-white/5 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Learn Platform
          </button>
        </div>

      </div>
    </div>
  );
}