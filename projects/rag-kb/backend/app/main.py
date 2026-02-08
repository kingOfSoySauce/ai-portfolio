"""
FastAPI 主入口
- 挂载路由
- CORS 配置
- 健康检查
- 请求日志中间件
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用启动/关闭时的生命周期管理"""
    logger.info("🚀 应用启动中...")
    yield
    logger.info("👋 应用关闭中...")


# 创建 FastAPI 应用
app = FastAPI(
    title="RAG Knowledge Base API",
    description="基于 FastAPI + FAISS 的知识库 RAG 应用",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 配置（允许前端调用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # 生产环境要改成具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 请求日志中间件（记录耗时）
@app.middleware("http")
async def log_requests(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"status={response.status_code} duration={duration:.3f}s"
    )
    return response


# 健康检查接口
@app.get("/health")
async def health_check():
    """健康检查：验证服务是否正常运行"""
    return JSONResponse(
        content={
            "ok": True,
            "service": "rag-kb-api",
            "version": "1.0.0"
        }
    )


# 根路径
@app.get("/")
async def root():
    """API 根路径"""
    return {
        "message": "RAG Knowledge Base API",
        "docs": "/docs",
        "health": "/health"
    }


# TODO: Day2+ 在这里挂载其他路由
# from app.api import chat, extract, ingest, rag
from app.api import chat
app.include_router(chat.router, prefix="/chat", tags=["chat"])
# app.include_router(extract.router, prefix="/extract", tags=["extract"])
# app.include_router(ingest.router, prefix="/ingest", tags=["ingest"])
# app.include_router(rag.router, prefix="/rag", tags=["rag"])
