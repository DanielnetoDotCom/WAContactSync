import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import process from 'process'

export default defineConfig(({ mode }) => {
  // Carregar as variáveis de ambiente corretamente
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      // allowedHosts: ['ticket-system.danielneto.com'],
      host: true,  
      port: parseInt(env.VITE_PORT) || 5001, // Usando a variável carregada do .env
    },
  }
})
