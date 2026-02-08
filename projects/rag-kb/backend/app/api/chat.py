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
        yield  f"data: {x}\n\n"
    


# 聊天接口
@router.post("/")
async def chat(request: ChatRequest):
    """流式响应聊天消息"""
    return StreamingResponse(
        fake_llm(request.message),media_type="text/event-stream"
    )