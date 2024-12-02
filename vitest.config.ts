import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'html', 'lcov'],
            all: true,
            include: ['src'],
            exclude: ['node_modules', 'dist', 'test', '**/*.test.ts'],
        },
    },
});
