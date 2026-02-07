
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Fix: Removed manual 'process.env' definition to prevent overriding the environment's provided variables
});
