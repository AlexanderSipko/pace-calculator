import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // грузим env для указанного режима
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log("⚡ Build mode:", mode)
  console.log("⚡ Base path:", env.VITE_BASE)

  return {
    plugins: [react(), tailwindcss(), ],
    base: env.VITE_BASE || '/',
  }
})