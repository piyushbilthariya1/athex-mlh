"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to sign up");
      }

      // Automatically login after signup
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) throw new Error("Account created, but failed to login automatically");

      router.push("/workspace");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-canvas)] relative overflow-hidden">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#181715] p-12 flex-col justify-between relative overflow-hidden select-none border-r border-white/5">
        {/* Glow highlights */}
        <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-[#cc785c]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(226,109,90,0.15)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 mb-16 hover:opacity-85 transition-opacity w-fit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-on-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#E26D5A]">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
            </svg>
            <span className="font-serif text-[24px] font-medium tracking-[-0.5px] text-[var(--color-on-dark)]">Athex.Doc</span>
          </Link>
          <h2 className="font-serif text-[46px] tracking-[-1px] text-[var(--color-on-dark)] leading-[1.15] max-w-[420px] font-medium">
            Generate a new operator identity.
          </h2>
          <p className="mt-6 font-sans text-[15.5px] text-[var(--color-on-dark-soft)] max-w-[400px] leading-relaxed">
            Gain immediate access to deterministic data extraction models and private vector storage architecture.
          </p>

          {/* Secure Keys Handshake Widget */}
          <div className="border border-white/10 bg-white/[0.02] p-6 rounded-2xl max-w-[400px] mt-12 font-mono text-[13px] text-white/70 leading-relaxed shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-1.5 mb-4 text-[10px] uppercase tracking-widest text-white/30 font-sans font-bold">session setup</div>
            <div className="text-[#5db8a6]">► Handshake protocol required...</div>
            <div className="text-[#5db8a6]">► Generating secure JWT keys...</div>
            <div className="text-[#cc785c] animate-pulse">► Awaiting credentials setup...</div>
          </div>
        </div>
        
        {/* Nominal status indicator */}
        <div className="relative z-10 flex items-center gap-2 w-fit">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          <span className="font-mono text-[11px] text-[var(--color-success)] uppercase tracking-widest font-semibold">Systems Nominal</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-[var(--spacing-lg)] relative z-10">
        {/* Subtle right-side grid */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-hairline)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        <div className="w-full max-w-[420px] relative z-10">
          <Link href="/" className="lg:hidden inline-flex items-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors mb-12 font-sans text-[13.5px] font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>

          <div className="mb-10">
            <h1 className="font-serif text-[38px] tracking-[-0.5px] leading-[1.15] text-[var(--color-ink)] mb-3 font-medium">
              Request Access
            </h1>
            <p className="font-sans text-[14.5px] text-[var(--color-muted)]">
              Create an operator identity to access the matrix.
            </p>
          </div>

          {error && (
            <div className="p-4 mb-8 text-[14px] text-[var(--color-error)] bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-[var(--radius-lg)] flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-sans text-[11px] font-bold text-[var(--color-muted)] mb-2 uppercase tracking-wider">
                Operator Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[48px] px-4 bg-[var(--color-surface-soft)]/50 border-2 border-[var(--color-surface-dark)] focus:border-[var(--color-primary)] focus:bg-[var(--color-canvas)] rounded-xl font-sans text-[15px] text-[var(--color-ink)] outline-none transition-all shadow-[2px_2px_0px_var(--color-surface-dark)] focus:shadow-[4px_4px_0px_var(--color-primary)]"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block font-sans text-[11px] font-bold text-[var(--color-muted)] mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[48px] px-4 bg-[var(--color-surface-soft)]/50 border-2 border-[var(--color-surface-dark)] focus:border-[var(--color-primary)] focus:bg-[var(--color-canvas)] rounded-xl font-sans text-[15px] text-[var(--color-ink)] outline-none transition-all shadow-[2px_2px_0px_var(--color-surface-dark)] focus:shadow-[4px_4px_0px_var(--color-primary)]"
                placeholder="operator@athex.com"
              />
            </div>
            <div>
              <label className="block font-sans text-[11px] font-bold text-[var(--color-muted)] mb-2 uppercase tracking-wider">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[48px] pl-4 pr-12 bg-[var(--color-surface-soft)]/50 border-2 border-[var(--color-surface-dark)] focus:border-[var(--color-primary)] focus:bg-[var(--color-canvas)] rounded-xl font-sans text-[15px] text-[var(--color-ink)] outline-none transition-all shadow-[2px_2px_0px_var(--color-surface-dark)] focus:shadow-[4px_4px_0px_var(--color-primary)]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer focus:outline-none p-1 rounded-md"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[48px] text-[15px] font-semibold border-2 border-[var(--color-surface-dark)] shadow-[4px_4px_0px_var(--color-surface-dark)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--color-surface-dark)] active:translate-y-0 active:shadow-[2px_2px_0px_var(--color-surface-dark)] transition-all cursor-pointer rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] disabled:opacity-50 mt-8"
            >
              {isLoading ? "Generating Identity..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-8 text-center font-sans text-[14px] text-[var(--color-muted)]">
            Already have an identity?{" "}
            <Link href="/login" className="text-[var(--color-primary)] hover:underline font-semibold transition-all">
              Initialize session
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
