import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'

import VideoPlayer from 'vue-video-player'

// elementUI默认主题样式
// import 'element-ui/lib/theme-chalk/index.css'
// 自定义主题
import './theme/index.css'

// elementUI基于断点的隐藏类
import 'element-ui/lib/theme-chalk/display.css'

import fastClick from 'fastclick'

import jsCookie from 'js-cookie'

// 引入jQuery
// import $ from 'jquery'

// 1px边框解决方案
// import './assets/styles/reset.css'
// import './assets/styles/border.css'

import './assets/styles/videoplayer.css'

import VueParticles from 'vue-particles'

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

Vue.use(VideoPlayer)

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(VueParticles)

// 使用fastClick自带的attach方法绑定到document.body上
fastClick.attach(document.body)

Vue.prototype.$cookie = jsCookie

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
