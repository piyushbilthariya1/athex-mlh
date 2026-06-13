import Link from "next/link";
import { Button } from "../ui/button";
import { cookies } from "next/headers";
import { LogoutButton } from "./logout-button";

export async function Navbar({ fullWidth = false }: { fullWidth?: boolean }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  return (
    <nav className="h-[64px] w-full bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] sticky top-0 z-10 flex-shrink-0">
      <div className={`${fullWidth ? "w-full" : "max-w-[1200px] mx-auto w-full"} h-full px-[var(--spacing-lg)] flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
          </svg>
          <Link href="/" className="font-serif text-[24px] font-medium tracking-[-0.5px] text-[var(--color-ink)]">
            Athex.Doc
          </Link>
        </div>
      <div className="flex items-center gap-4">
        {token ? (
          <>
            <span className="font-sans text-[14px] font-medium text-[var(--color-muted)]">Operator Workspace</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="secondary" className="h-[32px] px-4 text-[13px]">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" className="h-[32px] px-4 text-[13px]">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
      </div>
    </nav>
  );
}