import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load the external .env file
dotenv.config({ path: '../.env' });

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  envDir: '../.env'
});
