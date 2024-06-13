import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import { default as msalPlugin } from "vue-msal-browser";

import i18n from '@/libs/i18n'
import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'

// Axios Mock Adapter
import '@/@fake-db/db'

const msalConfig = {
  auth: {
    clientId: process.env.VUE_APP_CLIENT_ID,
    authority: process.env.VUE_APP_AUTHORITY,
    redirectUri: process.env.VUE_APP_REDIRECT_URI,
    scopes: ['openid', 'profile', 'User.Read']
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false
  },
  mode: "popup"
}
Vue.use(msalPlugin, msalConfig);

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
