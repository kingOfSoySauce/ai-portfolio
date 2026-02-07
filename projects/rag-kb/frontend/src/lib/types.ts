/** 单条聊天消息 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

/** 会话 */
export interface Session {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}
