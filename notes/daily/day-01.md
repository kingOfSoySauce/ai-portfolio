# Day 1 - FastAPI 工程骨架 + Python 基础

## TL;DR（一句话结论）
FastAPI 零配置自动生成 API 文档，通过 `app = FastAPI()` + 装饰器 `@app.get()` 就能快速搭建 RESTful API，核心是理解生命周期管理、配置分离、日志统一。

---

## 3 组要点

### 原理：FastAPI 的核心机制

**1. 自动文档生成**
- 创建 `FastAPI()` 实例时自动启用 Swagger UI (`/docs`) 和 ReDoc (`/redoc`)
- 通过函数签名和类型注解自动生成 OpenAPI schema
- 类似 JS 需要手动配置 `swagger-ui-express`，FastAPI 内置

**2. 生命周期管理（lifespan）**
```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # yield 之前：启动时执行（加载模型、连接数据库）
    logger.info("🚀 应用启动中...")
    yield  # 应用运行期间
    # yield 之后：关闭时执行（清理资源）
    logger.info("👋 应用关闭中...")
```
- JS 类比：Express 的 `app.on('listening')` + `process.on('SIGTERM')`
- 用途：Day4 会在这里加载 FAISS 索引和 embedding 模型

**3. 配置分离（pydantic-settings）**
```python
class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""  # 默认值
    class Config:
        env_file = ".env"  # 从 .env 读取
```
- 真实 key 放 `.env`（不提交到 git）
- `config.py` 只定义字段和默认值
- JS 类比：`dotenv` + 配置对象

---

### 实操：我做了什么

**1. 创建的文件**
```
backend/
├── app/
│   ├── main.py           # FastAPI 入口
│   ├── core/
│   │   ├── config.py     # 配置管理
│   │   └── logging.py    # 日志配置
│   └── __init__.py
├── requirements.txt      # 依赖
└── .env.example          # 环境变量模板
```

**2. 启动验证**
```bash
cd projects/rag-kb/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**3. 验收通过**
- ✅ 访问 `http://localhost:8000/docs` 看到 Swagger UI
- ✅ 访问 `http://localhost:8000/health` 返回 `{"ok": true, ...}`
- ✅ 终端看到 `🚀 应用启动中...` 和请求日志
- ✅ 按 `Ctrl+C` 看到 `👋 应用关闭中...`

**4. 日志输出示例**
```
2026-02-05 20:35:03 | INFO     | rag-kb | GET /health - status=200 duration=0.001s
```
- 格式：时间 | 级别 | 名称 | 消息
- 自动记录请求方法、路径、状态码、耗时

---

### 坑点：遇到的问题

**1. `uvicorn: command not found`**
- 原因：没激活虚拟环境
- 解决：`source .venv/bin/activate`（命令行前面会有 `(.venv)` 标记）
- 类比：类似 npm install 后才能用 `node_modules/.bin/` 里的命令

**2. 在 main.py 里直接写接口合适吗？**
- Day1 学习阶段：合适（快速验证）
- 最佳实践：应该拆分到 `app/api/` 目录
- 原因：单一职责、易于测试、团队协作
- 类比：类似 Express 的 `routes/` 目录

**3. OPENAI_API_KEY 放哪里？**
- ❌ 不要写在 `config.py` 里
- ✅ 写在 `.env` 文件（不提交到 git）
- `config.py` 的 `""` 只是默认值

**4. 虚拟环境的作用**
- 隔离依赖（类似每个项目有自己的 `node_modules`）
- 开发时必须用，Docker 部署时不需要（容器本身就是隔离环境）

---

## TODO（下一步）

- [ ] **Day2 目标**：实现 `/chat/stream` 接口（SSE 流式输出）
- [ ] **重构准备**：把 `/health` 接口拆到 `app/api/health.py`（学习路由分离）
- [ ] **Python 基础补充**：复习装饰器、类型注解、async/await（见 `python-basics.md`）
- [ ] **复现练习**：24 小时内不看笔记，重新创建 Day1 的 3 个文件

---

## 关键代码片段（可复制）

### FastAPI 最小启动
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health():
    return {"ok": True}
```

### 日志配置
```python
import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
)
logger = logging.getLogger("my-app")
logger.info("日志消息")
```

### 配置管理
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_KEY: str = ""
    class Config:
        env_file = ".env"

settings = Settings()
```
