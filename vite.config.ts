/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default mergeConfig(
    defineConfig({
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    // Backend now exposes versioned routes under /api/v1/*.
                    // No rewrite — forward the full path including the prefix.
                },
                '/api/v1/ws': {
                    target: 'ws://localhost:8080',
                    ws: true,
                },
            },
        },
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
