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
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    head: {
      title: 'StartupConnect',
      meta: [
        { name: 'description', content: 'Connect with innovative startups and investors' }
      ]
    }
  },
  routeRules: {
    '/startups/**': { ssr: true }
  }
})