import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect("/login");
  }

  return (
    <div className="h-screen w-full flex bg-[#2b2b2b] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#2b2b2b]">
        {children}
      </main>
    </div>
  );
}
