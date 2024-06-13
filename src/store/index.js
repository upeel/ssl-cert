import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import brandStoreModule from '@/views/ssl-certificate/brand/brandStoreModule'
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    'brand': brandStoreModule,
  },
  strict: process.env.DEV,
})
