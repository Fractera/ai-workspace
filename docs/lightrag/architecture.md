# LightRAG — Architecture & Developer Guide

Source: CLAUDE.md from https://github.com/HKUDS/LightRAG

---

## Project Overview

LightRAG is a RAG framework using graph-based knowledge representation. It extracts entities and relationships from documents, builds a knowledge graph, and uses multi-modal retrieval (local, global, hybrid, mix, naive) for queries.

---

## Core Components

| File | Role |
|---|---|
| `lightrag.py` | Main orchestrator. Always call `await rag.initialize_storages()` after instantiation |
| `operate.py` | Entity/relation extraction, chunking, multi-mode retrieval |
| `base.py` | Abstract base classes for all storage backends |
| `kg/` | Storage implementations (JSON, NetworkX, Neo4j, PostgreSQL, MongoDB, Redis, Milvus, Qdrant) |
| `llm/` | LLM provider bindings (OpenAI, Ollama, Azure, Gemini, Bedrock, Anthropic) |
| `api/` | FastAPI server with REST endpoints + React 19 WebUI |

---

## Storage Layer (4 types)

| Type | Purpose |
|---|---|
| KV_STORAGE | LLM cache, text chunks, document info |
| VECTOR_STORAGE | Entity/relation/chunk embeddings |
| GRAPH_STORAGE | Entity-relation graph |
| DOC_STATUS_STORAGE | Document processing status |

**Default (no external DB needed):** JSON + NetworkX — perfect for Fractera v1.3.

---

## Query Modes

| Mode | Description |
|---|---|
| `local` | Focused on specific entities |
| `global` | Community/summary-based broad retrieval |
| `hybrid` | Combines local + global |
| `naive` | Direct vector search, no graph |
| `mix` | KG + vector (recommended with reranker) |

---

## REST API Server

- Default port: **9621**
- Framework: FastAPI
- Auth header: `X-API-Key: your-key`
- Ollama-compatible interface included

Start: `lightrag-server`

---

## Critical Initialization Pattern

```python
import asyncio
from lightrag import LightRAG
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed

async def main():
    rag = LightRAG(
        working_dir="./rag_storage",
        llm_model_func=gpt_4o_mini_complete,
        embedding_func=openai_embed
    )
    await rag.initialize_storages()  # REQUIRED — most common mistake to skip this

    await rag.ainsert("Your text here")
    result = await rag.aquery("Your question", param=QueryParam(mode="hybrid"))

    await rag.finalize_storages()

asyncio.run(main())
```

---

## Query Configuration

```python
from lightrag import QueryParam

result = await rag.aquery(
    "Your question",
    param=QueryParam(
        mode="mix",           # Recommended with reranker
        top_k=60,
        chunk_top_k=20,
        max_total_tokens=30000,
        enable_rerank=True,
        stream=False
    )
)
```

---

## Document Insertion

```python
await rag.ainsert("Single text")
await rag.ainsert(["Text 1", "Text 2"])
await rag.ainsert("Text", ids=["doc-123"])
await rag.ainsert(["Text 1", "Text 2"], file_paths=["doc1.pdf", "doc2.pdf"])
```

---

## LLM Requirements

- Minimum **32B parameters**
- Context: **32KB minimum**, 64KB recommended
- Do NOT use reasoning models during indexing
- Use stronger models for query than indexing

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `AttributeError: __aenter__` | Forgot `initialize_storages()` | Always call it after instantiation |
| Embedding errors after model change | Vector dimensions mismatch | Clear data directory, restart |
| Ollama context too short | Default 8k context | Set `num_ctx: 32768` |

---

## Fractera Integration Notes

- **CORS:** set `CORS_ORIGINS=http://localhost:3000` in LightRAG `.env`
- **Storage for v1.3:** use default JSON/NetworkX — no extra DB needed
- **Cheapest LLM option:** OpenRouter with `google/gemini-2.5-flash` (free tier)
- **API key:** set `LIGHTRAG_API_KEY` in `.env`, pass as `X-API-Key` header from Fractera
- **Query endpoint:** `POST http://localhost:9621/query`
- **Port conflict check:** LightRAG runs on 9621, Fractera on 3000, bridge on 3200-3206, media on 3300 — no conflicts

---

## Status

- [x] install.md — done
- [x] env.example.md — done
- [x] architecture.md — done
- [x] REST API endpoints reference — done (api-reference.md)
- [ ] Fractera integration implementation — pending
