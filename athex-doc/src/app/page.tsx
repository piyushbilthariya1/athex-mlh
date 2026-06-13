import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { cookies } from "next/headers";
import { TerminalMock } from "@/components/layout/terminal-mock";

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get("auth-token")?.value;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)] relative overflow-hidden">
      {/* Engineering Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-hairline)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[var(--color-surface-soft)]/40 to-transparent pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col md:flex-row items-center justify-between px-[var(--spacing-lg)] py-[var(--spacing-section)] max-w-[1200px] mx-auto w-full gap-12 relative z-10">
        <div className="flex-1 flex flex-col gap-8 max-w-[620px] text-left">
          {isAuthenticated && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success)] text-[13px] font-medium w-fit">
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              Session Active
            </div>
          )}
          
          <h1 className="font-serif text-[54px] md:text-[62px] tracking-[-1.5px] leading-[1.08] text-[var(--color-ink)] font-medium">
            Meet your highly <span className="text-[var(--color-primary)] relative whitespace-nowrap">deterministic<span className="absolute -bottom-1 left-0 right-0 h-[4px] bg-[var(--color-primary)]/20 rounded-full" /></span> document analyst.
          </h1>
          
          <p className="font-sans text-[17.5px] text-[var(--color-body-strong)] leading-relaxed">
            Bypass conversational fluff. Upload complex engineering specifications, academic papers, and system architecture diagrams to extract strict, highly structured insights instantly.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-2">
            {isAuthenticated ? (
              <Link href="/workspace">
                <Button 
                  variant="primary" 
                  className="h-[48px] px-8 text-[15px] font-semibold border-2 border-[var(--color-surface-dark)] shadow-[4px_4px_0px_var(--color-surface-dark)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--color-surface-dark)] active:translate-y-0 active:shadow-[2px_2px_0px_var(--color-surface-dark)] transition-all cursor-pointer rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]"
                >
                  Enter Workspace
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button 
                    variant="primary" 
                    className="h-[48px] px-8 text-[15px] font-semibold border-2 border-[var(--color-surface-dark)] shadow-[4px_4px_0px_var(--color-surface-dark)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--color-surface-dark)] active:translate-y-0 active:shadow-[2px_2px_0px_var(--color-surface-dark)] transition-all cursor-pointer rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]"
                  >
                    Request Access
                  </Button>
                </Link>
                <Link href="/login">
                  <Button 
                    variant="secondary" 
                    className="h-[48px] px-8 text-[15px] font-semibold border-2 border-[var(--color-surface-dark)] shadow-[4px_4px_0px_var(--color-surface-dark)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--color-surface-dark)] active:translate-y-0 active:shadow-[2px_2px_0px_var(--color-surface-dark)] transition-all cursor-pointer rounded-xl bg-[var(--color-canvas)] text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]"
                  >
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Typing Console */}
        <div className="flex-1 w-full flex justify-center relative z-10">
          <TerminalMock />
        </div>
      </main>

      {/* Feature Section */}
      <section className="bg-[var(--color-surface-soft)]/50 py-24 border-y border-[var(--color-hairline)] relative z-10">
        <div className="max-w-[1200px] mx-auto w-full px-[var(--spacing-lg)]">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1 max-w-[420px] flex flex-col justify-center">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#cc785c] mb-3">Core Philosophy</span>
              <h2 className="font-serif text-[40px] tracking-[-1px] text-[var(--color-ink)] leading-[1.1] mb-6 font-medium">
                Engineered for maximum signal, minimum noise.
              </h2>
              <p className="font-sans text-[16px] text-[var(--color-body)] leading-relaxed">
                Traditional AI chat interfaces are built for casual conversation. Athex.Doc is an intelligence tool built for rigorous analysis of complex engineering documents.
              </p>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="p-6 bg-[var(--color-canvas)] border-2 border-[var(--color-surface-dark)] rounded-[var(--radius-xl)] shadow-[4px_4px_0px_rgba(24,23,21,0.08)] hover:shadow-[6px_6px_0px_var(--color-primary)] hover:border-[var(--color-primary)] hover:-translate-y-0.5 transition-all duration-300 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 className="font-sans font-semibold text-[16px] text-[var(--color-ink)] mb-2">Deterministic Output</h3>
                <p className="font-sans text-[14px] text-[var(--color-muted)] leading-relaxed">
                  Temperature forced to 0.2. Strict grounding against uploaded source materials to prevent hallucinated data.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 bg-[var(--color-canvas)] border-2 border-[var(--color-surface-dark)] rounded-[var(--radius-xl)] shadow-[4px_4px_0px_rgba(24,23,21,0.08)] hover:shadow-[6px_6px_0px_var(--color-accent-teal)] hover:border-[var(--color-accent-teal)] hover:-translate-y-0.5 transition-all duration-300 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)] border border-[var(--color-accent-teal)]/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <h3 className="font-sans font-semibold text-[16px] text-[var(--color-ink)] mb-2">Infinite Context</h3>
                <p className="font-sans text-[14px] text-[var(--color-muted)] leading-relaxed">
                  Leveraging Google Gemini's massive 2M+ token window to ingest entire codebases and textbook PDFs simultaneously.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 bg-[var(--color-canvas)] border-2 border-[var(--color-surface-dark)] rounded-[var(--radius-xl)] shadow-[4px_4px_0px_rgba(24,23,21,0.08)] hover:shadow-[6px_6px_0px_var(--color-accent-amber)] hover:border-[var(--color-accent-amber)] hover:-translate-y-0.5 transition-all duration-300 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-amber)]/10 text-[var(--color-accent-amber)] border border-[var(--color-accent-amber)]/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3 className="font-sans font-semibold text-[16px] text-[var(--color-ink)] mb-2">Secure Isolation</h3>
                <p className="font-sans text-[14px] text-[var(--color-muted)] leading-relaxed">
                  Enterprise-grade JWT architecture. Your uploaded specifications and analysis sessions remain completely encrypted.
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-6 bg-[var(--color-canvas)] border-2 border-[var(--color-surface-dark)] rounded-[var(--radius-xl)] shadow-[4px_4px_0px_rgba(24,23,21,0.08)] hover:shadow-[6px_6px_0px_var(--color-success)] hover:border-[var(--color-success)] hover:-translate-y-0.5 transition-all duration-300 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <h3 className="font-sans font-semibold text-[16px] text-[var(--color-ink)] mb-2">Zero Latency UI</h3>
                <p className="font-sans text-[14px] text-[var(--color-muted)] leading-relaxed">
                  Built on Next.js Edge infrastructure. Enjoy lightning fast interface responses without frustrating load spinners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="bg-[var(--color-canvas)] py-32 relative z-10">
        <div className="max-w-[1200px] mx-auto w-full px-[var(--spacing-lg)] text-center">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#cc785c] mb-3 block">Simple Execution</span>
          <h2 className="font-serif text-[44px] tracking-[-1px] text-[var(--color-ink)] leading-[1.1] mb-20 font-medium">
            Intelligence flow in three steps.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[var(--color-hairline)]" />
            
            {/* Step 1 */}
            <div className="relative flex flex-col items-center group">
              <div className="w-14 h-14 bg-[var(--color-surface-soft)] rounded-full border-2 border-[var(--color-surface-dark)] flex items-center justify-center text-[18px] font-serif font-bold text-[var(--color-ink)] mb-6 shadow-[3px_3px_0px_var(--color-surface-dark)] group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)] transition-all duration-300 z-10 select-none">
                1
              </div>
              <h3 className="font-sans font-semibold text-[18px] text-[var(--color-ink)] mb-3">Upload Source</h3>
              <p className="font-sans text-[14.5px] text-[var(--color-muted)] px-4 leading-relaxed">
                Drop your dense PDF specifications into the analyst matrix interface.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center group">
              <div className="w-14 h-14 bg-[var(--color-surface-soft)] rounded-full border-2 border-[var(--color-surface-dark)] flex items-center justify-center text-[18px] font-serif font-bold text-[var(--color-ink)] mb-6 shadow-[3px_3px_0px_var(--color-surface-dark)] group-hover:bg-[var(--color-accent-teal)] group-hover:text-white group-hover:border-[var(--color-accent-teal)] transition-all duration-300 z-10 select-none">
                2
              </div>
              <h3 className="font-sans font-semibold text-[18px] text-[var(--color-ink)] mb-3">Vector Parsing</h3>
              <p className="font-sans text-[14.5px] text-[var(--color-muted)] px-4 leading-relaxed">
                The Gemini engine processes millions of tokens to map the semantic topology.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center group">
              <div className="w-14 h-14 bg-[var(--color-surface-soft)] rounded-full border-2 border-[var(--color-surface-dark)] flex items-center justify-center text-[18px] font-serif font-bold text-[var(--color-ink)] mb-6 shadow-[3px_3px_0px_var(--color-surface-dark)] group-hover:bg-[var(--color-accent-amber)] group-hover:text-white group-hover:border-[var(--color-accent-amber)] transition-all duration-300 z-10 select-none">
                3
              </div>
              <h3 className="font-sans font-semibold text-[18px] text-[var(--color-ink)] mb-3">Extract Value</h3>
              <p className="font-sans text-[14.5px] text-[var(--color-muted)] px-4 leading-relaxed">
                Query the document and receive deterministic, highly structured insights instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-surface-dark)] py-16 mt-auto relative z-10 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto w-full px-[var(--spacing-lg)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-on-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
                </svg>
                <span className="font-serif text-[20px] tracking-[-0.5px] text-[var(--color-on-dark)] font-medium">Athex</span>
              </div>
              <p className="font-sans text-[14px] text-[var(--color-on-dark-soft)] max-w-[320px] leading-relaxed">
                Engineered for strict technical data extractions. Zero latency, zero hallucinations.
              </p>
            </div>
            
            <div>
              <h4 className="font-sans font-semibold text-[13px] uppercase tracking-wider text-white/40 mb-4">Product</h4>
              <ul className="space-y-2.5 font-sans text-[14px] text-[var(--color-on-dark-soft)]">
                <li className="hover:text-white transition-colors cursor-pointer">Features</li>
                <li className="hover:text-white transition-colors cursor-pointer">Integrations</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-sans font-semibold text-[13px] uppercase tracking-wider text-white/40 mb-4">Resources</h4>
              <ul className="space-y-2.5 font-sans text-[14px] text-[var(--color-on-dark-soft)]">
                <li className="hover:text-white transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-white transition-colors cursor-pointer">API Reference</li>
                <li className="hover:text-white transition-colors cursor-pointer">System Status</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 text-[12px] font-sans text-white/20 text-left">
            © {new Date().getFullYear()} Athex. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
