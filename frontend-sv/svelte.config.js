import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from 'svelte-adapter-bun';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      out: 'build',
      server: {
        port: 8080,
        host: '0.0.0.0'
      }
    }),
    alias: {
      "@/*": "./src/lib/*",
    }
  }
};

export default config;
