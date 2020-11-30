import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import '../theme/index.css'   // 自定义主题,修改element-ui主题
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import 'font-awesome/css/font-awesome.min.css'
import 'common/css/reset.css'
import 'common/css/common.css'

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

Vue.config.productionTip = false

// element-ui已在index.html CDN引入
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
