"use client";

import * as React from "react";

const TERMINAL_LINES = [
  { text: "► Loading target vector schema...", delay: 500, color: "text-[#5db8a6]" },
  { text: "► Initializing Gemini 2.5 context frame...", delay: 600, color: "text-[#5db8a6]" },
  { text: "► Analysing 14,841 lines of specifications...", delay: 900, color: "text-[#cc785c]" },
  { text: "✓ Grounding engine on source parameters (temp 0.2)", delay: 600, color: "text-[#5db872]" },
  { text: "✓ Integrity check complete. Athex.Doc operational.", delay: 400, color: "text-[#5db872]" },
  { text: "", delay: 100, color: "" },
  { text: "System Status Matrix:", delay: 300, color: "text-white font-semibold" },
  { text: "  - Grounding Guard: ACTIVE", delay: 150, color: "text-white/80" },
  { text: "  - Hallucination Threshold: < 0.01%", delay: 150, color: "text-white/80" },
  { text: "  - Max Window Limit: 2,097,152 Tokens", delay: 150, color: "text-white/80" }
];

export function TerminalMock() {
  const [visibleLines, setVisibleLines] = React.useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = React.useState(0);
  const [typedText, setTypedText] = React.useState("");
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    if (currentLineIndex >= TERMINAL_LINES.length) {
      setIsComplete(true);
      return;
    }

    const currentItem = TERMINAL_LINES[currentLineIndex];
    
    // For empty spacing line, just transition immediately
    if (currentItem.text === "") {
      setVisibleLines((prev) => [...prev, ""]);
      setCurrentLineIndex((prev) => prev + 1);
      return;
    }

    let charIndex = 0;
    setTypedText("");

    const typingTimer = setInterval(() => {
      if (charIndex < currentItem.text.length) {
        setTypedText((prev) => prev + currentItem.text.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(typingTimer);
        // Wait for the line's specific pause duration, then commit it
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, currentItem.text]);
          setTypedText("");
          setCurrentLineIndex((prev) => prev + 1);
        }, currentItem.delay);
      }
    }, 20); // Speed of character rendering

    return () => clearInterval(typingTimer);
  }, [currentLineIndex]);

  return (
    <div className="w-full max-w-[500px] bg-[#181715] rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden font-mono text-[13px] leading-relaxed min-h-[300px] flex flex-col justify-between select-none">
      {/* Glow highlight effects */}
      <div className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] bg-[#cc785c]/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-[100px] -left-[100px] w-[200px] h-[200px] bg-[#5db8a6]/10 rounded-full blur-[80px] pointer-events-none" />

      <div>
        {/* Window Bar Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#c64545]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#e8a55a]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#5db872]" />
          </div>
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-sans font-semibold">Live Analyst Matrix</span>
        </div>

        {/* Typed Lines Stream */}
        <div className="flex flex-col gap-1.5">
          {visibleLines.map((line, idx) => {
            const setup = TERMINAL_LINES[idx];
            return (
              <div key={idx} className={setup?.color || "text-white/70"}>
                {line}
              </div>
            );
          })}
          
          {/* Line active typing cursor state */}
          {!isComplete && TERMINAL_LINES[currentLineIndex] && (
            <div className={TERMINAL_LINES[currentLineIndex].color || "text-white/70"}>
              {typedText}
              <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-white/75 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Done Prompt */}
      {isComplete && (
        <div className="text-[#5db8a6]/70 mt-4 pt-4 border-t border-white/5 flex items-center gap-1 shrink-0">
          <span>athex-operator:~ $ ready</span>
          <span className="inline-block w-1.5 h-3.5 bg-[#5db8a6] animate-pulse" />
        </div>
      )}
    </div>
  );
}
