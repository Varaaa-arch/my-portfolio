// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    integrations: [react(), sitemap()],
    vite: {
        plugins: [tailwind()],
    },
});