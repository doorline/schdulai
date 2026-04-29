import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { parse } from 'smol-toml'

// Inline Vite plugin: .toml 파일을 ES module로 변환
const tomlPlugin = {
  name: 'vite-plugin-toml',
  transform(_code, id) {
    if (!id.endsWith('.toml')) return
    const parsed = parse(readFileSync(id, 'utf-8'))
    return `export default ${JSON.stringify(parsed)}`
  },
}

export default defineConfig({
  plugins: [react(), tomlPlugin],
  server: {
    host: true,
  },
})
