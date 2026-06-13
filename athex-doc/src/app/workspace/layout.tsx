import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex bg-[#2b2b2b] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#2b2b2b]">
        {children}
      </main>
    </div>
  );
}
