# rag-bootcamp — 文档知识库问答（RAG）

目标（7 天交付物）：
- 上传/加载文档
- 文档切块 + 向量检索（FAISS）
- 回答带引用来源（段落/chunk）
- 支持流式输出（SSE）

> 说明：此仓库目前仅创建“骨架”。实现会由你按 Day1–Day7 逐步补齐。

## 目录结构
```text
rag-bootcamp/
├── README.md
├── pyproject.toml  # 或 requirements.txt（你选择其一）
├── app/
│   ├── main.py
│   ├── config.py
│   ├── llm.py
│   ├── rag/
│   │   ├── ingest.py
│   │   ├── retrieve.py
│   │   ├── prompt.py
│   │   └── answer.py
│   └── utils/
│       └── text.py
├── data/
│   ├── raw/
│   └── index/
└── eval/
    ├── questions.jsonl
    └── run_eval.py
```

## Day1 验收
- `uvicorn app.main:app --reload` 能启动
- `/chat/stream?q=hi` 能看到逐行输出（可先假数据）
