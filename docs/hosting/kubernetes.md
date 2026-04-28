# Hosting — Kubernetes

Source: https://docs.openclaw.ai/hosting/kubernetes
Applies to: OpenClaw. Minimal starting point — adapt to your environment.

---

## Why Kustomize (not Helm)?

OpenClaw is a single container. Customization lives in agent content (markdown, skills, config), not infrastructure templating. Kustomize handles overlays without Helm overhead.

---

## Prerequisites

- Running Kubernetes cluster (AKS, EKS, GKE, k3s, kind, OpenShift, etc.)
- `kubectl` connected to cluster
- API key for at least one model provider

---

## Quick Start

```bash
# Replace with your provider: ANTHROPIC, GEMINI, OPENAI, or OPENROUTER
export ANTHROPIC_API_KEY="..."
./scripts/k8s/deploy.sh

kubectl port-forward svc/openclaw 18789:18789 -n openclaw
open http://localhost:18789

# Get gateway token
kubectl get secret openclaw-secrets -n openclaw \
  -o jsonpath='{.data.OPENCLAW_GATEWAY_TOKEN}' | base64 -d
```

---

## Local Testing with Kind

```bash
./scripts/k8s/create-kind.sh           # auto-detects docker or podman
./scripts/k8s/create-kind.sh --delete  # tear down
```

Then deploy as usual.

---

## Deploy

### Option A — API key in environment (one step)

```bash
export ANTHROPIC_API_KEY="..."
./scripts/k8s/deploy.sh
```

### Option B — Create secret separately

```bash
export ANTHROPIC_API_KEY="..."
./scripts/k8s/deploy.sh --create-secret
./scripts/k8s/deploy.sh
```

Use `--show-token` to print gateway token to stdout.

---

## What Gets Deployed

```
Namespace: openclaw
├── Deployment/openclaw        # Single pod, init container + gateway
├── Service/openclaw           # ClusterIP on port 18789
├── PersistentVolumeClaim      # 10Gi for agent state and config
├── ConfigMap/openclaw-config  # openclaw.json + AGENTS.md
└── Secret/openclaw-secrets    # Gateway token + API keys
```

---

## Customization

### Agent instructions

Edit `AGENTS.md` in `scripts/k8s/manifests/configmap.yaml` → redeploy:
```bash
./scripts/k8s/deploy.sh
```

### Add providers

```bash
export ANTHROPIC_API_KEY="..."
export OPENAI_API_KEY="..."
./scripts/k8s/deploy.sh --create-secret
./scripts/k8s/deploy.sh

# Or patch Secret directly
kubectl patch secret openclaw-secrets -n openclaw \
  -p '{"stringData":{"OPENAI_API_KEY":"..."}}'
kubectl rollout restart deployment/openclaw -n openclaw
```

### Custom namespace

```bash
OPENCLAW_NAMESPACE=my-namespace ./scripts/k8s/deploy.sh
```

### Custom image

Edit `image` in `scripts/k8s/manifests/deployment.yaml`:
```yaml
image: ghcr.io/openclaw/openclaw:latest
```

---

## Expose Beyond port-forward

Default: gateway binds to loopback inside pod (works with `kubectl port-forward` only).

To expose via Ingress or load balancer:
1. Change gateway bind in `configmap.yaml` from loopback to non-loopback
2. Keep gateway auth enabled
3. Use TLS-terminated entrypoint
4. Configure Control UI allowed origins for HTTPS/Tailscale

---

## Re-deploy / Teardown

```bash
# Re-deploy (applies all manifests, restarts pod)
./scripts/k8s/deploy.sh

# Teardown (deletes namespace + PVC)
./scripts/k8s/deploy.sh --delete
```

---

## Architecture Notes

- Gateway binds to loopback by default — `kubectl port-forward` for access
- No cluster-scoped resources — everything in single namespace
- Security: `readOnlyRootFilesystem`, `drop: ALL` capabilities, non-root user (UID 1000)
- Secrets applied directly to cluster — no secret material written to repo

---

## File Structure

```
scripts/k8s/
├── deploy.sh                   # Creates namespace + secret, deploys via kustomize
├── create-kind.sh              # Local Kind cluster
└── manifests/
    ├── kustomization.yaml
    ├── configmap.yaml          # openclaw.json + AGENTS.md
    ├── deployment.yaml         # Pod spec with security hardening
    ├── pvc.yaml                # 10Gi persistent storage
    └── service.yaml            # ClusterIP on 18789
```

---

## Fractera Notes

- Fractera has no official K8s manifests yet — this OpenClaw structure is the reference
- Three services (app/bridge/media) = three Deployments or one multi-process pod
- PVC needed for SQLite DB and media storage
- `kubectl port-forward svc/fractera 3000:3000` for local access
- Same security hardening (non-root, readOnlyRootFilesystem) applies
