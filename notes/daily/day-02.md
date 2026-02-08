# Day 2 - SSE 流式聊天接口 + APIRouter 路由分离

## TL;DR（一句话结论）
用 FastAPI 的 `APIRouter` + `StreamingResponse` + Python 异步生成器，实现了 SSE 流式聊天接口，先用 fake_llm 跑通链路，后续替换真 LLM 只需改一个函数。

---

## 3 组要点

### 一、核心概念：从前端视角理解后端路由

**1. FastAPI 实例 vs axios 实例——方向反了**

前端习惯用 `axios.create()` 创建共享实例给各 api 文件用，因为前端是"发请求的人"，需要共享 baseURL、拦截器、token。

后端完全反过来——你是"接请求的人"。api 文件不需要持有 app 实例，只管定义自己能处理什么路由。

| 前端（发请求） | 后端（接请求） |
|---|---|
| `axios.create()` 创建客户端实例 | `FastAPI()` 创建服务端实例 |
| `api/user.js` 用 axios 实例发请求 | `api/chat.py` 用 Router 定义路由 |
| 多个 api 文件共享同一个 axios 实例 | 多个 api 文件的 router 被 app 统一挂载 |

**2. APIRouter ≈ React Router 的 Route**
```
用户请求 → main.py (app) → 根据 path 分发 → 对应的 api 文件处理
```
- `app = FastAPI()` ≈ `<App />`，全局只有一个
- `router = APIRouter()` ≈ `<Route />`，每个 api 文件创建自己的
- `app.include_router(chat.router, prefix="/chat")` ≈ `<Route path="/chat" element={<Chat />} />`
- 路由注册发生在启动时，不是每次请求都经过 main.py 转发

**3. Pydantic BaseModel ≈ TypeScript interface + zod**
```python
class ChatRequest(BaseModel):
    message: str
    session_id: str = ""  # 有默认值 = 可选字段 ≈ TS 的 ?
```
一个 class 同时做三件事：
- 类型声明（≈ TS interface）
- 运行时校验（≈ zod.parse）
- 自动生成 API 文档（FastAPI 读取 model 生成 /docs 表单）

**4. Python import ≈ JS import**
- 每个文件独立导入，不存在"全局注册"
- `chat.py` 只需要 `APIRouter`、`StreamingResponse`、`BaseModel`
- 不需要导入 `FastAPI`（那是 main.py 的事）

---

### 二、SSE 流式输出实现

**1. SSE 是什么**
- `fetch` = 一次请求一次响应
- `WebSocket` = 双向长连接
- `SSE` = 服务端单向推送，客户端只读（介于两者之间）

**2. Python 异步生成器 ≈ JS async generator**

JS 写法：
```js
async function* fakeLLM(msg) {
  for (const char of msg) {
    await sleep(50)
    yield `data: ${char}\n\n`
  }
}
```

Python 写法（结构完全一样）：
```python
async def fake_llm(msg):
    for char in msg:
        await asyncio.sleep(0.05)
        yield f"data: {char}\n\n"
```

关键语法点：
- `for char in msg` — 遍历字符串直接拿到字符（不是索引）
- `yield` — 在循环体里用，不是赋值语句
- `f"data: {char}\n\n"` — Python 模板字符串 ≈ JS 反引号 `` `${var}` ``
- `asyncio.sleep(0.05)` — 单位是秒，不是毫秒

**3. StreamingResponse ≈ new Response(readableStream)**
```python
StreamingResponse(
    fake_llm(request.message),
    media_type="text/event-stream"  # 告诉浏览器这是 SSE 流
)
```
- 接收一个生成器（会不断 yield 数据的函数），不是静态 dict
- SSE 数据格式固定：`data: 内容\n\n`（两个换行分隔）

---

### 三、踩坑记录

**1. `python` vs `python3`**
- macOS 上 Python 3 的命令是 `python3`，不是 `python`
- 创建虚拟环境：`python3 -m venv .venv`
- 激活虚拟环境：`source .venv/bin/activate`（创建和激活是两步）

**2. Swagger UI 不支持流式展示**
- `/docs` 页面会等整个响应结束后才一次性显示
- 这是 Swagger UI 的限制，不是代码问题
- 验证流式用 curl：
```bash
curl -X POST http://localhost:8000/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}' \
  --no-buffer
```

**3. yield 语法错误**
- ❌ `yield = msg[x] for x in msg`（混合了赋值和推导式）
- ❌ `yield msg[x]`（x 已经是字符本身，不是索引）
- ✅ `yield f"data: {x}\n\n"`（在 for 循环体里逐个 yield）

**4. 路由函数参数**
- ❌ `async def chat(BaseModel):` — 这是在说"参数叫 BaseModel"
- ✅ `async def chat(request: ChatRequest):` — 参数名: 类型

---

## 今日交付文件

```
backend/app/
├── api/
│   ├── __init__.py        # 新增：api 包初始化
│   └── chat.py            # 新增：SSE 流式聊天接口
└── main.py                # 修改：挂载 chat router
```

### chat.py 最终版
```python
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: str = ""

async def fake_llm(msg):
    for x in msg:
        await asyncio.sleep(0.5)
        yield f"data: {x}\n\n"

@router.post("/")
async def chat(request: ChatRequest):
    """流式响应聊天消息"""
    return StreamingResponse(
        fake_llm(request.message), media_type="text/event-stream"
    )
```

### main.py 修改点
```python
# 取消注释，挂载 chat router
from app.api import chat
app.include_router(chat.router, prefix="/chat", tags=["chat"])
```

---

## 验收结果

- ✅ `http://localhost:8000/docs` 能看到 `/chat/` 接口
- ✅ curl 测试能看到逐字输出（每 0.5 秒一个字符）
- ✅ 请求日志正常记录

---

## TODO（下一步）

- [ ] **前端页面**：用 `fetch` + `getReader()` 消费 SSE，实现浏览器端逐字渲染
- [ ] **优化 sleep 时间**：0.5s 太慢，改成 0.05s（50ms）更接近真实 LLM 体验
- [ ] **Day3 目标**：结构化输出（JSON Schema / Pydantic 校验）
- [ ] **复现练习**：24 小时内不看笔记，重新写 chat.py（只看 TODO 提示）

### 复现检查清单
1. 能否不看笔记创建 `APIRouter` 并在 `main.py` 挂载？
2. 能否写出异步生成器（async def + yield）？
3. 能否说清楚 SSE 数据格式（`data: xxx\n\n`）？
4. 能否解释 `StreamingResponse` 为什么接收生成器而不是 dict？
