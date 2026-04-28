# LightRAG — env.example (full reference)

Source: https://github.com/HKUDS/LightRAG/blob/main/env.example

---

```env
### All configurable environment variable must show up in this sample file in active or comment out status
### Setup tool `make env-*` uses this file to generate final .env file
### These are placeholders and setup tool should not be substituted with actual values in this lines.

### Target environment of this env file: host/compose (compose is for Dokcer or Kubernetes)
# LIGHTRAG_RUNTIME_TARGET=host

###########################
### Server Configuration
###########################
HOST=0.0.0.0
PORT=9621
WEBUI_TITLE='My Graph KB'
WEBUI_DESCRIPTION='Simple and Fast Graph Based RAG System'
# WORKERS=2
### gunicorn worker timeout(as default LLM request timeout if LLM_TIMEOUT is not set)
# TIMEOUT=150
# CORS_ORIGINS=http://localhost:3000,http://localhost:8080

### Optional SSL Configuration
# SSL=true
# SSL_CERTFILE=/path/to/cert.pem
# SSL_KEYFILE=/path/to/key.pem

### Directory Configuration (defaults to current working directory)
# INPUT_DIR=<absolute_path_for_doc_input_dir>
# WORKING_DIR=<absolute_path_for_working_dir>

### Tiktoken cache directory
# TIKTOKEN_CACHE_DIR=/app/data/tiktoken

### Ollama Emulating Model and Tag
# OLLAMA_EMULATING_MODEL_NAME=lightrag
OLLAMA_EMULATING_MODEL_TAG=latest

### Max nodes for graph retrieval
# MAX_GRAPH_NODES=1000

### Logging level
# LOG_LEVEL=INFO
# VERBOSE=False
# LOG_MAX_BYTES=10485760
# LOG_BACKUP_COUNT=5
# LOG_DIR=/path/to/log/directory
# LIGHTRAG_PERFORMANCE_TIMING_LOGS=false

#####################################
### Login and API-Key Configuration
#####################################
# AUTH_ACCOUNTS='admin:admin123,user1:{bcrypt}$2b$12$S8Yu.gCbuAbNTJFB.231gegTwr5pgrFxc8H9kXQ4/sduFBHkhM8Ka'
# TOKEN_SECRET=lightrag-jwt-default-secret-key!
# JWT_ALGORITHM=HS256
# TOKEN_EXPIRE_HOURS=48
# GUEST_TOKEN_EXPIRE_HOURS=24

### Token Auto-Renewal
# TOKEN_AUTO_RENEW=true
# TOKEN_RENEW_THRESHOLD=0.5

### API-Key to access LightRAG Server API
### Use this key in HTTP requests with the 'X-API-Key' header
### Example: curl -H "X-API-Key: your-secure-api-key-here" http://localhost:9621/query
# LIGHTRAG_API_KEY=your-secure-api-key-here
# WHITELIST_PATHS=/health,/api/*

######################################################################################
### Query Configuration
######################################################################################
# ENABLE_LLM_CACHE=true
# COSINE_THRESHOLD=0.2
# TOP_K=40
# CHUNK_TOP_K=20
# MAX_ENTITY_TOKENS=6000
# MAX_RELATION_TOKENS=8000
# MAX_TOTAL_TOKENS=30000
# KG_CHUNK_PICK_METHOD=VECTOR
# RELATED_CHUNK_NUMBER=5

#########################################################
### Reranking configuration
### RERANK_BINDING type: null, cohere, jina, aliyun
#########################################################
RERANK_BINDING=null
# RERANK_MODEL=BAAI/bge-reranker-v2-m3
# RERANK_BINDING_HOST=http://localhost:8000/rerank
# RERANK_BINDING_API_KEY=your_rerank_api_key_here
# MIN_RERANK_SCORE=0.0
# RERANK_BY_DEFAULT=True

########################################
### Document processing configuration
########################################
ENABLE_LLM_CACHE_FOR_EXTRACT=true
SUMMARY_LANGUAGE=English
# MAX_UPLOAD_SIZE=104857600
# CHUNK_SIZE=1200
# CHUNK_OVERLAP_SIZE=100
# FORCE_LLM_SUMMARY_ON_MERGE=8
# SUMMARY_MAX_TOKENS=1200
# SUMMARY_LENGTH_RECOMMENDED=600
# SUMMARY_CONTEXT_SIZE=12000
# MAX_EXTRACT_INPUT_TOKENS=20480

###############################
### Concurrency Configuration
###############################
MAX_ASYNC=4
MAX_PARALLEL_INSERT=2
# EMBEDDING_FUNC_MAX_ASYNC=8
# EMBEDDING_BATCH_NUM=10

###########################################################################
### LLM Configuration
### LLM_BINDING type: openai, ollama, lollms, azure_openai, aws_bedrock, gemini
###########################################################################
# LLM_TIMEOUT=180

LLM_BINDING=openai
LLM_BINDING_HOST=https://api.openai.com/v1
LLM_BINDING_API_KEY=your_api_key
LLM_MODEL=gpt-4o-mini

### OpenRouter example
# LLM_BINDING=openai
# LLM_BINDING_HOST=https://openrouter.ai/api/v1
# LLM_BINDING_API_KEY=your_api_key
# LLM_MODEL=google/gemini-2.5-flash

### Google Gemini example
# LLM_BINDING=gemini
# LLM_BINDING_API_KEY=your_gemini_api_key
# LLM_MODEL=gemini-flash-latest

### Ollama example
# LLM_BINDING=ollama
# LLM_BINDING_HOST=http://localhost:11434
# LLM_MODEL=qwen3.5:9b
OLLAMA_LLM_NUM_CTX=32768

#######################################################################################
### Embedding Configuration (Should not be changed after the first file processed)
### EMBEDDING_BINDING: ollama, openai, azure_openai, jina, lollms, aws_bedrock
#######################################################################################
# EMBEDDING_TIMEOUT=30

EMBEDDING_BINDING=openai
EMBEDDING_BINDING_HOST=https://api.openai.com/v1
EMBEDDING_BINDING_API_KEY=your_api_key
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIM=3072
EMBEDDING_TOKEN_LIMIT=8192
EMBEDDING_SEND_DIM=false

### Ollama embedding
# EMBEDDING_BINDING=ollama
# EMBEDDING_BINDING_HOST=http://localhost:11434
# EMBEDDING_MODEL=qwen3-embedding:4b
# EMBEDDING_DIM=2560
OLLAMA_EMBEDDING_NUM_CTX=8192

############################
### Data storage selection
############################
### Default (Recommended for test deployment)
LIGHTRAG_KV_STORAGE=JsonKVStorage
LIGHTRAG_DOC_STATUS_STORAGE=JsonDocStatusStorage
LIGHTRAG_GRAPH_STORAGE=NetworkXStorage
LIGHTRAG_VECTOR_STORAGE=NanoVectorDBStorage

### PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_username
POSTGRES_PASSWORD='your_password'
POSTGRES_DATABASE=rag
POSTGRES_MAX_CONNECTIONS=25

### Neo4j
NEO4J_URI=neo4j+s://xxxxxxxx.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD='your_password'
NEO4J_DATABASE=neo4j

### MongoDB
MONGO_URI=mongodb://localhost:27017/
MONGO_DATABASE=LightRAG

### Qdrant
QDRANT_URL=http://localhost:6333

### Redis
REDIS_URI=redis://localhost:6379
REDIS_SOCKET_TIMEOUT=30
REDIS_CONNECT_TIMEOUT=10
REDIS_MAX_CONNECTIONS=100
```

---

## Key facts for Fractera integration

- **Default port:** 9621
- **API key header:** `X-API-Key: your-secure-api-key-here`
- **Query endpoint:** `POST http://localhost:9621/query`
- **Default storage:** JSON/NetworkX — no extra database needed for testing
- **LLM:** works with OpenAI, OpenRouter, Gemini, Ollama, Bedrock
- **Cheapest option for testing:** OpenRouter with free models (e.g. `google/gemini-2.5-flash`)
- **CORS:** set `CORS_ORIGINS=http://localhost:3000` for Fractera integration
