import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages: 상대 경로 사용 시 배포 위치와 관계없이 동작
  base: process.env.GITHUB_REPOSITORY ? './' : '/',
})
