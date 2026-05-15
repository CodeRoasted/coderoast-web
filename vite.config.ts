/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import http from 'node:http'
import https from 'node:https'

// Allow the proxy target to be overridden at dev/preview time without
// touching the config. Set PROXY_TARGET to point at a remote server:
//   PROXY_TARGET=https://api.coderoast.fr npm run dev
// Defaults to the local server for normal development.
const proxyTarget = process.env.PROXY_TARGET ?? 'http://localhost:8080'

// Disable connection pooling so every proxied request opens a fresh socket.
// Without this, http-proxy reuses pooled TCP connections that may have been
// silently closed by the remote end (SSH tunnel reset, nginx keepalive
// timeout, etc.), causing requests to hang until the 15 s abort fires.
const isHttps = proxyTarget.startsWith('https://')
const noPoolAgent = isHttps
    ? new https.Agent({ keepAlive: false })
    : new http.Agent({ keepAlive: false })

const proxy = {
    '/api/v1/ws': {
        target: proxyTarget,
        ws: true,
        changeOrigin: true,
    },
    '/api': {
        target: proxyTarget,
        changeOrigin: true,
        agent: noPoolAgent,
    },
}

export default mergeConfig(
    defineConfig({
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: { proxy },
        preview: { proxy },
    }),
    {
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/test/setup.ts',
            css: true,
        },
    }
)
