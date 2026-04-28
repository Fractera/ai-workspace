# LightRAG — Installation Documentation

Source: https://github.com/hkuds/lightrag

---

## Prerequisites

- Python 3.10+
- uv (recommended) or pip
- LLM with 32B+ parameters, 32KB+ context
- Embedding model (e.g. BAAI/bge-m3 or text-embedding-3-large)
- Reranker model (e.g. BAAI/bge-reranker-v2-m3) — optional but recommended

### Install uv

```bash
# Unix/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

---

## Install LightRAG Server (recommended for Fractera)

The LightRAG Server provides Web UI, REST API, and Ollama-compatible interface.

### From PyPI

```bash
# Recommended
uv tool install "lightrag-hku[api]"

# Or with pip
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install "lightrag-hku[api]"
```

### Build frontend

```bash
cd lightrag_webui
bun install --frozen-lockfile
bun run build
cd ..
```

### Configure

```bash
cp env.example .env
# Edit .env with your LLM and embedding settings
```

### Launch

```bash
lightrag-server
```

---

## Install from Source

```bash
git clone https://github.com/HKUDS/LightRAG.git
cd LightRAG
make dev
source .venv/bin/activate  # Windows: .venv\Scripts\activate
lightrag-server
```

---

## Docker Compose

```bash
git clone https://github.com/HKUDS/LightRAG.git
cd LightRAG
cp env.example .env
docker compose up
```

---

## Interactive .env Setup

```bash
make env-base      # LLM, embedding, reranker — required
make env-storage   # storage backends — optional
make env-server    # port, auth, SSL — optional
```

---

## Quick Start (core, OpenAI)

```bash
cd LightRAG
export OPENAI_API_KEY="sk-..."
curl https://raw.githubusercontent.com/gusye1234/nano-graphrag/main/tests/mock_data.txt > ./book.txt
python examples/lightrag_openai_demo.py
```

---

## LLM Requirements

| Parameter | Minimum | Recommended |
|---|---|---|
| Model size | 32B parameters | 70B+ |
| Context length | 32KB | 64KB |
| Reasoning models | Not recommended for indexing | Use stronger model for queries |

---

## Status

- [ ] env.example — needed
- [ ] REST API documentation — needed
- [ ] Fractera integration plan — pending
