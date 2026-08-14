import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👈 Permet à Vite de lire les variables NEXT_PUBLIC_ créées par l'intégration Vercel/Supabase
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
});