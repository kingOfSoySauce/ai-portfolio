"use client";

import { Sidebar } from "@/components/sidebar";
import { ChatPanel } from "@/components/chat-panel";
import { useChat } from "@/hooks/use-chat";

export default function Home() {
  const {
    sessions,
    activeSession,
    activeId,
    isStreaming,
    send,
    newSession,
    switchSession,
    deleteSession,
  } = useChat();

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onNew={newSession}
        onSwitch={switchSession}
        onDelete={deleteSession}
      />
      <main className="flex-1">
        <ChatPanel
          session={activeSession}
          isStreaming={isStreaming}
          onSend={send}
        />
      </main>
    </div>
  );
}
