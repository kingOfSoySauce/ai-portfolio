# rag-kb — 文档知识库问答系统

14 天主项目：从零实现一个可投递的 RAG 产品。

**目标**：RAG + 工具调用 + 前端界面 + 工程化（失败策略/日志/评估/面试卡片）

## 技术栈
- **后端**：FastAPI + Uvicorn + Pydantic
- **向量库**：FAISS（本地）
- **Embedding**：sentence-transformers（本地，不依赖 API Key）
- **前端**：HTML + JS（SSE 流式）
- **工程化**：超时/重试/降级、请求日志、评估脚本

---

## 快速开始

### 后端启动
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
访问：http://localhost:8000/docs

### 前端启动
```bash
cd frontend
python -m http.server 5173
```
访问：http://localhost:5173

---

## 目录结构

```
rag-kb/
├── README.md              # 项目总说明（面试官看的）
├── backend/               # Python FastAPI 后端
│   ├── app/
│   │   ├── main.py       # FastAPI 入口（路由、CORS）
│   │   ├── core/         # 核心配置
│   │   │   ├── config.py    # 环境变量、参数配置
│   │   │   └── logging.py   # 请求日志、耗时统计
│   │   ├── api/          # API 路由
│   │   │   ├── chat.py      # SSE 流式聊天
│   │   │   ├── extract.py   # 结构化输出（JSON Schema）
│   │   │   ├── ingest.py    # 文档上传入库
│   │   │   └── rag.py       # RAG 问答（带引用）
│   │   ├── rag/          # RAG 核心链路
│   │   │   ├── chunker.py      # 文本切块
│   │   │   ├── embeddings.py   # 向量化
│   │   │   ├── vectorstore.py  # FAISS 索引
│   │   │   ├── prompts.py      # Prompt 模板
│   │   │   └── qa.py           # 问答逻辑
│   │   └── tools/        # 工具调用
│   │       ├── registry.py     # 工具注册
│   │       └── calculator.py   # 计算器工具
│   ├── data/
│   │   ├── raw/          # 原始文档（PDF/TXT/MD）
│   │   └── index/        # FAISS 向量索引
│   ├── eval/
│   │   ├── dataset.jsonl # 测试问题集（20 条）
│   │   └── run_eval.py   # 自动评估脚本
│   └── requirements.txt
└── frontend/              # HTML/JS 前端
    ├── index.html        # 页面结构
    └── app.js            # API 调用、SSE 消费
```

---

## 各目录用途（JS 类比）

### `backend/app/core/` — 核心配置
- `config.py` — 读取 `.env`，定义参数（类似 `config.ts`）
- `logging.py` — 请求日志、耗时统计（类似 Express middleware）

### `backend/app/api/` — API 路由
- `chat.py` — SSE 流式聊天（类似 WebSocket handler）
- `extract.py` — 结构化输出（类似 Zod 校验 + 重试）
- `ingest.py` — 文档上传入库（类似 multer + 数据处理）
- `rag.py` — RAG 问答（类似业务逻辑层）

### `backend/app/rag/` — RAG 核心链路
这是最重要的部分，实现 **加载 → 切块 → 检索 → 回答** 的完整流程。

**JS 类比**：
```js
// 类似这样的数据处理流程
const chunks = chunker.split(document);       // chunker.py
const vectors = embeddings.encode(chunks);    // embeddings.py
vectorstore.add(vectors);                     // vectorstore.py
const relevant = vectorstore.search(query);   // 检索
const prompt = prompts.build(relevant);       // prompts.py
const answer = await qa.generate(prompt);     // qa.py
```

### `backend/app/tools/` — 工具调用
- `registry.py` — 工具注册表（类似 plugin system）
- `calculator.py` — 计算器工具（最简单、最稳）

### `backend/data/` — 数据存储
- `data/raw/` — 原始文档（类似 `public/uploads/`）
- `data/index/` — FAISS 索引（类似数据库文件）

### `backend/eval/` — 评估脚本
- `dataset.jsonl` — 测试问题集（类似 Jest test cases）
- `run_eval.py` — 批量跑测试（类似 `npm test`）

### `frontend/` — 前端界面
- `index.html` — 页面结构
- `app.js` — 调用后端 API，展示流式回答

---

## 14 天开发计划

| 天数 | 任务 | 验收标准 |
|------|------|---------|
| Day 1 | 工程骨架 | `/docs` 能打开，`/health` 返回 ok |
| Day 2 | SSE 流式输出 | 浏览器能看到逐字输出 |
| Day 3 | 结构化输出 | 5 条样例都能输出合法 JSON |
| Day 4 | Embedding + FAISS | 能检索到放进去的内容 |
| Day 5 | 最小 RAG | 回答带引用，空库时拒答 |
| Day 6 | 文档上传 + 前端 | 上传 PDF 后能问出答案 |
| Day 7 | README v0.1 | 录屏 30 秒展示完整流程 |
| Day 8 | 工具调用 | 前端能看到工具调用日志 |
| Day 9 | 失败策略 | 空库/超时不崩溃，输出可解释 |
| Day 10 | 成本与日志 | `/stats` 返回请求指标 |
| Day 11 | 评估脚本 | 一条命令跑完 20 条 QA |
| Day 12 | UI 打磨 | 引用高亮、检索调试面板 |
| Day 13 | 面试卡片 | 10 个问题的 30 秒口述版 |
| Day 14 | 最终整理 | README v1.0 + 简历一句话 |

详细任务清单见：[14 天任务清单.md](./14%20天任务清单.md)

---

## 完整数据流

```
用户上传文档（frontend）
    ↓
存入 data/raw/
    ↓
[chunker.py] 切块
    ↓
[embeddings.py] 向量化
    ↓
[vectorstore.py] 存入 data/index/（FAISS 索引）
    ↓
用户提问（frontend）
    ↓
[main.py] 接收请求
    ↓
[vectorstore.py] 检索 top-k chunks
    ↓
[prompts.py] 拼接 prompt
    ↓
[qa.py] 调用 LLM 生成答案
    ↓
[main.py] 流式返回（SSE）
    ↓
前端逐字显示 + 引用高亮
```

---

## 简历一句话（Day 14 用）

> 基于 FastAPI + FAISS 构建企业知识库 RAG 应用，支持文档上传入库、向量检索与引用溯源、工具调用（calculator）、失败降级（检索缺失追问/拒答）、请求日志与最小评估集（20 条 QA 自动回归），并提供前端可视化（SSE 流式 + 引用高亮 + debug 检索面板）。

---

## 下一步

准备好开始 Day1 了吗？告诉我，我会给你：
1. Day1 的具体任务清单
2. 需要创建哪些文件
3. 每个文件的接口签名（不是完整实现）
4. 验收标准

现在先不急着写代码，确保理解了整体架构和各目录用途。
