"use client";

import * as React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useChatStore } from "@/features/chat/store/use-chat-store";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const router = useRouter();
  const { sessions, activeSessionId, switchSession, deleteSession, projects } = useChatStore();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const handleExportWorkspace = () => {
    const sessionCount = Object.keys(sessions).length;
    if (sessionCount === 0) {
      alert("No active chats to export.");
      return;
    }
    const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `athex-workspace-export-${Date.now()}.json`;
    a.click();
    setIsSettingsOpen(false);
  };

  const handleClearWorkspace = () => {
    const confirmClear = window.confirm("Are you sure you want to reset your workspace? This will permanently delete all chat histories and uploaded documents.");
    if (confirmClear) {
      useChatStore.setState({ sessions: {}, activeSessionId: null });
      setIsSettingsOpen(false);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to terminate your session?");
    if (confirmLogout) {
      await fetch("/api/auth/logout", { method: "POST" });
      switchSession(null);
      router.push("/");
      router.refresh();
    }
  };
  
  // Sidebar Navigation tab state
  const [sidebarTab, setSidebarTab] = React.useState<"chats" | "projects" | "artifacts">("chats");
  
  // Collapse/Expand recents section
  const [isRecentsExpanded, setIsRecentsExpanded] = React.useState(true);
  
  // Project list expanded sections
  const [expandedProjectId, setExpandedProjectId] = React.useState<string | null>(null);
  
  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleItemClick = (action: () => void) => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
    action();
  };
  
  const activeSession = activeSessionId ? sessions[activeSessionId] : null;
  const messages = activeSession?.messages || [];
  const sortedSessions = Object.values(sessions).sort((a, b) => b.createdAt - a.createdAt);

  const handleExport = () => {
    if (!activeSession || messages.length === 0) return;
    if (!activeSessionId) return;
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `athex-export-${activeSessionId}.json`;
    a.click();
  };

  // Close settings when clicking outside or pressing Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <aside 
        className={cn(
          "h-screen bg-[#141414] border-r border-white/[0.03] flex flex-col py-4 hidden md:flex shrink-0 relative z-40 transition-all duration-300 ease-in-out",
          isExpanded ? "w-[260px]" : "w-[64px] items-center"
        )}
      >
        {/* Header Section */}
        <div className={cn("flex items-center", isExpanded ? "mb-6 px-4 justify-between" : "w-full flex-col gap-3 mb-3 pt-2")}>
          {isExpanded ? (
            <div 
              onClick={() => switchSession(null)}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity select-none group"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E26D5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 group-hover:rotate-180">
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
              </svg>
              <span className="font-serif text-[18px] text-[#ececec] font-medium tracking-tight">Athex.Doc</span>
            </div>
          ) : (
            <div className="group relative w-full flex justify-center">
              <div 
                onClick={() => handleItemClick(() => switchSession(null))}
                className="cursor-pointer hover:opacity-90 transition-opacity flex justify-center w-full select-none" 
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E26D5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 hover:rotate-180">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
                </svg>
              </div>
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/[0.08] text-[11px] font-sans text-white/95 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 translate-x-1 scale-95 group-hover:translate-x-2.5 group-hover:scale-100 transition-all duration-200 ease-out z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] select-none">
                Athex Home
              </div>
            </div>
          )}

          <div className={cn("flex items-center", isExpanded ? "gap-2" : "flex-col gap-2 w-full px-2")}>
            <div className="group relative w-full flex justify-center">
              <button 
                className={cn(
                  "text-white/50 hover:text-white transition-all duration-200 flex items-center justify-center border border-transparent", 
                  isExpanded 
                    ? "w-8 h-8 hover:bg-white/5 rounded-lg" 
                    : "w-10 h-10 rounded-xl hover:bg-white/[0.04] hover:border-white/10"
                )}
                onClick={() => {
                  handleItemClick(() => {
                    setSearchQuery("");
                    setIsSearchOpen(true);
                  });
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
              {!isExpanded && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/[0.08] text-[11px] font-sans text-white/95 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 translate-x-1 scale-95 group-hover:translate-x-2.5 group-hover:scale-100 transition-all duration-200 ease-out z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] select-none">
                  Search sessions
                </div>
              )}
            </div>

            <div className="group relative w-full flex justify-center">
              <button 
                className={cn(
                  "text-white/50 hover:text-white transition-all duration-200 flex items-center justify-center border border-transparent", 
                  isExpanded 
                    ? "w-8 h-8 hover:bg-white/5 rounded-lg" 
                    : "w-10 h-10 rounded-xl hover:bg-white/[0.04] hover:border-white/10"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                )}
              </button>
              {!isExpanded && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/[0.08] text-[11px] font-sans text-white/95 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 translate-x-1 scale-95 group-hover:translate-x-2.5 group-hover:scale-100 transition-all duration-200 ease-out z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] select-none">
                  Expand sidebar
                </div>
              )}
            </div>
          </div>
        </div>
        {!isExpanded && <div className="h-[1px] w-8 bg-white/[0.06] mb-4" />}

        {/* Main Tools */}
        <div className={cn("flex flex-col space-y-1 mb-6 px-3", isExpanded ? "items-stretch" : "items-center w-full")}>
          <div className="group relative w-full flex justify-center animate-fade-in">
            <Button 
              variant="ghost" 
              className={cn(
                "h-10 transition-all font-sans font-medium border rounded-xl mb-3",
                isExpanded 
                  ? "justify-start w-full px-4 bg-[#E26D5A]/10 hover:bg-[#E26D5A]/15 border-[#E26D5A]/20 text-[#E26D5A] hover:text-[#E26D5A]" 
                  : "justify-center w-10 p-0 bg-white/5 border-white/5 hover:bg-[#E26D5A]/10 hover:border-[#E26D5A]/20 text-white/80 hover:text-[#E26D5A]"
              )}
              onClick={() => handleItemClick(() => switchSession(null))}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cn(isExpanded && "mr-3")}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              {isExpanded && "New chat"}
            </Button>
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/[0.08] text-[11px] font-sans text-white/95 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 translate-x-1 scale-95 group-hover:translate-x-2.5 group-hover:scale-100 transition-all duration-200 ease-out z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] select-none">
                New chat
              </div>
            )}
          </div>
          {!isExpanded && <div className="h-[1px] w-8 bg-white/[0.06] mb-3" />}

          {/* Chats Tab */}
          <div className="group relative w-full flex justify-center">
            <Button 
              variant="ghost" 
              className={cn(
                "h-10 transition-all font-sans rounded-xl border relative",
                sidebarTab === "chats"
                  ? isExpanded
                    ? "bg-white/[0.04] text-white font-medium hover:bg-white/[0.04] border-white/5" 
                    : "bg-[#E26D5A]/10 text-[#E26D5A] border-[#E26D5A]/25 shadow-[0_2px_8px_rgba(226,109,90,0.12)] font-semibold"
                  : "bg-transparent text-white/60 border-transparent hover:text-white hover:bg-white/[0.02] hover:border-white/5",
                isExpanded ? "justify-start w-full px-3" : "justify-center w-10 p-0"
              )}
              onClick={() => handleItemClick(() => setSidebarTab("chats"))}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(isExpanded && "mr-3")}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {isExpanded && "Chats"}
            </Button>
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/[0.08] text-[11px] font-sans text-white/95 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 translate-x-1 scale-95 group-hover:translate-x-2.5 group-hover:scale-100 transition-all duration-200 ease-out z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] select-none">
                Chats
              </div>
            )}
          </div>

          {/* Projects Tab */}
          <div className="group relative w-full flex justify-center">
            <Button 
              variant="ghost" 
              className={cn(
                "h-10 transition-all font-sans rounded-xl border relative",
                sidebarTab === "projects"
                  ? isExpanded
                    ? "bg-white/[0.04] text-white font-medium hover:bg-white/[0.04] border-white/5" 
                    : "bg-[#E26D5A]/10 text-[#E26D5A] border-[#E26D5A]/25 shadow-[0_2px_8px_rgba(226,109,90,0.12)] font-semibold"
                  : "bg-transparent text-white/60 border-transparent hover:text-white hover:bg-white/[0.02] hover:border-white/5",
                isExpanded ? "justify-start w-full px-3" : "justify-center w-10 p-0"
              )}
              onClick={() => handleItemClick(() => setSidebarTab("projects"))}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(isExpanded && "mr-3")}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              {isExpanded && "Projects"}
            </Button>
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/[0.08] text-[11px] font-sans text-white/95 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 translate-x-1 scale-95 group-hover:translate-x-2.5 group-hover:scale-100 transition-all duration-200 ease-out z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] select-none">
                Projects
              </div>
            )}
          </div>

          {/* Artifacts Tab */}
          <div className="group relative w-full flex justify-center">
            <Button 
              variant="ghost" 
              className={cn(
                "h-10 transition-all font-sans rounded-xl border relative",
                sidebarTab === "artifacts"
                  ? isExpanded
                    ? "bg-white/[0.04] text-white font-medium hover:bg-white/[0.04] border-white/5" 
                    : "bg-[#E26D5A]/10 text-[#E26D5A] border-[#E26D5A]/25 shadow-[0_2px_8px_rgba(226,109,90,0.12)] font-semibold"
                  : "bg-transparent text-white/60 border-transparent hover:text-white hover:bg-white/[0.02] hover:border-white/5",
                isExpanded ? "justify-start w-full px-3" : "justify-center w-10 p-0"
              )}
              onClick={() => handleItemClick(() => setSidebarTab("artifacts"))}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(isExpanded && "mr-3")}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              {isExpanded && "Artifacts"}
            </Button>
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/[0.08] text-[11px] font-sans text-white/95 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 translate-x-1 scale-95 group-hover:translate-x-2.5 group-hover:scale-100 transition-all duration-200 ease-out z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] select-none">
                Artifacts
              </div>
            )}
          </div>
        </div>

        {/* Recents / Projects / Artifacts Content Section */}
        {isExpanded && (
          <div className="flex-1 flex flex-col min-h-0 px-3 select-none">
            {sidebarTab === "chats" && (
              <>
                <div className="flex items-center justify-between px-3 mb-2">
                  <span className="text-[11px] font-sans font-medium text-white/40 tracking-wider">Recents</span>
                  <button 
                    onClick={() => setIsRecentsExpanded(!isRecentsExpanded)}
                    className="text-white/30 hover:text-white/60 transition-colors"
                  >
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={cn("transition-transform duration-200", !isRecentsExpanded && "rotate-180")}
                    >
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                </div>
                
                {isRecentsExpanded && (
                  <ScrollArea className="flex-1">
                    <div className="space-y-1">
                      {sortedSessions.length === 0 ? (
                        <p className="text-white/30 text-[12px] px-3 mt-2">No recent chats.</p>
                      ) : (
                        sortedSessions.map(session => (
                          <div 
                            key={session.id}
                            onClick={() => switchSession(session.id)}
                            className={cn(
                              "group flex items-center justify-between p-2 px-3 rounded-xl cursor-pointer transition-all border",
                              activeSessionId === session.id 
                                ? "bg-[#222222] border-white/5 text-white font-medium shadow-md" 
                                : "bg-transparent border-transparent text-[#9b9b9b] hover:bg-white/[0.02] hover:text-white"
                            )}
                          >
                            <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-2">
                              {session.isStarred && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#E2C044" stroke="#E2C044" strokeWidth="2" className="shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              )}
                              <span className="font-sans text-[13px] truncate">
                                {session.documentName}
                              </span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(session.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/80 transition-opacity shrink-0 p-0.5 rounded-md hover:bg-white/5"
                              title="Delete"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                )}
              </>
            )}

            {sidebarTab === "projects" && (
              <>
                <div className="flex items-center justify-between px-3 mb-2">
                  <span className="text-[11px] font-sans font-medium text-white/40 tracking-wider">Project Folders</span>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="space-y-2">
                    {Object.values(projects).map((project) => {
                      const projectSessions = sortedSessions.filter(s => s.projectId === project.id);
                      const isProjectExpanded = expandedProjectId === project.id;
                      
                      return (
                        <div key={project.id} className="flex flex-col">
                          <div 
                            onClick={() => setExpandedProjectId(isProjectExpanded ? null : project.id)}
                            className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer text-white/70 hover:text-white transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                              <span className="font-sans text-[13px] font-medium truncate max-w-[150px]">
                                {project.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-white/35 font-mono px-1.5 py-0.5 rounded-md bg-white/5 flex items-center gap-1.5">
                              {projectSessions.length}
                              <svg 
                                width="10" 
                                height="10" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2.5" 
                                className={cn("transition-transform duration-200", isProjectExpanded && "rotate-180")}
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </span>
                          </div>
                          
                          {isProjectExpanded && (
                            <div className="pl-6 pr-1 py-1 space-y-1 border-l border-white/5 ml-3.5 mt-0.5">
                              {projectSessions.length === 0 ? (
                                <p className="text-white/20 text-[11px] py-1 font-sans">No documents in folder.</p>
                              ) : (
                                projectSessions.map(session => (
                                  <div 
                                    key={session.id}
                                    onClick={() => switchSession(session.id)}
                                    className={cn(
                                      "flex items-center justify-between p-1.5 px-2.5 rounded-md cursor-pointer transition-colors text-[12px]",
                                      activeSessionId === session.id 
                                        ? "bg-white/10 text-white font-medium" 
                                        : "text-white/50 hover:bg-white/5 hover:text-white"
                                    )}
                                  >
                                    <span className="truncate pr-1 font-sans">{session.documentName}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </>
            )}

            {sidebarTab === "artifacts" && (
              <>
                <div className="flex items-center justify-between px-3 mb-2">
                  <span className="text-[11px] font-sans font-medium text-white/40 tracking-wider">Active Assets</span>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="space-y-1">
                    {sortedSessions.length === 0 ? (
                      <p className="text-white/30 text-[12px] px-3 mt-2">No documents loaded.</p>
                    ) : (
                      sortedSessions.map(session => (
                        <div 
                          key={session.id}
                          onClick={() => switchSession(session.id)}
                          className={cn(
                            "flex items-center gap-2 p-2 px-3 rounded-lg cursor-pointer transition-colors",
                            activeSessionId === session.id 
                              ? "bg-white/10 text-white" 
                              : "text-white/60 hover:bg-white/5 hover:text-white/90"
                          )}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 shrink-0"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                          <div className="flex flex-col min-w-0">
                            <span className="font-sans text-[13px] truncate">
                              {session.documentName}
                            </span>
                            <span className="text-[10px] text-white/30 leading-none mt-0.5">
                              {session.mimeType === "application/pdf" ? "PDF Document" : "Structured File"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
        )}

        {/* User Profile Section */}
        <div className={cn("mt-auto flex items-center border-t border-white/[0.03] pt-4", isExpanded ? "px-4 pb-2" : "px-2 pb-2 flex-col")}>
          <div className="group relative w-full flex justify-center">
            <div 
              className={cn(
                "flex items-center cursor-pointer rounded-xl transition-all duration-200 border border-transparent", 
                isExpanded 
                  ? "w-full p-2 gap-3 hover:bg-white/[0.04] hover:border-white/10" 
                  : "w-10 h-10 justify-center hover:bg-white/[0.04] hover:border-white/10"
              )}
              onClick={() => handleItemClick(() => setIsSettingsOpen(!isSettingsOpen))}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E26D5A] to-[#f79d84] text-white flex items-center justify-center font-sans font-semibold text-[13px] shrink-0 shadow-inner border border-white/10 group-hover:border-[#E26D5A]/50 group-hover:scale-105 transition-all duration-200 relative">
                x0
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#141414]" />
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white/95 truncate">Operator</p>
                  <p className="text-[11px] text-white/40">Free plan</p>
                </div>
              )}
              {isExpanded && (
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  className={cn("text-white/30 transition-transform duration-200", isSettingsOpen && "rotate-180")}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </div>
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/[0.08] text-[11px] font-sans text-white/95 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 translate-x-1 scale-95 group-hover:translate-x-2.5 group-hover:scale-100 transition-all duration-200 ease-out z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] select-none">
                Workspace access & Settings
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Settings Popover */}
      {isSettingsOpen && (
        <div className={cn(
          "fixed bg-[#1a1a1a]/95 backdrop-blur-md border border-white/[0.08] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-2.5 z-50 flex flex-col animate-fade-in", 
          isExpanded ? "left-[20px] w-[220px] bottom-[76px]" : "left-[76px] w-[200px] bottom-[20px]"
        )}>
          {/* Header */}
          <div className="px-2.5 py-2 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#E26D5A] to-[#f79d84] text-white flex items-center justify-center font-sans font-semibold text-[12px] shrink-0 shadow-inner border border-white/10 relative">
              x0
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#1a1a1a]" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-[12.5px] text-white font-semibold leading-none mb-0.5">Operator</p>
              <p className="text-[10px] text-white/45 leading-none">Free plan ({Object.keys(sessions).length} chats)</p>
            </div>
          </div>
          <div className="h-[1px] bg-white/[0.06] my-1.5 mx-1" />

          {/* Premium Pro Card banner */}
          <div className="bg-gradient-to-b from-[#E26D5A]/12 to-[#E26D5A]/5 border border-[#E26D5A]/20 rounded-xl p-3 mb-2 mx-1 select-none text-left">
            <div className="flex items-center gap-1.5 mb-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#E26D5A" stroke="#E26D5A" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span className="text-[10.5px] font-sans font-semibold text-[#E26D5A] uppercase tracking-wider">Athex Pro</span>
            </div>
            <p className="text-[9.5px] text-white/50 leading-relaxed mb-2">Get higher query limits and access to reasoning models.</p>
            <button 
              onClick={() => alert("Athex Pro pricing and upgrades will be available shortly. Stay tuned!")}
              className="w-full py-1 bg-[#E26D5A] hover:bg-[#d85c49] text-white text-[11px] font-sans font-semibold rounded-lg transition-colors shadow-sm"
            >
              Upgrade
            </button>
          </div>

          {/* Action List items */}
          <div className="space-y-0.5">
            <button 
              onClick={handleExportWorkspace}
              className="w-full text-left px-2.5 py-1.5 text-[12.5px] font-sans text-white/70 hover:text-white hover:bg-white/[0.04] rounded-lg flex items-center gap-2 transition-colors border border-transparent hover:border-white/5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>Export all chats</span>
            </button>
            <button 
              onClick={handleClearWorkspace}
              className="w-full text-left px-2.5 py-1.5 text-[12.5px] font-sans text-white/70 hover:text-white hover:bg-white/[0.04] rounded-lg flex items-center gap-2 transition-colors border border-transparent hover:border-white/5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              <span>Reset workspace</span>
            </button>
            
            <div className="h-[1px] bg-white/[0.06] my-1.5 mx-1" />
            
            <button 
              onClick={handleLogout}
              className="w-full text-left px-2.5 py-1.5 text-[12.5px] font-sans text-[#E26D5A] hover:bg-[#E26D5A]/10 rounded-lg flex items-center gap-2 transition-all border border-transparent hover:border-[#E26D5A]/20"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span className="font-semibold">Terminate Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Global Search Dialog Modal */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-24 pointer-events-auto"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="bg-[#2b2b2b] border border-white/10 rounded-[20px] p-4 max-w-[500px] w-full mx-4 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-2.5 mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/40"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                type="text" 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents and sessions..."
                className="w-full bg-transparent text-white placeholder:text-white/30 outline-none font-sans text-[14px]"
              />
            </div>
            
            <div className="text-[11px] font-sans font-semibold text-white/40 uppercase tracking-wider px-2 mb-2">
              Matching Chats ({sortedSessions.filter(s => s.documentName.toLowerCase().includes(searchQuery.toLowerCase())).length})
            </div>
            
            <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1">
              {sortedSessions.filter(s => s.documentName.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <p className="text-white/30 text-[13px] px-2 py-4 font-sans text-center">No matching sessions found.</p>
              ) : (
                sortedSessions
                  .filter(s => s.documentName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(session => (
                    <div 
                      key={session.id}
                      onClick={() => {
                        switchSession(session.id);
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center justify-between p-2.5 px-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 shrink-0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span className="font-sans text-[13.5px] truncate font-medium">{session.documentName}</span>
                      </div>
                      <span className="text-[10px] text-white/30 font-sans">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}