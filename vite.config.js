import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages: https://<user>.github.io/<repo>/ (GitHub는 repo 이름을 소문자로 사용)
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1].toLowerCase()}/`
    : '/',
})
