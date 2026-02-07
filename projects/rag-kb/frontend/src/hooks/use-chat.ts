"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage, Session } from "@/lib/types";
import { streamChat } from "@/lib/api";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function createSession(): Session {
  return {
    id: uid(),
    title: "新对话",
    createdAt: Date.now(),
    messages: [],
  };
}

export function useChat() {
  const [sessions, setSessions] = useState<Session[]>(() => [createSession()]);
  const [activeId, setActiveId] = useState(() => sessions[0].id);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(false);

  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0];

  /** 向当前会话追加消息 */
  const pushMessage = useCallback(
    (msg: ChatMessage) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                messages: [...s.messages, msg],
                // 用第一条用户消息做标题
                title:
                  s.messages.length === 0 && msg.role === "user"
                    ? msg.content.slice(0, 20)
                    : s.title,
              }
            : s,
        ),
      );
    },
    [activeId],
  );

  /** 更新最后一条 assistant 消息的 content（流式追加） */
  const appendToLast = useCallback(
    (chunk: string) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeId) return s;
          const msgs = [...s.messages];
          const last = msgs[msgs.length - 1];
          if (last?.role === "assistant") {
            msgs[msgs.length - 1] = {
              ...last,
              content: last.content + chunk,
            };
          }
          return { ...s, messages: msgs };
        }),
      );
    },
    [activeId],
  );

  /** 发送消息 */
  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      // 同时 push 用户消息 + 空的 assistant 占位（用于流式追加）
      const assistantMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                messages: [...s.messages, userMsg, assistantMsg],
                title:
                  s.messages.length === 0
                    ? text.trim().slice(0, 20)
                    : s.title,
              }
            : s,
        ),
      );

      setIsStreaming(true);
      abortRef.current = false;

      await streamChat(
        text.trim(),
        activeId,
        (chunk) => {
          if (!abortRef.current) appendToLast(chunk);
        },
        () => setIsStreaming(false),
        (err) => {
          console.error("Stream error:", err);
          appendToLast("\n\n[连接中断]");
          setIsStreaming(false);
        },
      );
    },
    [activeId, isStreaming, pushMessage, appendToLast],
  );

  /** 新建会话 */
  const newSession = useCallback(() => {
    const s = createSession();
    setSessions((prev) => [s, ...prev]);
    setActiveId(s.id);
  }, []);

  /** 切换会话 */
  const switchSession = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  /** 删除会话 */
  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (next.length === 0) {
          const fresh = createSession();
          next.push(fresh);
        }
        if (id === activeId) {
          setActiveId(next[0].id);
        }
        return next;
      });
    },
    [activeId],
  );

  return {
    sessions,
    activeSession,
    activeId,
    isStreaming,
    send,
    newSession,
    switchSession,
    deleteSession,
  };
}
