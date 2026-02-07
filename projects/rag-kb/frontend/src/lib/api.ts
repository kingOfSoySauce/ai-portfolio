const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * 向后端 /chat 发送 SSE 流式请求，逐段回调 delta
 *
 * 类比前端经验：
 * - fetch + ReadableStream 就像你用 EventSource 监听服务端推送
 * - 但这里用 POST（EventSource 只支持 GET），所以手动读 stream
 */
export async function streamChat(
  message: string,
  sessionId: string,
  onDelta: (chunk: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
) {
  try {
    const res = await fetch(`${API_BASE}/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`请求失败: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      // SSE 格式: "data: xxx\n\n"
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const chunk = line.slice(6); // 去掉 "data: "
          onDelta(chunk);
        }
      }
    }

    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}
