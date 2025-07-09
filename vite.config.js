import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
    // Configure for GitHub Pages deployment
    base: process.env.NODE_ENV === 'production' ? '/revomo-hero/' : '/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        // Handle large files
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            // Define multiple HTML entry points
            input: {
                main: resolve(__dirname, 'index.html'),
                footer: resolve(__dirname, 'footer.html'),
                circularParticles: resolve(__dirname, 'circular-particles.html')
            },
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
