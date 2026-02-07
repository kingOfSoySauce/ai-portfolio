"use client";

import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "@/components/message-bubble";
import { ChatInput } from "@/components/chat-input";
import type { Session } from "@/lib/types";

interface ChatPanelProps {
  session: Session;
  isStreaming: boolean;
  onSend: (text: string) => void;
}

export function ChatPanel({ session, isStreaming, onSend }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 新消息时自动滚到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h1 className="text-sm font-medium text-foreground">
          {session.title || "新对话"}
        </h1>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          {session.messages.length} 条消息
        </span>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-3xl py-4">
          {session.messages.length === 0 ? (
            <EmptyState />
          ) : (
            session.messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isStreaming={
                  isStreaming &&
                  msg.role === "assistant" &&
                  i === session.messages.length - 1
                }
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 rounded-xl bg-muted/50 p-4">
        <MessageSquare className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h2 className="mb-1 text-sm font-medium text-foreground">
        开始对话
      </h2>
      <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
        输入任意消息测试 SSE 流式输出。当前使用 fake-llm 模式，会逐字回显你的输入。
      </p>
    </div>
  );
}
