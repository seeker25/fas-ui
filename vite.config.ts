import EnvironmentPlugin from 'vite-plugin-environment'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import postcssNesting from 'postcss-nesting'
import { createVuePlugin as vue } from 'vite-plugin-vue2'

const packageJson = fs.readFileSync('./package.json') as unknown as string
const appName = JSON.parse(packageJson).appName
const appVersion = JSON.parse(packageJson).version
const sbcName = JSON.parse(packageJson).sbcName
const sbcVersion = JSON.parse(packageJson).dependencies['sbc-common-components']
const aboutText1 = (appName && appVersion) ? `${appName} v${appVersion}` : ''
const aboutText2 = (sbcName && sbcVersion) ? `${sbcName} v${sbcVersion}` : ''

const generateAboutText = (aboutText1, aboutText2) => {
  return (aboutText1 && aboutText2) ? `"${aboutText1}<br>${aboutText2}"`
    : aboutText1 ? `"${aboutText1}"`
      : aboutText2 ? `"${aboutText2}"`
        : '""' // Ensure a string is always returned
}

export default defineConfig({
  define: {
    'import.meta.env.ABOUT_TEXT': generateAboutText(aboutText1, aboutText2)
  },
  envPrefix: 'VUE_APP_', // Need to remove this after fixing vaults. Use import.meta.env with VUE_APP.
  plugins: [
    vue({
      vueTemplateOptions: {
        transformAssetUrls: {
          img: ['src', 'data-src'],
          'v-app-bar': ['image'],
          'v-avatar': ['image'],
          'v-banner': ['avatar'],
          'v-card': ['image'],
          'v-card-item': ['prependAvatar', 'appendAvatar'],
          'v-chip': ['prependAvatar', 'appendAvatar'],
          'v-img': ['src', 'lazySrc', 'srcset'],
          'v-list-item': ['prependAvatar', 'appendAvatar'],
          'v-navigation-bar': ['image'],
          'v-parallax': ['src', 'lazySrc', 'srcset'],
          'v-toolbar': ['image']
        }
      }
    }),
    VitePWA({
      name: 'Business Registry',
      themeColor: '#003366',
      msTileColor: '#fcba19',
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black',
      manifestOptions: {
        name: 'Business Registry fas',
        short_name: 'Business Registry fas',
        start_url: '',
        display: 'standalone',
        theme_color: '#003366',
        background_color: '#fcba19',
        scope: '.'
      },
      iconPaths: {
        favicon32: 'img/icons/favicon-32x32.png',
        favicon16: 'img/icons/favicon-16x16.png',
        appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
        maskIcon: 'img/icons/safari-pinned-tab.svg',
        msTileImage: 'img/icons/msapplication-icon-144x144.png'
      },
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        // swSrc is required in InjectManifest mode.
        swSrc: 'src/service-worker.js',
        // skip precaching json files such as configs
        exclude: [/\.json$/]
      }
    }),
    EnvironmentPlugin({
      BUILD: 'web' // Fix for Vuelidate, allows process.env with Vite.
    }),
    postcssNesting,
    pluginRewriteAll()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './node_modules'),
      $assets: path.resolve(__dirname, './src/assets'),
      // Fix for bcrs-shared-components unit tests fail
      '@bcrs-shared-components/mixins': path.resolve(__dirname, './node_modules/@bcrs-shared-components/mixins/index.ts'),
      '@bcrs-shared-components/enums': path.resolve(__dirname, './node_modules/@bcrs-shared-components/enums/index.ts'),
      '@bcrs-shared-components/staff-comments': path.resolve(__dirname, './node_modules/@bcrs-shared-components/staff-comments/index.ts'),
      // Fix for module decorator unit tests fail
      'vuex-module-decorators': path.resolve(__dirname, './node_modules/vuex-module-decorators/dist/esm/index.js')
    },
    extensions: ['.js', '.ts', '.vue', '.json', '.css']
  },
  server: {
    port: 8080,
    host: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/unit/setup.ts',
    threads: true,
    // hide Vue Devtools message
    onConsoleLog: function (log) {
      if (log.includes('Download the Vue Devtools extension')) {
        return false
      }
    }
  },
  optimizeDeps: {
    // This needs to be done for FAS-UI and sbc-common-components to work.
    // Otherwise FAS complains about not having Vue.use(VueCompositionAPI)
    // sbc-common-components will fail at login.
    // Remove with Vue 3 for most of these.
    exclude: ['@vue/composition-api', 'sbc-common-components']
  }
})
