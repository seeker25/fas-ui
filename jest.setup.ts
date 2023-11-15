import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { config } from '@vue/test-utils'

import VueCompositionApi from '@vue/composition-api'
vi.mock('@/plugins/i18n', () => {})

Vue.use(VueCompositionApi)

Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueRouter)

config.mocks.$t = () => {}

(global as any).IntersectionObserver = class IntersectionObserver {
  private observe () {
    return vi.fn()
  }

  private disconnect () {
    return vi.fn()
  }

  private unobserve () {
    return vi.fn()
  }
}
