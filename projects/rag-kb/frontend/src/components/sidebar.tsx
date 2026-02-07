"use client";

import { Plus, MessageSquare, Trash2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Session } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  sessions: Session[];
  activeId: string;
  onNew: () => void;
  onSwitch: (id: string) => void;
  onDelete: (id: string) => void;
}

export function Sidebar({
  sessions,
  activeId,
  onNew,
  onSwitch,
  onDelete,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4">
        <Database className="h-5 w-5 text-primary" />
        <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
          RAG-KB
        </span>
        <span className="ml-auto rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          v0.1
        </span>
      </div>

      <Separator />

      {/* New chat button */}
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-sm"
          onClick={onNew}
        >
          <Plus className="h-4 w-4" />
          新对话
        </Button>
      </div>

      {/* Session list */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5 pb-4">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSwitch(s.id)}
              className={cn(
                "group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                s.id === activeId
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 truncate">
                {s.title || "新对话"}
              </span>
              <Trash2
                className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
              />
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <Separator />
      <div className="px-4 py-3">
        <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
          FastAPI + FAISS + SSE
          <br />
          Day 2 — 流式聊天
        </p>
      </div>
    </aside>
  );
}
