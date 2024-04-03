import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    // Expose Google Maps API key to the application
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY),
    
  },
});