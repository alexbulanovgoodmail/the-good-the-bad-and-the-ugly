import { fileURLToPath, URL } from 'node:url'
import { checker } from 'vite-plugin-checker'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    checker({
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./**/*.{ts,js,vue}"',
      },
      stylelint: {
        lintCommand: 'stylelint "**/*.{vue,css,scss}"',
      },
    }),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
        additionalData: `@use "@/assets/scss/general/variables.scss" as *; @use "@/assets/scss/abstracts/mixins.scss" as *;`,
      },
    },
  },
})
