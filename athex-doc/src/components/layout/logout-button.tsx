"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useChatStore } from "@/features/chat/store/use-chat-store";

export function LogoutButton() {
  const router = useRouter();
  const { switchSession } = useChatStore();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    switchSession(null);
    router.push("/");
    router.refresh();
  };

  return (
    <Button variant="secondary" className="h-[32px] px-3 text-[13px]" onClick={handleLogout}>
      Terminate Session
    </Button>
  );
}
