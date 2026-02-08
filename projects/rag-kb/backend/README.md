# RAG Knowledge Base - Backend

基于 FastAPI + FAISS 的知识库 RAG 应用后端

## 快速启动

### 1. 创建虚拟环境并安装依赖

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

### 2. 配置环境变量（可选）

```bash
cp .env.example .env
# 编辑 .env 填入你的配置（如果用 OpenAI）
```

### 3. 启动服务

```bash
uvicorn app.main:app --reload --port 8000
```

### 4. 验证

- API 文档：http://localhost:8000/docs
- 健康检查：http://localhost:8000/health

## 项目结构

```
backend/
├── app/
│   ├── main.py           # FastAPI 主入口
│   ├── core/             # 核心配置
│   │   ├── config.py     # 环境变量配置
│   │   └── logging.py    # 日志配置
│   ├── api/              # API 路由（Day2+ 添加）
│   ├── rag/              # RAG 核心逻辑（Day4+ 添加）
│   └── tools/            # 工具调用（Day8+ 添加）
├── data/
│   ├── index/            # 向量索引存储
│   └── raw/              # 原始文档存储
├── eval/                 # 评估脚本（Day11+ 添加）
├── requirements.txt      # Python 依赖
└── .env                  # 环境变量（不提交到 git）
```

## Day1 验收清单

- [ ] `/docs` 能打开（Swagger UI）
- [ ] `/health` 返回 `{"ok": true, ...}`
- [ ] 日志能看到请求耗时
- [ ] CORS 配置正确（前端能调用）

## 下一步（Day2）

- 添加 `/chat/stream` 接口（SSE 流式输出）
- 创建前端页面消费 SSE
