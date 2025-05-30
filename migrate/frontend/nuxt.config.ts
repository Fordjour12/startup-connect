// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    'shadcn-nuxt',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
  ],
  colorMode: {
    classSuffix: ''
  },
  css: ['~/assets/css/tailwind.css'],
  fonts: {
    families: [
      {
        name: 'Poppins',
        provider: 'google'
      },
      {
        name: 'Montserrat',
        provider: 'google'
      }
    ]
  },
  shadcn: {
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  plugins: [
    './plugins/auth.ts',
    './plugins/api.ts',
  ],
  vite: {
    plugins: [
      tailwindcss(),

    ],
  },
  app: {
    head: {
      title: 'StartupConnect',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  routeRules: {
    '/startups/**': { ssr: true },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL,
    },
  },
  // nitro: {
  //   routeRules: {
  //     '/api/**': {
  //       proxy: 'http://localhost:8000/api/v1/**',
  //     },
  //   },
  // },
  components: true,
})
