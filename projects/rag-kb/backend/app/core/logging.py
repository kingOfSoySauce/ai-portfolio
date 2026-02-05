"""
日志配置：统一日志格式
"""
import logging
import sys
from datetime import datetime


# 配置日志格式
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# 创建 logger
logger = logging.getLogger("rag-kb")

# 如果需要写文件日志（可选）
# file_handler = logging.FileHandler("logs/app.log")
# file_handler.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(message)s"))
# logger.addHandler(file_handler)
