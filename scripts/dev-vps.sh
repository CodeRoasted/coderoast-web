#!/usr/bin/env bash
# Start a self-restarting SSH tunnel to the VPS backend, then launch Vite.
#
# Why a tunnel? Vite's http-proxy reuses TLS keep-alive connections that nginx
# closes on the remote side, causing random request timeouts. The SSH tunnel
# gives a plain HTTP local socket — no TLS, no connection-reuse surprises.
#
# Why a restart loop? Without it the SSH connection can silently drop under
# load (no keepalive), causing every subsequent request to hang for 15 s.
# ServerAliveInterval keeps the connection alive; the loop catches the rare
# case where the SSH process still exits.

set -euo pipefail

VPS_HOST="vps-aea62a2c.vps.ovh.net"
TUNNEL_LOCAL_PORT=19080
TUNNEL_REMOTE_PORT=8080

# File used to share the current ssh child PID with the cleanup trap
TUNNEL_PID_FILE=$(mktemp /tmp/dev-vps-tunnel-pid.XXXXXX)

cleanup() {
    echo "[dev:vps] Shutting down..."
    kill "${LOOP_PID:-}" 2>/dev/null || true
    if [ -s "${TUNNEL_PID_FILE}" ]; then
        kill "$(cat "${TUNNEL_PID_FILE}")" 2>/dev/null || true
    fi
    rm -f "${TUNNEL_PID_FILE}"
}
trap cleanup EXIT INT TERM

# Self-restarting tunnel loop (runs in background)
tunnel_loop() {
    while true; do
        echo "[dev:vps] Opening SSH tunnel  localhost:${TUNNEL_LOCAL_PORT} → ${VPS_HOST}:${TUNNEL_REMOTE_PORT}"
        ssh -N \
            -o ServerAliveInterval=10 \
            -o ServerAliveCountMax=6 \
            -o TCPKeepAlive=yes \
            -o ExitOnForwardFailure=yes \
            -L "${TUNNEL_LOCAL_PORT}:localhost:${TUNNEL_REMOTE_PORT}" \
            "${VPS_HOST}" &
        local ssh_pid=$!
        echo "${ssh_pid}" > "${TUNNEL_PID_FILE}"
        wait "${ssh_pid}" 2>/dev/null || true
        echo "[dev:vps] Tunnel dropped, reconnecting in 2 s..."
        sleep 2
    done
}
tunnel_loop &
LOOP_PID=$!

# Wait for the tunnel to be ready before starting Vite
echo "[dev:vps] Waiting for tunnel on localhost:${TUNNEL_LOCAL_PORT}..."
for i in $(seq 1 10); do
    if curl -sf --max-time 2 "http://localhost:${TUNNEL_LOCAL_PORT}/api/v1/tiers" -o /dev/null 2>/dev/null; then
        echo "[dev:vps] Tunnel ready. Starting Vite."
        break
    fi
    sleep 0.5
done

PROXY_TARGET="http://localhost:${TUNNEL_LOCAL_PORT}" exec npx vite
