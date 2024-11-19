import { defineVitestConfig } from '@nuxt/test-utils/config'
import { configDefaults } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineVitestConfig({
  // any custom Vitest config you require
  test: {
    globals: true,
    environment: 'nuxt',
    exclude: [...configDefaults.exclude, './tests/e2e/*'],
    root: fileURLToPath(new URL('./', import.meta.url)),
    setupFiles: ['./tests/unit/setup.ts']
  }
})

// Using vitest instead of @nuxt/test-utils
// import { defineConfig } from 'vitest/config'
// import vue from '@vitejs/plugin-vue'

// export default defineConfig({
//   plugins: [vue()],
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     server: {
//       deps: {
//         inline: ['vuetify']
//       }
//     }
//   }
// })
