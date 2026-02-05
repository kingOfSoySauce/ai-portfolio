"""
配置管理：读取环境变量
使用 pydantic-settings 管理配置（类型安全）
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """应用配置（从环境变量读取）"""
    
    # 基础配置
    APP_NAME: str = "RAG Knowledge Base"
    DEBUG: bool = True
    
    # CORS 配置
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    
    # LLM 配置（Day2 会用到）
    LLM_MODE: str = "local"  # "local" 或 "openai"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # Embedding 配置（Day4 会用到）
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # 向量库配置
    VECTOR_STORE_PATH: str = "./data/index/faiss.index"
    
    # RAG 配置
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    TOP_K: int = 4
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# 全局配置实例
settings = Settings()
