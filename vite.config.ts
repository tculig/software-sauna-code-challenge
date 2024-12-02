/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true, // Enable global test APIs like describe, it, and expect
        environment: 'jsdom', // Simulate a browser-like environment
        setupFiles: './vitest.setup.ts', // Optional: Add global setup
    },
});
