import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // В режиме сборки путь /admin/dist/ (откуда PHP будет отдавать файлы)
  // В режиме dev — корень, чтобы dev-сервер работал по localhost:5173
  base: command === 'build' ? '/admin/dist/' : '/',
  build: {
    outDir: '../admin/dist',
    emptyOutDir: true,
  },
}))
