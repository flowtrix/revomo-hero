import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    // Configure for GitHub Pages deployment
    base: process.env.NODE_ENV === 'production' ? '/Revomo/' : '/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        // Handle large files
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    'gsap': ['gsap'],
                }
            }
        }
    },
    // Ensure proper asset handling
    publicDir: 'public'
})
