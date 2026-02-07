"use client";

import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 py-3",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <Avatar className="h-7 w-7 shrink-0 rounded-md">
        <AvatarFallback
          className={cn(
            "rounded-md text-xs",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted/60 text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap break-words">
          {message.content}
          {isStreaming && !isUser && (
            <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-current align-text-bottom" />
          )}
        </p>

        {/* Timestamp */}
        <p
          className={cn(
            "mt-1.5 font-mono text-[10px]",
            isUser ? "text-primary-foreground/50" : "text-muted-foreground/60",
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
