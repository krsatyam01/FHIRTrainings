import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/FHIRTrainings/fhir-app/',       // Ensures asset paths are relative to index.html
  plugins: [react()],
  build: {
    outDir: 'dist', // Default build output
    rollupOptions: {
      input: 'src/index.html', // Explicitly sets the entry point
    },
  },
  server: {
    open: true,     // Opens browser on dev server start
  },
});
