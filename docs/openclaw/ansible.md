# Open Claw — Ansible Deployment

Source: https://docs.openclaw.ai/containers/ansible
Repo: https://github.com/openclaw/openclaw-ansible

---

## Prerequisites

| Requirement | Details |
|---|---|
| OS | Debian 11+ or Ubuntu 20.04+ |
| Access | Root or sudo privileges |
| Network | Internet connection |
| Ansible | 2.14+ (installed automatically by quick-start script) |

---

## What You Get

- **Firewall-first security** — UFW + Docker isolation (only SSH + Tailscale accessible)
- **Tailscale VPN** — secure remote access without exposing services publicly
- **Docker** — isolated sandbox containers, localhost-only bindings
- **Defense in depth** — 4-layer security architecture
- **Systemd integration** — auto-start on boot with hardening
- **One-command setup** — complete deployment in minutes

---

## Quick Start

```bash
curl -fsSL https://raw.githubusercontent.com/openclaw/openclaw-ansible/main/install.sh | bash
```

---

## What Gets Installed

- Tailscale — mesh VPN for secure remote access
- UFW firewall — SSH + Tailscale ports only
- Docker CE + Compose V2 — default agent sandbox backend
- Node.js 24 + pnpm — runtime (Node 22.14+ also supported)
- OpenClaw — **host-based, not containerized**
- Systemd service — auto-start with security hardening

Note: Docker is installed for agent sandboxes (isolated tool execution), not for running the gateway itself.

---

## Post-Install Setup

```bash
# 1. Switch to openclaw user
sudo -i -u openclaw

# 2. Run onboarding wizard
# (guided by post-install script)

# 3. Connect messaging providers
openclaw channels login

# 4. Verify
sudo systemctl status openclaw
sudo journalctl -u openclaw -f
```

---

## Quick Commands

```bash
sudo systemctl status openclaw      # Check service status
sudo journalctl -u openclaw -f      # Live logs
sudo systemctl restart openclaw     # Restart gateway

# Provider login (run as openclaw user)
sudo -i -u openclaw
openclaw channels login
```

---

## Security Architecture (4-Layer Defense)

| Layer | What it does |
|---|---|
| UFW firewall | Only SSH (22) + Tailscale (41641/udp) exposed publicly |
| Tailscale VPN | Gateway accessible only via VPN mesh |
| Docker isolation | DOCKER-USER iptables chain prevents external port exposure |
| Systemd hardening | NoNewPrivileges, PrivateTmp, unprivileged user |

Verify attack surface:
```bash
nmap -p- YOUR_SERVER_IP
# Only port 22 (SSH) should be open
```

---

## Manual Installation

```bash
sudo apt update && sudo apt install -y ansible git

git clone https://github.com/openclaw/openclaw-ansible.git
cd openclaw-ansible

ansible-galaxy collection install -r requirements.yml

./run-playbook.sh
# or:
ansible-playbook playbook.yml --ask-become-pass
# Then: /tmp/openclaw-setup.sh
```

---

## Updating

```bash
# Standard OpenClaw update
openclaw update

# Re-run Ansible playbook (idempotent — safe to run multiple times)
cd openclaw-ansible
./run-playbook.sh
```

---

## Fractera Notes

- This 4-layer security model is the reference for Fractera production deployments
- UFW + Tailscale pattern applies directly — same approach for Fractera VPS
- Systemd hardening (`NoNewPrivileges`, `PrivateTmp`) should be applied to Fractera PM2 units too
- `nmap -p- YOUR_SERVER_IP` — only 22 open = correctly locked down Fractera server too
